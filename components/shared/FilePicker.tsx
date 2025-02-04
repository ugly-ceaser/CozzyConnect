import React, { ReactNode, useEffect, useState } from "react"
import { Dimensions, Image, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { Box, HStack, Text, useThemeColor } from "../others/Themed"
import * as DocumentPicker from 'expo-document-picker';
import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD } from "@/constants/Variables";
import { FontFamily } from "@/constants/Enums";
import Icon from '@expo/vector-icons/SimpleLineIcons';
import FeatherIcon from '@expo/vector-icons/Feather';
import { GRAY_COLOR, RED_COLOR, WHITE_COLOR } from "@/constants/Colors";
import { arraySplitter } from "@/utils/helpers";

interface FilePickerProps {
  onSelect?: (data: DocumentPicker.DocumentPickerAsset[]) => void;
  hasError?: boolean;
  multiple?: boolean;
  children?: ReactNode;
  styles?: StyleProp<ViewStyle>;
  data?: string[];
}
const FilePicker: React.FC<FilePickerProps> = ({ onSelect, data, hasError, multiple, children, styles }) => {
  const [files, setFile] = useState<Partial<DocumentPicker.DocumentPickerAsset>[]>([])
  const textColor = useThemeColor({}, 'text')

  const handleRemove = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFile(newFiles)
  }

  useEffect(() => {
    if(!data) return
    data = data.filter(item => item)
    setFile(data.map(item => ({ uri: item })))
  }, [])

  const pickDocument = async () => {
    setFile([])
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      multiple: Boolean(multiple)
    });

    if (result.canceled) return
    onSelect?.(result.assets)
    setFile(result.assets)
  };

  

  if (Boolean(files.length)) {
    return (
      <Box style={[style.uploadBox, hasError && style.error, styles]}>
        {
          arraySplitter(files).map((row, index) => (
            <HStack key={`file-${index}`} style={{ gap: 10 }}>
              { row.map((file, index) => (
                <Box style={{ flex: 1, position: 'relative', maxWidth: 150 }} key={file.name}>
                  <Image
                    source={{ uri: file.uri }}
                    alt={file.name}
                    style={{ width: '100%', minHeight: 90 }}
                    resizeMode="cover"
                    resizeMethod="auto"
                  />
                  <Text style={{ fontSize: 14, fontFamily: FontFamily.URBANIST_MEDIUM }} numberOfLines={1} ellipsizeMode="middle">{file.name}</Text>

                  <Box style={{ position: 'absolute', top: 0, right: 0, backgroundColor: RED_COLOR }}>
                    <Pressable hitSlop={25} onPress={() => handleRemove(index)}>
                      <FeatherIcon name="x" style={{ fontSize: 20, color: WHITE_COLOR }} />
                    </Pressable>
                  </Box>
                </Box>
              )) }
            </HStack>
          ))
        }
      </Box>
    )
  }

  return (
    <Box>
      <Pressable onPress={pickDocument}>
        { children || (
          <Box style={[style.uploadBox, hasError && style.error, styles]}>
            <Icon name="cloud-upload" style={{ fontSize: 22, color: textColor }} />
            <Text style={[style.uploadText]}>Click to choose {`${ multiple ? 'files' : 'file' }`}</Text>
          </Box>
        ) }
      </Pressable>
    { hasError && <Text style={style.errorText}>Please select {`${ multiple ? 'files' : "a file" }`}</Text> }
    </Box>
  )
}

const style = StyleSheet.create({
  uploadBox: {
    borderStyle: 'dashed',
    borderRadius: DEFAULT_BORDER_RADIUS,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
    borderColor: GRAY_COLOR
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.URBANIST_LIGHT,
    letterSpacing: .5,
    marginTop: 4,
    color: RED_COLOR,
    width: "100%"
  },
  uploadText: {
    fontFamily: FontFamily.URBANIST_SEMIBOLD,
    fontSize: 14,
    textAlign: 'center'
  },

  error: {
    borderColor: RED_COLOR,
    borderStyle: 'solid',
    borderWidth: 1
  }
})

export default FilePicker