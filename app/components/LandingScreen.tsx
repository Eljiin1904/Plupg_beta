import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Car, UtensilsCrossed } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

interface LandingScreenProps {
  onModeSelect?: (mode: "food" | "ride") => void;
}

export default function LandingScreen({
  onModeSelect = () => {},
}: LandingScreenProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const foodButtonScale = useRef(new Animated.Value(1)).current;
  const rideButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (buttonScale: Animated.Value) => {
    // Trigger haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((e) => {
        console.warn("Haptic feedback error:", e);
      });
    } catch (e) {
      console.warn("Error with haptics:", e);
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelectFood = () => {
    animateButton(foodButtonScale);
    onModeSelect("food");
  };

  const handleSelectRide = () => {
    animateButton(rideButtonScale);
    onModeSelect("ride");
  };

  return (
    <View
      className={`flex-1 ${colorScheme === "dark" ? "bg-dark-bg" : "bg-white"} p-6 justify-center items-center`}
    >
      {/* Logo and App Name */}
      <View className="items-center mb-12">
        <Image
          source={require("../../assets/images/the-plug-logo.jpg")}
          className="w-36 h-36 mb-4"
          contentFit="contain"
        />
        <Text
          className={`text-3xl font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          The Plug
        </Text>
        <Text
          className={`text-base ${colorScheme === "dark" ? "text-gray-300" : "text-gray-600"} mt-2 text-center`}
        >
          Your all-in-one delivery solution
        </Text>
      </View>

      {/* Mode Selection Buttons */}
      <View className="w-full space-y-4">
        <Animated.View style={{ transform: [{ scale: foodButtonScale }] }}>
          <TouchableOpacity
            onPress={handleSelectFood}
            className="bg-plug-green rounded-xl p-6 flex-row items-center justify-between"
            style={styles.buttonShadow}
            activeOpacity={0.9}
          >
            <View>
              <Text className="text-white text-2xl font-bold mb-1">Food</Text>
              <Text className="text-white opacity-90">
                Restaurants, groceries, alcohol & more
              </Text>
            </View>
            <UtensilsCrossed size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: rideButtonScale }] }}>
          <TouchableOpacity
            onPress={handleSelectRide}
            className="bg-dark-card rounded-xl p-6 flex-row items-center justify-between"
            style={styles.buttonShadow}
            activeOpacity={0.9}
          >
            <View>
              <Text className="text-white text-2xl font-bold mb-1">Auto</Text>
              <Text className="text-white opacity-90">
                Rideshare & roadside assistance
              </Text>
            </View>
            <Car size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Terms and Privacy */}
      <View className="mt-12">
        <Text
          className={`text-xs ${colorScheme === "dark" ? "text-gray-400" : "text-gray-500"} text-center`}
        >
          By continuing, you agree to our{" "}
          <Text className="text-plug-green font-medium">Terms of Service</Text>{" "}
          and{" "}
          <Text className="text-plug-green font-medium">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
