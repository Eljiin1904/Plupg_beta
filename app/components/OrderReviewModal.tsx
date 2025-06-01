// OrderReviewModal.tsx
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Edit,
} from "lucide-react-native";
import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartItem } from "./CartModal";
import { DeliveryDetails } from "./DeliveryDetailsModal";

interface OrderReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  onEditDeliveryDetails: () => void;
  cartItems?: CartItem[];
  deliveryDetails?: DeliveryDetails;
  /** you may still pass these in if you want custom values… */
  tax?: number;
  deliveryFee?: number;
  tip?: number;
  discount?: number;
  total?: number;
}

const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  visible,
  onClose,
  onContinue,
  onEditDeliveryDetails,
  cartItems = [],
  deliveryDetails,
  tax = 0,
  deliveryFee = 0,
  tip = 0,
  discount = 0,
  // if total isn't passed, compute it from the below
  total,
}) => {
  // compute subtotal from cartItems
  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  // compute total if user didn't supply one
  const computedTotal =
    typeof total === "number"
      ? total
      : subtotal + tax + deliveryFee + tip - discount;

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
          <Text className="text-xl font-bold text-white">Order Review</Text>
          <View style={{ width: 24 /* placeholder for centering */ }} />
        </View>

        <ScrollView className="flex-1">
          {/* Delivery Details Section */}
          <View className="p-4 bg-dark-card mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white font-bold text-lg">
                Delivery Details
              </Text>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={onEditDeliveryDetails}
              >
                <Edit size={16} color="#FF3008" />
                <Text className="text-[#FF3008] ml-1">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-start mb-2">
              <MapPin size={18} color="#FF3008" />
              <Text className="text-white ml-2 flex-1">
                {deliveryDetails?.address || "123 Main Street"}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Clock size={18} color="#FF3008" />
              <Text className="text-white ml-2">
                {deliveryDetails?.deliveryTime || "ASAP"}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Phone size={18} color="#FF3008" />
              <Text className="text-white ml-2">
                {deliveryDetails?.phone || "(555) 123-4567"}
              </Text>
            </View>

            {deliveryDetails?.instructions && (
              <View className="flex-row items-start">
                <MessageSquare size={18} color="#FF3008" />
                <Text className="text-white ml-2 flex-1">
                  {deliveryDetails.instructions}
                </Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View className="p-4 bg-dark-card mb-4">
            <Text className="text-white font-bold text-lg mb-3">
              Order Items
            </Text>
            {cartItems.map((item) => (
              <View
                key={item.item_id}
                className="flex-row justify-between mb-3 pb-3 border-b border-gray-800"
              >
                <View className="flex-1">
                  <Text className="text-white font-medium">
                    {item.quantity}× {item.name}
                  </Text>
                  {item.selected_options.map((option, i) => (
                    <Text key={`opt-${i}`} className="text-gray-400 text-sm">
                      {option.name}
                    </Text>
                  ))}
                  {item.add_ons.map((addon, i) => (
                    <Text key={`add-${i}`} className="text-gray-400 text-sm">
                      {addon.name}
                    </Text>
                  ))}
                </View>
                <Text className="text-white">
                  ${item.total_price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Order Summary */}
          <View className="p-4 bg-dark-card">
            <Text className="text-white font-bold text-lg mb-3">
              Order Summary
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-white">${subtotal.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Tax</Text>
              <Text className="text-white">${tax.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Delivery Fee</Text>
              <Text className="text-white">${deliveryFee.toFixed(2)}</Text>
            </View>

            {tip > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Tip</Text>
                <Text className="text-white">${tip.toFixed(2)}</Text>
              </View>
            )}

            {discount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Discount</Text>
                <Text className="text-green-500">-${discount.toFixed(2)}</Text>
              </View>
            )}

            <View className="border-t border-gray-800 my-2" />

            <View className="flex-row justify-between">
              <Text className="text-white font-bold">Total</Text>
              <Text className="text-white font-bold">
                ${computedTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View className="p-4 border-t border-gray-800">
          <TouchableOpacity
            className="bg-[#FF3008] py-3 rounded-lg items-center"
            onPress={onContinue}
          >
            <Text className="text-white font-bold text-lg">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OrderReviewModal;
