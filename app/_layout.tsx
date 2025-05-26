import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";

// Prevent the system splash screen from auto-hiding before asset loading is complete.
try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  console.warn("Error preventing splash screen from auto-hiding:", e);
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    try {
      if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
        const { TempoDevtools } = require("tempo-devtools");
        TempoDevtools.init();
      }
    } catch (e) {
      console.warn("Error initializing Tempo devtools:", e);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      // Hide the system splash screen once fonts are loaded
      // Our custom branded splash screen will still show
      try {
        SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
          animation: "fade",
        })}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
