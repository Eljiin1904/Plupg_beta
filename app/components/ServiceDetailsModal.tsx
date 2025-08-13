import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  X,
  DollarSign,
  Clock,
  CreditCard,
  ChevronDown,
  AlertCircle,
} from "lucide-react-native";

import { ServiceOption } from "./RoadsideScreen";

interface ServiceDetailsModalProps {
  visible: boolean;
  service: ServiceOption;
  onClose: () => void;
  onBook: (details: any) => void;
}

const ServiceDetailsModal = ({
  visible,
  service,
  onClose,
  onBook,
}: ServiceDetailsModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number>(service.basePrice);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Visa •••• 4242");

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setInputValue("");
      setEstimatedCost(service.basePrice);
      setErrors({});
      setIsLoading(false);
    }
  }, [visible, service]);

  // Calculate estimated cost in real time
  useEffect(() => {
    const numericValue = parseFloat(inputValue) || 0;
    const newCost = service.basePrice + service.variablePrice * numericValue;
    setEstimatedCost(newCost);
  }, [inputValue, service]);

  const validateInput = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (service.requiresInput) {
      const numericValue = parseFloat(inputValue);

      if (!inputValue.trim()) {
        newErrors.input = `Please enter ${getInputLabel().toLowerCase()}`;
      } else if (isNaN(numericValue) || numericValue <= 0) {
        newErrors.input = "Please enter a valid number";
      } else {
        // Service-specific validation
        switch (service.inputType) {
          case "miles":
            if (numericValue > 100) {
              newErrors.input = "Maximum 100 miles allowed";
            }
            break;
          case "gallons":
            if (numericValue > 5) {
              newErrors.input = "Maximum 5 gallons allowed";
            }
            break;
          case "tires":
            if (numericValue > 4) {
              newErrors.input = "Maximum 4 tires allowed";
            }
            break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getInputLabel = (): string => {
    switch (service.inputType) {
      case "miles":
        return "Miles to tow";
      case "gallons":
        return "Gallons needed";
      case "tires":
        return "Number of tires";
      default:
        return "Input";
    }
  };

  const getInputPlaceholder = (): string => {
    switch (service.inputType) {
      case "miles":
        return "Enter miles (e.g., 10)";
      case "gallons":
        return "Enter gallons (1-5)";
      case "tires":
        return "Enter number of tires (1-4)";
      default:
        return "Enter value";
    }
  };

  const handleRequestService = async () => {
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const bookingDetails = {
        serviceId: service.id,
        inputValue: service.requiresInput ? parseFloat(inputValue) : null,
        estimatedCost,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date().toISOString(),
      };

      onBook(bookingDetails);
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "Unable to process your request. Please try again.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: handleRequestService },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = () => {
    if (!service.requiresInput) return null;

    return (
      <View className="mb-6">
        <Text className="text-white font-bold mb-2">
          {getInputLabel()} <Text className="text-[#00E676]">*</Text>
        </Text>
        <TextInput
          className={`bg-gray-800 text-white px-4 py-3 rounded-lg text-base ${
            errors.input ? "border border-red-500" : ""
          }`}
          placeholder={getInputPlaceholder()}
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
          onBlur={validateInput}
        />
        {errors.input && (
          <View className="flex-row items-center mt-2">
            <AlertCircle size={16} color="#00E676" />
            <Text className="text-[#00E676] ml-2 text-sm">{errors.input}</Text>
          </View>
        )}
      </View>
    );
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
          <Text className="text-xl font-bold text-white">{service.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Service Image */}
          <Image
            source={
              typeof service.iconUri === "string"
                ? { uri: service.iconUri }
                : service.iconUri
            }
            className="w-full h-48 rounded-lg mb-6"
            contentFit="cover"
          />

          {/* Service Description */}
          <View className="mb-6">
            <Text className="text-white text-base leading-6">
              {service.description}
            </Text>
          </View>

          {/* Input Fields */}
          {renderInputField()}

          {/* Price Estimate */}
          <View className="bg-dark-card p-4 rounded-lg mb-6">
            <Text className="text-white font-bold text-lg mb-3">
              Price Estimate
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-400">Base Price</Text>
              <Text className="text-white">
                ${service.basePrice.toFixed(2)}
              </Text>
            </View>
            {service.requiresInput && parseFloat(inputValue) > 0 && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-400">
                  {getInputLabel()} ({inputValue})
                </Text>
                <Text className="text-white">
                  ${(service.variablePrice * parseFloat(inputValue)).toFixed(2)}
                </Text>
              </View>
            )}
            <View className="border-t border-gray-700 my-2" />
            <View className="flex-row justify-between items-center">
              <Text className="text-white font-bold text-lg">Total</Text>
              <Text className="text-plug-green font-bold text-xl">
                ${estimatedCost.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* ETA */}
          <View className="flex-row items-center mb-6">
            <Clock size={20} color="#00E676" />
            <Text className="text-white ml-2">
              Estimated arrival: {service.eta}
            </Text>
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="text-white font-bold mb-2">Payment Method</Text>
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-800 p-4 rounded-lg">
              <View className="flex-row items-center">
                <CreditCard size={20} color="#FFFFFF" />
                <Text className="text-white ml-3">{selectedPaymentMethod}</Text>
              </View>
              <ChevronDown size={16} color="#888" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Request Service Button */}
        <View className="p-4 border-t border-gray-800">
          <TouchableOpacity
            className={`py-4 rounded-lg items-center ${
              isLoading || (service.requiresInput && !inputValue.trim())
                ? "bg-gray-700"
                : "bg-plug-green"
            }`}
            onPress={handleRequestService}
            disabled={
              isLoading || (service.requiresInput && !inputValue.trim())
            }
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-white font-bold text-lg ml-2">
                  Processing...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                Request Service - ${estimatedCost.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ServiceDetailsModal;
