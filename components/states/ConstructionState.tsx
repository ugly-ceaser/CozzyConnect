import React, { ReactNode } from "react"
import { Box, VStack } from "../others/Themed"
import { Image } from "react-native"

interface ConstructionStateProps {
  children?: ReactNode;
}
const ConstructionState: React.FC<ConstructionStateProps> = ({ children }) => {
  return (
    <VStack style={{ flex: 1, justifyContent: 'center' }}>
      <Image source={require('@/assets/images/construction.png')} resizeMode="contain" style={{ width: 280, height: 200 }} />
      <Box style={{ width: '100%', alignItems: 'center' }}>
        {children && children}
      </Box>
    </VStack>
  )
}

export default ConstructionState