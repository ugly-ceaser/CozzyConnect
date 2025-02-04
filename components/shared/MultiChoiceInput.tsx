import React, { useEffect, useState } from "react"
import { Box, HStack, Text, useThemeColor } from "../others/Themed"
import CustomInput from "./CustomInput"
import { useForm } from "react-hook-form"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { FontFamily } from "@/constants/Enums"
import { FlatList, Pressable, StyleSheet } from "react-native"
import Icon from '@expo/vector-icons/Feather'
// import { log } from "@/utils/helpers"

interface MultiChoiceInputProps { 
  data?: string[];
  label?: string;
  useError?: boolean;
  error?: string;
  onChange: (data: string[]) => void;
}
const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({ data, label, useError, onChange, error }) => {
  const [values, setValues] = useState<string[]>([])
  const color = useThemeColor({}, 'text')
  const { control, getValues, setValue, setError } = useForm({
    mode: 'onChange'
  })

  useEffect(() => {
    if(!error) return 
    setError('value', {
      message: useError ? error : `Please enter ${label ?? 'a value'} `,
      type: 'required'
    })
  }, [error])

  const handleRemove = (index: number) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    setValues(newValues)
    onChange?.(newValues)
  }

  const handleEnterPress = () => {
    const value = getValues('value') as string
    // CHECK IF VALUE CONTAINS [,]
    if(!value) return
    let newValue = [value]
    if(value.includes(',')) {
      newValue = value.split(',').map((item) => item.trim())
    }
    const data = new Set([...values, ...newValue])
    setValues([...data])
    setValue('value', '')
    onChange([...data])
  }

  useEffect(() => {
    if(!data?.length) return
    setValues(data)
  }, [data])

  return (
    <Box>
      <CustomInput 
        control={control}
        name="value"
        rules={{}}
        InputProps={{
          returnKeyType: 'done',
          placeholder: label,
          onSubmitEditing:handleEnterPress,
          enablesReturnKeyAutomatically: true,
        }}
      />
      <HStack style={{ flexWrap: 'wrap', marginTop: (Boolean(values.length)) ? 10 : 0, gap: 10 }}>
        <FlatList 
          data={values}
          horizontal
          ItemSeparatorComponent={() => <Box style={{ marginRight: 8 }} />}
          keyExtractor={(value, index) => `item-chip-${index}`}
          renderItem={({ item: value, index }) => (
            <HStack style={[styles.chip]} key={`chip-${value}-${index}`}>
              <Text style={{ fontSize: 15, fontFamily: FontFamily.URBANIST_MEDIUM }}>{value}</Text>
              <Pressable hitSlop={15} onPress={() => handleRemove(index)}>
                <Icon name="x" size={17} color={color} />
              </Pressable>
            </HStack>
          )}
        />
        {/* { values.map((value, index) => (
          <HStack style={[styles.chip]} key={`chip-${value}-${index}`}>
            <Text style={{fontSize: 15, fontFamily: FontFamily.URBANIST_MEDIUM }}>{value}</Text>
            <Pressable hitSlop={15} onPress={() => handleRemove(index)}>
              <Icon name="x" size={17} color={color} />
            </Pressable>
          </HStack>
        )) } */}
      </HStack>
    </Box>
  )
}

const styles = StyleSheet.create({
  chip: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    backgroundColor: `rgba(200, 200, 200, .5)`, 
    borderRadius: DEFAULT_BORDER_RADIUS,
    width: 'auto'
  }
})

export default MultiChoiceInput