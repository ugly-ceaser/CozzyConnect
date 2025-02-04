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
// import GoogleSignInButton from "@/components/shared/GoogleSignInButton"
import { log } from "@/utils/helpers"
import useBoolean from "@/hooks/useBoolean"
import { handleChangePassword } from "@/api/auth"
import { toast } from "@backpackapp-io/react-native-toast"
import AppBar from "@/components/shared/AppBar"
import { usePasswordResetStore } from "@/store/passwordReset"
import { ChangePasswordPayload } from "@/model/auth"
import TogglePassword from "@/components/shared/TogglePassword"


interface PasswordResetProps { }
const PasswordReset = ({ }: PasswordResetProps) => {
  const textColor = useThemeColor({}, "text")
  const { control, trigger, getValues, watch } = useForm<ChangePasswordPayload>({
    mode: "onTouched"
  })
  const { isOpen: isShowing, toggle } = useBoolean()
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const router = useRouter()
  const { reset, id } = usePasswordResetStore()

  // HANDLE SEND OTP
  const changePassword = async () => {
    if (!await trigger()) return

    try {
      openLoading()
      const payload = getValues()
      log("PAYLOAD:", payload)
      const res = await handleChangePassword(payload, id!)
      if(!res?.status) throw new Error(res.message)

      // SHOW TOAST
      toast.success(res.message, {
        duration: 3000
      })

      // CLEAR STATE
      reset()

      // NAVIGATE TO HOME PAGE
      router.replace('/login')
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
          <AuthPageTitle>Change{"\n"}Password</AuthPageTitle>
          <AuthPageParagraph>Create a new password</AuthPageParagraph>
        </Box>
          <Box style={{ gap: 16 }}>
          <CustomInput
            InputProps={{
              placeholder: "Create password",
              secureTextEntry: !isShowing,
            }}
            icon={<Icon name="lock" color={textColor} size={20} />}
            RightElement={<TogglePassword isShowing={isShowing} toggle={toggle} />}
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters"
              }
            }}
          />

          <CustomInput
            InputProps={{
              placeholder: "Confirm password",
              secureTextEntry: !isShowing,
            }}
            icon={<Icon name="lock" color={textColor} size={20} />}
            RightElement={<TogglePassword isShowing={isShowing} toggle={toggle} />}
            control={control}
            name="confirm_password"
            rules={{
              validate: (value: string) => value === watch("password") || "Passwords do not match"
            }}
          />
            <CustomButton isLoading={isLoading} onPress={changePassword} style={{ marginTop: 12 }} scheme="orange" block size="lg" text="Change Password" />
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

export default PasswordReset