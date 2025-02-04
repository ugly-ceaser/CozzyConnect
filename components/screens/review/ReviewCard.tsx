import { Box, HStack, Text } from "@/components/others/Themed"
import CustomImage from "@/components/shared/CustomImage"
import Rating from "@/components/shared/Rating"
import { BLACK_COLOR, OFF_GREEN } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { ReviewResult } from "@/model/review"
import { useUserStore } from "@/store/user"
import { formDateString } from "@/utils/date"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"

interface ReviewCardProps extends ReviewResult  { 
  handleEdit?: () => void;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ handleEdit, comment, createdAt, rating, userId, user: userData }) => {
  const { user } = useUserStore()
  const isUsersPost = user?.id === userData.id || user?.id === userData.userInfo.id
  return (
    <Box style={{ padding: 12, borderRadius: 6, backgroundColor: OFF_GREEN }}>
      <HStack style={{ justifyContent:'space-between', backgroundColor: 'transparent' }}>
        <CustomImage
          source={{ uri: userData?.userInfo?.profilePicture }}
          // source={require("../../../assets/images/user.png")}
          style={{  
            width: 55,
            height: 55,
            borderRadius: 8
          }}
        />
        <Box style={{ backgroundColor: 'transparent', gap: 2 }}>
          <Rating rate={rating ?? 0} />
          <Text style={{ color: BLACK_COLOR, fontSize: 14, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>{formDateString(createdAt!)}</Text>
        </Box>
      </HStack>

      <Box style={{ backgroundColor: 'transparent', gap: 6, marginTop: 15, marginBottom: 8 }}>
        <HStack style={{ backgroundColor: 'transparent', gap: 8 }}>
          <Text style={{ fontSize: 22, color: BLACK_COLOR, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>{userData?.userInfo?.fullName}</Text>
          {isUsersPost && <TouchableOpacity onPress={handleEdit} hitSlop={20}>
            <FontAwesome name="pencil" size={18} />
          </TouchableOpacity>}
        </HStack>
        <Text style={{ fontSize: 16, color: BLACK_COLOR, fontFamily: FontFamily.URBANIST_MEDIUM }}>{comment}</Text>
      </Box>
    </Box>
  )
}

export default ReviewCard