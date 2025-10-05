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
import MobileImageComponent from "./MobileImageComponent";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Check,
} from "lucide-react-native";

export interface CartItem {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  thumbnail_url?: string;
  selected_options: {
    option_id: string;
    choice_id: string;
    name: string;
    price: number;
  }[];
  add_ons: {
    addon_id: string;
    name: string;
    price: number;
  }[];
}

interface CartModalProps {
  visible: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const CartModal = ({
  visible,
  cartItems = [],
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartModalProps) => {
  const [tipPercentage, setTipPercentage] = useState<number | null>(15);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  // Calculate taxes (assume 8%)
  const taxRate = 0.08;
  const taxes = subtotal * taxRate;

  // Delivery fee
  const deliveryFee = 2.99;

  // Calculate tip
  const tipAmount = tipPercentage ? (subtotal * tipPercentage) / 100 : 0;

  // Calculate discount if promo applied
  const discount = promoApplied ? 5 : 0;

  // Calculate total
  const total = subtotal + taxes + deliveryFee + tipAmount - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "PLUG50") {
      setPromoApplied(true);
      Alert.alert("Success", "Promo code applied successfully!");
    } else {
      Alert.alert("Error", "Invalid promo code");
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => onRemoveItem(itemId),
          style: "destructive",
        },
      ],
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before checkout",
      );
      return;
    }
    onCheckout();
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
          <Text className="text-xl font-bold text-white">Your Cart</Text>
          <View style={{ width: 24 }} />
        </View>

        {cartItems.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-white text-lg mb-4">Your cart is empty</Text>
            <TouchableOpacity
              className="bg-[#00E676] py-3 px-6 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-white font-bold">Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView className="flex-1">
              {/* Cart Items */}
              <View className="p-4">
                {cartItems.map((item) => (
                  <View
                    key={item.item_id}
                    className="flex-row mb-4 pb-4 border-b border-gray-800"
                  >
                    {item.thumbnail_url && (
                      <MobileImageComponent
                        source={{ uri: item.thumbnail_url }}
                        className="w-20 h-20 rounded-lg"
                        style={{ width: 80, height: 80 }}
                        contentFit="cover"
                        showLoadingIndicator={true}
                      />
                    )}
                    <View className="flex-1 ml-3">
                      <View className="flex-row justify-between">
                        <Text className="text-white font-bold">
                          {item.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item.item_id)}
                        >
                          <Trash2 size={18} color="#00E676" />
                        </TouchableOpacity>
                      </View>

                      {/* Options and Add-ons */}
                      {item.selected_options.map((option, index) => (
                        <Text
                          key={`option-${index}`}
                          className="text-gray-400 text-sm"
                        >
                          {option.name}
                          {option.price > 0 &&
                            ` (+$${option.price.toFixed(2)})`}
                        </Text>
                      ))}

                      {item.add_ons.map((addon, index) => (
                        <Text
                          key={`addon-${index}`}
                          className="text-gray-400 text-sm"
                        >
                          {addon.name} (+${addon.price.toFixed(2)})
                        </Text>
                      ))}

                      {/* Quantity controls */}
                      <View className="flex-row items-center mt-2">
                        <TouchableOpacity
                          className="bg-gray-800 w-8 h-8 rounded-full items-center justify-center"
                          onPress={() =>
                            onUpdateQuantity(
                              item.item_id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                        >
                          <Minus size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white mx-3">{item.quantity}</Text>
                        <TouchableOpacity
                          className="bg-gray-800 w-8 h-8 rounded-full items-center justify-center"
                          onPress={() =>
                            onUpdateQuantity(item.item_id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white ml-auto font-bold">
                          ${item.total_price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Promo Code */}
              <View className="p-4 bg-dark-card mb-4">
                <Text className="text-white font-bold mb-2">Promo Code</Text>
                <View className="flex-row">
                  <TextInput
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg"
                    placeholder="Enter promo code"
                    placeholderTextColor="#999"
                    value={promoCode}
                    onChangeText={setPromoCode}
                  />
                  <TouchableOpacity
                    className="bg-[#00E676] px-4 justify-center rounded-r-lg"
                    onPress={handleApplyPromo}
                  >
                    <Text className="text-white font-bold">Apply</Text>
                  </TouchableOpacity>
                </View>
                {promoApplied && (
                  <View className="flex-row items-center mt-2">
                    <Check size={16} color="#4CAF50" />
                    <Text className="text-green-500 ml-1">
                      Promo code applied: $5.00 off
                    </Text>
                  </View>
                )}
              </View>

              {/* Tip Selection */}
              <View className="p-4 bg-dark-card mb-4">
                <Text className="text-white font-bold mb-2">Add a Tip</Text>
                <View className="flex-row justify-between">
                  {[0, 10, 15, 20, 25].map((percentage) => (
                    <TouchableOpacity
                      key={`tip-${percentage}`}
                      className={`py-2 px-4 rounded-lg ${tipPercentage === percentage ? "bg-[#00E676]" : "bg-gray-800"}`}
                      onPress={() => setTipPercentage(percentage)}
                    >
                      <Text
                        className={`text-white font-medium ${tipPercentage === percentage ? "font-bold" : ""}`}
                      >
                        {percentage === 0 ? "No Tip" : `${percentage}%`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
                  <Text className="text-white">${taxes.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-400">Delivery Fee</Text>
                  <Text className="text-white">${deliveryFee.toFixed(2)}</Text>
                </View>
                {tipAmount > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400">Tip</Text>
                    <Text className="text-white">${tipAmount.toFixed(2)}</Text>
                  </View>
                )}
                {discount > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400">Discount</Text>
                    <Text className="text-green-500">
                      -${discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View className="border-t border-gray-800 my-2" />
                <View className="flex-row justify-between">
                  <Text className="text-white font-bold">Total</Text>
                  <Text className="text-white font-bold">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Checkout Button */}
            <View className="p-4 border-t border-gray-800">
              <TouchableOpacity
                className="bg-[#00E676] py-3 rounded-lg items-center"
                onPress={handleCheckout}
              >
                <Text className="text-white font-bold text-lg">
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default CartModal;
