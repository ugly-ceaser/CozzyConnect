import { AuthPageParagraph, AuthPageTitle } from "@/components/others/StyledText"
import { Box, useThemeColor } from "@/components/others/Themed"
import Styles from "@/constants/Styles"
import { StyleSheet } from "react-native"
import { useForm } from "react-hook-form"
import CustomInput from "@/components/shared/CustomInput"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import { FontFamily } from "@/constants/Enums"
import { Stack, useRouter } from "expo-router"
import { ORANGE_COLOR, PRIMARY_COLOR } from "@/constants/Colors"
import CustomButton from "@/components/shared/CustomButton"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import { useEffect } from "react"
// import GoogleSignInButton from "@/components/shared/GoogleSignInButton"
import { log } from "@/utils/helpers"
import useBoolean from "@/hooks/useBoolean"
import { handleSendEmailOtp } from "@/api/auth"
import { toast } from "@backpackapp-io/react-native-toast"
import AppBar from "@/components/shared/AppBar"
import { usePasswordResetStore } from "@/store/passwordReset"
import { OTP_TYPE } from "@/constants/Variables"


interface ForgotPasswordProps { }
const ForgotPassword = ({ }: ForgotPasswordProps) => {
  const textColor = useThemeColor({}, "text")
  const { control, trigger, getValues } = useForm<{ email: string; }>({
    mode: "onTouched"
  })
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const router = useRouter()
  const { populate, email } = usePasswordResetStore()

  // HANDLE SEND OTP
  const handleSendToken = async () => {
    if (!await trigger()) return

    try {
      openLoading()
      const payload = getValues()

      const res = await handleSendEmailOtp(payload.email)
      if(!res?.status) throw new Error(res.message)

      // SHOW TOAST
      toast.success(res.message, {
        duration: 3000
      })
      
      // ADD EMAIL TO STATE
      populate('email', payload.email)

      // NAVIGATE TO OTP PAGE
      router.navigate({
        pathname: '/otp',
        params: {
          type: OTP_TYPE.PASSWORD_RESET
        }
      })
    }
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      })
    }
    finally {
      closeLoading()
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="" />
        }}
      />

      <KeyboardAvoidingScrollView>
        <Box style={[Styles.container, { paddingBottom: 20 }]}>
        <Box style={style.titleContainer}>
          <AuthPageTitle>Forgot{"\n"}Password</AuthPageTitle>
          <AuthPageParagraph>Enter your email address to continue</AuthPageParagraph>
        </Box>
          <Box style={{ gap: 16 }}>
            <CustomInput
              InputProps={{
                placeholder: "Enter email address"
              }}
              icon={<Icon name="envelope" color={textColor} size={20} />}
              control={control}
              name="email"
              rules={{
                required: "Please enter your email",
              }}
            />
            <CustomButton isLoading={isLoading} onPress={handleSendToken} style={{ marginTop: 12 }} scheme="orange" block size="lg" text="Send OTP" />
          </Box>

        </Box>
      </KeyboardAvoidingScrollView>
    </>
  )
}
const style = StyleSheet.create({
  titleContainer: {
    marginBottom: 30,
    marginTop: 40
  },
  policyText: { fontFamily: FontFamily.URBANIST_REGULAR, lineHeight: 18, fontSize: 13, maxWidth: "90%" },
  policyMainText: { fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 13, color: ORANGE_COLOR },
  divider: { backgroundColor: PRIMARY_COLOR, flex: 1, height: 1 },
  redirectSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    marginTop: 30
  },
  redirectText: {
    fontFamily: FontFamily.URBANIST_MEDIUM,
    fontSize: 14
  }
})

export default ForgotPassword