import { Box, Text } from "@/components/others/Themed"
import { BLACK_COLOR, OFF_GREEN, PRIMARY_COLOR, WHITE_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums";
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import React from "react"
import { StyleSheet } from "react-native";

interface MessageCardProps {
  message: string;
  isOwner?: boolean;
}
const MessageCard: React.FC<MessageCardProps> = ({ message, isOwner }) => {
  return (
    <Box style={[{ maxWidth: 310, marginBottom: 10, padding: 12, paddingHorizontal: 16, borderRadius: DEFAULT_BORDER_RADIUS }, isOwner ? styles.owner : styles.other]}>
      <Text style={[{ lineHeight: 24, fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 17 }, isOwner ? styles.ownerText : styles.otherText]}>{message}</Text>
    </Box>
  )
}

const styles = StyleSheet.create({
  owner: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    backgroundColor: OFF_GREEN
  },
  ownerText: {
    color: BLACK_COLOR
  },
  other: {
    borderTopLeftRadius: 0,
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY_COLOR
  },
  otherText: {
    color: WHITE_COLOR
  }
})

export default MessageCard