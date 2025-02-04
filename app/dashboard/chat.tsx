import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import ChatCard from "@/components/screens/chat/ChatCard"
import DrawerContainer from "@/components/shared/DrawerContainer"
import SearchBar from "@/components/shared/SearchBar"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { chats } from "@/contents/chat"
import useBoolean from "@/hooks/useBoolean"
import { useDrawerStore } from "@/store/drawer"
import React, { useEffect, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native"


interface SpeechProps { }
const Speech: React.FC<SpeechProps> = ({ }) => {
  const { isOpen, closeDrawer, openDrawer } = useDrawerStore((state) => state)
  const text = useThemeColor({}, "text")
  const { isOpen: isLoading } = useBoolean()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState([])

  useEffect(() => {
    if(search) return
    setFilter([])
  }, [search])

  const handleSearch = () => {
    if(!search) return
    const result = chats.filter(chat => chat.name.includes(search))
    setFilter(result as any)
  }

  return (
    <Box style={{ flex: 1 }}>
      <DrawerContainer>
        <Box style={Styles.container}>
          <HStack style={{ marginTop: 50, paddingBottom: 10, marginBottom: 30, justifyContent: "space-between" }}>
            <TouchableOpacity style={{ gap: 4 }} onPress={openDrawer} hitSlop={20}>
              <Box style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: text }} />
              <Box style={{ width: 15, height: 3, borderRadius: 2, backgroundColor: text }} />
              <Box style={{ width: 20, height: 3, borderRadius: 2, backgroundColor: text }} />
            </TouchableOpacity>

            <Text style={{ textTransform: "capitalize", flex: 1, textAlign: "center", fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Chats</Text>
          </HStack>
          <Box style={{ flex: 1 }}>

            {/* SEARCH BAR */}
            <SearchBar
              placeholder="Search chats"
              isSearching={isLoading}
              search={search}
              handleSearch={handleSearch}
              setSearch={setSearch}
            />

            {/* MESSAGE CARDS */}
            <FlatList
              data={filter.length ? filter : chats}
              keyExtractor={(item) => item.id + "-item"}
              style={{ marginTop: 20, flex: 1 }}
              renderItem={({ item }) => (
                <ChatCard
                  {...item}
                />
              )}
            />
          </Box>
        </Box>
      </DrawerContainer>
    </Box>
  )
}

export default Speech