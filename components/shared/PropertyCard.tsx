import React from "react"
import { Box, HStack, Text, useThemeColor } from "../others/Themed"
import { FontFamily } from "@/constants/Enums"
import Icon from "@expo/vector-icons/Feather"
import CustomButton from "./CustomButton"
import { useAssets } from "expo-asset"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { PropertyType } from "@/model/property"
import { useRouter } from "expo-router"
import Image from 'react-native-image-progress';
import Progress from 'react-native-progress';

interface PropertyCardProps extends PropertyType { }
const PropertyCard: React.FC<PropertyCardProps> = ({ mainPictureIndex, pictures, address, category, houseName  }) => {
  const [assets] = useAssets([require('@/assets/images/house/img.png')])
  const textColor = useThemeColor({}, 'text')
  const router = useRouter()

  return (
    <HStack style={{ gap: 16 }}>
      { (pictures.length) && String(pictures[mainPictureIndex]).includes('file') ? 
         <Image indicator={Progress.Circle} source={{ uri: pictures[mainPictureIndex] ?? assets?.[0].uri }} style={{ width: 140, height: 130, borderRadius: DEFAULT_BORDER_RADIUS }} />
         :  <Image indicator={Progress.Circle} source={pictures[mainPictureIndex] as any} style={{ width: 140, height: 130, borderRadius: DEFAULT_BORDER_RADIUS }} />
      }
      <Box style={{ flex: 1, gap: 8 }}>
        <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 16 }}>{houseName}</Text>
        <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 16 }}>{category}</Text>
        <HStack style={{ gap: 8 }}>
          <Icon houseName="map-pin" size={14} color={textColor} />
          <Text style={{ fontFamily: FontFamily.URBANIST_MEDIUM, fontSize: 14 }}>{address}</Text>
        </HStack>
        <CustomButton 
          onPress={() => router.push(`/property/${houseName}`)}
          size="xs" text="View" 
          scheme="orange" 
          textStyles={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 15 }}
          style={{ 
            height: 40, 
            width: "100%", 
            paddingHorizontal: 20, 
            marginRight: 14, 
            borderRadius: 5 
          }} 
        />
      </Box>
    </HStack>
  )
}

export default PropertyCard