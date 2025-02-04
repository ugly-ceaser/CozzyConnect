import { handleGetNotifications } from "@/api/user"
import { Box, Text } from "@/components/others/Themed"
import NotificationCard from "@/components/screens/notification/NotificationCard"
import AppBar from "@/components/shared/AppBar"
import EmptyState from "@/components/states/EmptyState"
import Styles from "@/constants/Styles"
import { notificationData } from "@/contents/notification"
import usePagination from "@/hooks/usePagination"
import { useNotificationStore } from "@/store/notification"
import { useUserStore } from "@/store/user"
import { Stack } from "expo-router"
import React, { useEffect } from "react"
import { FlatList } from "react-native"

interface NotificationProps { }
const Notification: React.FC<NotificationProps> = ({ }) => {
  const { notifications, initialize,  } = useNotificationStore(state => state)
  const token = useUserStore(state => state.token)
  const { data, isLoading, isRefreshing, handleRefresh } = usePagination(async (page, perPage) => await handleGetNotifications(token, { page, perPage }))

  // useEffect(() => {
  //   initialize(notificationData)
  // }, [])

  useEffect(() => {
    initialize([])
  }, [])


  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="Notifications" />
        }}
      />
      <Box style={Styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationCard {...item} />}
          ListEmptyComponent={() => <EmptyState title="No Notifications found" />}
          ItemSeparatorComponent={() => <Box style={{ marginBottom: 10 }} />}
        />
      </Box>
    </> 
  )
}

export default Notification