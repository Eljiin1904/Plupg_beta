import React, { useState } from "react";
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
import { X, CreditCard, Check } from "lucide-react-native";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
}

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPlaceOrder: () => void;
  total?: number;
}

const PaymentModal = ({
  visible,
  onClose,
  onPlaceOrder,
  total = 0,
}: PaymentModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      type: "Visa",
      last4: "4242",
      expiry: "04/25",
    },
    {
      id: "pm_2",
      type: "Mastercard",
      last4: "5555",
      expiry: "05/26",
    },
  ];

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "PLUG10") {
      const discount = total * 0.1; // 10% discount
      setPromoDiscount(discount);
      setPromoApplied(true);
      Alert.alert("Success", "Promo code applied successfully!");
    } else {
      Alert.alert("Error", "Invalid promo code");
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPlaceOrder();
    }, 2000);
  };

  const finalTotal = promoApplied ? total - promoDiscount : total;

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
          <Text className="text-xl font-bold text-white">Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Payment Methods */}
          <Text className="text-white font-bold text-lg mb-3">
            Select Payment Method
          </Text>

          <View className="bg-dark-card rounded-lg overflow-hidden mb-6">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row justify-between items-center p-4 border-b border-gray-700`}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View className="flex-row items-center">
                  <CreditCard size={24} color="#FFFFFF" />
                  <View className="ml-3">
                    <Text className="text-white font-medium">
                      {method.type} •••• {method.last4}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Expires {method.expiry}
                    </Text>
                  </View>
                </View>
                {selectedPaymentMethod === method.id && (
                  <View className="h-6 w-6 rounded-full bg-[#00E676] items-center justify-center">
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() =>
                Alert.alert(
                  "Info",
                  "Add new payment method functionality would go here",
                )
              }
            >
              <View className="h-6 w-6 rounded-full border border-[#00E676] items-center justify-center mr-3">
                <Text className="text-[#00E676] font-bold">+</Text>
              </View>
              <Text className="text-[#00E676] font-medium">
                Add New Payment Method
              </Text>
            </TouchableOpacity>
          </View>

          {/* Promo Code */}
          <Text className="text-white font-bold mb-2">Promo Code</Text>
          <View className="flex-row mb-6">
            <TextInput
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg"
              placeholder="Enter promo code"
              placeholderTextColor="#999"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
            />
            <TouchableOpacity
              className={`px-4 justify-center rounded-r-lg ${promoApplied ? "bg-green-600" : "bg-[#00E676]"}}`}
              onPress={handleApplyPromo}
              disabled={promoApplied}
            >
              {promoApplied ? (
                <Check size={20} color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold">Apply</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Order Total */}
          <View className="bg-dark-card p-4 rounded-lg mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">Order Total</Text>
              <Text className="text-white">${total.toFixed(2)}</Text>
            </View>
            {promoApplied && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-green-500">Promo Discount</Text>
                <Text className="text-green-500">
                  -${promoDiscount.toFixed(2)}
                </Text>
              </View>
            )}
            {promoApplied && (
              <View className="flex-row justify-between pt-2 border-t border-gray-700">
                <Text className="text-white font-bold">Final Total</Text>
                <Text className="text-white font-bold">
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View className="p-4 border-t border-gray-800">
          <TouchableOpacity
            className={`py-3 rounded-lg items-center ${isProcessing || !selectedPaymentMethod ? "bg-gray-700" : "bg-[#00E676]"}}`}
            onPress={handlePlaceOrder}
            disabled={isProcessing || !selectedPaymentMethod}
          >
            {isProcessing ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-white font-bold text-lg ml-2">
                  Processing...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                Place Order - ${finalTotal.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PaymentModal;
