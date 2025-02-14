import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import React from "react"
import Icon from "@expo/vector-icons/Feather"
import { GRAY_COLOR, OFF_GREEN, PRIMARY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums";
import { StyleSheet } from "react-native";
import { NotificationType } from "@/model/notification";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { formatDate } from "@/utils/date";

interface NotificationCardProps extends NotificationType {
  icon: any,
  hasBottom?: boolean;
}
const NotificationCard: React.FC<NotificationCardProps> = ({ icon, title, text, hasBottom, date }) => {
  const textColor = useThemeColor({}, "text")
  const isFire = icon.toLowerCase() === 'fire'

  return (
    <HStack style={[{ gap: 14, paddingVertical: 12, alignItems: text ? "flex-start" : "center" }, hasBottom && { ...styles.border, borderBottomColor: textColor }]}>
      <HStack style={{ width: 50, height: 50, borderRadius: 25, justifyContent: "center", backgroundColor: OFF_GREEN }}>
        {!isFire ?
          <Icon name={icon} color={PRIMARY_COLOR} size={22} />
          : <MaterialIcon name={"local-fire-department"} color={PRIMARY_COLOR} size={22} />
        }
      </HStack>

      <Box style={{ flex: 1, gap: 10 }}>
        <HStack style={{ justifyContent: "space-between" }}>
          <Text style={{ flex: 1, fontSize: 18, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>{title}</Text>
          <Text style={{ fontSize: 14, color: GRAY_COLOR, fontFamily: FontFamily.URBANIST_REGULAR }}>{formatDate(date)}</Text>
        </HStack>

        { text && <Text style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.URBANIST_REGULAR }}>{text}</Text>}
      </Box>
    </HStack>
  )
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: 1,
    borderStyle: "solid",
  }
})

export default NotificationCard