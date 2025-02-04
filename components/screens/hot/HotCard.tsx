import { Box, HStack, Text } from "@/components/others/Themed"
import LikeButton from "@/components/shared/LikeButton"
import { GRAY_COLOR, OFF_GREEN, PRIMARY_COLOR, WHITE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import { DEFAULT_SCREEN_PAD } from "@/constants/Variables"
import { PropertyType } from "@/model/property"
import { log } from "@/utils/helpers"
import { router, usePathname } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, FlatList, Image, Pressable, StyleSheet } from "react-native"

interface HotCardProps extends PropertyType { 
  paginationRef: React.RefObject<FlatList<any>>;
}
const HotCard: React.FC<HotCardProps> = ({paginationRef, ...item}) => {

  const [currentSegment, setCurrentSegment] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const segments = item?.pictures || [];
  const width = Dimensions.get('screen').width
  const height = Dimensions.get('screen').height
  const segmentDuration = 5000;
  const pathname = usePathname()

  useEffect(() => {
    setCurrentSegment(0)
    progressAnimation.setValue(0);
    animateSegment();
  }, [pathname])

  useEffect(() => {
    progressAnimation.setValue(0);
    animateSegment();
  }, [currentSegment]);

  const animateSegment = () => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: segmentDuration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && currentSegment < segments.length - 1) {
        setCurrentSegment(prev => prev + 1);
      }

    });
  };


  const handleBackPress = () => {
    if(!currentSegment) return
    setCurrentSegment(prev => prev - 1)
  }

  const handleNextPress = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(prev => prev + 1)
    }
    else {
      const data = paginationRef.current?.props.data as PropertyType[]
      const index = data.findIndex(_item => _item.id === item.id)
      if (index === -1) return

      const nextIndex = index + 1
      if (nextIndex >= data.length) return
      paginationRef.current?.scrollToIndex({ index, animated: true })
    }
  }


  const handleSlideChange = (index: number) => {
    paginationRef.current?.scrollToIndex({ index, animated: true })
  }

  return (
    <Box style={{ position: 'relative', width }}>
      <HStack style={styles.btnContainer}>
        <Pressable onPress={handleBackPress} style={styles.floatingBtn} />
        <Pressable onPress={handleNextPress} style={styles.floatingBtn} />
      </HStack>

      <Image
        source={{ uri: item.pictures[currentSegment] }}
        resizeMode="cover"
        resizeMethod="scale"
        style={{ flexDirection: 'row', height: height - 75 }}
      />

      <HStack style={{ justifyContent: 'center', gap: 4, backgroundColor: "rgba(0, 0, 0, .3)", position: 'absolute', top: 0, paddingTop: 40, paddingBottom: 10, paddingHorizontal: DEFAULT_SCREEN_PAD, width: '100%' }}>
        {item.pictures.map((item, idx) => (
          <Box key={idx} style={styles.segment}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: idx === currentSegment
                    ? progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                    : idx < currentSegment
                      ? '100%'
                      : '0%',
                },
              ]}
            />
          </Box>
        ))}
      </HStack>

      <Box style={{ backgroundColor: "rgba(0, 0, 0, .4)", bottom: 0, zIndex: 2, paddingHorizontal: DEFAULT_SCREEN_PAD, width: '100%', paddingVertical: 12, paddingBottom: 50, position: "absolute" }}>
        <Text style={{ color: WHITE_COLOR, fontSize: 18, fontFamily: FontFamily.URBANIST_BOLD }}>{item.houseName}</Text>

        <Box style={{ marginTop: 8, backgroundColor: 'transparent', }}>
          <Text style={{ color: GRAY_COLOR, fontSize: 16, fontFamily: FontFamily.URBANIST_MEDIUM }}>Features</Text>
          <HStack style={{ backgroundColor: 'transparent', gap: 6, marginTop: 8 }}>
            {item.amenities.map((elem, index) => (
              <Box key={`amenities-${index}`} style={{ paddingVertical: 4, paddingHorizontal: 16, backgroundColor: PRIMARY_COLOR, borderRadius: 20 }}>
                <Text style={{ color: WHITE_COLOR, fontFamily: FontFamily.URBANIST_MEDIUM }}>{elem}</Text>
              </Box>
            ))}
          </HStack>

          <HStack style={{ gap: 6, marginTop: 8, backgroundColor: 'transparent' }}>
            <Box style={{ padding: 8, borderRadius: 50, backgroundColor: OFF_GREEN, justifyContent: 'center', alignItems: 'center' }}>
              <LikeButton />
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 2,
    gap: 4,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderRadius: 4
  },
  segment: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 6,
    overflow: 'hidden',
    borderRadius: 4
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  btnContainer: { 
    flex: 1,
    zIndex: 1,
    position: 'absolute', 
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  floatingBtn: {
    width: '50%',
    height: '100%',
    display: 'flex',
    position: 'relative',
  }
});


export default HotCard