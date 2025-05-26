import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "nativewind";

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
    <View className="flex-1 bg-dark-bg items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <Image
          source={require("../../assets/images/the-plug-logo.jpg")}
          className="w-48 h-48 mb-6"
          contentFit="contain"
        />
        <Text className="text-4xl font-bold text-white text-center">
          The Plug
        </Text>
        <Text className="text-xl text-white mt-2 text-center">Delivery</Text>
        <Text className="text-sm text-gray-300 mt-4 text-center">
          Your all in one delivery solution
        </Text>
      </Animated.View>
    </View>
  );
}
