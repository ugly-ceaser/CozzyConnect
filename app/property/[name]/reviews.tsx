import { handleGetPropertyReview } from "@/api/realEstate"
import { Box, HStack, Text, VStack } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton"
import { GRAY_COLOR, ORANGE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import useAuth from "@/hooks/useAuth"
import useBoolean from "@/hooks/useBoolean"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { useUserStore } from "@/store/user"
import { log } from "@/utils/helpers"
import { toast } from "@backpackapp-io/react-native-toast"
import Entypo from "@expo/vector-icons/Entypo"
import { Stack, router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, RefreshControl } from "react-native"
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import CustomImage from "@/components/shared/CustomImage"
import { ReviewResponse, ReviewResult } from "@/model/review"
import EmptyState from "@/components/states/EmptyState"
import ReviewCard from "@/components/screens/review/ReviewCard"
import { useEditReviewStore } from "@/store/editReview"

interface ReviewsProps { }
const Reviews: React.FC<ReviewsProps> = ({ }) => {
  const { name: propertyId } = useLocalSearchParams();
  const token = useUserStore(state => state.token)
  const [details, setDetails] = useState<ReviewResponse>()
  const { handleLogoutAccount } = useAuth()
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const slideRef = useRef<ICarouselInstance>(null)
  const width = Dimensions.get('screen').width
  const { populate } = useEditReviewStore()

  const handleEditReview = (reviewItem: ReviewResult) => {
    if(!reviewItem) return
    populate(reviewItem)
    router.navigate(`/property/${propertyId}/update-review`)
  }


  const handleFetchReview = async () => {
    try {
      openLoading()
      const result = await handleGetPropertyReview(+propertyId, token!) as any

      if (!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }

      if (!("data" in result)) throw new Error(result?.message)

      log("REVIEWS:", result)
      setDetails(result.data)
    }
    catch (error: any) {
      log("ERROR: ", error.message)
      return router.back()
    }
    finally {
      closeLoading()
    }
  }

  useEffect(() => {
    if (!propertyId) {
      return router.back()
    }
    handleFetchReview()
  }, [propertyId])


  if (isLoading) return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Reviews" />
        }}
      />
      <Box style={Styles.container}>
        <VStack style={[{ flex: 1, marginTop: -100, justifyContent: "center", alignItems: 'center' }]}>
          <ActivityIndicator size={"large"} color={GRAY_COLOR} />
          <Text style={{ fontSize: 15, letterSpacing: 5, marginTop: 8, textTransform: 'uppercase', textAlign: 'center', fontFamily: FontFamily.URBANIST_SEMIBOLD, }}>Loading reviews</Text>
        </VStack>
      </Box>
    </>
  )

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Reviews" />
        }}
      />

      <Box style={[Styles.container, { gap: 6 }]}>
        <HStack style={{ justifyContent: 'space-between', marginTop: 20 }}>
          <CustomButton onPress={() =>  router.push(`/property/${propertyId}/create-review`)} style={{ height: 50, width: 180 }} scheme="orange" text="Send review" />
          <Box>
            <HStack style={{ gap: 5 }}>
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 22 }}>{details?.averageRate!}</Text>
              <Entypo name="star" size={18} color={ORANGE_COLOR} />
            </HStack>
            <Text style={{ marginTop: 5, fontSize: 14, fontFamily: FontFamily.URBANIST_REGULAR, color: GRAY_COLOR }}>{details?.total} Reviews</Text>
          </Box>
        </HStack>

        <Box>
          <FlatList
            style={{ marginTop: 12 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 4 }} />}
            data={details?.images ?? []}
            keyExtractor={(_, idx) => idx + "pagination"}
            renderItem={({ item, index }) => (
              <CustomImage
                source={{ uri: item }}
                style={[
                  { width: 140, height: 120, borderRadius: DEFAULT_BORDER_RADIUS },
                ]}
              />
            )}
          />
        </Box>

        <Box style={{ flex: 1, marginTop: 10 }}>
          <FlatList
            style={{ flex: 1 }}
            data={details?.data as ReviewResult[] ?? []}
            refreshControl={<RefreshControl onRefresh={handleFetchReview} refreshing={isLoading} />}
            ListEmptyComponent={<EmptyState title="No reviews found" />}
            renderItem={({ item }) => <ReviewCard handleEdit={() => handleEditReview(item)} {...item} />}
          />
        </Box>
      </Box>

    </>
  )
}

export default Reviews