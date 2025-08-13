import * as Haptics from "expo-haptics";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MobileImageComponent from "./MobileImageComponent";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colorScheme } = useColorScheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Trigger haptic feedback when splash screen appears
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((e) => {
        console.warn("Haptic feedback error:", e);
      });
    } catch (e) {
      console.warn("Error with haptics:", e);
    }

    // Animation sequence
    Animated.sequence([
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600, // Reduced duration
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600, // Reduced duration
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(800), // Reduced delay
      Animated.delay(2000), // Added extra 2s hold before fading out
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400, // Reduced duration
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call onFinish when animation completes
      onFinish();
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="flex-1 items-center justify-center"
      >
        <MobileImageComponent
          source={require("../../assets/images/the-plug-logo.jpg")}
          className="w-96 h-96"
          style={{ width: 384, height: 384 }}
          contentFit="contain"
          showLoadingIndicator={false}
        />
        <Text className="text-xl text-white text-center -mt-32">Delivery</Text>
        <Text className="text-sm text-gray-300 text-center -mt-1">
          Your all in one delivery solution
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
