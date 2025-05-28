import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  X,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
} from "lucide-react-native";

export interface DeliveryDetails {
  address: string;
  instructions: string;
  phone: string;
  deliveryTime: string;
}

interface DeliveryDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (details: DeliveryDetails) => void;
  initialDetails?: DeliveryDetails;
}

const DeliveryDetailsModal = ({
  visible,
  onClose,
  onContinue,
  initialDetails,
}: DeliveryDetailsModalProps) => {
  const [address, setAddress] = useState(
    initialDetails?.address || "123 Main Street",
  );
  const [instructions, setInstructions] = useState(
    initialDetails?.instructions || "",
  );
  const [phone, setPhone] = useState(initialDetails?.phone || "");
  const [deliveryTime, setDeliveryTime] = useState(
    initialDetails?.deliveryTime || "ASAP",
  );

  const [errors, setErrors] = useState<{
    address?: string;
    phone?: string;
  }>({});

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleContinue = () => {
    const newErrors: { address?: string; phone?: string } = {};

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onContinue({
        address,
        instructions,
        phone,
        deliveryTime,
      });
    }
  };

  const deliveryTimeOptions = ["ASAP", "30 minutes", "1 hour", "2 hours"];

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
          <Text className="text-xl font-bold text-white">Delivery Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Delivery Address */}
          <View className="mb-6">
            <Text className="text-white font-bold mb-2">
              Delivery Address <Text className="text-[#FF3008]">*</Text>
            </Text>
            <View
              className={`flex-row items-center bg-gray-800 p-3 rounded-lg ${errors.address ? "border border-red-500" : ""}`}
            >
              <MapPin size={20} color="#FF3008" />
              <TextInput
                className="flex-1 text-white ml-2"
                placeholder="Enter your address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            {errors.address && (
              <Text className="text-red-500 mt-1">{errors.address}</Text>
            )}
          </View>

          {/* Delivery Time */}
          <View className="mb-6">
            <Text className="text-white font-bold mb-2">Delivery Time</Text>
            <View className="bg-gray-800 rounded-lg overflow-hidden">
              {deliveryTimeOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  className={`flex-row justify-between items-center p-3 ${index < deliveryTimeOptions.length - 1 ? "border-b border-gray-700" : ""}`}
                  onPress={() => setDeliveryTime(option)}
                >
                  <View className="flex-row items-center">
                    <Clock size={20} color="#FF3008" />
                    <Text className="text-white ml-2">{option}</Text>
                  </View>
                  {deliveryTime === option && (
                    <View className="h-4 w-4 rounded-full bg-[#FF3008]" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Phone Number */}
          <View className="mb-6">
            <Text className="text-white font-bold mb-2">
              Phone Number <Text className="text-[#FF3008]">*</Text>
            </Text>
            <View
              className={`flex-row items-center bg-gray-800 p-3 rounded-lg ${errors.phone ? "border border-red-500" : ""}`}
            >
              <Phone size={20} color="#FF3008" />
              <TextInput
                className="flex-1 text-white ml-2"
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone && (
              <Text className="text-red-500 mt-1">{errors.phone}</Text>
            )}
          </View>

          {/* Delivery Instructions */}
          <View className="mb-6">
            <Text className="text-white font-bold mb-2">
              Delivery Instructions (Optional)
            </Text>
            <View className="bg-gray-800 p-3 rounded-lg">
              <View className="flex-row items-start">
                <MessageSquare size={20} color="#FF3008" />
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Add instructions for delivery (gate code, landmarks, etc.)"
                  placeholderTextColor="#999"
                  value={instructions}
                  onChangeText={setInstructions}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View className="p-4 border-t border-gray-800">
          <TouchableOpacity
            className="bg-[#FF3008] py-3 rounded-lg items-center"
            onPress={handleContinue}
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DeliveryDetailsModal;
