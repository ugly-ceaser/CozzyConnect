import { Box, HStack, Text, VStack } from "@/components/others/Themed"
import JobTabButton from "@/components/screens/job/JobTabButton"
import ReviewCard from "@/components/screens/review/ReviewCard"
import AppBar from "@/components/shared/AppBar"
import CustomImage from "@/components/shared/CustomImage"
import EmptyState from "@/components/states/EmptyState"
import { GRAY_COLOR } from "@/constants/Colors"
import { FontFamily } from "@/constants/Enums"
import Styles from "@/constants/Styles"
import { JobType } from "@/model/jobs"
import { useJobStore } from "@/store/job"
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { FlatList, ScrollView, StyleSheet } from "react-native"


type TabType = "description" | "company" | "reviews"

interface JobDetailsProps { }
const JobDetails: React.FC<JobDetailsProps> = ({ }) => {
  const navigation = useNavigation()
  const { title } = useLocalSearchParams()
  const [jobDetails, setJobDetails] = useState<JobType>()
  const { newJobs, recommendedJobs } = useJobStore(state => state)
  const [activeTab, setActiveTab] = useState<TabType>("description")

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    if(!title) router.back()
  }, [title])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <AppBar title={title as string} />
    })
  }, [title])

  useEffect(() => {
    const jobs = [...(new Set([...newJobs, ...recommendedJobs]))]
    const job = jobs.find(job => job.title === title)
    if(!job) 
      return router.back()
    setJobDetails(job)
  }, [])

  return (
    <Box style={Styles.container}>
      <VStack
        style={{  
          justifyContent: 'center',
          width: '100%',
          height: 120
        }}
      >
        <CustomImage 
          source={{ uri: jobDetails?.company.logo }}
          style={{  
            width: 60,
            height: 60
          }}
        />
      </VStack>
      <HStack style={{ marginVertical: 12, gap: 15 }}>
        <JobTabButton
          title="Description"
          isActive={activeTab === "description"}
          onPress={() => handleTabChange("description")}
        />
        <JobTabButton
          title="Company"
          isActive={activeTab === "company"}
          onPress={() => handleTabChange("company")}
        />
        <JobTabButton
          title="Reviews"
          isActive={activeTab === "reviews"}
          onPress={() => handleTabChange("reviews")}
        />
      </HStack>

      <Box style={{ marginTop: 30, flex: 1 }}>
        {activeTab === "description" && (
          <Box style={{ gap: 20, flex: 1 }}>
            <Text style={[styles.title]}>Qualifications</Text>
            <ScrollView style={{ paddingBottom: 20 }}>
              <Box style={{ gap: 10, marginBottom: 30 }}>
                { jobDetails?.description?.split('\n').map(para => (
                  <HStack style={{ gap: 12, alignItems: "flex-start" }}>
                    <Box style={{ width: 6, height: 6, borderRadius: 6, marginTop: 6, backgroundColor: GRAY_COLOR }} />
                    <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_MEDIUM, color: GRAY_COLOR }}>{para.trim()}</Text>
                  </HStack>
                )) }
              </Box>
            </ScrollView>
          </Box>
        )}

        { activeTab === "company" && (
          <Box style={{ gap: 20, flex: 1 }}>
            <Text style={[styles.title]}>Company Profile</Text>
            <ScrollView style={{ flex: 1 }}>
              <Box style={{ gap: 10, marginBottom: 30 }}>
                { jobDetails?.company.profile?.split('\n').map(para => (
                  <HStack style={{ gap: 12, alignItems: "flex-start" }}>
                    <Box style={{ width: 6, height: 6, borderRadius: 6, marginTop: 6, backgroundColor: GRAY_COLOR }} />
                    <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_MEDIUM, color: GRAY_COLOR }}>{para.trim()}</Text>
                  </HStack>
                )) }
              </Box>
            </ScrollView>
          </Box>
        ) }

        { activeTab === "reviews" && (
          <Box style={{ gap: 20, flex: 1 }}>
          <Text style={[styles.title]}>Reviews</Text>
          <FlatList
            data={[]}
            ListEmptyComponent={<EmptyState title="No review" />} 
            renderItem={() => <ReviewCard />}
          />
        </Box>
        ) }
      </Box>
    </Box>
  )
}


const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.URBANIST_SEMIBOLD,
    fontSize: 20,
  }
})

export default JobDetails