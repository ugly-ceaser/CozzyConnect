import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Toasts } from '@backpackapp-io/react-native-toast';

import { useColorScheme } from '@/components/others/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { useDrawerStore } from '@/store/drawer';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {};

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    UrbanistExtraBold: require("../assets/fonts/Urbanist-ExtraBold.ttf"),
    UrbanistBold: require("../assets/fonts/Urbanist-Bold.ttf"),
    UrbanistSemiBold: require("../assets/fonts/Urbanist-SemiBold.ttf"),
    UrbanistRegular: require("../assets/fonts/Urbanist-Regular.ttf"),
    UrbanistMedium: require("../assets/fonts/Urbanist-Medium.ttf"),
    UrbanistLight: require("../assets/fonts/Urbanist-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);
  
  useEffect(() => {
    // (async () => await LocalStorage.deleteItem(StorageKeys.FIRST_TIME))();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style='auto' animated />
      <Stack initialRouteName='intro'>
        <Stack.Screen name='intro' options={{ headerShown: false }} />
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='register' options={{ headerShown: false }} />
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='registration-success' options={{ headerShown: false }} />
        {/* <Stack.Screen name='otp' options={{ headerShown: false }} /> */}
        <Stack.Screen name='dashboard' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme as "light" | "dark"].background
  const navigation = useNavigation()
  const { closeDrawer } = useDrawerStore(state => state)
  const handleStateChange = () => {
    closeDrawer()
  }

  useEffect(() => {
    navigation.addListener('state', handleStateChange)
    return () => navigation.removeListener('state', handleStateChange)
  }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <Toasts />
      <InitialLayout />
    </GestureHandlerRootView>
  )
}

export default RootLayoutNav