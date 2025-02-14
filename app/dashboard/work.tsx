import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import SearchBar from "@/components/shared/SearchBar"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import useBoolean from "@/hooks/useBoolean"
import { useJobStore } from "@/store/job"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Pressable, TouchableOpacity } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import Icon from "@expo/vector-icons/Feather"
import { DEFAULT_BORDER_RADIUS } from "@/constants/Variables"
import CustomImage from "@/components/shared/CustomImage"
import { JOBS } from "@/contents/jobs"
import { BLUE_COLOR, GRAY_COLOR, OFF_GREEN, ORANGE_COLOR } from "@/constants/Colors"
import JobCard from "@/components/screens/job/JobCard"
import JobCardHorizontal from "@/components/screens/job/JobCardHorizontal"

interface WorkProps { }
const Work: React.FC<WorkProps> = ({ }) => {
  const [search, setSearch] = useState("")
  const { isOpen: isSearching } = useBoolean()
  const { newJobs, populate, recommendedJobs } = useJobStore(state => state)
  const textColor = useThemeColor({}, "text")

  const handleSearch = () => {

  }

  useEffect(() => {
    populate('newJobs', JOBS)
    populate('recommendedJobs', JOBS)
  }, [])

  return (
    <>
      <AppBar title="Job" />
      <Box style={[Styles.container]}>
        {/* NOTICE */}
        {/* <HStack style={{ padding: 18, borderLeftColor: BLUE_COLOR, borderLeftWidth: 5, borderStyle: 'solid', backgroundColor: 'rgba(0, 122, 255, .2)' , marginBottom: 20}}>
          <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 15 }}>This page is currently showing dummy data</Text>
        </HStack> */}

        {/* SEARCH BAR */}
        <SearchBar
          isSearching={isSearching}
          search={search}
          handleSearch={handleSearch}
          setSearch={setSearch}
        />
        <Box style={{ flex: 1, marginBottom: 60, width: '100%' }}>
          {/* RECOMMENDED SECTION */}
          <Box style={{ marginTop: 20 }}>
            <HStack style={{ justifyContent: "space-between", paddingVertical: 16 }}>
              <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 20 }}>Recommended for you</Text>
              <TouchableOpacity 
                // onPress={() => router.push(`/view/jobs/recommended`)}
                >
                <Text style={{ fontSize: 16 }}>See all</Text>
              </TouchableOpacity>
            </HStack>

            <FlatList
              data={recommendedJobs}
              style={{ paddingBottom: 10 }}
              horizontal
              keyExtractor={(_, idx) => `history-${idx + 1}`}
              ItemSeparatorComponent={() => <Box style={{ marginHorizontal: 8 }} />}
              renderItem={({ item }) => <JobCard {...item}/>}
            />
          </Box>

          {/* WHAT'S SECTION */}
          <Box style={{ marginTop: 20 }}>
            <HStack style={{ justifyContent: "space-between", paddingVertical: 16 }}>
              <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 20 }}>What's new</Text>
              <TouchableOpacity 
                onPress={() => router.push(`/view/jobs/new`)}
              >
                <Text style={{ fontSize: 16 }}>See all</Text>
              </TouchableOpacity>
            </HStack>


            <Box>
              <FlatList
                data={recommendedJobs}
                style={{ paddingRight: 10, height: 280 }}

                keyExtractor={(_, idx) => `history-hori-${idx + 1}`}
                ItemSeparatorComponent={() => <Box style={{ marginBottom: 14 }} />}
                renderItem={({ item }) => <JobCardHorizontal {...item} />}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Work