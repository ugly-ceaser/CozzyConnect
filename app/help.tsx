import { handleCreateContact } from "@/api/help"
import { Box, Text } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton"
import CustomInput from "@/components/shared/CustomInput"
import KeyboardAvoidingScrollView from "@/components/shared/KeyboardAvoidingScrollView"
import Select from "@/components/shared/Select"
import { INFO_GRAY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { reportCategory } from "@/contents/report"
import useAuth from "@/hooks/useAuth"
import useBoolean from "@/hooks/useBoolean"
import { SupportPayload } from "@/model/contact"
import { useUserStore } from "@/store/user"
import { log } from "@/utils/helpers"
import { toast } from "@backpackapp-io/react-native-toast"
import { router } from "expo-router"
import { Stack } from "expo-router"
import React, { } from "react"
import { useForm } from "react-hook-form"

interface HelpProps { }
const Help: React.FC<HelpProps> = ({ }) => {
  const { control, getValues, trigger, reset } = useForm<SupportPayload>()
  const { isOpen: isLoading, open, close } = useBoolean()
  const { handleLogoutAccount } = useAuth()

  const handleSubmit = async () => {
    const payload = getValues()
    if (!await trigger()) return
    try { 
      open()
      // MAKE REQUEST HERE
      const result = await handleCreateContact(payload)

      if (!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }

      toast.success(result.message, {
        duration: 3000
      })

    }
    catch (error: any) {
      log("ERROR: ", error.message)
      toast.error("Failed to submit form, please try again", {
        duration: 3000
      })
      return router.back()
    }
    finally {
      close()
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Help & Support" />
        }}
      />
      <KeyboardAvoidingScrollView style={Styles.container}>
        <Box style={{ flex: 1, paddingBottom: 50 }}>
          <Text style={{ fontSize: 17, fontFamily: FontFamily.URBANIST_SEMIBOLD, color: INFO_GRAY_COLOR, textAlign: "center" }}>Our support will respond once you send in your message</Text>
          <Box style={{ marginTop: 20, gap: 16 }}>
            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>First Name</Text>
              <CustomInput
                name="firstName"
                control={control}
                rules={{
                  required: "Please enter your firstname",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Last Name</Text>
              <CustomInput
                name="lastName"
                control={control}
                rules={{
                  required: "Please enter your lastname",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Email</Text>
              <CustomInput
                name="email"
                control={control}
                InputProps={{
                  keyboardType: 'email-address'
                }}
                rules={{
                  required: "Please enter your lastname",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Message</Text>
              <CustomInput
                name="message"
                InputProps={{
                  multiline: true
                }}
                control={control}
                rules={{
                  required: "Please input a message",
                }}
              />
            </Box>

            <CustomButton
              text="Sumbit"
              scheme="orange"
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </KeyboardAvoidingScrollView>
    </>
  )
}

export default Help