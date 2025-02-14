import { Box, HStack, Text } from "@/components/others/Themed"
import { PRIMARY_COLOR, WHITE_COLOR } from "@/constants/Colors"
import Styles from "@/constants/Styles"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import { Stack, router } from "expo-router"
import React from "react"
import { FlatList, Image, Linking, Pressable, TextInput, Touchable, TouchableOpacity } from "react-native"
import Entypo from "@expo/vector-icons/Entypo"
import { FontFamily } from "@/constants/Enums"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons"
import useBoolean from "@/hooks/useBoolean"
import Feather from "@expo/vector-icons/Feather"
import { messages } from "@/contents/chat"
import MessageCard from "@/components/screens/chat/MessageCard"

interface indexProps { }
const index: React.FC<indexProps> = ({ }) => {
  const phoneNumber = "09052541151"
  const { toggle, isOpen } = useBoolean()

  const handleDial = () => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />

      <Box style={Styles.container}>
        {/* HEADER */}
        <HStack style={{ backgroundColor: PRIMARY_COLOR, marginTop: 40, padding: 10, borderRadius: DEFAULT_BORDER_RADIUS }}>
          <Pressable onPress={router.back} hitSlop={20}>
            <Entypo name="chevron-thin-left" size={20} color={"#fff"} />
          </Pressable>

          <HStack style={{ backgroundColor: "transparent", gap: 10, marginLeft: 10, flex: 1 }}>
            <Image source={require("../../assets/images/pngs/user.png")} resizeMethod="scale" resizeMode="center" style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: "#fff", backgroundColor: "transparent" }} />
            <Box style={{ backgroundColor: "transparent", flex: 1 }}>
              <Text style={{ fontSize: 17, fontFamily: FontFamily.URBANIST_BOLD, color: WHITE_COLOR }}>Bronson Blake</Text>
              <Text style={{ fontSize: 14,  color: WHITE_COLOR }}>Online</Text>
            </Box>
          </HStack>

          <HStack style={{ gap: 12, backgroundColor: "transparent", }}>
            <Pressable hitSlop={20} onPress={handleDial}>
              <MaterialIcons name="local-phone" size={20} color="#fff" />
            </Pressable>

            <Box style={{ backgroundColor: "transparent", position: 'relative' }}>
              <Pressable hitSlop={20} onPress={toggle}>
                <SimpleLineIcons name="options-vertical" size={20} color="#fff" />
              </Pressable>
            </Box>
          </HStack>
        </HStack>

        {/* MESSAGES */}
        <FlatList
          style={{ flex: 1, paddingVertical: 12 }}
          keyExtractor={(_, idx) => `card-${idx}`}
          data={messages}
          renderItem={({ item }) => (
            <MessageCard {...item} />
          )}
        />

        <HStack style={{ gap: 12, marginBottom: 20 }}>
          <HStack style={{ gap: 10, flex: 1, borderRadius: DEFAULT_BORDER_RADIUS, backgroundColor: PRIMARY_COLOR, padding: 12 }}>
            <Pressable>
              <MaterialIcons style={{ marginRight: 5, marginTop: 2 }} name="attach-file" size={20} color="#fff" />
            </Pressable>

            <TextInput multiline style={{
              flex: 1, color: "#fff", fontFamily: FontFamily.URBANIST_MEDIUM,
              alignItems: 'center',
              fontSize: 16,
              maxHeight: 120,
              textAlignVertical: 'auto'
            }} placeholder="Enter your message" placeholderTextColor={"#fff"} />

          </HStack>

          <TouchableOpacity hitSlop={50} style={{ display: 'flex', width: 'auto', padding: 12, backgroundColor: PRIMARY_COLOR, borderRadius: DEFAULT_BORDER_RADIUS }} onPress={() => { }}>
            <Feather style={{}} name="send" size={26} color="#fff" />
          </TouchableOpacity>
        </HStack>
      </Box>
    </>
  )
}

export default index