import { handleGetProperties } from "@/api/realEstate"
import { Box, Text, VStack } from "@/components/others/Themed"
import HotCard from "@/components/screens/hot/HotCard"
import { GRAY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import usePagination from "@/hooks/usePagination"
import { PropertyType } from "@/model/property"
import { useUserStore } from "@/store/user"
import React, { useRef } from "react"
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, } from "react-native"


interface HotProps { }
const Hot: React.FC<HotProps> = ({ }) => {
  const width = Dimensions.get('screen').width
  const token = useUserStore(state => state.token)
  const { data, isLoading, isRefreshing, handleRefresh } = usePagination(async (page) => await handleGetProperties({ page, token }))
  const paginationRef = useRef<FlatList>(null)

  if (isLoading) return (
    <Box style={Styles.container}>
      <VStack style={[{ flex: 1, marginTop: -100, justifyContent: "center", alignItems: 'center' }]}>
        <ActivityIndicator size={"large"} color={GRAY_COLOR} />
        <Text style={{ fontSize: 15, letterSpacing: 5, marginTop: 8, textTransform: 'uppercase', textAlign: 'center', fontFamily: FontFamily.URBANIST_SEMIBOLD, }}>Loading hots</Text>
      </VStack>
    </Box>
  )

  return (
    <>
      <Box style={{ flex: 1 }}>
        <FlatList
          ref={paginationRef}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          style={{ flex: 1 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate={0}
          snapToInterval={width}
          data={data as PropertyType[]}
          keyExtractor={(_, idx) => `index-${idx}`}
          renderItem={({ item }) => {
            return <HotCard paginationRef={paginationRef} key={item.houseName} {...item}/>
          }}
        />
      </Box>

    </>
  )
}
export default Hot