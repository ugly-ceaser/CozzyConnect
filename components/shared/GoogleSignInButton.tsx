import React from "react"
import { HStack, Text } from "../others/Themed"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import Constants from 'expo-constants';
// import * as Updates from 'expo-updates';

// WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps { }
const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ }) => {
  // const config = (Updates.manifest as any)?.extra ?? (Constants?.manifest as any)?.extra;

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: config.expoClientId,
  //   iosClientId: config.iosClientId,
  //   androidClientId: config.androidClientId,
  //   webClientId: config.webClientId,
  // });
  // // const { isOpen, open, close } = useBoolean()

  // const fetchUserInfo = async (token: string) => {
  //   let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const user = await userInfoResponse.json();
  //   console.log("USER:", user)
  // };

  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     if (!authentication) return
  //     fetchUserInfo(authentication.accessToken);
  //   }
  // }, [response]);

  return (
    <TouchableOpacity onPress={() => {}} >
      <HStack style={[style.button]}>
        <Image source={require("../../assets/images/google.png")} style={style.googleLogo} />
        <Text style={style.btnText}>Sign in with google</Text>
      </HStack>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  button: {
    padding: 18,
    alignItems: "center",
    backgroundColor: 'rgba(200, 200, 200, .2)',
    borderRadius: DEFAULT_BORDER_RADIUS
  },
  btnText: {
    fontFamily: FontFamily.URBANIST_MEDIUM,
    fontSize: 18,
    flex: 1,
    textAlign: "center"
  },
  googleLogo: {
    width: 20,
    height: 20,
    resizeMode: "contain"
  }
})

export default GoogleSignInButton