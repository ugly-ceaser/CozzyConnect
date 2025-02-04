import { Box, HStack, Text } from "@/components/others/Themed"
import CustomImage from "@/components/shared/CustomImage"
import { OFF_GREEN, ORANGE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { JobType } from "@/model/jobs"
import { router } from "expo-router"
import React from "react"
import { Pressable, TouchableOpacity } from "react-native"

interface JobCardHorizontalProps extends JobType { }
const JobCardHorizontal: React.FC<JobCardHorizontalProps> = (item) => {

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/job/${item.title}`)}
    >
      <HStack style={{ alignItems: "flex-start", paddingVertical: 15, paddingHorizontal: 12, gap: 12, borderBottomWidth: 1, borderBlockColor: OFF_GREEN, borderTopWidth: 0.5, borderTopColor: "#333" }}>
        <CustomImage source={{ uri: item.company.logo }} width={45} height={45} style={{ marginTop: 5 }} />
        <Box style={{ backgroundColor: "transparent" }}>
          <Box style={{ backgroundColor: "transparent" }}>
            <Text style={{ fontSize: 18, fontFamily: FontFamily.URBANIST_BOLD, marginBottom: 4, textTransform: "capitalize" }}>{item.title}</Text>
            <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textTransform: "capitalize", marginBottom: 4, }}>{item.company.name}</Text>
            <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textTransform: "capitalize" }}>{item.location} ({item.type})</Text>
          </Box>

          <HStack style={{ backgroundColor: "transparent", gap: 10, marginTop: 12 }}>
            <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, color: ORANGE_COLOR }}>{item.time}</Text>
            <Pressable hitSlop={20}>
              <CustomImage source={{ uri: item?.medium?.logo }} width={60} resizeMode="contain" style={{ height: 20, }} />
            </Pressable>
          </HStack>
        </Box>

      </HStack>
    </TouchableOpacity>
  )
}

export default JobCardHorizontal