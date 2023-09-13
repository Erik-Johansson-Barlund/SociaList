import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import UserProvider from '../context'
import UserContext from '../context/userContext'
import LoginScreen from '../components/LoginScreen'
import WelcomeScreen from '../components/WelcomeScreen'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <UserProvider><RootLayoutNav /></UserProvider>
}

function RootLayoutNav() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const colorScheme = useColorScheme()
  const { userName } = useContext(UserContext)

  setTimeout(() => {
    setShowWelcomeScreen(false)
  }, 2000)

  if (showWelcomeScreen) {
    return (
      <WelcomeScreen />
    )
  }
  if (!userName) {
    return (
      <LoginScreen />
    )
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
