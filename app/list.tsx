import { Box, Text, VStack, useThemeColor } from "@/components/others/Themed"
import { FontFamily } from "@/constants/Enums"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native"

interface LandingPageProps { }
const LandingPage: React.FC<LandingPageProps> = ({ }) => {
  const router = useRouter()
  const backgroundColor = useThemeColor({}, "background")

  const pages = {
    "auth": [
      { name: "Login Page", handlePress: () => router.push("/login") },
      { name: "Register Page", handlePress: () => router.push("/register") },
      { name: "OTP Page", handlePress: () => router.push("/otp") },
      { name: "Registration Success Page", handlePress: () => router.push("/registration-success") },
    ],
    "dashboard": [
      { name: "Home Page", handlePress: () => router.push("/dashboard/home") },
      { name: "Job Page", handlePress: () => router.push("/dashboard/work") },
    ],
    "profile": [
      { name: "Profile Page", handlePress: () => router.push("/profile/") },
      { name: "Profile Edit Page", handlePress: () => router.push("/profile/edit") },
    ],
    "others": [
      { name: "Notification Page", handlePress: () => router.push("/notification") },
      { name: "Intro Page", handlePress: () => router.push("/intro") },
    ],
  }

  return (
    <VStack style={{ paddingTop: 60, paddingBottom: 20, flex: 1, paddingHorizontal: 14 }}>
      <Text style={styles.title} >Pages</Text>
      <ScrollView style={{ backgroundColor, flex: 1, width: "100%" }} showsVerticalScrollIndicator>
        {Object.entries(pages).map(([key, value]) => (
          <Box key={key} style={{ gap: 10, marginBottom: 30, width: "100%" }}>
            <Text style={styles.header}>{key}</Text>
            <Box>
              {value.map(({ name, handlePress }, index) => (
                <TouchableOpacity onPress={handlePress} key={index} style={styles.btn}>
                  <Text style={styles.text}>{name}</Text>
                </TouchableOpacity>
              ))}
            </Box>
          </Box>
        ))}
      </ScrollView>
    </VStack>
  )
}

const styles = StyleSheet.create({
  header: { fontFamily: FontFamily.URBANIST_BOLD, fontSize: 18, textTransform: "uppercase" },
  title: {
    fontSize: 24,
    marginBottom: 18,
    fontFamily: FontFamily.URBANIST_EXTRA_BOLD
  },
  btn: {
    width: "100%",
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    borderColor: "#999"
  },
  text: {
    fontFamily: FontFamily.URBANIST_BOLD,
    fontSize: 16
  }
})

export default LandingPage