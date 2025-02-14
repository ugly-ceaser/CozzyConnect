import { Box, HStack, Text } from "@/components/others/Themed"
import ImageComponent from "@/components/shared/ImageComponent"
import EmptyState from "@/components/states/EmptyState"
import { WHITE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD } from "@/constants/Variables"
import { PropertyType } from "@/model/property"
import { router } from "expo-router"
import React, { useState } from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import { FlatList } from "react-native-gesture-handler"

interface SinglePropertyProps extends PropertyType { }
const SingleProperty: React.FC<SinglePropertyProps> = (item) => {
  const width = Dimensions.get('screen').width
  const fullWidth = width - (2 * DEFAULT_SCREEN_PAD)
  const [currentIndex, setCurrentIndex] = useState(0)
  return (
    <Box>
      <Box style={{ position: 'relative', borderRadius: DEFAULT_BORDER_RADIUS, overflow: 'hidden' }}>
        <FlatList
          keyExtractor={(_, index) => `best-${index}`}
          data={item.pictures}
          horizontal
          style={{ width: '100%', flex: 1 }}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={({ nativeEvent }) => {
            setCurrentIndex(Math.round(nativeEvent.contentOffset.x / fullWidth))
          }}
          ListEmptyComponent={() => <EmptyState title="No Property found" />}
          renderItem={({ item: _item }) => (
            <TouchableOpacity onPress={() => router.push(`/property/${item.id}/`)}>
              <ImageComponent
                style={{ width: fullWidth, height: 245, borderRadius: DEFAULT_BORDER_RADIUS }}
                uri={_item}
                ImageProps={{
                  alt: item.houseName
                }}
              />
            </TouchableOpacity>
          )}
        />

        <HStack style={{ gap: 4, position: 'absolute', right: 0, bottom: -1, padding: 8, backgroundColor: 'rgba(0, 0, 0, .7)' }}>
          { item.pictures.map((_, index) => (
            <Box key={`pic-pag-${index}`} style={{ width: 8, height: 8, borderRadius: 10, backgroundColor: index === currentIndex ? WHITE_COLOR : `rgba(255, 255, 255, .3)` }} />
          )) }
        </HStack>
      </Box>
      <HStack style={{ justifyContent: "space-between", paddingVertical: 10 }}>
        <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, textTransform: "capitalize" }}>{item.description}</Text>
      </HStack>
    </Box>
  )
}

export default SingleProperty