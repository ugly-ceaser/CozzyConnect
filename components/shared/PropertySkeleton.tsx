import React from "react"
// import ContentLoader from 'react-content-loader'
import { Skeleton } from "react-native-skeletons"
import { Box, HStack } from "../others/Themed"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"


interface PropertySkeletonProps { }
export const BestPriceSkeleton: React.FC<PropertySkeletonProps> = ({ }) => {
  return ( <Skeleton width={272} height={245} style={{ borderRadius: DEFAULT_BORDER_RADIUS }} /> )
}

export const NearBySkeleton: React.FC<PropertySkeletonProps> = ({ }) => {
  return (
    <Box style={{ width: 188 }}>
      <Skeleton width={'100%'} style={{ borderRadius: DEFAULT_BORDER_RADIUS }} height={160} />
      <HStack style={{ justifyContent: "space-between", marginTop: 12 }}>
        <Skeleton width={120} />
        <Skeleton width={40} />
      </HStack>
    </Box>
  )
}

export const PropertySkeleton: React.FC<PropertySkeletonProps> = ({ }) => {
  return (
    <Box style={{ width: "100%", gap: 8 }}>
      <Skeleton width={'100%'} style={{ borderRadius: DEFAULT_BORDER_RADIUS }} height={245} />
      <Skeleton width={250} />
      <Skeleton width={230} />
    </Box>
  )
}
