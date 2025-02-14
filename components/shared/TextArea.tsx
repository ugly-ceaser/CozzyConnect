import { useController, set } from "react-hook-form"
import { StyleSheet, TextInput, TextInputProps, ViewProps } from "react-native";
import { Text, Box, useThemeColor } from "../others/Themed";
import { FontFamily } from "@/constants/Enums";
import { RED_COLOR } from "@/constants/Colors";
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables";
import { ReactNode, useEffect } from "react";
import Styles from "@/constants/Styles";

interface CustomInputProps extends ViewProps {
  control: any;
  icon?: any;
  name: string;
  defaultValue?: string;
  rules?: any;
  InputBoxProps?: ViewProps;
  RightElement?: ReactNode;
  InputProps?: TextInputProps;
  IconBoxProps?: ViewProps;
}
const CustomInput: React.FC<CustomInputProps> = ({ icon, name, control, defaultValue, rules, InputProps, InputBoxProps, RightElement, IconBoxProps, ...rest }) => {
  const color = useThemeColor({}, "borderColor")
  const text = useThemeColor({}, "text")
  const { field: { onBlur, onChange, value }, fieldState: { error } } = useController({
    control,
    name,
    defaultValue: (() => defaultValue)(),
    rules
  })

  const { style: inputBoxStyle, ...inputBoxRestProp } = InputBoxProps ? InputBoxProps : {} as ViewProps

  const { style: iconBoxStyle, ...iconBoxRestProp } = IconBoxProps ? IconBoxProps : {} as ViewProps

  const { multiline } = InputProps ? InputProps : {} as TextInputProps
  return (
    <Box style={[style.baseBox]} {...rest}>
      <Box style={[style.inputBox, { borderColor: error ? RED_COLOR : color }, inputBoxStyle]} {...inputBoxRestProp}>
        {icon && (
          <Box style={[style.iconBox, iconBoxStyle]} {...iconBoxRestProp}>
            {icon}
          </Box>
        )}
        <TextInput
          placeholderTextColor={text}
          style={[style.input, { color: text }, multiline && style.multilineTextArea]}
          onBlur={onBlur}
          onChangeText={onChange}
          cursorColor={color}
          value={value ?? defaultValue}
          multiline={multiline}
          {...InputProps}
        />
        {RightElement}
      </Box>
      {error && <Text style={style.errorText}>{error.message}</Text>}
    </Box>
  )
}

const style = StyleSheet.create({
  baseBox: {
    alignItems: "center",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: DEFAULT_BORDER_RADIUS,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    height: 60,
    flex: 1,
    fontSize: 18,
    paddingRight: 16,
    paddingLeft: 16,
    fontFamily: FontFamily.URBANIST_REGULAR,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.URBANIST_LIGHT,
    letterSpacing: .5,
    marginTop: 4,
    color: RED_COLOR,
    width: "100%"
  },
  errorBorder: {
    borderColor: RED_COLOR
  },
  multilineTextArea: {
    alignItems: 'center',
    height: 120,
    paddingVertical: 8,
    textAlignVertical: 'top'
  }
})

export default CustomInput