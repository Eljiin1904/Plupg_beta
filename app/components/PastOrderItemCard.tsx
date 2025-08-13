import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { PastItem } from "../api/ordersApi";

interface PastOrderItemCardProps {
  item: PastItem;
  onAddToCart: (
    itemId: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const PastOrderItemCard = ({ item, onAddToCart }: PastOrderItemCardProps) => {
  const handleAddToCart = async () => {
    if (!item.isAvailable) {
      Alert.alert(
        "Item Unavailable",
        "This item is currently not available at the restaurant.",
      );
      return;
    }

    try {
      const result = await onAddToCart(item.itemId);
      if (result.success) {
        Alert.alert("Success", "Item added to cart!");
      } else {
        Alert.alert("Error", result.message || "Failed to add item to cart");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  return (
    <View className="flex-row p-3 bg-dark-card rounded-lg mb-3">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-20 h-20 rounded-lg"
        contentFit="cover"
      />

      <View className="flex-1 ml-3 justify-center">
        <Text className="text-white font-bold text-base">{item.name}</Text>
        <Text className="text-gray-400 text-sm mt-1">
          {item.restaurantName}
        </Text>
        <Text className="text-white font-bold mt-1">
          ${item.price.toFixed(2)}
        </Text>

        {!item.isAvailable && (
          <Text className="text-red-500 text-xs mt-1">
            Currently unavailable
          </Text>
        )}
      </View>

      <TouchableOpacity
        className={`w-10 h-10 rounded-full items-center justify-center ${
          item.isAvailable ? "bg-[#00E676]" : "bg-gray-600"
        }`}
        onPress={handleAddToCart}
        disabled={!item.isAvailable}
      >
        <Plus size={20} color={item.isAvailable ? "#FFFFFF" : "#999999"} />
      </TouchableOpacity>
    </View>
  );
};

export default PastOrderItemCard;
