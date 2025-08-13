import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  Navigation,
  Car,
  Store,
  Home,
} from "lucide-react-native";

interface OrderTrackingModalProps {
  visible: boolean;
  onClose: () => void;
  restaurantName: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OrderTrackingModal = ({
  visible,
  onClose,
  restaurantName,
}: OrderTrackingModalProps) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [driverLocation, setDriverLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const carAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Map control states
  const [isMapCentered, setIsMapCentered] = useState(true);

  // Additional car markers for ambient traffic
  const [trafficCars, setTrafficCars] = useState([
    { id: "car1", position: { top: "30%", left: "20%" }, rotation: 45 },
    { id: "car2", position: { top: "50%", left: "70%" }, rotation: 180 },
    { id: "car3", position: { top: "70%", left: "40%" }, rotation: 270 },
  ]);

  const statuses = [
    "Order Received",
    "Preparing",
    "Ready for Pickup",
    "On the Way",
    "Delivered",
  ];

  // Pulse animation for driver marker
  useEffect(() => {
    if (!visible) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Initialize car animation value but don't start moving yet
    carAnim.setValue(0);

    // Animate traffic cars
    const trafficInterval = setInterval(() => {
      setTrafficCars((prev) =>
        prev.map((car) => ({
          ...car,
          position: {
            top: `${Math.random() * 70 + 10}%`,
            left: `${Math.random() * 70 + 10}%`,
          },
          rotation: Math.random() * 360,
        })),
      );
    }, 5000);

    return () => clearInterval(trafficInterval);
  }, [visible, pulseAnim, carAnim]);

  // Simulate order progress
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev < statuses.length - 1) {
          const newStatus = prev + 1;

          // Start car and path animation only after "Ready for Pickup" (status 2)
          if (newStatus >= 2) {
            const carProgress = Math.max(
              0,
              (newStatus - 2) / (statuses.length - 3),
            );

            // Animate car and progress path together synchronously
            Animated.parallel([
              Animated.timing(carAnim, {
                toValue: carProgress,
                duration: 2000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(progressAnim, {
                toValue: carProgress,
                duration: 2000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
              }),
            ]).start();
          }

          return newStatus;
        }
        clearInterval(interval);
        return prev;
      });

      setEstimatedTime((prev) => Math.max(0, prev - 5));

      // Simulate driver moving
      setDriverLocation((prev) => ({
        lat: prev.lat + 0.001,
        lng: prev.lng + 0.001,
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [visible, progressAnim, carAnim, statuses.length]);

  const handleContactDriver = () => {
    // In a real app, this would initiate a call
    console.log("Contacting driver...");
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a chat
    console.log("Messaging driver...");
  };

  const handleRecenterMap = () => {
    setIsMapCentered(true);
    // In a real app, this would recenter the map on the driver
    console.log("Recentering map...");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-dark-bg">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Order Tracking</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1">
          {/* Enhanced Professional Map View */}
          <View
            className="h-64 relative"
            style={{ backgroundColor: "#2d3748" }}
          >
            {/* Professional Dark Map Background */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#2d3748",
              }}
            >
              {/* Map Grid Pattern */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                }}
              >
                {/* Vertical lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <View
                    key={`v-${i}`}
                    style={{
                      position: "absolute",
                      left: `${(i + 1) * 12.5}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      backgroundColor: "#4a5568",
                    }}
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={`h-${i}`}
                    style={{
                      position: "absolute",
                      top: `${(i + 1) * 16.66}%`,
                      left: 0,
                      right: 0,
                      height: 1,
                      backgroundColor: "#4a5568",
                    }}
                  />
                ))}
              </View>

              {/* Road Network */}
              <View
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "10%",
                  right: "10%",
                  bottom: "20%",
                }}
              >
                {/* Main road */}
                <View
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: "#4a5568",
                    borderRadius: 2,
                  }}
                />
                {/* Vertical road */}
                <View
                  style={{
                    position: "absolute",
                    left: "60%",
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: "#4a5568",
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>

            {/* Professional Route Path - Only show after Ready for Pickup */}
            {currentStatus >= 2 && (
              <View
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "15%",
                  width: "70%",
                  height: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 2,
                  zIndex: 2,
                }}
              >
                {/* Animated Progress - synced with car */}
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 2,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
            )}

            {/* Professional Origin Marker */}
            <View
              style={{
                position: "absolute",
                top: "20%",
                left: "15%",
                alignItems: "center",
                zIndex: 5,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 3,
                  borderColor: "#2d3748",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#4299e1",
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "600" }}
                >
                  {restaurantName}
                </Text>
              </View>
            </View>

            {/* Professional Destination Marker */}
            <View
              style={{
                position: "absolute",
                top: "20%",
                right: "15%",
                alignItems: "center",
                zIndex: 5,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 3,
                  borderColor: "#2d3748",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#48bb78",
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "600" }}
                >
                  Your location
                </Text>
              </View>
            </View>

            {/* Professional Driver Car Marker - Only show after Ready for Pickup */}
            {currentStatus >= 2 && (
              <Animated.View
                style={{
                  position: "absolute",
                  top: "22%",
                  left: carAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["15%", "85%"],
                  }),
                  transform: [{ scale: pulseAnim }],
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🚗</Text>
                </View>
              </Animated.View>
            )}

            {/* Professional Recenter Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleRecenterMap}
            >
              <Navigation
                size={20}
                color={isMapCentered ? "#4299e1" : "#718096"}
              />
            </TouchableOpacity>

            {/* ETA Info Panel */}
            <View className="absolute bottom-4 left-4 right-4 bg-dark-bg bg-opacity-80 p-3 rounded-lg">
              <Text className="text-white font-bold">
                {estimatedTime > 0
                  ? `Arriving in approximately ${estimatedTime} minutes`
                  : "Your order has arrived!"}
              </Text>
              <View className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <Animated.View
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    height: "100%",
                    backgroundColor: "#00E676",
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Order Status */}
          <View className="p-4 bg-dark-card mt-4">
            <Text className="text-white font-bold text-lg mb-4">
              Order Status
            </Text>

            {statuses.map((status, index) => (
              <View key={status} className="flex-row items-center mb-4">
                <View className="mr-3">
                  {index <= currentStatus ? (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#4CAF50",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: "#999999",
                        backgroundColor: "transparent",
                      }}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${index <= currentStatus ? "text-white" : "text-gray-500"}`}
                  >
                    {status}
                  </Text>
                  {index === currentStatus && (
                    <Text className="text-[#00E676] text-sm mt-1">
                      {index < statuses.length - 1
                        ? "In progress..."
                        : "Completed"}
                    </Text>
                  )}
                </View>
                {index === 3 && currentStatus >= 3 && (
                  <Text className="text-white">
                    {estimatedTime > 0 ? `${estimatedTime} min` : "Arrived"}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Driver Info */}
          {currentStatus >= 2 && (
            <View className="p-4 bg-dark-card mt-4">
              <Text className="text-white font-bold text-lg mb-3">
                Your Driver
              </Text>

              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
                  }}
                  className="w-16 h-16 rounded-full bg-gray-700"
                  transition={500}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">
                    Michael Johnson
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-400">Toyota Prius • ABC123</Text>
                  </View>
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center mr-2"
                    onPress={handleContactDriver}
                  >
                    <Phone size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center"
                    onPress={handleMessageDriver}
                  >
                    <MessageSquare size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Order Details */}
          <View className="p-4 bg-dark-card mt-4">
            <Text className="text-white font-bold text-lg mb-3">
              Order Details
            </Text>

            <View className="flex-row items-center mb-2">
              <MapPin size={18} color="#FF3008" />
              <Text className="text-white ml-2">{restaurantName}</Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Clock size={18} color="#FF3008" />
              <Text className="text-white ml-2">
                Order placed at {new Date().toLocaleTimeString()}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Text className="text-white">Order #: </Text>
              <Text className="text-white font-medium">
                {Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default OrderTrackingModal;
