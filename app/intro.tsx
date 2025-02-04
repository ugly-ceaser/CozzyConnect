import { Box, HStack, Text, VStack } from "@/components/others/Themed"
import { FadeInAnimation } from "@/components/shared/Animations"
import CustomButton from "@/components/shared/CustomButton"
import CustomImage from "@/components/shared/CustomImage"
import { DARK_COLOR, GRAY_COLOR, ORANGE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { StorageKeys } from "@/constants/Storage"
import Styles from "@/constants/Styles"
import { AUTO_SCROLL_DURATION, DEFAULT_SCREEN_PAD, SCROLL_INTERVAL } from "@/constants/Variables"
import { introSlides } from "@/contents/intro"
import { log } from "@/utils/helpers"
import { LocalStorage } from "@/utils/storage"
import { router } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, Image, Pressable, StyleSheet } from "react-native"

interface IntroProps { }
const intro: React.FC<IntroProps> = ({ }) => {
  const carousel = useRef<any>()
  const width = Dimensions.get('screen').width
  const height = Dimensions.get('screen').height - 500
  const [currentSlide, setCurrentSlide] = useState(0)
  const AUTO_PLAY_INTERVAL = 10_000
  const isLast = currentSlide === (introSlides.length - 1)
  const intervalRef = useRef<NodeJS.Timeout>()

  const handleSlideChange = async (isLast: boolean = false) => {
    if (isLast) {
      // SET FIRST TIME
      await LocalStorage.setItem(StorageKeys.FIRST_TIME, "YES")
      router.replace("/")
    }
    setCurrentSlide((current) => (current + 1))
  }

  // const handleAutoSlide = (currentSlide: number) => {
  //   console.log("CURRENT SLIDES:", currentSlide)
  //   if(currentSlide >= introSlides.length - 1) return
  //   if(isLast) return
  //   setCurrentSlide((current) => (current + 1))
  // }

  // useEffect(() => {
  //   // intervalRef.current = setInterval(() => handleAutoSlide(currentSlide), AUTO_PLAY_INTERVAL)
  //   return () => intervalRef.current && clearInterval(intervalRef.current)
  // }, [])

  useEffect(() => {
    const handleFirstTime = async () => {
      // CHECK IF FIRST TIME
      const isFirstTime = await LocalStorage.getItem(StorageKeys.FIRST_TIME)
      if (isFirstTime && isFirstTime === "YES") return router.replace('/')
    }
    handleFirstTime()
  }, [])

  return (
    <Box style={{ flex: 1 }}>
      <FlatList
        style={{ height, width }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={({ nativeEvent }) => {
          setCurrentSlide(Math.round(nativeEvent.contentOffset.x / width))
        }}

        data={introSlides}
        renderItem={({ item }) => (
          <Box style={{ width }}>
            <Image source={item.image} style={{ flex: 1 }} resizeMethod="scale" />
          </Box>
        )}
        keyExtractor={(item) => item.key}
      />
      <Box style={{ flex: 1, paddingHorizontal: DEFAULT_SCREEN_PAD }}>
        <Box style={{ marginTop: 15 }}>
          {/* <FadeInAnimation>
            <Text style={{ fontSize: 24, fontFamily: FontFamily.URBANIST_BOLD }}>{introSlides[currentSlide].title}</Text>
          </FadeInAnimation> */}
          <FadeInAnimation>
            <Text style={{ fontSize: 17, color: GRAY_COLOR, fontFamily: FontFamily.URBANIST_REGULAR, marginTop: 20 }}>{introSlides[currentSlide].text}</Text>
          </FadeInAnimation>
        </Box>

        <HStack style={style.bottomContainer}>
          {/* <Pagination
            dotsLength={introSlides.length}
            activeDotIndex={currentSlide}
            containerStyle={style.paginationContainerStyle}
            dotContainerStyle={{ marginHorizontal: 0, marginRight: 8 }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 2,
              backgroundColor: ORANGE_COLOR
            }}
            inactiveDotStyle={{
              backgroundColor: GRAY_COLOR,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          /> */}

          <CustomButton
            style={{ paddingHorizontal: 30, height: 40 }}
            onPress={() => handleSlideChange(isLast)}
            scheme="orange"
            text={isLast ? "Done" : "Next"}
          />
        </HStack>
      </Box>
    </Box>
  )
}

const style = StyleSheet.create({
  paginationContainerStyle: {
    width: 'auto',
    padding: 0,
    justifyContent: "flex-start",
    paddingVertical: 0, paddingLeft: 0,
    marginBottom: 10
  },
  bottomContainer: {
    paddingHorizontal: DEFAULT_SCREEN_PAD,
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 24
  }
})


export default intro