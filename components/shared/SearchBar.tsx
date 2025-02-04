import React from "react"
import { HStack, useThemeColor } from "../others/Themed"
import { StyleSheet, TextInput } from "react-native"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import CustomButton from "./CustomButton";
import { FontFamily } from "@/constants/Enums";

interface SearchBarProps {
  search: string;
  placeholder?: string;
  autoFocus?: boolean;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  handleSearch: () => any
}
const SearchBar: React.FC<SearchBarProps> = ({ handleSearch, autoFocus, placeholder, isSearching, search, setSearch }) => {
  const textColor = useThemeColor({}, "text")
  return (
    <HStack style={{ alignItems: "center", borderWidth: 1, borderColor: textColor, borderRadius: DEFAULT_BORDER_RADIUS }}>
      <TextInput
        autoFocus={autoFocus} cursorColor={textColor}
        onChangeText={setSearch}
        value={search}
        placeholderTextColor={textColor} placeholder={ placeholder || "Search name, address..." }
        style={[styles.searchInput, { color: textColor }]}
      />

      <CustomButton
        size="xs" text="Search"
        scheme="orange"
        isLoading={isSearching}
        onPress={handleSearch}
        textStyles={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 14 }} style={{ height: 35, paddingHorizontal: 20, marginRight: 14, borderRadius: 5 }}
      />
    </HStack>
  )
}

const styles = StyleSheet.create({
  searchInput: { flex: 1, height: 60, paddingLeft: 14, fontFamily: FontFamily.URBANIST_REGULAR, fontSize: 16 },

})

export default SearchBar