import { GRAY_COLOR, PRIMARY_COLOR, RED_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums";
import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD } from "@/constants/Variables";
import React, { useEffect, useState } from "react"
import { Platform, StyleSheet } from "react-native";
import { Box, Text, useThemeColor } from "../others/Themed";
import Icon from "@expo/vector-icons/SimpleLineIcons"
import AntDesign from "@expo/vector-icons/AntDesign"
import { Dropdown } from 'react-native-element-dropdown';


interface SelectProps {
  data: { label: string; value: string }[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  hasError?: boolean;
  defaultValue?: string;
}
const Select: React.FC<SelectProps> = ({ data, onChange, placeholder, defaultValue, hasError }) => {
  const borderColor = useThemeColor({}, "borderColor")
  const textColor = useThemeColor({}, "text")
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (!defaultValue) return
    setValue(defaultValue);
  }, [defaultValue])

  const handleSelect = (item: { label: string; value: string }) => {
    onChange(item.value)
    setValue(item.value);
  }

  return (
    <Box style={{ flex: 1 }}>
      <Dropdown
        style={[styles.dropdown, { borderColor }]}
        placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: textColor }]}
        inputSearchStyle={[styles.inputSearchStyle, { color: textColor }]}
        iconStyle={styles.iconStyle}
        data={data}
        itemTextStyle={{ textTransform: 'capitalize', }}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={defaultValue || placeholder }
        searchPlaceholder="Search..."
        value={value}
        onChange={handleSelect}
      />
      {hasError && <Text style={styles.errorText}>{`Please ${placeholder?.toLowerCase() || 'select an option'}`}</Text>}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  dropdown: {
    height: 60,
    borderRadius: DEFAULT_BORDER_RADIUS,
    paddingHorizontal: 16,
    textTransform: 'capitalize',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    textTransform: 'capitalize',
    zIndex: 999,
    fontFamily: FontFamily.URBANIST_REGULAR,
    paddingHorizontal: 8,
    fontSize: 18,
  },
  placeholderStyle: {
    fontSize: 18,
    fontFamily: FontFamily.URBANIST_REGULAR,
  },
  selectedTextStyle: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontFamily: FontFamily.URBANIST_REGULAR,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontFamily: FontFamily.URBANIST_REGULAR,
    fontSize: 14,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.URBANIST_LIGHT,
    letterSpacing: .5,
    marginTop: 4,
    color: RED_COLOR,
    width: "100%"
  },
});
export default Select