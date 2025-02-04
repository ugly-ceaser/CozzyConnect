import { Box, HStack, Text } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import Styles from "@/constants/Styles"
import { Stack } from "expo-router"
import React from "react"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { INFO_GRAY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { terms } from "@/contents/terms"

interface TermsProps { }
const Terms: React.FC<TermsProps> = ({ }) => {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Terms & Policies" />
        }}
      />
      <Box style={[Styles.container, { paddingTop: 20 }]}>
        <HStack style={{ gap: 6, marginBottom: 15 }}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={INFO_GRAY_COLOR} />
          <Text style={{ color: INFO_GRAY_COLOR, fontFamily: FontFamily.URBANIST_LIGHT, fontSize: 14 }}>Last updated on 15 March, 2024</Text>
        </HStack>

        <Text style={{ fontFamily: FontFamily.URBANIST_REGULAR, fontSize: 16 }}>Please read the terms and conditions carefully before accepting</Text>

        <Box style={{ marginTop: 30, gap: 30 }}>
          { terms.map((term, index) => (
          <Box key={`terms-${term.title}-${index}`} style={{ gap: 6}}>
            <Text style={{ fontSize: 18, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>{`${index + 1}. ${term.title}`}</Text>
            <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, lineHeight: 22 }}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem natus, earum laboriosam, accusantium ex, corrupti dolore ipsam tempora nulla assumenda quo labore ut tenetur. Ex vel et eum dolore enim.</Text>
          </Box>
          )) }
        </Box>
      </Box>
    </>
  )
}

export default Terms