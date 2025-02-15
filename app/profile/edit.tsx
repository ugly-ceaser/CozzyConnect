import { Box, HStack, Text, VStack, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import Icon from "@expo/vector-icons/Feather"
import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import CustomInput from "@/components/shared/CustomInput"
import { useForm } from "react-hook-form"
import { PRIMARY_COLOR, WHITE_COLOR } from "@/constants/Colors"
import * as DocumentPicker from 'expo-document-picker';
import { toast } from '@backpackapp-io/react-native-toast';
import CustomButton from "@/components/shared/CustomButton"
import { useUserStore } from "@/store/user"
import { handleCreateUserProfile, handleUpdateUserProfile } from "@/api/user"
import useBoolean from "@/hooks/useBoolean"
import { UserResponseData, UserTypes } from "@/model/user"
import useAuth from "@/hooks/useAuth"
import { handleFileUpload } from "@/lib/cloudinary"
import { arrayToSelectObject, log } from "@/utils/helpers"
import ImageComponent from "@/components/shared/ImageComponent" 
import Select from "@/components/shared/Select"
import useFetchUser from "@/hooks/useFetchUser"



interface editProps {}
const Edit:React.FC<editProps> = ({}) => {
  const textColor = useThemeColor({}, "text")
  const router = useRouter()
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const {setUser, user, token} = useUserStore(state => state)
  const [userData, setUserData] = useState<Partial<UserResponseData> | undefined>(user)
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const { handleLogoutAccount } = useAuth()
  const [errors, setErrors] = useState({
    userType: false
  })
  const { isPassing } = useLocalSearchParams();
  const { control, getValues, setValue, trigger } = useForm({
    mode: "onTouched"
  })
  const { fetchUserData } = useFetchUser()

  const isPassingThrough = isPassing && isPassing === "YES"

  useEffect(() => {
    if(isPassingThrough) return
    fetchUserData(token)
  }, [])

  useEffect(() => {
    if(!user) return
    setUserData(user)
  }, [user])

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: ['image/jpg', 'image/png', 'image/jpeg'] 
      })
      if(result.canceled) return
      log("RES:", result)
      const [imageData] = result.assets
      setFile(imageData)
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleUpdateProfile = async () => {
    let canSubmit = true
    if(!await trigger()) {
      canSubmit = false
    } 

    if(!getValues('userType')) {
      canSubmit = false
      setErrors(prev => ({...prev, userType: true }))
    }

    if(!canSubmit) return 

    openLoading()
    try {
      let fileUrl = userData?.profilePicture ?? ""
      if(file) {
        const uploadRes = await handleFileUpload({ 
          mimeType: file.mimeType! || 'image/jpeg',
          name: file.name,
          uri: file.uri
        })

        log("UPLOAD RES:", uploadRes)

        if(!uploadRes) throw new Error("Failed to upload file")
        fileUrl = uploadRes!.secure_url
      }
      const payload: Partial<UserResponseData> = {
        ...userData,
        ...getValues(),
        profilePicture: fileUrl,
      }

      if(isPassingThrough)  {
        const result = await handleCreateUserProfile(payload!, token)
        if (!result?.status && result.shouldLogout) {
          toast("Session expired, please login", {
            duration: 3000
          })
          await handleLogoutAccount()
          return
        }

        if (!result?.status) throw new Error(result.message)
        // UPDATE PROFILE
        await setUser({...user, ...result.data!}, true)

        // NOTIFY & REDIRECT
        toast.success("Profile created successfully", {
          duration: 3000
        })

        router.replace({
          pathname: '/kyc/form',
          params: {
            isPassing: "YES"
          }
        })
      }
      else {
        const result = await handleUpdateUserProfile(payload!, token)
        if(!result?.status && result.shouldLogout) {
          toast("Session expired, please login", {
            duration: 3000
          })
          await handleLogoutAccount()
          return
        }

        if(!result?.status) throw new Error(result.message)
        // UPDATE PROFILE
        await setUser({...user, ...result.data!}, true)

        // NOTIFY & REDIRECT
        toast.success("Profile updated successfully", {
          duration: 3000
        })

        router.replace('/profile')
      }
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

  return(
   <>
    <Stack.Screen 
        options={{
          header: () => <AppBar preventBackPress title="edit profile" />
        }}
      />
      <KeyboardAvoidingScrollView>
        <Box style={Styles.container}>
          <HStack style={{ marginTop: 40, gap: 18, justifyContent: "center" }}>
            <Box style={{ position: "relative" }}>
              <ImageComponent 
                noLoading
                style={{ width: 150, height: 150, borderRadius: 150 }}
                uri={file?.uri ?? userData?.profilePicture}
                profile
              />
              <Box style={{ position: "absolute", bottom: 0, right: 10, backgroundColor: 'transparent' }}>
                <TouchableOpacity activeOpacity={.75} onPress={handleImagePick}>
                  <VStack style={{ width: 35, height: 35, borderRadius: 35, backgroundColor: PRIMARY_COLOR, justifyContent: 'center' }}>
                    <Icon name="upload-cloud" size={20} color={WHITE_COLOR} />
                  </VStack>
                </TouchableOpacity>
              </Box>
            </Box>
          </HStack>

          <Box style={{ marginTop: 30, gap: 20, marginBottom: 50 }}>
            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Full Name</Text>
              <CustomInput
                InputProps={{
                  placeholder: "Full name",
                }}
                defaultValue={userData?.fullName}
                icon={<Icon name="user" color={textColor} size={20} />}
                control={control}
                name="fullName"
              />
            </Box>
            
            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Mobile Number</Text>
              <CustomInput
                InputProps={{
                  placeholder: "Phone no",
                  keyboardType: 'phone-pad'
                }}
                defaultValue={userData?.phoneNumber}
                icon={<Icon name="phone" color={textColor} size={20} />}
                control={control}
                name="phoneNumber"
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Email Address</Text>
              <CustomInput
                InputProps={{
                  placeholder: "Email",
                  keyboardType: 'email-address',
                  readOnly: Boolean(userData?.email)
                }}
                defaultValue={userData?.email}
                icon={<Icon name="mail" color={textColor} size={20} />}
                control={control}
                name="email"
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Address</Text>
              <CustomInput
                InputProps={{
                  placeholder: "Address",
                }}
                defaultValue={userData?.address}
                icon={<Icon name="home" color={textColor} size={20} />}
                control={control}
                name="address"
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>User Type</Text>
              <Select
                placeholder="Select ID Type"
                defaultValue={userData?.userType}
                data={arrayToSelectObject(Object.values(UserTypes))}
                hasError={errors.userType}
                onChange={(value) => setValue('userType', value!)}
              />
            </Box>

            <CustomButton  
              text={ isPassingThrough ? "Create profile" : "Update profile" } 
              scheme="orange" 
              onPress={handleUpdateProfile}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </KeyboardAvoidingScrollView>
   </>
  )
}


const styles = StyleSheet.create({
  avatarBadge: { width: 25, height: 25, position: "absolute", zIndex: 5, right: -8, top: 6 },
  label: {}
})


export default Edit