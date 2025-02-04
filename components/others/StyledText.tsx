import { StyleSheet } from 'react-native';
import { Text, TextProps, useThemeColor } from './Themed';
import { FontFamily } from '@/constants/Enums';

export function AuthPageTitle(props: TextProps) {
  const color = useThemeColor({}, "text")
  return <Text style={[props.style, { fontFamily: FontFamily.URBANIST_MEDIUM, color }, defaultStyles.authPageTitle]}  {...props} />;
}

export function AuthPageParagraph(props: TextProps) {
  const color = useThemeColor({}, "text")
  return <Text style={[props.style, { fontFamily: FontFamily.URBANIST_MEDIUM, color }, defaultStyles.authPageParagraph]}  {...props} />;
}

const defaultStyles = StyleSheet.create({
  authPageTitle: {
    fontSize: 36,
  },
  authPageParagraph: {
    fontSize: 18,
    marginTop: 16,
  },
})