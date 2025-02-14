import React, { ReactNode } from "react"
import { HStack, useThemeColor } from "../others/Themed"
import AntIcon from "@expo/vector-icons/AntDesign"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { TextInput, TextInputProps, ViewStyle } from "react-native"
import { FontFamily } from "@/constants/Enums"


interface IconInputProps extends ViewStyle { 
  InputProps?: TextInputProps
  icon: ReactNode;
}
const IconInput: React.FC<IconInputProps> = ({ icon, InputProps, ...styles }) => {
  const textColor = useThemeColor({}, 'text')
  return (
    <HStack style={[{ borderColor: textColor, borderWidth: 1, borderRadius: DEFAULT_BORDER_RADIUS}, styles]}>
      {icon || <AntIcon name="search1" size={20} color={textColor} style={{ marginHorizontal: 15 }} />}
      <TextInput placeholder="Search..." cursorColor={textColor} style={[{ width: "100%", height: 60, color: textColor, fontSize: 17, fontFamily: FontFamily.URBANIST_REGULAR, }]} {...InputProps}/>
    </HStack>
  )
}

export default IconInput