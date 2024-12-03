import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding/signup" />
            <Stack.Screen name="CreateRating" />
            <Stack.Screen name="CreateReview" />
            <Stack.Screen name="MediaReviewsPage" />
            <Stack.Screen name="MediaPage" />
            <Stack.Screen name="Settings" />
            <Stack.Screen name="Activity" />
            <Stack.Screen name="OnQueue" />
            <Stack.Screen name="ReviewPage" />
            <Stack.Screen name="SectionResults" />
            <Stack.Screen name="Recommendations" />
            <Stack.Screen name="Notifications" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}
