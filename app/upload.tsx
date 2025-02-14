import { Box, Text } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import FilePicker from "@/components/shared/FilePicker"
import Select from "@/components/shared/Select"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { Stack, useRouter } from "expo-router"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { PropertyType } from "@/model/property"
import CustomInput from "@/components/shared/CustomInput"
import { arrayToSelectObject, log } from "@/utils/helpers"
import lga from "@/contents/lga"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import CustomButton from "@/components/shared/CustomButton"
import useBoolean from "@/hooks/useBoolean"
import AutoCompleteInput from "@/components/shared/AutoCompleteInput"
import MultiChoiceInput from "@/components/shared/MultiChoiceInput"
import { NearbyResult } from "@/lib/google"
import { DocumentPickerAsset } from "expo-document-picker"
import { handleFileUpload } from "@/lib/cloudinary"
import { toast } from "@backpackapp-io/react-native-toast"
import { useUserStore } from "@/store/user"
import { handleUploadProperty } from "@/api/realEstate"
import useAuth from "@/hooks/useAuth"
import { INFO_GRAY_COLOR } from "@/constants/Colors"



interface UploadProps { }
const Upload: React.FC<UploadProps> = ({ }) => {
  const categoryData = [
    { label: "1 Bedroom Flat", value: "1 Bedroom Flat" },
    { label: "2 Bedroom Flat", value: "2 Bedroom Flat" },
    { label: "3 Bedroom Flat", value: "3 Bedroom Flat" },
    { label: "Self-conducive", value: "Self-conducive" }
  ]
  // const [location, setLocation] = useState<Location.LocationObject>()
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const [amenities, setAmenities] = useState<string[]>([])
  const [nearBy, setNearby] = useState<string[]>([])
  const [files, setFiles] = useState<DocumentPickerAsset[]>([])
  const { setValue, control, watch, trigger, getValues  } = useForm<Omit<PropertyType, 'userId' | 'createdAt' | 'mainPictureIndex' | 'id' | 'pictures' | 'amenities' | 'nearby'>>({
    mode: 'onTouched',
  })
  const { handleLogoutAccount } = useAuth()
  const token = useUserStore(state => state.token)
  const MAX_SELECTION = 8
  const state = watch('state') as keyof typeof lga
  const [errors, setErrors] = useState({
    fileError: '',
    amenities: '',
    nearby: '',
    state: '',
    category: '',
    lga: '',
    address: '',
  })
  const router = useRouter()
  const { lga: formLga, address, category } = watch()

  useEffect(() => {
    log("AMENITES DATA:", amenities)
  }, [amenities])

  useEffect(() => {
    if(formLga) {
      setErrors(prev => ({...prev, lga: ''}))
    }

    if(category) {
      setErrors(prev => ({...prev, category: ''}))
    }

    if(address) {
      setErrors(prev => ({...prev, address: ''}))
    }

    if(state) {
      setErrors(prev => ({...prev, state: ''}))
    }

    if(amenities.length) {
      setErrors(prev => ({...prev, amenities: ''}))
    }

    if(nearBy.length) {
      setErrors(prev => ({...prev, nearby: ''}))
    }

    if(files.length) {
      setErrors(prev => ({...prev, fileError: ''}))
    }

  }, [formLga, state, amenities, files, nearBy, category])

  const handleUploadCreate = async () => {
    let canSubmit = true
    // VALIDATE

    // CHECK FILES UPLOAD
    if(!files.length) {
      canSubmit = false
      setErrors(prev => ({...prev, fileError: 'Please select files'}))
      log("FILE ERROR:")
    }

    // CHECK FORMS
    if(! await trigger()) {
      canSubmit = false
      log("FORM ERROR:")
    }

    // CHECK LIST
    if(!amenities.length) {
      canSubmit = false
      setErrors(prev => ({...prev, amenities: 'Please enter amenities'}))
      log("AMENITY ERROR:")
    }

    if(!getValues('category')) {
      canSubmit = false
      setErrors(prev => ({...prev, category: 'Please select category'}))
      log("CATEGORY ERROR:")
    }

    if(!getValues('state')) {
      canSubmit = false
      setErrors(prev => ({...prev, state: 'Please select state'}))
      log("STATE ERROR:")
    }

    if(!getValues('address')) {
      canSubmit = false
      setErrors(prev => ({...prev, address: 'Please enter address'}))
      log("ADDRESS ERROR:")
    }

    if(!getValues('lga')) {
      canSubmit = false
      setErrors(prev => ({...prev, lga: 'Please select lga'}))
      log("LGA ERROR:")
    }

    if(!nearBy.length) {
      canSubmit = false
      setErrors(prev => ({...prev, nearby: 'Please enter nearby places'}))
      log("NEARBY ERROR:")
    }
    
    // CHECK IF VALIDATION PASSED
    if(!canSubmit) return 
    try{
      openLoading()
      // UPLOAD FILES
      const uploadRes = await Promise.all(files.map(file => handleFileUpload({ mimeType: file.mimeType!, name: file.name, uri: file.uri })))
      if(!uploadRes.every(item => item)) {
        throw new Error("Failed to upload files")
      }

      const pictures = uploadRes.map(item => item?.secure_url!)
      const payload: Partial<PropertyType> = {
        ...getValues(),
        numberOfRooms: +getValues('numberOfRooms'),
        mainPictureIndex: 0,
        amenities,
        nearby: nearBy,
        pictures,
      }
      // MAKE API CALL
      const result = await handleUploadProperty(payload!, token)

      if(!result?.status && result?.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }

      if(!result?.status) throw new Error(result?.message)

      toast.success(result.message, {
        duration: 3000
      })

      router.replace('/dashboard/home')
    }
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000
      })
    }
    finally {
      closeLoading()
    }
  }

  const handleOnSelect = (data: { popularPlaces: NearbyResult[]; address: string }) => {
    const { popularPlaces, address } = data
    setNearby(popularPlaces.slice(0, MAX_SELECTION).map(item => item.name))
    setValue('address', address)
  }


  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       toast.error('Permission to access location was denied');
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // useEffect(() => {
  //   log("LOCATION:", location)
  // }, [location])

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="upload" />
        }}
      />
      <KeyboardAvoidingScrollView style={Styles.container}>
        <Box style={{ paddingBottom: 50, flex: 1 }}>
          <Text style={{ fontSize: 17, fontFamily: FontFamily.URBANIST_SEMIBOLD, color: INFO_GRAY_COLOR, textAlign: "center" }}>Upload Files with the public</Text>
          <Box style={{ marginTop: 20, gap: 16 }}>
            <FilePicker
              multiple
              styles={{
                minHeight: 200
              }}
              hasError={!!errors.fileError}
              onSelect={(data) => setFiles(data)}
            />

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Category</Text>
              <Select
                data={categoryData}
                hasError={!!errors.category}
                placeholder="Choose house category"
                onChange={(data) => setValue('category', data ?? '')}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>State</Text>
              <Select
                hasError={!!errors.state}
                data={Object.keys(lga)?.map(lga => ({ label: lga, value: lga }))}
                placeholder="Choose State"
                onChange={(data) => setValue('state', data ?? '')}
              />
            </Box>


            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>LGA</Text>
              <Select
                hasError={!!errors.lga}
                data={state ? arrayToSelectObject(lga[state]) : []}
                placeholder="Choose LGA"
                onChange={(data) => setValue('lga', data ?? '')}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>House name</Text>
              <CustomInput
                control={control}
                name="houseName"
                InputProps={{
                  placeholder: "Enter house name",
                }}
                rules={{
                  required: "Please enter house name",
                  minLength: {
                    value: 5,
                    message: 'Please enter a valid house name'
                  }
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>House address</Text>
              <AutoCompleteInput error={errors.address} onSelect={handleOnSelect} />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>No of rooms</Text>
              <CustomInput
                name="numberOfRooms"
                InputProps={{
                  placeholder: "Enter no of rooms",
                  keyboardType: 'number-pad',
                }}
                control={control}
                rules={{
                  required: "Please enter no of rooms",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>House Description</Text>
              <CustomInput
                name="description"
                InputProps={{
                  placeholder: "Enter house description",
                  multiline: true,
                }}
                control={control}
                rules={{
                  required: "Please enter house description",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Amenities</Text>
              <MultiChoiceInput useError error={errors.amenities} label="Enter amenities" data={amenities} onChange={(data) => setAmenities(data)} />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Nearby places</Text>
              <MultiChoiceInput useError error={errors.nearby} label="Enter popular places" data={nearBy} onChange={(data) => setNearby(data)} />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Contact (Phone no.)</Text>
              <CustomInput
                name="contact"
                InputProps={{
                  placeholder: "Enter contact information",
                  keyboardType: 'phone-pad'
                }}
                control={control}
                rules={{
                  required: "Please enter your contact information",
                }}
              />
            </Box>

            <CustomButton
              text="Upload Property"
              scheme="orange"
              onPress={handleUploadCreate}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </KeyboardAvoidingScrollView>
    </>
  )
}

export default Upload