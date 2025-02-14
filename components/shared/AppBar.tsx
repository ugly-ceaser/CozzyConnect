import React, { ReactNode } from "react"
import { HStack, Text, useThemeColor } from "../others/Themed"
import { TouchableOpacity } from "react-native-gesture-handler"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import { SafeAreaView, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/Enums";
import { DEFAULT_SCREEN_PAD } from "@/constants/Variables";
import { useRouter } from "expo-router";

interface AppBarProps {
  title: string;
  preventBackPress?: boolean;
  caseInsensitive?: boolean;
  RightElement?: ReactNode;
}
const AppBar: React.FC<AppBarProps> = ({ title, caseInsensitive, preventBackPress, RightElement }) => {
  const textColor = useThemeColor({}, "text")
  const bgColor = useThemeColor({}, "background")
  const router = useRouter()
  return (
    <SafeAreaView style={{ paddingTop: 40, paddingHorizontal: DEFAULT_SCREEN_PAD, backgroundColor: bgColor, paddingBottom: 12 }}>
      <HStack>
        <TouchableOpacity style={{ padding: 6 }} onPress={() => !preventBackPress && router.canGoBack() ? router.back() : router.push('/dashboard/home')} hitSlop={20}>
          <Icon name="arrow-left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { textTransform: !caseInsensitive ? "capitalize" : undefined, }]}>{title ?? ""}</Text>
        {RightElement}
      </HStack>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  title: { flex: 1, textAlign: "center", fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }
})
export default AppBar