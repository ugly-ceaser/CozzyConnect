import { Box, useThemeColor } from "@/components/others/Themed"
import { Tabs, router } from "expo-router"
import React, { ReactNode } from "react"
import Icon from "@expo/vector-icons/SimpleLineIcons"
import MatIcon from "@expo/vector-icons/MaterialIcons"
import { ORANGE_COLOR, PRIMARY_COLOR } from "@/constants/Colors"
import { Dimensions, Platform, Pressable, StyleSheet } from "react-native"
import useKeyboard from "@/hooks/useKeyboard"


interface LayoutProps {
  children: ReactNode
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bg = useThemeColor({}, 'background')
  const { width } = Dimensions.get("screen")
  const middle = (size: number) => (width / 2) - (size / 2)
  const { isKeyboardShowing } = useKeyboard()

  return (
    <Tabs
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { backgroundColor: PRIMARY_COLOR, height: 60, flexDirection: 'row', justifyContent: 'center', position: 'relative', }
      }} 
      tabBar={isKeyboardShowing && Platform.OS !== "ios" ? () => null : undefined}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIconStyle: {
            flex: 1
          },
          tabBarIcon: ({ focused }) => <Icon style={{ opacity: focused ? 1 : 0.5 }} name="home" color={"#fff"} size={20} />,
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          tabBarIconStyle: {
            flex: 1
          },
          tabBarIcon: ({ focused }) => <Icon style={{ opacity: focused ? 1 : 0.5 }} name="speech" color={"#fff"} size={20} />,
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="hot"
        options={{
          tabBarButton: () => (
            <Box style={{ position: 'relative' }}>
              <Box style={[styles.floatingBtn, { backgroundColor: bg  }]}>
                <Pressable style={styles.btn} onPress={() => router.push('/dashboard/hot')}>
                  <MatIcon name="local-fire-department" color={"#fff"} size={24} />
                </Pressable>
              </Box>
            </Box>
          )
        }}
      />

      <Tabs.Screen
        name="work"
        options={{
          tabBarIconStyle: {
            flex: 1
          },
          tabBarIcon: ({ focused }) => <Icon style={{ opacity: focused ? 1 : 0.5 }} name="briefcase" color={"#fff"} size={20} />,
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIconStyle: {
            flex: 1
          },
          tabBarIcon: ({ focused }) => <Icon style={{ opacity: focused ? 1 : 0.5 }} name="equalizer" color={"#fff"} size={20} />,
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  floatingBtn: {
    padding: 8,
    top: -35,
    borderRadius: 50,
    position: "absolute",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    width: 50,
    height: 50,
    backgroundColor: ORANGE_COLOR,
    display: 'flex',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Layout