import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";


interface LikeButtonProp {
  size?: number
}
const LikeButton: React.FC<LikeButtonProp> = ({ size = 26 }) => {
  const liked = useSharedValue(0);
  const DEFAULT_ICON_SIZE = 24
  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });

  return (
    <Pressable hitSlop={20} onPress={() => (liked.value = withSpring(liked.value ? 0 : 1))}>
      <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
        <MaterialCommunityIcons
          name={"heart-outline"}
          size={DEFAULT_ICON_SIZE}
          color={"black"}
        />
      </Animated.View>

      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons name={"heart"} size={DEFAULT_ICON_SIZE} color={"red"} />
      </Animated.View>
    </Pressable>
  );
};


export default LikeButton