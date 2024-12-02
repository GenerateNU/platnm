import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "@/components/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    NeueHaasUnicaPro: require("../assets/fonts/NeueHaasUnicaPro-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // UNCOMMENT IF DEMOING SO THAT EMBARRASSING LOGS DONT APPEAR
  // LogBox.ignoreAllLogs();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding/signup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateReview"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PreviewReview"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="MediaPage" options={{ headerShown: false }} />
            <Stack.Screen
              name="MediaReviewsPage"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" options={{ headerShown: false }} />
            <Stack.Screen name="Activity" options={{ headerShown: false }} />
            <Stack.Screen name="OnQueue" options={{ headerShown: false }} />
            <Stack.Screen name="ReviewPage" options={{ headerShown: false }} />
            <Stack.Screen
              name="SectionResults"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Recommendations"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}
