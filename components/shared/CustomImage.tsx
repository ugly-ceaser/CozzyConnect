import React, { useState } from "react"
import { Image, ImageProps } from "react-native"
import { Box } from "../others/Themed"

interface CustomImageProps extends ImageProps { 
  LoadingComponent?: React.FC;
}
const CustomImage: React.FC<CustomImageProps> = ({ style, LoadingComponent, ...props }) => {
  const [isLoading, setIsLoading] = useState(true)
  const shouldHide = isLoading && LoadingComponent
  return (
    <Box style={{ backgroundColor: 'transparent' }}>
      { shouldHide && <LoadingComponent /> }
      <Image style={[style, { display: shouldHide ? 'none' : 'flex' }]} {...props} onLoad={() => setIsLoading(false)} />
    </Box>
  )

}

export default CustomImage