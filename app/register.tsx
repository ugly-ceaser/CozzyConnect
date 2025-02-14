import { Text, Box, useThemeColor } from "@/components/others/Themed"
import { AuthPageParagraph, AuthPageTitle } from "@/components/others/StyledText"
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
import { handleRegister, handleSendEmailOtp } from "@/api/auth"
import { RegisterData } from "@/model/auth"
import useBoolean from "@/hooks/useBoolean"
import { toast } from "@backpackapp-io/react-native-toast"
import { useRegistrationStore } from "@/store/registration"
import React from "react"
import TogglePassword from "@/components/shared/TogglePassword"
import { useUserStore } from "@/store/user"
import useFetchUser from "@/hooks/useFetchUser"
import { UserResponseData } from "@/model/user"


interface RegisterPageProps { }
const RegisterPage = ({ }: RegisterPageProps) => {
  const { isOpen: isLoading, open, close } = useBoolean()
  const textColor = useThemeColor({}, "text")
  const { replace } = useRouter()
  const { populate, email } = useRegistrationStore()
  const { isOpen: isShowing, toggle } = useBoolean()
  const { control, watch, trigger, getValues } = useForm<RegisterData>({
    mode: "onTouched",
    defaultValues: { email }
  })
  const userStore = useUserStore()
  
  
  const handleSignUp = async () => {
    if(! await trigger()) return
    open()
    try {
      const payload = getValues()
      const result = await handleRegister(payload)

      if(!result?.status) throw new Error(result.message)

      // SET DATA
      populate?.({
        password: payload.password,
        email: payload.email
      })

      // REQUEST OTP
      const res = await handleSendEmailOtp(payload.email)
      if(!res?.status) throw new Error(res.message)

      userStore.setToken(result.data?.access_token as string, true)
      userStore.setUser(result.data?.data as UserResponseData, true)

      // REDIRECT TO OTP PAGE
      replace('/otp')
    } 
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      });
    }
    finally {
      close()
    }
  }

  return (
    <KeyboardAvoidingScrollView>
      <Box style={[Styles.container, { paddingBottom: 20 }]}>
        <Box style={style.titleContainer}>
          <AuthPageTitle>Hello {"\n"}there!</AuthPageTitle>
          <AuthPageParagraph>Create account to enjoy our services</AuthPageParagraph>
        </Box>

        <Box style={{ gap: 16 }}>
          <CustomInput
            InputProps={{
              placeholder: "Email",
              keyboardType: "email-address"
            }}
            icon={<Icon name="envelope" color={textColor}  size={20} />}
            control={control}
            defaultValue={email ?? ''}
            name="email"
            rules={{
              required: "Please enter your email",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              }
            }}
          />

          <CustomInput
            InputProps={{
              placeholder: "Create password",
              secureTextEntry: !isShowing,
            }}
            RightElement={<TogglePassword isShowing={isShowing} toggle={toggle} />}
            icon={<Icon name="lock" color={textColor} size={20} />}
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
            RightElement={<TogglePassword isShowing={isShowing} toggle={toggle} />}
            icon={<Icon name="lock" color={textColor} size={20} />}
            control={control}
            name="confirmPassword"
            rules={{
              validate: (value: string) => value === watch("password") || "Passwords do not match"
            }}
          />
        </Box>

        <Box style={{ marginTop: 20}}>
          <Text style={style.policyText}>By clicking Sign Up, you agree to our
            <Link href={"/"}>
              <Text style={style.policyMainText}> Terms, Privacy Policy and Cookies Policy. </Text>
            </Link>
            You may receive SMS notifications from us and can opt out at any time</Text>

          <CustomButton isLoading={isLoading} onPress={handleSignUp} style={{ marginTop: 16 }} block size="lg" scheme="orange" text="Sign up" />
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
          <Text style={style.redirectText}>Already have an account?</Text>
          <Link href={"/login"} asChild>
            <Text style={{ color: ORANGE_COLOR, ...style.redirectText }}> Sign in</Text>
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

export default RegisterPage