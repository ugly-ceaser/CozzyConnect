import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton"
import Select from "@/components/shared/Select"
import { GRAY_COLOR, ORANGE_COLOR, WHITE_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { propertyTypes } from "@/contents/filter"
import lga from "@/contents/lga"
import useBoolean from "@/hooks/useBoolean"
import { FilterStore, useFilterStore } from "@/store/filter"
import { arrayToSelectObject, log, sleep } from "@/utils/helpers"
import { toast } from "@backpackapp-io/react-native-toast"
import AntDesign from "@expo/vector-icons/AntDesign"
import { Stack, router } from "expo-router"
import React, { useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity } from "react-native"
import RangeSlider from 'react-native-range-slider-expo';



interface SettingsProps { }
const Settings: React.FC<SettingsProps> = ({ }) => {
  const { update, reset, ...filters } = useFilterStore()
  const [filterState, setFilterState] = useState<FilterStore>({
    lga: undefined,
    maxPrice: 100000,
    minPrice: 30000,
    state: undefined,
    bedroom: 1,
    type: undefined,
    ...filters
  })
  const { state, type, bedroom = 1, lga: lgaState, maxPrice, minPrice } = filterState
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const lgas = state ? lga[(state as keyof typeof lga)] : []
  const borderColor = useThemeColor({}, 'text')
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useBoolean()
  const color = useThemeColor({}, 'text')

  const handleTypeChange = (name: string) => {
    if (type && type === name) return setFilterState({ ...filterState, type: '' })
    setFilterState({ ...filterState, type: name })
  }


  const handleRangeChange = (value: number, type: 'minPrice' | 'maxPrice') => {
    if (timer) clearTimeout(timer)

    if (type === 'maxPrice') {
      setTimer(setTimeout(() => {
        setFilterState({ ...filterState, maxPrice: value })
        setTimer(undefined)
      }, 500))
    }
    else {
      setTimer(setTimeout(() => {
        setFilterState({ ...filterState, minPrice: value })
        setTimer(undefined)
      }, 500))
    }
  }

  const handleMinus = () => {
    if (bedroom <= 1) return
    setFilterState({ ...filterState, bedroom: bedroom - 1 })
  }

  const handlePlus = () => {
    setFilterState({ ...filterState, bedroom: bedroom + 1 })
  }

  const handleApplyFilter = async () => {
    openLoading()
    try {
      await sleep(2000)
      update(filterState)
      toast.success("Filter applied", { duration: 3000 })
      router.replace("/dashboard/home")
    }
    catch(error) {
      log("ERROR:", error)
    }
    finally {
      closeLoading()
    }
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <AppBar title="Filter" />
        }}
      />
      <Box style={[Styles.container, { paddingTop: 20 }]}>
        <Box style={{ gap: 12 }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 20 }}>Location</Text>
          <HStack style={{ gap: 12 }}>
            <Select
              placeholder={state || "States"}
              defaultValue={state}
              data={arrayToSelectObject(Object.keys(lga))}
              onChange={(data) => setFilterState({ state: data ?? undefined })}
            />

            <Select
              placeholder={lgaState || "LGA"}
              defaultValue={lgaState}
              data={arrayToSelectObject(lgas)}
              onChange={(data) => setFilterState({ lga: data ?? undefined })}
            />
          </HStack>
        </Box>

        <Box style={{ gap: 12, marginTop: 30 }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 20 }}>Property Type</Text>
          <HStack style={{ gap: 12, }}>
            {propertyTypes.map((_type, idx) => (
              <TouchableOpacity onPress={() => handleTypeChange(_type)}>
                <Box style={[styles.btn, type ? type === _type && styles.btnSelected : { borderColor }]} key={`prop-${idx}`}>
                  <Text style={[styles.btnText, type ? type === _type && styles.btnSelectedText : {}]}>{_type}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>

        <Box style={{ gap: 12, marginTop: 30, position: 'relative' }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 20 }}>Price Range</Text>
          <Box style={{ position: 'relative' }}>
            <RangeSlider
              min={10_000} max={200_000}
              fromValueOnChange={value => handleRangeChange(value, 'minPrice')}
              toValueOnChange={value => handleRangeChange(value, 'maxPrice')}
              step={5000}
              initialFromValue={minPrice}
              initialToValue={maxPrice}
              barHeight={5}
              toKnobColor={ORANGE_COLOR}
              fromKnobColor={ORANGE_COLOR}
              inRangeBarColor={ORANGE_COLOR}
              rangeLabelsTextColor={GRAY_COLOR}
              labelFormatter={(value) => `${value / 1000}k`}
            />
          </Box>
        </Box>

        <Box style={{ gap: 12, marginTop: 110, position: 'relative' }}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 20 }}>Bedroom</Text>
          <HStack>
            <TouchableOpacity disabled={bedroom <= 1} onPress={handleMinus}>
              <AntDesign style={{ width: 100, padding: 8, textAlign: 'center' }} color={bedroom <= 1 ? GRAY_COLOR : ORANGE_COLOR} name="minus" size={24} />
            </TouchableOpacity>

            <TextInput value={bedroom?.toString()} maxLength={2} keyboardType="number-pad" style={{ flex: 1, color, textAlign: 'center', fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 20 }} defaultValue={"1"} />

            <TouchableOpacity onPress={handlePlus}>
              <AntDesign style={{ width: 100, padding: 8, textAlign: 'center' }} color={ORANGE_COLOR} name="plus" size={24} />
            </TouchableOpacity>
          </HStack>
        </Box>

        <Box style={{ gap: 12, marginTop: 110, position: 'relative' }}>
          <CustomButton
            text="Apply filter"
            scheme="orange"
            onPress={handleApplyFilter}
            isLoading={isLoading}
          />
        </Box>
      </Box>

    </>
  )
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: DEFAULT_BORDER_RADIUS,
    padding: 10,
    paddingHorizontal: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontFamily: FontFamily.URBANIST_SEMIBOLD,
    textTransform: 'capitalize',
    fontSize: 16
  },
  btnSelected: {
    borderColor: ORANGE_COLOR,
    backgroundColor: ORANGE_COLOR,
  },
  btnSelectedText: {
    color: WHITE_COLOR
  }
})

export default Settings