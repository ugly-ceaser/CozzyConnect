import { Box, HStack, useThemeColor } from "@/components/others/Themed"
import CustomButton from "@/components/shared/CustomButton"
import CustomInput from "@/components/shared/CustomInput"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import { useUserStore } from "@/store/user"
import { DISABLE_GRAY, GRAY_COLOR, PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from "@/constants/Colors"
import { toast } from "@backpackapp-io/react-native-toast"
import { UserResponseData } from "@/model/user"
import { handleSendEmailOtp, handleVerifyOtp } from "@/api/auth"
import { VerifyOTP } from "@/model/auth"
import useCountdown from "@/hooks/useCountdown"
import useBoolean from "@/hooks/useBoolean"
import useKeyboard from "@/hooks/useKeyboard"
import OTPTextInput from "react-native-otp-textinput"


interface VerifyPhoneProps { 
  isVerified?: boolean;
}
const VerifyPhone: React.FC<VerifyPhoneProps> = ({ isVerified }) => {
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, "borderColor")
  const [hasSent, setHasSent] = useState<boolean>(false)
  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const { closeKeyboard } = useKeyboard()
  const otpInput = useRef<any>(null)
  const { control, getValues, trigger } = useForm<{ email: string }>({
    mode: 'onTouched'
  })
  const { start, restart, isDone, formattedTime } = useCountdown({ initialMinutes: 2 })
  const user = useUserStore(state => state.user)
  const [verifyError, setVerifyError] = useState<boolean>(false)
  const updateUser = useUserStore(state => state.updateItem)


  // HANDLE TEXT CHANGE
  const handleTextChange = (code: string) => {
    if(code.length === 4){ 
      setCanSubmit(true)
      closeKeyboard()
      handleVerify()
    }

    else setCanSubmit(false)
    setCode(code)
  }

  // HANDLE VERIFY
  const handleClearCode = async () => {
    otpInput?.current?.clear()
  }

  // HANDLE SEND OTP
  const sendOTP = async () => {
    if(! await trigger()) return
    try {
      openLoading()

      const payload = getValues()
      const result = await handleSendEmailOtp(payload.email)
      if(!result?.status) throw new Error(result.message)
      
      setHasSent(true)
      start()

      toast.success(result.message, {
        duration: 3000
      })
    }
    catch(error: any){
      toast.error(error.message, {
        duration: 3000
      })
    }
    finally {
      closeLoading()
    }
  }

  // HANDLE VERIFY OTP
  const handleVerify = async () => {
    if(! await trigger()) return
    if(!canSubmit) return
    
    openLoading()
    setVerifyError(false)
    try {
      const { email } = getValues()
      const payload: VerifyOTP = {
        otp: code,
        email: email!
      }
      const result = await handleVerifyOtp(payload)
      if(!result?.status) throw new Error(result.message)

      toast.success(result.message, {
        duration: 3000,
      });
      
      handleClearCode()   
      setHasSent(false)
      updateUser('user', { ...user, isEmailVerified: true } as UserResponseData)
    }
    catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      });
      setVerifyError(true)
    }
    finally {
      closeLoading()
    }
  }

  useEffect(() => {
    setTimeout(() => setVerifyError(false), 2000)
  }, [verifyError])


  return (
    <Box>
      <HStack style={{ width: '100%', gap: 15 }}>
        <CustomInput
          InputProps={{
            placeholder: "Phone no",
            keyboardType: "email-address",
            readOnly: isVerified,
          }}
          InputBoxProps={{
            style: {
              height: 45,
              borderColor: isVerified ? GRAY_COLOR : borderColor,
              backgroundColor: isVerified ? DISABLE_GRAY : WHITE_COLOR,
            }
          }}
          IconBoxProps={{
            style: {
              backgroundColor: isVerified ? DISABLE_GRAY : WHITE_COLOR,
            }
          }}
          style={{ flex: 1 }}
          icon={<Icon name="phone" color={textColor} size={20} />}
          control={control}
          defaultValue={user?.phoneNumber ?? ''}
          name="phone"
          rules={{
            required: "Phone no. is required",
            pattern: {
              value: /^[0-9]+[0-9]{9,10}$/,
              message: 'Invalid phone no.',
            }
          }}
        />
        <CustomButton
          isDisabled={isVerified || (hasSent && !isDone)}
          isLoading={isLoading}
          onPress={sendOTP}
          text={hasSent ?
            isDone ? 'Resend' : formattedTime
            : "Verify"
          } style={{
            height: 45, width: 90,
          }}
          size="sm"
        />
      </HStack>

      { hasSent && (
        <HStack>
           <OTPTextInput
              ref={otpInput} 
              handleTextChange={handleTextChange}
              tintColor={verifyError ? RED_COLOR : PRIMARY_COLOR}
              autoFocus
              
              offTintColor={verifyError ? RED_COLOR : PRIMARY_COLOR}
              containerStyle={{
                flex: 1,
              }}
              textInputStyle={{
                height: 60,
                width: 80,
                fontSize: 28,
                color: textColor
              } as any}
            />
        </HStack>
        )}

    </Box>
  )
}

export default VerifyPhone