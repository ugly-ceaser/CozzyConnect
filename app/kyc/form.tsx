import { Box, Text, VStack, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import Styles from "@/constants/Styles"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet } from "react-native";
import { GRAY_COLOR, OFF_GREEN, PRIMARY_COLOR, RED_COLOR } from "@/constants/Colors"
import CustomInput from "@/components/shared/CustomInput"
import { useForm } from "react-hook-form"
import { useUserStore } from "@/store/user"
import VerifyEmail from "@/components/screens/kyc/VerifyEmail"
import { KYCPayload, KYCResponse } from "@/model/kyc"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import useBoolean from "@/hooks/useBoolean"
import Select from "@/components/shared/Select"
import FilePicker from "@/components/shared/FilePicker"
import * as DocumentPicker from 'expo-document-picker';
import CustomButton from "@/components/shared/CustomButton"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import { handleFileUpload } from "@/lib/cloudinary"
import { log, sleep } from "@/utils/helpers"
import useFetchUser from "@/hooks/useFetchUser"
import { handleUpdateKYC, handleCreateKYC } from "@/api/kyc"
import { toast } from "@backpackapp-io/react-native-toast"
import useAuth from "@/hooks/useAuth"
import { DEFAULT_USER } from "@/contents/user"
import { handleFetchKYC } from "@/api/kyc"
import { USER_TYPES, UserTypes } from "@/model/user"


interface KycFormProps { }
const KycForm: React.FC<KycFormProps> = ({ }) => {
  const user = useUserStore(state => state.user)
  const token = useUserStore(state => state.token)
  const { fetchUserData } = useFetchUser()
  const backgroundColor = useThemeColor({}, 'background');
  const { control, trigger, getValues, setValue } = useForm<Omit<KYCPayload, 'idFrontImage' | 'idBackImage' | 'passportPhoto'>>({
    mode: "onTouched",
  })
  const { handleLogoutAccount } = useAuth()
  const router = useRouter()
  const [kycData, setKycData] = useState<Partial<KYCResponse>>({})
  const { isOpen: isLoadingMain, open: openLoadingMain, close: closeLoadingMain } = useBoolean()
  const { isPassing } = useLocalSearchParams();

  const getKYC = async () => {
    openLoadingMain()
    try {
      const result = await handleFetchKYC(token)
      if (!result?.status) throw new Error(result.message)
      log("RESULT [KYC]", result)
      setKycData(result.data!)
      await sleep(1000)
    }
    catch (error: any) {
      log("ERROR [KYC]:", error.message)
    }
    finally {
      closeLoadingMain()
    }
  }

  useEffect(() => {
    log("TIMES [KYC]:", kycData)
    if (!kycData) return
    setValue('idType', kycData?.idType!)
    setValue('nin', kycData?.nin!)
    setValue('nyscNumber', kycData?.nyscNumber!)
  }, [kycData])

  useEffect(() => {
    if (!token) return
    getKYC()
  }, [token])


  useEffect(() => {
    if (user) return
      ; (async () => await fetchUserData(token))();
  }, [user, token])

  useEffect(() => {
    if (!user) return
    if (user?.isVerified) {
      toast("KYC already verified", {
        duration: 3000
      })
      router.replace('/dashboard/home')
    }
  }, [user])

  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()

  const [idFiles, setIdFiles] = useState<{
    front: DocumentPicker.DocumentPickerAsset[];
    back: DocumentPicker.DocumentPickerAsset[];
  }>({
    front: [],
    back: [],
  })
  const [errors, setErrors] = useState({
    idError: false,
    front: false,
    back: false
  })

  const data = [
    { label: "National ID", value: "National ID" },
    { label: "International Passport", value: "International Passport" },
  ]

  log("FILES:", idFiles)

  const handleSubmit = async () => {
    // VALIDATE
    let canSubmit = true
    if (!await trigger()) {
      canSubmit = false
    }

    // CHECK IF ID TYPE IS SELECTED
    if (!getValues('idType')) {
      setErrors(prev => ({ ...prev, idError: true }))
      canSubmit = false
    }

    if ((isPassing && isPassing === "YES") && !Boolean(idFiles.front.length)) {
      setErrors(prev => ({ ...prev, front: true }))
      canSubmit = false
    }

    if (!canSubmit) return
    try {
      openLoading()
      // UPLOAD FILES 
      const idImage = {
        front: kycData.idFrontImage ?? '',
        back: kycData.idBackImage ?? ''
      }

      if (Boolean(idFiles.front.length) && Boolean(idFiles.back.length)) {
        const [front, back] = await Promise.all([
          handleFileUpload({
            mimeType: idFiles.front[0].mimeType ?? 'image/jpeg',
            name: idFiles.front[0].name,
            uri: idFiles.front[0].uri
          }),
          handleFileUpload({
            mimeType: idFiles.back[0].mimeType ?? 'image/jpeg',
            name: idFiles.back[0].name,
            uri: idFiles.back[0].uri
          }),
        ])
        log("UPLOAD RESULT:", { front, back })
        idImage.back = back?.secure_url!
        idImage.front = front?.secure_url!
      }
      else if (Boolean(idFiles.front.length)) {
        const front = await handleFileUpload({
          mimeType: idFiles.front[0].mimeType ?? 'image/jpeg',
          name: idFiles.front[0].name,
          uri: idFiles.front[0].uri
        })
        log("UPLOAD RESULT:", { front })
        idImage.front = front?.secure_url!
      }
      else if (Boolean(idFiles.back.length)) {
        const back = await handleFileUpload({
          mimeType: idFiles.back[0].mimeType ?? 'image/jpeg',
          name: idFiles.back[0].name,
          uri: idFiles.back[0].uri
        })
        log("UPLOAD RESULT:", { back })
        idImage.back = back?.secure_url!
      }

      // UPDATE THE KYC
      const values = getValues()
      let result;

      if (Object.keys(kycData).length) {
        result = await handleUpdateKYC({
          idBackImage: idImage.back,
          idFrontImage: idImage.front,
          idType: values.idType,
          nin: values.nin,
          nyscNumber: values.nyscNumber,
          passportPhoto: [user?.profilePicture ?? DEFAULT_USER.profilePicture]
        }, token)
      }
      else {
        log("CREATING!!!!")
        result = await handleCreateKYC({
          idBackImage: idImage.back,
          idFrontImage: idImage.front,
          idType: values.idType,
          nin: values.nin,
          nyscNumber: values.nyscNumber,
          passportPhoto: [user?.profilePicture ?? DEFAULT_USER.profilePicture]
        }, token)
      }

      if (!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }

      if (!result?.status) throw new Error(result.message)

      toast.success(result.message, {
        duration: 3000
      })

      if (isPassing && isPassing === "YES") {
        router.replace('/registration-success')
        return
      }
      router.replace('/dashboard/home')
    } catch (error: any) {
      toast(error.message || 'failed to submit KYC', {
        duration: 3000
      })
    }
    finally {
      closeLoading()
    }
  }

  useEffect(() => {
    if (idFiles.front.length) {
      setErrors(prev => ({ ...prev, front: false }))
    }

    if (idFiles.back.length) {
      setErrors(prev => ({ ...prev, back: false }))
    }
  }, [idFiles])

  if (isLoadingMain) return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar caseInsensitive title="KYC Verification" />
        }}
      />
      <Box style={Styles.container}>
        <VStack style={[{ flex: 1, justifyContent: "center", alignItems: 'center' }]}>
          <ActivityIndicator size={"large"} color={GRAY_COLOR} />
          <Text style={{ fontSize: 15, letterSpacing: 5, marginTop: 8, textTransform: 'uppercase', textAlign: 'center', fontFamily: FontFamily.URBANIST_SEMIBOLD, }}>Loading KYC</Text>
        </VStack>
      </Box>
    </>
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar caseInsensitive title="KYC Verification" />
        }}
      />

      <KeyboardAvoidingScrollView style={[Styles.container, { backgroundColor }]}>
        <Box style={{ marginBottom: 40 }}>
          <Box style={{ gap: 20 }}>
            <VerifyEmail isVerified={user?.isEmailVerified} />
            {/* <VerifyPhone isVerified={user?.isNumberVerified} /> */}

            {user?.userType === USER_TYPES.CORP_MEMBER && (

              <Box>
                <CustomInput
                  InputProps={{
                    placeholder: "Enter NYSC number (optional)",
                    keyboardType: "name-phone-pad",
                  }}
                  control={control}
                  defaultValue={kycData?.nyscNumber}
                  name="nyscNumber"
                  rules={{
                    pattern: {
                      value: /^NYSC\/[A-Z]{2}\/\d{4}\/\d{6}$/,
                      message: 'Invalid NYSC number format'
                    }
                  }}
                />
                <Text style={{ color: '#555', fontSize: 14, fontFamily: FontFamily.URBANIST_REGULAR, marginTop: 5, paddingVertical: 5, backgroundColor: "#f1f1f1", paddingHorizontal: 16, borderLeftWidth: 4, borderColor: PRIMARY_COLOR }}>Hint: `NYSC/ES/1234/123456`</Text>
              </Box>
            )}

            <CustomInput
              InputProps={{
                placeholder: "Enter NIN",
                keyboardType: "number-pad",
              }}
              control={control}
              name="nin"
              defaultValue={kycData?.nin}
              rules={{
                required: "Please enter your NIN",
                pattern: {
                  value: /^\d{11}$/,
                  message: 'Invalid NIN'
                }
              }}
            />

            <Select
              placeholder="Select ID Type"
              data={data}
              defaultValue={kycData?.idType}
              hasError={errors.idError}
              onChange={(value) => setValue('idType', value!)}
            />

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 16, marginBottom: 8 }}>Upload ID (Front)</Text>
              <FilePicker
                hasError={errors.front}
                data={[kycData?.idFrontImage!]}
                onSelect={(data) => setIdFiles((prev) => ({ ...prev, front: data }))}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 16, marginBottom: 8 }}>Upload ID (Back)</Text>
              <FilePicker
                hasError={errors.back}
                data={[kycData?.idBackImage!]}
                onSelect={(data) => setIdFiles((prev) => ({ ...prev, back: data }))}
              />
            </Box>

            <Box style={{ width: '100%' }}>
              <CustomButton
                isLoading={isLoading}
                onPress={handleSubmit}
                style={{ marginTop: 16 }}
                block size="lg" scheme="orange"
                text={Object.keys(kycData).length ? "Update KYC Details" : "Submit"}
              />
            </Box>
          </Box>
        </Box>
      </KeyboardAvoidingScrollView>
    </>
  )
}


const style = StyleSheet.create({
  baseBox: {
    alignItems: "center",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: DEFAULT_BORDER_RADIUS,
    overflow: "hidden",
    height: 60,
  },
  input: {
    height: 60,
    flex: 1,
    fontSize: 18,
    paddingRight: 16,
    paddingLeft: 16,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.URBANIST_LIGHT,
    letterSpacing: .5,
    marginTop: 4,
    color: RED_COLOR,
    width: "100%"
  },
  errorBorder: {
    borderColor: RED_COLOR
  }
})


export default KycForm