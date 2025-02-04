import React from "react"
import { Box, Text, VStack } from "../others/Themed"
import { Dimensions, Image } from "react-native"
import { FontFamily } from "@/constants/Enums";
import { DEFAULT_SCREEN_PAD } from "@/constants/Variables";

interface EmptyStateProps { 
  title: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({ title }) => {
  const SCREEN_WIDTH = Dimensions.get('screen').width - (DEFAULT_SCREEN_PAD * 2)
  return (
    <VStack style={{ flex: 1, height: 280, width: SCREEN_WIDTH, justifyContent: 'center' }}>
      <Box style={{ alignItems: 'center', width: '100%' }}>
        <Image source={require("@/assets/images/empty.png")} resizeMode="contain" style={{ width: 200, height: 150 }} />
        <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 17,  textAlign: 'center' }}>{title}</Text>
      </Box>
    </VStack>
  )
}

export default EmptyState