import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin,
  Truck,
  Key,
  Fuel,
  Wrench,
  Battery,
  Clock,
  DollarSign,
} from "lucide-react-native";

import ServiceDetailsModal from "./ServiceDetailsModal";
import TechnicianTrackingModal from "./TechnicianTrackingModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface ServiceOption {
  id: string;
  name: string;
  iconUri: any; // Allow both string and require()
  price: string;
  basePrice: number;
  variablePrice: number;
  eta: string;
  description: string;
  icon: React.ReactNode;
  requiresInput: boolean;
  inputType?: "miles" | "gallons" | "tires" | "none";
}

interface ServiceCardProps {
  service: ServiceOption;
  onPress: (service: ServiceOption) => void;
}

const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
  // FIX: Conditionally set the image source for local (require) vs remote (uri) assets.
  const imageSource =
    typeof service.iconUri === "string"
      ? { uri: service.iconUri }
      : service.iconUri;

  return (
    <TouchableOpacity
      className="mr-4 w-48 bg-dark-card rounded-xl overflow-hidden shadow-sm"
      onPress={() => onPress(service)}
    >
      <Image source={imageSource} className="w-full h-32" contentFit="cover" />
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          {service.icon}
          <Text className="text-white font-bold text-base ml-2">
            {service.name}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <DollarSign size={14} color="#00E676" />
            <Text className="text-plug-green font-bold ml-1">
              {service.price}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={14} color="#888888" />
            <Text className="text-gray-400 text-sm ml-1">{service.eta}</Text>
          </View>
        </View>
        <Text className="text-gray-400 text-sm mt-2" numberOfLines={2}>
          {service.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface RoadsideScreenProps {
  userLocation?: string;
  onBack?: () => void;
}

const RoadsideScreen = ({
  userLocation = "Current Location",
  onBack = () => console.log("Back pressed"),
}: RoadsideScreenProps) => {
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  );
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showTechnicianTracking, setShowTechnicianTracking] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  // Mock service options data
  const serviceOptions: ServiceOption[] = [
    {
      id: "tow",
      name: "Tow Service",
      iconUri: require("../../assets/roadside.png"),
      price: "$79.99",
      basePrice: 79.99,
      variablePrice: 2.0, // per mile
      eta: "25 min",
      description: "Professional towing service to your destination",
      icon: <Truck size={20} color="#00E676" />,
      requiresInput: true,
      inputType: "miles",
    },
    {
      id: "lockout",
      name: "Lockout Service",
      iconUri: require("../../assets/images/Lockout.png"),
      price: "$49.99",
      basePrice: 49.99,
      variablePrice: 0,
      eta: "15 min",
      description: "Quick and safe vehicle lockout assistance",
      icon: <Key size={20} color="#00E676" />,
      requiresInput: false,
      inputType: "none",
    },
    {
      id: "fuel",
      name: "Fuel Delivery",
      iconUri: require("../../assets/roadside.png"),
      price: "$24.99",
      basePrice: 24.99,
      variablePrice: 3.5, // per gallon
      eta: "20 min",
      description: "Emergency fuel delivery to your location",
      icon: <Fuel size={20} color="#00E676" />,
      requiresInput: true,
      inputType: "gallons",
    },
    {
      id: "tire",
      name: "Tire Change",
      iconUri: require("../../assets/flattire.png"),
      price: "$39.99",
      basePrice: 39.99,
      variablePrice: 15.0, // per additional tire
      eta: "30 min",
      description: "Professional tire change service",
      icon: <Wrench size={20} color="#00E676" />,
      requiresInput: true,
      inputType: "tires",
    },
    {
      id: "battery",
      name: "Dead Battery",
      iconUri: require("../../assets/deadbattery.png"),
      price: "$34.99",
      basePrice: 34.99,
      variablePrice: 0,
      eta: "18 min",
      description: "Jump start or battery replacement service",
      icon: <Battery size={20} color="#00E676" />,
      requiresInput: false,
      inputType: "none",
    },
  ];

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };

  const handleServiceBook = (bookingDetails: any) => {
    // Simulate booking API call
    const booking = {
      bookingId: `RS${Date.now()}`,
      serviceType: selectedService?.name,
      technicianId: "tech_001",
      eta: selectedService?.eta,
      ...bookingDetails,
    };

    setCurrentBooking(booking);
    setShowServiceDetails(false);
    setShowTechnicianTracking(true);
  };

  const handleTrackingClose = () => {
    setShowTechnicianTracking(false);
    setCurrentBooking(null);
    setSelectedService(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-dark-card border-b border-gray-800">
        <TouchableOpacity onPress={onBack}>
          <Text className="text-plug-green font-medium">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">
          Roadside Assistance
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View className="h-64 bg-gray-800 relative">
          {/* Professional Map Background */}
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

          {/* User Location Marker */}
          <View className="absolute top-1/2 left-1/2 items-center z-20 transform -translate-x-1/2 -translate-y-1/2">
            <View className="w-6 h-6 rounded-full bg-plug-green border-2 border-white items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-white" />
            </View>
            <View className="bg-black bg-opacity-80 px-2 py-1 rounded mt-1">
              <Text className="text-white text-xs font-semibold">
                You Are Here
              </Text>
            </View>
          </View>

          {/* Location Info */}
          <View className="absolute bottom-4 left-4 right-4 bg-dark-bg bg-opacity-80 p-3 rounded-lg">
            <View className="flex-row items-center">
              <MapPin size={16} color="#00E676" />
              <Text className="text-white font-medium ml-2">
                {userLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Options */}
        <View className="mt-6 px-4">
          <Text className="text-xl font-bold text-white mb-4">
            Select Service
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-4"
          >
            {serviceOptions.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServiceSelect}
              />
            ))}
          </ScrollView>
        </View>

        {/* Emergency Contact */}
        <View className="mt-6 mx-4 p-4 bg-green-900 bg-opacity-20 border border-[#00E676] rounded-lg">
          <Text className="text-[#00E676] font-bold text-base mb-2">
            Emergency?
          </Text>
          <Text className="text-green-300 text-sm mb-3">
            For immediate emergency assistance, call 911
          </Text>
          <TouchableOpacity className="bg-[#00E676] py-2 px-4 rounded-lg self-start">
            <Text className="text-white font-bold">Call 911</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Services */}
        <View className="mt-6 px-4 pb-20">
          <Text className="text-lg font-bold text-white mb-3">
            Recent Services
          </Text>
          <View className="bg-dark-card p-4 rounded-lg">
            <Text className="text-gray-400 text-center">
              No recent services
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsModal
          visible={showServiceDetails}
          service={selectedService}
          onClose={() => setShowServiceDetails(false)}
          onBook={handleServiceBook}
        />
      )}

      {/* Technician Tracking Modal */}
      {currentBooking && (
        <TechnicianTrackingModal
          visible={showTechnicianTracking}
          booking={currentBooking}
          onClose={handleTrackingClose}
        />
      )}
    </SafeAreaView>
  );
};

export default RoadsideScreen;
