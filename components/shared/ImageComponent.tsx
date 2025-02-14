import React, { useEffect } from "react"
import { ActivityIndicator, Image, ImageProps } from "react-native"
import { Box } from "../others/Themed";
import useBoolean from "@/hooks/useBoolean";
import { GRAY_COLOR } from "@/constants/Colors";
import { useAssets } from "expo-asset";


interface ImageComponentProps { 
  style: ImageProps['style'];
  uri?: string;
  ImageProps?: Omit<ImageProps, 'style'>;
  noLoading?: boolean;
  profile?: boolean;
}
const ImageComponent: React.FC<ImageComponentProps> = ({ style, uri, profile, noLoading, ImageProps }) => {
  const { isOpen, close } = useBoolean(true)
  const TIMEOUT = 1000
  const [assets, _error] = useAssets([
    require('@/assets/images/user.png'),
    require('@/assets/images/transparent.png'),
  ])

  useEffect(() => {
    setTimeout(close, TIMEOUT)
  }, [])

  if(!noLoading && (isOpen)) return (
    <Box style={[style, { justifyContent: 'center', alignContent: 'center' }]} >
      <ActivityIndicator size={"large"}  />
    </Box>
  )

  if(!uri && profile) return (
    <Image onLoad={close} source={{ uri: assets?.[0].uri }} style={[style, { backgroundColor: GRAY_COLOR }]} {...ImageProps}  />
  )

  if(!uri && !profile) return (
    <Image onLoad={close} source={{ uri: assets?.[1].uri }} style={style} {...ImageProps}  />
  )

  return (
    <Image onLoad={close} source={{ uri }} style={style} {...ImageProps}  />
  )
}

export default ImageComponent