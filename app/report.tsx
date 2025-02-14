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
import useBoolean from "@/hooks/useBoolean"
import { ReportPayload } from "@/model/report"
import { Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface ReportProps { }
const Report: React.FC<ReportProps> = ({ }) => {
  const [reportPayloadError, setReportPayloadError] = useState<Partial<Record<keyof ReportPayload, boolean>>>({
    category: false,
    priority: false,
  })
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const { control, setValue, getValues, trigger, watch } = useForm<ReportPayload>({
    mode: "onTouched"
  })
  const { category, description, priority } = watch()
  useEffect(() => {
    if (category) {
      setReportPayloadError(prev => ({...prev, category: false}))
    }
    if (priority) {
      setReportPayloadError(prev => ({...prev, priority: false}))
    }
  }, [category, description, priority])


  const handleSubmit = async () => {
    let canSubmit = true
    const payload = getValues()

    if (!await trigger('description', { shouldFocus: true })) {
      canSubmit = false
    }

    if (!payload.category) {
      canSubmit = false
      setReportPayloadError(prev => ({ ...prev, category: true }))
    }

    if (!payload.priority) {
      canSubmit = false
      setReportPayloadError(prev => ({ ...prev, priority: true }))
    }

    if (!canSubmit) return

  }



  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Report a problem" />
        }}
      />
      <KeyboardAvoidingScrollView style={Styles.container}>
        <Box style={{ flex: 1, paddingBottom: 50 }}>
          <Text style={{ fontSize: 17, fontFamily: FontFamily.URBANIST_SEMIBOLD, color: INFO_GRAY_COLOR, textAlign: "center" }}>Our support will respond once you send in your message</Text>
          <Box style={{ marginTop: 20, gap: 16 }}>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Category</Text>
              <Select
                data={reportCategory}
                placeholder="Choose house category"
                hasError={reportPayloadError.category}
                onChange={(data) => setValue('category', data!)}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>House Description</Text>
              <CustomInput
                name="description"
                InputProps={{
                  placeholder: "Brief Description of your problem ",
                  multiline: true,
                }}
                control={control}
                rules={{
                  required: "Please state your issue",
                }}
              />
            </Box>

            <Box>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Category</Text>
              <Select
                data={reportCategory}
                hasError={reportPayloadError.priority}
                placeholder="Prioritize your problem"
                onChange={(data) => setValue('priority', data!)}
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

export default Report