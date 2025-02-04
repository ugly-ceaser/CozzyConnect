import React, { useRef, useState } from "react"
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";

import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import useBoolean from "@/hooks/useBoolean";
import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD, GOOGLE_API_KEY } from "@/constants/Variables";
import { Box, HStack, Text, useThemeColor } from "../others/Themed";
import Icon from '@expo/vector-icons/SimpleLineIcons'
import { RED_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums";
import Styles from "@/constants/Styles";
import Google, { NearbyResult } from "@/lib/google";
import lga from "@/contents/lga";
// import { log } from "@/utils/helpers";

interface AutoCompleteInputProps {
  error?: string;
  placeholder?: string;
  onSelect?: (data: {
    popularPlaces: NearbyResult[];
    address: string
  }) => void;
}
const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({ error, placeholder, onSelect }) => {
  const { isOpen, open, close } = useBoolean(false)
  const borderColor = useThemeColor({}, "borderColor")
  const textColor = useThemeColor({}, "text")
  const [address, setAddress] = useState('')
  // const RADUIS = 30
  const placesRef = useRef<GooglePlacesAutocompleteRef>(null)

  const handleSelection = async (data: GooglePlaceData | null, details: GooglePlaceDetail | null) => {
    setAddress(data?.description!)
    const popularPlaces = await Google.getNearbyPlaces({
      latitude: details?.geometry.location.lat!,
      longitude: details?.geometry.location.lng!,
    }, 'establishment')
    const states = Object.keys(lga)
    const filteredPopularPlace = popularPlaces?.filter(popularPlace => !states.includes(popularPlace.name))
    // const filteredPopularPlace = popularPlaces?.filter(popularPlace => !popularPlace.name.startsWith("Enugu"))

    onSelect?.({
      address: data?.description!,
      popularPlaces: filteredPopularPlace,
    })
    close()
  }

  const handleEnter = () => {
    onSelect?.({
      address,
      popularPlaces: [],
    })
    close()
  }


  if (isOpen) return (
    <Modal isVisible={isOpen} animationIn="fadeIn" animationOut={'fadeOut'}>
      <Box style={[Styles.container]}>
        <HStack style={{ justifyContent: 'flex-end', padding: DEFAULT_SCREEN_PAD, paddingHorizontal: 0, marginBottom: 10 }}>
          <Pressable hitSlop={20} onPress={close}>
            <Icon name="close" size={24} style={{ color: textColor }} />
          </Pressable>
        </HStack>

        <Box style={{ flex: 1 }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 17, marginBottom: 8 }}>Search Address</Text>
          <GooglePlacesAutocomplete
            placeholder='Enter address'
            keyboardShouldPersistTaps="always"
            onPress={(data, details) => handleSelection(data, details)}
            ref={placesRef}
            // listLoaderComponent={() => <ActivityIndicator size={"small"} />}
            listViewDisplayed={false}
            textInputProps={{
              placeholderTextColor: textColor,
              autoFocus: true,
              onChangeText: setAddress,
              onSubmitEditing: handleEnter,
              returnKeyType: "done"
            }}
            styles={{
              textInput: [style.input, { color: textColor }],
              textInputContainer: [style.btn, { borderColor }]
            }}
            fetchDetails
            keepResultsAfterBlur={false}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
          />
        </Box>
      </Box>
    </Modal>
  )

  return (
    <Box>
      <Pressable onPress={open}>
        <Box style={[style.btn, { borderColor: error ? RED_COLOR : borderColor }]}>
          <Text style={{ fontSize: 18, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: 'left', flex: 1 }}>{address ? address : placeholder ?? "Enter address"}</Text>
        </Box>
      </Pressable>
      {error && <Text style={style.errorText}>{error}</Text>}
    </Box>
  )
}

const style = StyleSheet.create({
  btn: {
    height: 60,
    paddingHorizontal: DEFAULT_SCREEN_PAD,
    borderWidth: 1,
    borderRadius: DEFAULT_BORDER_RADIUS,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center'
  },
  input: {
    height: 60,
    fontSize: 16,
    width: '100%',
    backgroundColor: 'transparent',
    fontFamily: FontFamily.URBANIST_REGULAR,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.URBANIST_LIGHT,
    letterSpacing: .5,
    marginTop: 4,
    color: RED_COLOR,
    width: "100%"
  }
})

export default AutoCompleteInput