import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { useAssets } from "expo-asset"
import React, { useEffect, useState } from "react"
import { Dimensions, FlatList, Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Icon from "@expo/vector-icons/AntDesign"
import { ORANGE_COLOR } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD } from "@/constants/Variables"
import { useDrawerStore } from "@/store/drawer"
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from "@/components/others/DrawerContent"
import { useUserStore } from "@/store/user"
import { handleGetProperties } from "@/api/realEstate"
import usePagination from "@/hooks/usePagination"
import { BestPriceSkeleton, NearBySkeleton, PropertySkeleton } from "@/components/shared/PropertySkeleton"
import useAuth from "@/hooks/useAuth"
import useFetchUser from "@/hooks/useFetchUser"
import EmptyState from "@/components/states/EmptyState"
import { PropertyType } from "@/model/property"
import ImageComponent from "@/components/shared/ImageComponent"
import DrawerContainer from "@/components/shared/DrawerContainer"
import SingleProperty from "@/components/screens/home/SingleProperty"
import { log } from "@/utils/helpers"


interface HomeProps { }
const Home: React.FC<HomeProps> = ({ }) => {
  const [assets, _error] = useAssets([
    require('@/assets/images/pngs/user.png'),
    require('@/assets/images/pngs/verified.png'),
  ])
  const bgColor = useThemeColor({}, 'background')
  const token = useUserStore(state => state.token)
  const text = useThemeColor({}, "text")
  const router = useRouter()
  const { isOpen, openDrawer } = useDrawerStore((state) => state)
  const user = useUserStore(state => state.user)
  const { data, isLoading, isRefreshing, handleRefresh } = usePagination(async (page) => await handleGetProperties({ page, token }))
  const { isLoggedIn } = useAuth()
  const { fetchUserData } = useFetchUser()
  const { width } = Dimensions.get('screen')
  const fullCardWidth = width - (2 * DEFAULT_SCREEN_PAD)
  const isSingle = data.length === 1

  const flatListProps: Partial<FlatList['props']> = isSingle ? {
    style: { width: '100%', flex: 1 },
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
  } : {
    style: { width: '100%', flex: 1 },
    snapToAlignment: "start",
    decelerationRate: "fast",
    snapToInterval: 200,
    snapToStart: true,
    showsHorizontalScrollIndicator: false,
  }

  useEffect(() => {
    if (!user) return
      ; (async () => fetchUserData(token))()
  }, [isLoggedIn])

  useEffect(() => {
    StatusBar.setTranslucent(true)
  }, [isOpen])

  return (
    <Box style={{ flex: 1 }}>
      <DrawerContainer>
        <Box style={Styles.container}>
          <HStack style={{ marginTop: 40, paddingBottom: 10, justifyContent: "space-between" }}>
            <TouchableOpacity style={{ gap: 4 }} onPress={openDrawer} hitSlop={20}>
              <Box style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: text }} />
              <Box style={{ width: 15, height: 3, borderRadius: 2, backgroundColor: text }} />
              <Box style={{ width: 20, height: 3, borderRadius: 2, backgroundColor: text }} />
            </TouchableOpacity>

            <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 18 }}>Hello <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD }}>{user?.fullName ?? "User"}</Text> ,</Text>

            <TouchableOpacity onPress={() => router.push("/profile/")} style={{ position: "relative" }}>
              {user?.isVerified && <Image style={styles.avatar} source={{ uri: assets?.[1].uri }} />}
              <ImageComponent
                style={{ width: 43, height: 43, borderRadius: 43 }}
                uri={user?.profilePicture}
                profile
                noLoading
              />
            </TouchableOpacity>
          </HStack>

          <Pressable onPress={() => router.push('/search')}>
            <HStack style={{ borderColor: text, borderWidth: 1, borderRadius: DEFAULT_BORDER_RADIUS, marginVertical: 20, alignItems: 'center', height: 60 }}>
              <Icon name="search1" size={20} color={text} style={{ marginHorizontal: 15 }} />
              <Text style={{ color: text, fontSize: 17, fontFamily: FontFamily.URBANIST_REGULAR }}>Search</Text>
            </HStack>
          </Pressable>

          <ScrollView style={{ backgroundColor: bgColor, flex: 1 }} refreshControl={
            <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
          }>
            <Box style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 24, fontFamily: FontFamily.URBANIST_MEDIUM, marginBottom: 12 }}>Best value</Text>
              {isLoading ? (
                <FlatList
                  keyExtractor={(_, index) => `skel-near-${index}`}
                  data={new Array(5).fill("*")}
                  horizontal
                  snapToAlignment="start"
                  decelerationRate={"fast"}
                  snapToInterval={200}
                  snapToStart
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 10 }} />}
                  renderItem={() => <BestPriceSkeleton />}
                />
              ) : (
                <FlatList
                  keyExtractor={(_, index) => `best-${index}`}
                  data={data?.slice(0, 5) as PropertyType[]}
                  horizontal
                  {...flatListProps}
                  ListEmptyComponent={() => <EmptyState title="No Property found" />}
                  ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 10 }} />}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/property/${item.id}/`)}>
                      <ImageComponent
                        style={{ width: isSingle ? fullCardWidth : 272, height: 245, borderRadius: DEFAULT_BORDER_RADIUS }}
                        uri={item.pictures[item.mainPictureIndex]}
                        ImageProps={{
                          alt: item.houseName
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            </Box>

            <Box style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 24, fontFamily: FontFamily.URBANIST_MEDIUM, marginBottom: 12 }}>Near by</Text>
              {isLoading ? (
                <FlatList
                  keyExtractor={(_, index) => `skel-near-${index}`}
                  data={new Array(5).fill("*")}
                  horizontal
                  snapToAlignment="start"
                  decelerationRate={"fast"}
                  snapToInterval={200}
                  snapToStart
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 10 }} />}
                  renderItem={() => <NearBySkeleton />}
                />
              ) : (
                <FlatList
                  keyExtractor={(item) => `near-by-${item.id}`}
                  // data={data.slice(5)}
                  data={data as PropertyType[]}
                  horizontal
                  {...flatListProps}
                  ListEmptyComponent={() => <EmptyState title="No Property found" />}
                  ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 10 }} />}
                  renderItem={({ item }) => (
                    <Box>
                      <TouchableOpacity onPress={() => router.push(`/property/${item.id}/`)}>
                        <ImageComponent
                          style={{ width: isSingle ? fullCardWidth : 188, height: 160, borderRadius: DEFAULT_BORDER_RADIUS }}
                          uri={item.pictures[item.mainPictureIndex]}
                          ImageProps={{
                            alt: item.houseName
                          }}
                        />
                      </TouchableOpacity>
                      <HStack style={{ justifyContent: "space-between", paddingVertical: 10 }}>
                        <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, textTransform: "capitalize" }}>{item.houseName}</Text>
                        <TouchableOpacity onPress={() => router.push(`/property/${item.id}/`)}>
                          <Text style={{ color: ORANGE_COLOR, fontFamily: FontFamily.URBANIST_BOLD }}>View</Text>
                        </TouchableOpacity>
                      </HStack>
                    </Box>
                  )}
                />
              )}
            </Box>

            <Box style={{ marginTop: 20, paddingBottom: 40 }}>
              {isLoading ? (
                <FlatList
                  keyExtractor={(_, index) => `skel-near-${index}`}
                  data={new Array(5).fill("*")}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <Box style={{ marginVertical: 10 }} />}
                  renderItem={() => <PropertySkeleton />}
                />
              ) : (
                <FlatList
                  keyExtractor={(item) => `near-by-${item.id}`}
                  data={data as PropertyType[]}
                  snapToStart
                  ListEmptyComponent={() => <EmptyState title="No Property found" />}
                  ItemSeparatorComponent={() => <Box style={{ marginVertical: 10 }} />}
                  renderItem={({ item }) => <SingleProperty {...item} />}
                />
              )}
            </Box>
          </ScrollView>
        </Box>
      </DrawerContainer>
    </Box>
  )
}

const styles = StyleSheet.create({
  avatar: { width: 15, height: 15, position: "absolute", zIndex: 5, left: 0, bottom: -5 },
  sectionTitle: {}
})

export default Home