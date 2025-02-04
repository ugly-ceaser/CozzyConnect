import React, { ReactNode } from "react"
import Animated, { Easing, FadeInDown, FadeInUp } from "react-native-reanimated"

interface AnimationsProps {
  delay?: number;
  children: ReactNode
}

export const FadeInAnimation: React.FC<AnimationsProps> = (prop) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(100).easing(Easing.elastic()).delay(prop?.delay ?? 0)}
      exiting={FadeInUp.duration(100).easing(Easing.elastic()).delay(prop?.delay ?? 0)}
    >
      {prop.children}
    </Animated.View>
  )
}
