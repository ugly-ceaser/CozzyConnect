import { Text, TextProps } from "@/components/others/Themed"
import { BLACK_COLOR, OFF_GREEN, ORANGE_COLOR, WHITE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import React from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

interface JobTabButtonProps extends TouchableOpacityProps { 
  title: string;
  TextProps?: TextProps; 
  isActive?: boolean;
}
const JobTabButton: React.FC<JobTabButtonProps> = ({ title, style, isActive, TextProps, ...props }) => {
  const { style: textStyle = {}, ...textProps } = TextProps! || {}
  return (
    <TouchableOpacity
      style={[styles.btn, style, isActive && styles.activeBtn]}
      {...props}
    >
      <Text style={[styles.text, textStyle, isActive && styles.activeText]} {...textProps}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 'auto', height: 50, flex: 1, position: 'relative',
    justifyContent: "center", paddingHorizontal: 15,
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 15, backgroundColor: OFF_GREEN,
    borderRadius: DEFAULT_BORDER_RADIUS, elevation: 3
  },
  activeBtn: { backgroundColor: ORANGE_COLOR },
  activeText: { color: WHITE_COLOR },
  text: { fontSize: 15, fontFamily: FontFamily.URBANIST_BOLD, color: BLACK_COLOR }
})
export default JobTabButton