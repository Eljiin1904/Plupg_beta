import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Car, UtensilsCrossed } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";
import MobileImageComponent from "./MobileImageComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from '../assets';

interface LandingScreenProps {
  onModeSelect?: (mode: "food" | "ride") => void;
}

export default function LandingScreen({
  onModeSelect = () => {},
}: LandingScreenProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const foodButtonScale = useRef(new Animated.Value(0.9)).current;
  const rideButtonScale = useRef(new Animated.Value(0.9)).current;

  const handleSelectFood = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.warn("Haptic feedback error:", e);
    }

    Animated.sequence([
      Animated.timing(foodButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(foodButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onModeSelect("food");
  };

  const handleSelectRide = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.warn("Haptic feedback error:", e);
    }

    Animated.sequence([
      Animated.timing(rideButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rideButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onModeSelect("ride");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
      {/* Logo and App Name */}
      <View className="items-center mb-6">
        <MobileImageComponent
          source={images.plugLogo}
          className="w-32 h-32 mb-3"
          style={{ width: 384, height: 384 }}
          contentFit="contain"
          showLoadingIndicator={true}
        />

        <Text
          className={`text-lg font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-800"} text-center mb-1`}
        >
          Delivery
        </Text>
        <Text
          className={`text-base ${colorScheme === "dark" ? "text-gray-300" : "text-gray-600"} text-center`}
        >
          Your all in one delivery solution
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
                Restaurants, Groceries, Alcohol & More
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
                Rideshare & Roadside Assistance
              </Text>
            </View>
            <Car size={32} color="grey" />
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
    </SafeAreaView>
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
