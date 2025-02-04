import { ReactNode } from "react"
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform, ScrollView, StyleSheet } from "react-native"
import { useThemeColor } from "../others/Themed"

interface KeyboardAvoidingScrollViewProps extends KeyboardAvoidingViewProps{}
const KeyboardAvoidingScrollView:React.FC<KeyboardAvoidingScrollViewProps> = ({ style, children, ...props }) => {
  const bg = useThemeColor({}, "background")
  return(
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style, { backgroundColor: bg }]}
      {...props}
    >
      <ScrollView style={[styles.container, { backgroundColor: bg }]} keyboardShouldPersistTaps="always">
        { children }
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default KeyboardAvoidingScrollView