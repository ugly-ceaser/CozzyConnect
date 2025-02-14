import { Box, HStack, Text } from "@/components/others/Themed"
import CustomImage from "@/components/shared/CustomImage"
import { OFF_GREEN, ORANGE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { JobType } from "@/model/jobs"
import { router } from "expo-router"
import React from "react"
import { Pressable, TouchableOpacity } from "react-native"

interface JobCardProps extends JobType { }
const JobCard: React.FC<JobCardProps> = (item) => {
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/job/${item.title}`)}
    >
    <Box style={{ padding: 12, borderRadius: DEFAULT_BORDER_RADIUS, justifyContent: "space-between", backgroundColor: OFF_GREEN, minHeight: 212, width: 180 }}>
      <Box style={{ backgroundColor: "transparent", gap: 10 }}>
        <CustomImage source={{ uri: item.company.logo }} style={{ width: 53, height: 53 }} />
        <Box style={{ backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 18, fontFamily: FontFamily.URBANIST_BOLD, marginBottom: 4, textTransform: "capitalize" }} darkColor="#000">{item.title}</Text>
          <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textTransform: "capitalize", marginBottom: 4,}} darkColor="#000">{item.company.name}</Text>
          <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textTransform: "capitalize" }} darkColor="#000">{item.location} ({item.type})</Text>
        </Box>
      </Box>
      <HStack style={{ backgroundColor: "transparent", justifyContent: "space-between" }}>
        <Text style={{  fontFamily: FontFamily.URBANIST_SEMIBOLD, color: ORANGE_COLOR }}>{item.time}</Text>
        <Pressable hitSlop={20}>
          <CustomImage source={{ uri: item?.medium?.logo }} width={60} resizeMode="contain" style={{ height: 20, }} />
        </Pressable>
      </HStack>
    </Box>
  </TouchableOpacity>
  )
}

export default JobCard