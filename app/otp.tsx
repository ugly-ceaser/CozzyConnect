import { handleSendEmailOtp, handleVerifyOtp } from "@/api/auth"
import { Text, Box, HStack, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import { DARK_COLOR, ORANGE_COLOR, PRIMARY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { OTP_TYPE } from "@/constants/Variables"
import useAuth from "@/hooks/useAuth"
import useBoolean from "@/hooks/useBoolean"
import useCountdown from "@/hooks/useCountdown"
import useFetchUser from "@/hooks/useFetchUser"
import useKeyboard from "@/hooks/useKeyboard"
import { VerifyOTP } from "@/model/auth"
import { usePasswordResetStore } from "@/store/passwordReset"
import { useRegistrationStore } from "@/store/registration"
import { useUserStore } from "@/store/user"
import { log } from "@/utils/helpers"
import { toast } from "@backpackapp-io/react-native-toast"
import { useAssets } from "expo-asset"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import OTPTextInput from "react-native-otp-textinput"

interface OTPProps { }
const OTP: React.FC<OTPProps> = ({ }) => {
  const [assets] = useAssets([require("@/assets/images/pngs/otp.png")])
  const otpInput = useRef<any>(null)
  const { start, restart, isDone, formattedTime } = useCountdown({ initialMinutes: 2 })
  const [code, setCode] = useState("")
  const text = useThemeColor({}, "text")
  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const { closeKeyboard } = useKeyboard()
  const { email } = useRegistrationStore()
  const { email: forgotEmail, populate } = usePasswordResetStore()
  const { replace } = useRouter()
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const { isOpen: isResending, close: closeResending, open: openResending } = useBoolean()
  const { fetchUserData } = useFetchUser()
  const { token, setUser, user } = useUserStore()
  const { type } = useLocalSearchParams<{ type: OTP_TYPE }>();

  const isPasswordType = type && type === OTP_TYPE.PASSWORD_RESET

  // HANDLE VERIFY
  const handleVerify = async () => {
    openLoading()
    try {
      const payload: VerifyOTP = {
        otp: code,
        email: isPasswordType ? forgotEmail! : email!, 
        dataVerified: 'email'
      }
      const result = await handleVerifyOtp(payload)
      if (!result?.status) throw new Error(result.message)

      // UPDATE STATE
      setUser({ ...user, ...result.data }, true)

      toast.success(result.message, {
        duration: 3000,
      });
      
      if(isPasswordType) {
        // STORE THE DATA
        log("ID:", result.data.id)
        populate('id', result.data.id)

        // NAVIGATE TO PASSWORD RESET
        replace('/password-reset')
      }
      else {
        // UPDATE AUTH STATE
        await fetchUserData(token)
        handleClearCode()

        // NAVIGATE TO PROFILE EDIT
        replace({
          pathname: '/profile/edit',
          params: {
            isPassing: 'YES'
          }
        })
      }
    }
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      });
    }
    finally {
      closeLoading()
    }
  }

  // HANDLE VERIFY
  const handleClearCode = async () => {
    otpInput?.current?.clear()
  }

  // HANDLE RESEND
  const handleResend = async () => {
    try {
      openResending()
      const res = await handleSendEmailOtp(email!)
      if (!res?.status) throw new Error(res.message)
      toast.success(res.message, {
        duration: 3000,
      })
      restart()
    }
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      })
    }
    finally {
      closeResending()
    }
  }

  // HANDLE TEXT CHANGE
  const handleTextChange = (code: string) => {
    if (code.length === 4) {
      setCanSubmit(true)
      closeKeyboard()
    }

    else setCanSubmit(false)
    setCode(code)
  }

  useEffect(() => {
    start()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title=" " />
        }}
      />
      <KeyboardAvoidingScrollView style={[Styles.container]}>
        <Box style={{ flex: 1 }}>
          <Image source={{ uri: assets?.[0]?.uri }} style={style.image} />

          <Box>
            <Text style={{ fontSize: 15, fontFamily: FontFamily.URBANIST_MEDIUM, textAlign: "center" }}>Please enter the code that was sent to the {'\n'}email you provided</Text>

            <Box style={{ alignItems: "center" }}>
              <OTPTextInput
                ref={otpInput}
                handleTextChange={handleTextChange}
                tintColor={PRIMARY_COLOR}
                autoFocus
                offTintColor={PRIMARY_COLOR}
                containerStyle={{
                  width: "100%",
                  maxWidth: "90%"
                }}
                textInputStyle={{
                  height: 60,
                  width: 70,
                  fontSize: 32,
                  color: text
                } as any}
              />
              <Text style={{ textAlign: "center", fontSize: 16, fontFamily: FontFamily.URBANIST_SEMIBOLD, color: ORANGE_COLOR, marginTop: 20 }}>{formattedTime}</Text>
            </Box>

            <Box style={{ marginTop: 20 }}>
              <CustomButton
                scheme="orange" text="Verify"
                textStyles={{ fontSize: 24, fontFamily: FontFamily.URBANIST_BOLD }}
                size="lg"
                onPress={handleVerify}
                style={{ backgroundColor: !canSubmit ? DARK_COLOR : ORANGE_COLOR }}
                isDisabled={!canSubmit}
                isLoading={isLoading}
              />

              <HStack style={{ justifyContent: "center", marginTop: 15 }}>
                <Text style={style.btnText}>Didn't recieve code? </Text>
                <TouchableOpacity
                  disabled={!isDone || isResending} aria-disabled={!isDone || isResending}
                  onPress={handleResend}

                  style={{ opacity: isDone ? 1 : .5 }}
                >
                  <Text style={[style.btnText, { color: ORANGE_COLOR }]}>{isResending ? 'Resending...' : 'Resend'}</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
        </Box>
      </KeyboardAvoidingScrollView>

    </>
  )
}

const style = StyleSheet.create({
  image: { width: "100%", height: 379, marginTop: 60 },
  btnText: { fontFamily: FontFamily.URBANIST_BOLD, fontSize: 15 }
})

export default OTP