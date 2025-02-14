import { Box, HStack, Text } from "@/components/others/Themed"
import { GRAY_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums";
import { router } from "expo-router";
import React from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

interface ChatCardProps {
  image: string;
  name: string;
  date: string;
  id: string | number;
  message: string;
}
const ChatCard: React.FC<ChatCardProps> = ({ date, image, message, id, name }) => {
  return (
    <TouchableOpacity onPress={() => router.push(`/speech/${id}`)}>
      <HStack style={{ alignItems: 'flex-start', gap: 10, paddingVertical: 5, marginBottom: 8 }}>
        <Image source={image as any} resizeMethod="scale" resizeMode="center" style={styles.image} />
        <Box style={{ flex: 1,  marginTop: 2 }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 16 }}>{name}</Text>
          <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: FontFamily.URBANIST_LIGHT }}>{message}</Text>
        </Box>
        <Text style={{ fontSize: 12, marginTop: 5, color: GRAY_COLOR }}>{date}</Text>
      </HStack>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: { width: 45, height: 45 }
})

export default ChatCard