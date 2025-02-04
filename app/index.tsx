import { Box, Text, VStack } from "@/components/others/Themed"
import { ORANGE_COLOR, PRIMARY_COLOR, WHITE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity } from "react-native"

interface IndexPageProps { }
const IndexPage = ({ }: IndexPageProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const registerButtonFadeAnim = useRef(new Animated.Value(0)).current;
  const [canClick, setCanClick] = useState(false)


  useEffect(() => {
    // Helper function for fade in/out
    const createFadeLoop = () => {
      return Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    };

    // Complete animation sequence
    Animated.sequence([
      // Triple fade in/out
      Animated.sequence([
        // createFadeLoop(),
        createFadeLoop(),
        createFadeLoop(),
      ]),

      // Slide up with fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50, // Slide up by 50 units
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Scale up
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),

      // Fade in login button
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Fade in register button
      Animated.timing(registerButtonFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => setCanClick(finished));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return
    router.replace('/dashboard/home')
  }, [isLoggedIn])

  return (
    <Box style={Styles.container}>
      <VStack style={{ flex: 1, justifyContent: "center" }}>
        <Animated.Image source={require("../assets/images/logo-name.png")} style={[
          style.logo,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]} />
      </VStack>
      <Box style={{ gap: 15, marginBottom: 100 }}>
        <Animated.View style={{ opacity: buttonFadeAnim }}>
          <TouchableOpacity disabled={!canClick} activeOpacity={.8} style={[style.button, { backgroundColor: ORANGE_COLOR }]} onPress={() => router.push('/login')}>
            <Text style={style.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: registerButtonFadeAnim }}>
          <TouchableOpacity disabled={!canClick} activeOpacity={.8} style={[style.button, { backgroundColor: PRIMARY_COLOR }]} onPress={() => router.push('/register')}>
            <Text style={style.buttonText}>Register</Text>
          </TouchableOpacity>
        </Animated.View>
      </Box>
    </Box>
  )
}

const style = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: DEFAULT_BORDER_RADIUS,
    ...Styles.shadow
  },
  buttonText: {
    color: WHITE_COLOR,
    fontSize: 18,
    fontFamily: FontFamily.URBANIST_SEMIBOLD
  },
  logo: {
    height: 200,
    resizeMode: "contain",
  }
})
export default IndexPage