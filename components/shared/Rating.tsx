import React from "react"
import { HStack } from "../others/Themed";
import { Pressable, ViewStyle } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GRAY_COLOR, ORANGE_COLOR } from "@/constants/Colors";

interface RatingProps {
  rate: number;
  size?: number;
  BoxStyles?: ViewStyle;
  onPress?: (count: number) => void;
}
const Rating: React.FC<RatingProps> = ({ rate, onPress, BoxStyles, size = 20 }) => {
  const isDecimal = !Number.isInteger(rate)
  const stars = Array(5).fill(null).map((_, index) => {
    const filled = index < rate 
    const type: "full" | "half" | "empty" = isDecimal && filled && index === Math.floor(rate) ? 'half' : filled ? 'full' : 'empty'
    return { type }
  })

  return (
    <HStack style={{ backgroundColor: 'transparent', gap: 3, ...BoxStyles }}>
      {stars.map(({ type }, index) => {
        if(type === "half") return (
          <Pressable key={`rate-comp-${index}`} onPress={() => onPress?.(index + 1)}>
            <FontAwesome name="star-half-full" size={size} color={ORANGE_COLOR} />
          </Pressable>
        )
        else if (type === "full") return (
          <Pressable key={`rate-comp-${index}`} onPress={() => onPress?.(index + 1)}>
            <FontAwesome name="star" size={size} color={ORANGE_COLOR} />
          </Pressable>
        )
        else return (
          <Pressable key={`rate-comp-${index}`} onPress={() => onPress?.(index + 1)}>
            <FontAwesome name="star-o" size={size} color={GRAY_COLOR} />
          </Pressable>
        )
      })}
    </HStack>
  )
}

export default Rating