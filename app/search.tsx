import { Box, HStack, Text, VStack, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import PropertyCard from "@/components/shared/PropertyCard"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { PropertyType, SearchParams } from "@/model/property"
import { useSearchHistory } from "@/store/searchHistory"
import { Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import Icon from "@expo/vector-icons/Feather"
import { TouchableOpacity } from "react-native-gesture-handler"
import useBoolean from "@/hooks/useBoolean"
import { log } from "@/utils/helpers"
import SearchBar from "@/components/shared/SearchBar"
import { handleSearchProperty } from "@/api/realEstate"
import { useUserStore } from "@/store/user"


interface SearchProps { }
const Search: React.FC<SearchProps> = ({ }) => {
  const textColor = useThemeColor({}, "text")
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState<PropertyType[]>([])
  const { history, deleteHistory, appendHistory, initialize } = useSearchHistory(state => state)
  const [recentHistory, setRecentHistory] = useState<string[]>([])
  const { isOpen: isLoading, close, open } = useBoolean()
  const [hasSearched, setHasSearched] = useState(false)
  const token = useUserStore(state => state.token)

  const handleSearch = async () => {
    log("SEARCH:", search)
    if(!search.length) return
    open()
    try {
      const payload: Partial<SearchParams> = {
        category: search,
        state: search,
        limit: 30,
        page: 1,
      }

      // SEARCH PROPERTY
      const result = await handleSearchProperty(payload, token)
      log("RESULT:", result)

      // SAVE SEARCH TO HISTORY
      appendHistory(search)
      // setSearchResult(searchResult as any)
    }
    catch(err: any) {

    }
    finally {
      close()
      setHasSearched(true)
    }
  }

  const handleChooseRecent = async (item: string) => {
    log("ITEM:", item)
    setSearch(item)
  }

  const handleViewAll = () => {
    setRecentHistory(history)
  }

  const isViewAllDisabled = (history.length <= 3) || (recentHistory.length === history.length)

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if(!Array.isArray(history)) return
    setRecentHistory(history?.slice(0, 3))
  }, [history])
  return (
    <>
      <Stack.Screen 
        options={{  
          header: () => <AppBar title="Search" />
        }} 
      />
      <Box style={Styles.container}>

        {/* SEARCH BAR */}
        <SearchBar  
          isSearching={isLoading}
          autoFocus
          search={search}
          handleSearch={handleSearch}
          setSearch={setSearch}
        />

        {(!isLoading && !hasSearched && !!history.length) && (
          <Box>
            <HStack style={{ justifyContent: "space-between", paddingVertical: 16 }}>
              <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 20 }}>Recent Search</Text>
              { !isViewAllDisabled && <TouchableOpacity onPress={handleViewAll} disabled={isViewAllDisabled}>
                <Text style={{ opacity: isViewAllDisabled ? .5 : 1, fontSize: 16 }}>View All</Text>
              </TouchableOpacity> }
            </HStack>
            <FlatList
              data={recentHistory}
              keyExtractor={(_, idx) => `history-${idx + 1}`}
              ItemSeparatorComponent={() => <Box style={{ marginBottom: 5 }} />}
              renderItem={({ item }) => (
                <HStack style={{ width: "100%" }}>
                  <Box style={{ flex: 1 }}>
                    <TouchableOpacity hitSlop={20} style={{ width: "100%" }} onPress={() => handleChooseRecent(item)}> 
                      <HStack style={{ gap: 10, flex: 1, paddingVertical: 12 }}>
                        <Icon name="clock" color={textColor} size={18} />
                        <Text style={{ fontSize: 14, fontFamily: FontFamily.URBANIST_REGULAR }}>{item}</Text>
                      </HStack>
                    </TouchableOpacity>
                  </Box>

                  <TouchableOpacity onPress={() => deleteHistory(item)}>
                    <Icon name="x" size={22} color={"#999"} />
                  </TouchableOpacity>
                </HStack>
              )}
            />
          </Box>
        )}

        <FlatList
          ItemSeparatorComponent={() => <Box style={{ marginVertical: 12 }} />}
          style={{ flex: 1, marginTop: 30, marginBottom: 20}}
          keyExtractor={(item) => item.houseName}
          data={searchResult}
          ListEmptyComponent={ hasSearched? (() => (
            <VStack style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontFamily: FontFamily.URBANIST_MEDIUM }}>No item found</Text>
            </VStack>
          )): undefined }
          renderItem={({ item }) => <PropertyCard {...item} />}
        />
      </Box>
    </>
  )
}

export default Search