import { handleGetProperty, handleGetPropertyReview } from "@/api/realEstate"
import { Box, HStack, Text, VStack } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton"
import { GRAY_COLOR, ORANGE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import useAuth from "@/hooks/useAuth"
import useBoolean from "@/hooks/useBoolean"
import usePagination from "@/hooks/usePagination"
import { PropertyType, PropertyTypeData } from "@/model/property"
import { AUTO_SCROLL_DURATION, DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD, SCROLL_INTERVAL } from "@/constants/Variables"
import { useUserStore } from "@/store/user"
import { log } from "@/utils/helpers"
import { ToastPosition, toast } from "@backpackapp-io/react-native-toast"
import Entypo from "@expo/vector-icons/Entypo"
import { Stack, router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView } from "react-native"
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import CustomImage from "@/components/shared/CustomImage"
import ReviewCard from "@/components/screens/review/ReviewCard"
import { ReviewData, ReviewResponse } from "@/model/review"
import EmptyState from "@/components/states/EmptyState"
import CustomInput from "@/components/shared/TextArea"
import { useForm } from "react-hook-form"
import Rating from "@/components/shared/Rating"
import { handleCreateReview } from "@/api/review"

interface CreateReviewsProps { }
const CreateReviews: React.FC<CreateReviewsProps> = ({ }) => {
  const { name: propertyId } = useLocalSearchParams();
  const token = useUserStore(state => state.token)
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useBoolean()
  const { handleLogoutAccount } = useAuth()
  const [rating, setRating] = useState(0)

  const { control, trigger, getValues, reset } = useForm<{ comment: string }>({
    mode: 'onTouched',
  })

  const testToast = () => {
    toast.success("Testing", {
      duration: 3000,
      position: ToastPosition.BOTTOM
    })
  }


  const handleSendReview = async () => {
    if (!await trigger()) return

    try {
      openLoading()
      const payload: ReviewData = {
        comment: getValues('comment'),
        realEstateId: +propertyId,
        rating: rating
      }
      const result = await handleCreateReview(payload, token!) as any

      if (!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }
      if (!result?.status) throw new Error()

      toast.success("Review sent!", {
        duration: 3000,
      })

      reset()
      setRating(0)
      router.replace(`/property/${propertyId}/reviews`)
    }
    catch (error: any) {
      toast.error("Failed to create review, please try again", {
        duration: 3000,
      })
    }
    finally {
      closeLoading()
    }
  }


  return (
    <>
      <Stack.Screen options={{ header: () => '' }} />
      <Box style={[Styles.container,]}>
        <AppBar
          title="Create Review"
          RightElement={<CustomButton onPress={handleSendReview} isLoading={isLoading} scheme="orange" style={{ height: 40, width: 80 }} text="Post" />}
        />

        <CustomInput
          name="comment"
          InputProps={{
            multiline: true,
            placeholder: "Review",
          }}
          control={control}
          rules={{
            required: "Please input a comment",
          }}
        />
        <Box style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Rate</Text>
          <Rating BoxStyles={{ gap: 8 }} size={26} rate={rating} onPress={(rate) => setRating(rate)} />
        </Box>
      </Box>

    </>
  )

}

export default CreateReviews