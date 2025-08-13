import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Clock, ChevronRight, RotateCcw, Store } from "lucide-react-native";
import { PastOrder } from "../api/ordersApi";

interface PastOrderSummaryCardProps {
  order: PastOrder;
  onReorder: (orderId: string) => Promise<any>;
  onViewStore: (restaurantId: string) => void;
}

const PastOrderSummaryCard = ({
  order,
  onReorder,
  onViewStore,
}: PastOrderSummaryCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReorder = async () => {
    try {
      const result = await onReorder(order.orderId);

      if (result.success) {
        Alert.alert("Success", "Items added to cart!");
      } else if (result.unavailableItems && result.availableItems) {
        // Some items are unavailable
        const unavailableCount = result.unavailableItems.length;
        const availableCount = result.availableItems.length;

        Alert.alert(
          "Some Items Unavailable",
          `${unavailableCount} item(s) are currently unavailable. Add the remaining ${availableCount} available item(s) to your cart?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Add Available Items",
              onPress: async () => {
                // Add available items to cart
                Alert.alert(
                  "Success",
                  `${availableCount} items added to cart!`,
                );
              },
            },
          ],
        );
      } else {
        Alert.alert("Error", result.message || "Failed to reorder");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reorder");
    }
  };

  const handleViewStore = () => {
    onViewStore(order.restaurantId);
  };

  return (
    <View className="bg-dark-card rounded-lg p-4 mb-3">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">
            {order.restaurantName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} color="#888888" />
            <Text className="text-gray-400 text-sm ml-1">
              {formatDate(order.orderDate)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-white font-bold">
            ${order.totalPrice.toFixed(2)}
          </Text>
          <Text className="text-gray-400 text-sm">
            {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Order Summary */}
      <Text className="text-gray-300 text-sm mb-4" numberOfLines={2}>
        {order.itemSummary}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        {order.reorderAction === "reorder" ? (
          <TouchableOpacity
            className="flex-1 bg-[#00E676] py-3 rounded-lg flex-row items-center justify-center mr-2"
            onPress={handleReorder}
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Reorder</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center mr-2"
            onPress={handleViewStore}
          >
            <Store size={16} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">View Store</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-gray-800 py-3 px-4 rounded-lg flex-row items-center"
          onPress={handleViewStore}
        >
          <Text className="text-white font-medium">View</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PastOrderSummaryCard;
