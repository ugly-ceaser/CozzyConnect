import { Text, Box } from "@/components/others/Themed"
import React, { useEffect } from "react"
import {useAssets} from  "expo-asset" 
import { Dimensions, Image, ImageBackground, StyleSheet } from "react-native"
import Styles from "@/constants/Styles"
import { FontFamily } from "@/constants/Enums"
import { ORANGE_COLOR } from "@/constants/Colors"
import { useRouter } from "expo-router"


interface RegistrationSuccessProps {}
const RegistrationSuccess:React.FC<RegistrationSuccessProps> = ({}) => {
  const CHANGE_INTERVAL = 4000
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.replace('/dashboard/home')
    }, CHANGE_INTERVAL)
  }, [])

  const [asset] = useAssets([
    require("@/assets/images/pngs/confetti.png"), 
    require("@/assets/images/pngs/success.png")
  ])
  const { height, width } = Dimensions.get("screen")
  return(
    <Box style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={{uri: asset?.[0]?.uri, width, height }}>
        <Box style={[Styles.container, style.main]}>
          <Image source={{ uri: asset?.[1]?.uri, width: 123, height: 123 }} />
          
          <Box style={{ marginTop: 20, gap: 10 }}>
            <Text style={style.title}>Registration successful</Text>
            <Text style={style.text}>Your dream home is one click away</Text>
          </Box>
        </Box>
      </ImageBackground>
    </Box>
  )
}


const style = StyleSheet.create({
  main: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  title: { fontSize: 24, fontFamily: FontFamily.URBANIST_EXTRA_BOLD, color: ORANGE_COLOR },
  text: { fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR }
})

export default RegistrationSuccess