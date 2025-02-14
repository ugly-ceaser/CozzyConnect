import { Box, HStack, Text, VStack, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import { DARK_COLOR, GRAY_COLOR, ORANGE_COLOR, PRIMARY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import Styles from "@/constants/Styles"
import { AUTO_SCROLL_DURATION, DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD, SCROLL_INTERVAL } from "@/constants/Variables"
import { PropertyType } from "@/model/property"
import { Stack, router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import CustomButton from "@/components/shared/CustomButton"
import CustomImage from "@/components/shared/CustomImage"
import useBoolean from "@/hooks/useBoolean"
import { handleGetProperty } from "@/api/realEstate"
import { useUserStore } from "@/store/user"
import { toast } from "@backpackapp-io/react-native-toast"
import useAuth from "@/hooks/useAuth"
import { log } from "@/utils/helpers"

interface DetailsProps { }
const Details: React.FC<DetailsProps> = ({ }) => {
  const { name } = useLocalSearchParams();
  const [details, setDetails] = useState<PropertyType>()
  const width = Dimensions.get('screen').width
  const slideRef = useRef<ICarouselInstance>(null)
  const paginationRef = useRef<FlatList>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [tab, setTab] = useState<string>("Description")
  const textColor = useThemeColor({}, 'text')
  const bgColor = useThemeColor({}, 'background')
  const token = useUserStore(state => state.token)
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const { handleLogoutAccount } = useAuth()

  enum TABS {
    DESCRIPTION = "Description",
    NEARBY = "Nearby",
    AMENITIES = "Amenities",
    STATUS = "Status"
  }
  const tabItems = ["Description", "Nearby", "Amenities", "Status"]

  const handleSlideChange = (index: number) => {
    paginationRef.current?.scrollToIndex({ index, animated: true })
    setCurrentSlide(index)
  }

  const handlePaginationClick = (index: number) => {
    slideRef.current?.scrollTo({ index })
    paginationRef.current?.scrollToIndex({ index, animated: true })
    setCurrentSlide(index)
  }

  const handleFetchContent = async () => {
    try {
      openLoading()
      const result = await handleGetProperty(name as string, token) as any

      log("WORKING:", result)
      if (!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }

      if (!("data" in result)) throw new Error(result?.message)
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
    if (!name) {
      return router.back()
    }
    log("NAME:", name)
    handleFetchContent()
  }, [name])


  if (isLoading) return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Details" />
        }}
      />
      <Box style={Styles.container}>
        <VStack style={[{ flex: 1, marginTop: -100, justifyContent: "center", alignItems: 'center' }]}>
          <ActivityIndicator size={"large"} color={GRAY_COLOR} />
          <Text style={{ fontSize: 15, letterSpacing: 5, marginTop: 8, textTransform: 'uppercase', textAlign: 'center', fontFamily: FontFamily.URBANIST_SEMIBOLD, }}>Loading details</Text>
        </VStack>
      </Box>
    </>
  )

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Details" />
        }}
      />
      <Box style={Styles.container}>
        <ScrollView style={{ backgroundColor: bgColor, position: 'relative', flex: 1 }}>
          <Box style={{ marginBottom: 16 }}>
            <Carousel
              ref={slideRef}
              loop
              autoPlay
              width={width - (DEFAULT_SCREEN_PAD * 2)}
              height={283}
              data={details?.pictures ?? []}
              scrollAnimationDuration={AUTO_SCROLL_DURATION}
              autoPlayInterval={SCROLL_INTERVAL}
              onSnapToItem={(index) => handleSlideChange(index)}
              renderItem={({ item }) => (
                <Box>
                  <CustomImage source={{ uri: item }} style={{ width: "100%", height: "100%" }} />
                </Box>
              )}
            />

            <FlatList
              style={{ marginTop: 12 }}
              ref={paginationRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 4 }} />}
              data={details?.pictures ?? []}
              keyExtractor={(_, idx) => idx + "pagination"}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => handlePaginationClick(index)}>
                  <Box style={[index === currentSlide ? styles.activeSlideBox : {}]}>
                    <CustomImage
                      source={{ uri: item }}
                      style={[
                        { width: 140, height: 120, borderRadius: DEFAULT_BORDER_RADIUS },
                        index === currentSlide ? styles.activeSlideImage : {}
                      ]}
                    />
                  </Box>
                </TouchableOpacity>
              )}
            />
          </Box>

          <Box style={{ gap: 20 }}>
            <Text style={styles.title}>{details?.houseName ?? '---'}</Text>
            <HStack style={{ gap: 8 }}>
              <Icon name="location-pin" color={textColor} size={16} />
              <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_MEDIUM }}>{details?.address ?? '...'}</Text>
            </HStack>
          </Box>

          <ScrollView horizontal style={{ marginTop: 20 }}>
            <HStack style={{ gap: 10 }}>
              {tabItems.map(label => (
                <Pressable key={label} hitSlop={10} onPress={() => setTab(label)}>
                  <VStack style={styles.tab}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>{label}</Text>
                    <Box style={label === tab ? styles.tabActiveBar : {}} />
                  </VStack>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>

          <Box style={{ marginTop: 12, marginBottom: 20 }}>
            {tab === TABS.DESCRIPTION && (
              <Box style={{ gap: 10 }}>
                {details?.description && details.description.split("\n").map(paragraph => (
                  <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 16, color: textColor, lineHeight: 21 }}>{paragraph ?? '...'}</Text>
                ))}
              </Box>
            )}

            {tab === TABS.NEARBY && (
              <VStack style={{ minHeight: 150, }}>
                {!!details?.nearby.length ? details?.nearby.map((item, index) => (
                  <HStack style={{ width: '100%' }} key={`near-by-item-${index}`}>
                    <Box style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: GRAY_COLOR }} />
                    <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, width: '100%', fontSize: 15, padding: 8 }} >{item}</Text>
                  </HStack>
                )) : (
                  <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM }} >Empty...</Text>
                )}
              </VStack>
            )}

            {tab === TABS.AMENITIES && (
              <VStack style={{ minHeight: 150 }}>
                {!!details?.amenities.length ? details?.amenities.map((item, index) => (
                  <HStack style={{ width: '100%' }} key={`near-by-item-${index}`}>
                    <Box style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: GRAY_COLOR }} />
                    <Text key={`amenities-by-item-${index}`} style={{ fontFamily: FontFamily.URBANIST_MEDIUM, width: '100%', fontSize: 15, padding: 8 }} >{item}</Text>
                  </HStack>
                )) : (
                  <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM }} >Empty...</Text>
                )}
              </VStack>
            )}

            {tab === TABS.STATUS && (
              <VStack style={{ minHeight: 150, justifyContent: 'center' }}>
                <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM }} >Empty...</Text>
              </VStack>
            )}
          </Box>
        </ScrollView>

        <HStack style={{ width: '100%', gap: 10, marginBottom: 30 }}>
          <CustomButton
            onPress={() => router.push(`/speech/${details?.userId.toString()}`)}
            BoxProps={{
              style: {
                flex: 1,
              }
            }}
            scheme={"orange"} text="Message Agent"
            style={{
              height: 50,
              minWidth: 150
            }}
          />
          <CustomButton
            onPress={() => router.push(`/property/${name}/reviews`)}
            BoxProps={{
              style: {
                flex: 1
              }
            }}
            style={{
              backgroundColor: "#FDF6EB",
              borderWidth: 1,
              borderColor: DARK_COLOR,
              height: 50,
              minWidth: 150,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            block
            textStyles={{ color: "#000" }}
            text="Review"
          />
        </HStack>

      </Box>
    </>
  )
}

const styles = StyleSheet.create({
  activeSlideBox: {
    padding: 1,
    borderWidth: 2,
    borderColor: ORANGE_COLOR,
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  activeSlideImage: {
    transformOrigin: "center",
    transform: [{ scale: 0.94 }]
  },
  title: { fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 18, textTransform: 'capitalize' },
  tab: { display: 'flex', paddingBottom: 8, height: 32 },
  tabActiveBar: {
    height: 5,
    width: '90%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0
  },
  block: {
    padding: DEFAULT_SCREEN_PAD, borderLeftWidth: 4, borderStyle: 'solid', borderLeftColor: GRAY_COLOR
  }
})

export default Details