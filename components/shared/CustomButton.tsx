import { ORANGE_COLOR, PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums"
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native"
import { Box, Text } from "../others/Themed";
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables";

interface CustomButtonProps extends TouchableOpacityProps {
  size?: "lg" | "md" | "sm" | "xs";
  block?: boolean;
  rounded?: "md" | "sm";
  scheme?: "orange" | "red";
  text: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  BoxProps?: ViewProps;
  textStyles?: TextStyle;
}
const CustomButton: React.FC<CustomButtonProps> = ({ size, style, scheme, BoxProps, isDisabled, rounded, block, text, textStyles, isLoading, ...props }) => {
  const sizeStyles = size ? defaultStyle[size] : defaultStyle['md']
  const roundedStyle = rounded ? roundedStyles[rounded] : roundedStyles['md']
  const colorStyles = scheme ? defaultStyle[scheme] : defaultStyle['default']
  const opacity = isDisabled || isLoading ? .5 : 1
  return (
    <Box {...BoxProps}>
      <TouchableOpacity
        disabled={isDisabled || isLoading}
        {...props}
        activeOpacity={0.8}
      >
        <Box style={[defaultStyle.btn, block && defaultStyle.block, sizeStyles, roundedStyle, colorStyles, { opacity }, style]} >
          {isLoading ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={"small"} color={WHITE_COLOR} />
            </View>
          ) : (
            <Text style={[defaultStyle.white, { fontSize: sizeStyles.fontSize, fontFamily: FontFamily.URBANIST_SEMIBOLD, ...textStyles }]}>{text}</Text>
          )}
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

const roundedStyles = StyleSheet.create({
  md: {
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  sm: {
    borderRadius: DEFAULT_BORDER_RADIUS / 2,
  },
})

const defaultStyle = StyleSheet.create({
  btn: {
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  block: {
    width: "100%"
  },
  lg: {
    height: 55,
    fontSize: 18,
  },
  md: {
    height: 50,
    fontSize: 17
  },
  sm: {
    height: 50,
    fontSize: 16
  },
  xs: {
    height: 40,
    fontSize: 12
  },
  orange: {
    backgroundColor: ORANGE_COLOR
  },
  white: {
    color: WHITE_COLOR,
  },
  red: {
    backgroundColor: RED_COLOR
  },
  default: {
    backgroundColor: PRIMARY_COLOR
  },
})

export default CustomButton