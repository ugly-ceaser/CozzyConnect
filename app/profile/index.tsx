import { Box, HStack, Text, useThemeColor } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import Styles from "@/constants/Styles"
import { useAssets } from "expo-asset"
import { Stack, useRouter } from "expo-router"
import React, { useEffect } from "react"
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "@expo/vector-icons/Feather"
import { FontFamily } from "@/constants/Enums"
import IconInput from "@/components/shared/IconInput"
import { useUserStore } from "@/store/user"
import { RefreshControl } from "react-native-gesture-handler"
import useFetchUser from "@/hooks/useFetchUser"
import ImageComponent from "@/components/shared/ImageComponent"
import { log } from "@/utils/helpers"
import useBoolean from "@/hooks/useBoolean"

interface IndexProps { }
const Index: React.FC<IndexProps> = ({ }) => {
  const [assets] = useAssets([require('@/assets/images/pngs/verified.png')])
  const textColor = useThemeColor({}, 'text')
  const bgColor = useThemeColor({}, 'background')
  const router = useRouter()
  const { user }  = useUserStore(state => state)
  const token = useUserStore(state => state.token)
  const { fetchUserData, isLoadingUser } = useFetchUser()
  const {isOpen: isLoading, open, close} = useBoolean()

  const handleRefresh = async () => {
    open()
    await fetchUserData(token)
    close()
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AppBar title="profile" />
        }}
      />
      <ScrollView style={[Styles.container, { backgroundColor: bgColor }]} refreshControl={
        <RefreshControl onRefresh={handleRefresh} refreshing={isLoading} />
      }>
        <Box style={{ flex: 1 }}>
          <HStack style={{ marginTop: 40, gap: 18 }}>
            <Box style={{ position: "relative" }}>
              {user?.isVerified && <ImageComponent
                style={[styles.avatarBadge, { zIndex: 5 }]}
                noLoading
                uri={assets?.[0].uri}
              />}
              <ImageComponent
                style={{ width: 75, height: 75, borderRadius: 75 }}
                uri={user?.profilePicture}
                profile
                noLoading
              />
            </Box>

            <HStack style={{ gap: 10 }}>
              <Text style={{ fontSize: 24, fontFamily: FontFamily.URBANIST_MEDIUM }}>{user?.fullName || '- - -'}</Text>
              <TouchableOpacity onPress={() => router.push('/profile/edit')}>
                <Icon name="edit" size={20} color={textColor} />
              </TouchableOpacity>
            </HStack>
          </HStack>

          <Box style={{ marginTop: 30, gap: 20 }}>
            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Full Name</Text>
              <IconInput
                icon={<Icon name="user" size={20} style={{ marginHorizontal: 15 }} color={textColor} />}
                InputProps={{
                  defaultValue: user?.fullName || "- - -",
                  readOnly: true
                }}
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Mobile Number</Text>
              <IconInput
                icon={<Icon name="phone" size={20} style={{ marginHorizontal: 15 }} color={textColor} />}
                InputProps={{
                  defaultValue: user?.phoneNumber || "- - -",
                  readOnly: true
                }}
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Email Address</Text>
              <IconInput
                icon={<Icon name="mail" size={20} style={{ marginHorizontal: 15 }} color={textColor} />}
                InputProps={{
                  defaultValue: user?.email || '- - -',
                  readOnly: true
                }}
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>Address</Text>
              <IconInput
                icon={<Icon name="home" size={20} style={{ marginHorizontal: 15 }} color={textColor} />}
                InputProps={{
                  defaultValue: user?.address || '- - -',
                  readOnly: true
                }}
              />
            </Box>

            <Box style={{ gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_SEMIBOLD }}>User Type</Text>
              <IconInput
                icon={<Icon name="users" size={20} style={{ marginHorizontal: 15 }} color={textColor} />}
                InputProps={{
                  defaultValue: user?.userType || '- - -',
                  readOnly: true
                }}
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  avatarBadge: { width: 25, height: 25, position: "absolute", right: -8, top: 6 },
  label: {}
})

export default Index