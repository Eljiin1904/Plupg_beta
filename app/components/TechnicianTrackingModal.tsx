import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
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
  Navigation,
  Truck,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TechnicianTrackingModalProps {
  visible: boolean;
  booking: any;
  onClose: () => void;
}

const TechnicianTrackingModal = ({
  visible,
  booking,
  onClose,
}: TechnicianTrackingModalProps) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [technicianLocation, setTechnicianLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const truckAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const statuses = [
    "Service Requested",
    "Technician En Route",
    "Technician Arrived",
    "Service In Progress",
    "Completed",
  ];

  const technicianInfo = {
    name: "Mike Rodriguez",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    vehicle: "Ford F-150 • TRK789",
    phone: "(555) 123-4567",
    rating: 4.9,
  };

  // Pulse animation for technician marker
  useEffect(() => {
    if (!visible) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    truckAnim.setValue(0);
  }, [visible, pulseAnim, truckAnim]);

  // Simulate service progress
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev < statuses.length - 1) {
          const newStatus = prev + 1;

          // Start truck animation after "Technician En Route" (status 1)
          if (newStatus >= 1) {
            const truckProgress = Math.max(
              0,
              (newStatus - 1) / (statuses.length - 2),
            );

            // Animate truck and progress path together
            Animated.parallel([
              Animated.timing(truckAnim, {
                toValue: truckProgress,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(progressAnim, {
                toValue: truckProgress,
                duration: 2000,
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

      // Simulate technician moving
      setTechnicianLocation((prev) => ({
        lat: prev.lat + 0.001,
        lng: prev.lng + 0.001,
      }));
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [visible, progressAnim, truckAnim, statuses.length]);

  const handleContactTechnician = () => {
    console.log("Contacting technician...");
  };

  const handleMessageTechnician = () => {
    console.log("Messaging technician...");
  };

  const getServiceIcon = () => {
    switch (booking?.serviceType) {
      case "Tow Service":
        return "🚛";
      case "Lockout Service":
        return "🔧";
      case "Fuel Delivery":
        return "⛽";
      case "Tire Change":
        return "🔧";
      case "Dead Battery":
        return "🔋";
      default:
        return "🚛";
    }
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
          <Text className="text-xl font-bold text-white">Service Tracking</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1">
          {/* Enhanced Professional Map View */}
          <View className="h-64 relative bg-gray-800">
            {/* Professional Dark Map Background */}
            <View className="absolute inset-0 bg-gray-800">
              {/* Map Grid Pattern */}
              <View className="absolute inset-0 opacity-10">
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
              <View className="absolute inset-x-10 inset-y-20">
                {/* Main road */}
                <View className="absolute top-2/5 inset-x-0 h-1 bg-gray-600 rounded" />
                {/* Vertical road */}
                <View className="absolute left-3/5 inset-y-0 w-1 bg-gray-600 rounded" />
              </View>
            </View>

            {/* Professional Route Path - Only show after En Route */}
            {currentStatus >= 1 && (
              <View className="absolute top-1/4 left-15 w-70 h-1 bg-white bg-opacity-30 rounded z-10">
                {/* Animated Progress */}
                <Animated.View
                  className="absolute inset-y-0 left-0 bg-plug-green rounded"
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
            )}

            {/* Service Center/Origin Marker */}
            <View className="absolute top-1/5 left-15 items-center z-20">
              <View className="w-5 h-5 rounded-full bg-white border-2 border-gray-800 items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-blue-400" />
              </View>
              <View className="bg-black bg-opacity-80 px-2 py-1 rounded mt-1">
                <Text className="text-white text-xs font-semibold">
                  Service Center
                </Text>
              </View>
            </View>

            {/* Your Location Marker */}
            <View className="absolute top-1/5 right-15 items-center z-20">
              <View className="w-5 h-5 rounded-full bg-white border-2 border-gray-800 items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-plug-green" />
              </View>
              <View className="bg-black bg-opacity-80 px-2 py-1 rounded mt-1">
                <Text className="text-white text-xs font-semibold">
                  Your Location
                </Text>
              </View>
            </View>

            {/* Professional Technician Truck Marker */}
            {currentStatus >= 1 && (
              <Animated.View
                className="absolute top-22 items-center z-30"
                style={{
                  left: truckAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["15%", "85%"],
                  }),
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-md">
                  <Text className="text-base">{getServiceIcon()}</Text>
                </View>
              </Animated.View>
            )}

            {/* ETA Info Panel */}
            <View className="absolute bottom-4 left-4 right-4 bg-dark-bg bg-opacity-80 p-3 rounded-lg">
              <Text className="text-white font-bold">
                {estimatedTime > 0
                  ? `Arriving in approximately ${estimatedTime} minutes`
                  : "Technician has arrived!"}
              </Text>
              <View className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <Animated.View
                  className="h-full bg-plug-green rounded-full"
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
            </View>

            {/* Recenter Button */}
            <TouchableOpacity className="absolute top-4 right-4 bg-black bg-opacity-50 w-10 h-10 rounded-full items-center justify-center">
              <Navigation size={20} color="#00E676" />
            </TouchableOpacity>
          </View>

          {/* Service Status */}
          <View className="p-4 bg-dark-card mt-4">
            <Text className="text-white font-bold text-lg mb-4">
              Service Status
            </Text>

            {statuses.map((status, index) => (
              <View key={status} className="flex-row items-center mb-4">
                <View className="mr-3">
                  {index <= currentStatus ? (
                    <View className="w-6 h-6 rounded-full bg-plug-green items-center justify-center">
                      <Text className="text-white text-base font-bold">✓</Text>
                    </View>
                  ) : (
                    <View className="w-6 h-6 rounded-full border-2 border-gray-500 bg-transparent" />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${
                      index <= currentStatus ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {status}
                  </Text>
                  {index === currentStatus && (
                    <Text className="text-plug-green text-sm mt-1">
                      {index < statuses.length - 1
                        ? "In progress..."
                        : "Completed"}
                    </Text>
                  )}
                </View>
                {index === 2 && currentStatus >= 2 && (
                  <Text className="text-white">
                    {currentStatus < 4 ? `${estimatedTime} min` : "Completed"}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Technician Info */}
          {currentStatus >= 1 && (
            <View className="p-4 bg-dark-card mt-4">
              <Text className="text-white font-bold text-lg mb-3">
                Your Technician
              </Text>

              <View className="flex-row items-center">
                <Image
                  source={{ uri: technicianInfo.photoUrl }}
                  className="w-16 h-16 rounded-full bg-gray-700"
                  transition={500}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">
                    {technicianInfo.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-400">
                      {technicianInfo.vehicle}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-yellow-400">★</Text>
                    <Text className="text-gray-400 ml-1">
                      {technicianInfo.rating}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center mr-2"
                    onPress={handleContactTechnician}
                  >
                    <Phone size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center"
                    onPress={handleMessageTechnician}
                  >
                    <MessageSquare size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Service Details */}
          <View className="p-4 bg-dark-card mt-4">
            <Text className="text-white font-bold text-lg mb-3">
              Service Details
            </Text>

            <View className="flex-row items-center mb-2">
              <Truck size={18} color="#00E676" />
              <Text className="text-white ml-2">
                {booking?.serviceType || "Roadside Service"}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Clock size={18} color="#00E676" />
              <Text className="text-white ml-2">
                Requested at {new Date().toLocaleTimeString()}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Text className="text-white">Booking ID: </Text>
              <Text className="text-white font-medium">
                {booking?.bookingId || "RS123456"}
              </Text>
            </View>

            {booking?.estimatedCost && (
              <View className="flex-row items-center">
                <Text className="text-white">Total Cost: </Text>
                <Text className="text-plug-green font-bold">
                  ${booking.estimatedCost.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Emergency Contact */}
          <View className="p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg mt-4 mx-4 mb-6">
            <Text className="text-red-400 font-bold mb-2">Need Help?</Text>
            <Text className="text-red-300 text-sm mb-3">
              If you need immediate assistance or have concerns about your
              service, contact our support team.
            </Text>
            <TouchableOpacity className="bg-red-600 py-2 px-4 rounded-lg self-start">
              <Text className="text-white font-bold">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default TechnicianTrackingModal;
