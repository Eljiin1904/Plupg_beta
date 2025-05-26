import React, { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import LandingScreen from "./components/LandingScreen";
import FoodDeliveryHome from "./components/FoodDeliveryHome";
import RideshareHome from "./components/RideshareHome";
import SplashScreen from "./components/SplashScreen";

export type AppMode = "food" | "ride" | "roadside";

export default function MainScreen() {
  const [currentMode, setCurrentMode] = useState<AppMode>("food");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    // Set dark theme
    setColorScheme("dark");

    // Check if user has used the app before and get their last used mode
    const checkUserStatus = async () => {
      try {
        // Only get the last used mode, but always show landing screen
        const lastUsedMode = await AsyncStorage.getItem("lastUsedMode");

        if (
          lastUsedMode === "food" ||
          lastUsedMode === "ride" ||
          lastUsedMode === "roadside"
        ) {
          setCurrentMode(lastUsedMode as AppMode);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        // Continue with default values on error
        setCurrentMode("food");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleModeSelection = async (mode: AppMode) => {
    // Update state immediately for better UX
    setCurrentMode(mode);
    setShowLanding(false);

    try {
      // Save the last used mode
      await AsyncStorage.setItem("lastUsedMode", mode);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      // Continue with the app even if storage fails
    }
  };

  const toggleMode = () => {
    const newMode = currentMode === "food" ? "ride" : "food";
    handleModeSelection(newMode);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const navigateToLanding = () => {
    setShowLanding(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-bg">
        {/* Loading state */}
      </View>
    );
  }

  // Show branded splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <StatusBar style="light" />
      {showLanding ? (
        <LandingScreen onModeSelect={handleModeSelection} />
      ) : currentMode === "food" ? (
        <FoodDeliveryHome
          onSwitchMode={toggleMode}
          onNavigateToLanding={navigateToLanding}
        />
      ) : currentMode === "ride" || currentMode === "roadside" ? (
        <RideshareHome
          onSwitchMode={toggleMode}
          onNavigateToLanding={navigateToLanding}
          mode={currentMode}
          onModeChange={(mode) => handleModeSelection(mode as AppMode)}
        />
      ) : null}
    </SafeAreaView>
  );
}
