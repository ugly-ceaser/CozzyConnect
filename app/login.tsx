import { AuthPageParagraph, AuthPageTitle } from "@/components/others/StyledText"
import { HStack, Text, Box, useThemeColor } from "@/components/others/Themed"
import Styles from "@/constants/Styles"
import { StyleSheet } from "react-native"
import { useForm } from "react-hook-form"
import CustomInput from "@/components/shared/CustomInput"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import { FontFamily } from "@/constants/Enums"
import { Link, useRouter } from "expo-router"
import { ORANGE_COLOR, PRIMARY_COLOR } from "@/constants/Colors"
import CustomButton from "@/components/shared/CustomButton"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react"
import { log } from "@/utils/helpers"
import useBoolean from "@/hooks/useBoolean"
import TogglePassword from "@/components/shared/TogglePassword"
import { handleLogin, handleSendEmailOtp } from "@/api/auth"
import { LoginData } from "@/model/auth"
import { toast } from "@backpackapp-io/react-native-toast"
import { useUserStore } from "@/store/user"
import { UserResponseData } from "@/model/user"
import { useRegistrationStore } from "@/store/registration"
import useFetchUser from "@/hooks/useFetchUser"
import { DEFAULT_TOKEN, DEFAULT_USER } from "@/contents/user"
import { APIEndpoint } from "@/api"


interface LoginPageProps { }
const LoginPage = ({ }: LoginPageProps) => {
  const [remember, setRemember] = useState<boolean>(false)
  const textColor = useThemeColor({}, "text")
  const { control, watch, trigger, getValues } = useForm<LoginData>({
    mode: "onTouched"
  })
  const { isOpen: isShowing, toggle } = useBoolean()
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const userStore = useUserStore()
  const userRegStore = useRegistrationStore()
  const router = useRouter()
  const { fetchUserData } = useFetchUser()

  // HANDLE SIGN IN
  const handleSignIn = async () => {
    if (!await trigger()) return

    try{
      openLoading()
      const payload = getValues()
      const result = await handleLogin(payload)
      if(!result?.status) throw new Error(result.message)
      userStore.setUser(result.data?.data as UserResponseData)

      // CHECK FOR VERIFICATION
      if(!result.data?.data.isEmailVerified){
        userRegStore.populate?.({ email: result.data?.data.email })
        userStore.setToken(result.data?.access_token as string, remember)

        const res = await handleSendEmailOtp(payload.EmailOrPhoneNumber)
        if(!res?.status) throw new Error(res.message)
        userStore.setToken(result.data?.access_token as string, true)

        return router.replace("/otp")
      }

      // SET STATES
      const details = await fetchUserData(result.data?.access_token)
      userStore.setUser({...result.data?.data, ...details} as UserResponseData, remember)
      userStore.setToken(result.data?.access_token as string, remember)

      // NAVIGATE TO HOME PAGE
      router.replace('/dashboard/home')
    }
    catch(error: any) {
      // userStore.setUser(DEFAULT_USER as UserResponseData, remember)
      // userStore.setToken(DEFAULT_TOKEN as string, remember)
      // router.replace('/dashboard/home')

      toast.error(error.message, {
        duration: 3000,
      })
    }
    finally {
      closeLoading()
    }
  }

  return (
    <KeyboardAvoidingScrollView style={{ flex: 1 }}>
      <Box style={[Styles.container, { paddingBottom: 20 }]}>
        <Box style={style.titleContainer}>
          <AuthPageTitle>Welcome {"\n"}back!</AuthPageTitle>
          <AuthPageParagraph>Sign in to enjoy our services</AuthPageParagraph>
        </Box>

        <Box style={{ gap: 16 }}>
          <CustomInput
            InputProps={{
              placeholder: "Enter email/phone number"
            }}
            icon={<Icon name="envelope" color={textColor} size={20} />}
            control={control}
            name="EmailOrPhoneNumber"
            rules={{
              required: "Please enter your email or phone number",
            }}
          />

          <CustomInput
            InputProps={{
              placeholder: "Enter Password",
              secureTextEntry: !isShowing
            }}
            icon={<Icon name="lock" color={textColor} size={20} />}
            control={control}
            name="password"
            rules={{
              required: "Password is required",
            }}
            RightElement={<TogglePassword isShowing={isShowing} toggle={toggle} />}
          />
        </Box>

        <Box style={{ marginTop: 20, gap: 10 }}>
          <HStack style={{ width: "100%", justifyContent: "space-between" }}>
            <Box style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <BouncyCheckbox
                size={22}
                fillColor={ORANGE_COLOR}
                unFillColor="#D9D9D9"
                text="Remember me"
                iconStyle={{ borderRadius: 4}}
                innerIconStyle={{ borderWidth: 1, borderRadius: 4, borderColor: !remember ? "#424F24" : ORANGE_COLOR }}
                textStyle={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 15, color: textColor, textDecorationLine: "none" }}
                onPress={(isChecked: boolean) => setRemember(isChecked)}
              />
            </Box>

            <Link href={"/forgot-password"} asChild>
              <Text style={{fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 15, textDecorationLine: "none" }}>Forgot password?</Text>
            </Link>
          </HStack>
          <CustomButton isLoading={isLoading} onPress={handleSignIn} style={{ marginTop: 12 }} scheme="orange" block size="lg" text="Sign in" />
        </Box>

        {/* <Box style={{ flexDirection: "row", alignItems: "center", marginVertical: 18 }}>
          <Box style={style.divider} />
          <Text style={{ marginHorizontal: 12, fontFamily: FontFamily.URBANIST_BOLD, fontSize: 18 }}>Or</Text>
          <Box style={style.divider} />
        </Box>

        <Box>
          <GoogleSignInButton />
        </Box> */}

        <Box style={style.redirectSection}>
          <Text style={style.redirectText}>Don't have an account?</Text>
          <Link href={"/register"} asChild>
            <Text style={{ color: ORANGE_COLOR, ...style.redirectText }}> Create an account</Text>
          </Link>
        </Box>

      </Box>
    </KeyboardAvoidingScrollView>
  )
}
const style = StyleSheet.create({
  titleContainer: {
    marginBottom: 30,
    marginTop: 100
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

export default LoginPage