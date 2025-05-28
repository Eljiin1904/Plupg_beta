import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Image } from "expo-image";
import { Plus, Minus, Check } from "lucide-react-native";

export interface MenuItemOption {
  id: string;
  name: string;
  required: boolean;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  options?: MenuItemOption[];
  addons?: MenuItemAddon[];
}

interface MenuItemDetailModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    options: { [key: string]: string },
    addons: { [key: string]: boolean },
  ) => void;
}

const MenuItemDetailModal = ({
  visible,
  item,
  onClose,
  onAddToCart,
}: MenuItemDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: boolean;
  }>({});
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  // Reset state when modal opens with new item
  React.useEffect(() => {
    if (visible && item) {
      setQuantity(1);
      setSelectedAddons({});
      setAddToCartSuccess(false);

      // Initialize default selections for required options
      if (item.options) {
        const defaultOptions: { [key: string]: string } = {};
        item.options.forEach((option) => {
          if (option.required && option.choices.length > 0) {
            defaultOptions[option.id] = option.choices[0].id;
          }
        });
        setSelectedOptions(defaultOptions);
      } else {
        setSelectedOptions({});
      }
    }
  }, [visible, item]);

  if (!item) return null;

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = item.price * quantity;

    // Add option prices
    if (item.options) {
      item.options.forEach((option) => {
        const selectedChoiceId = selectedOptions[option.id];
        if (selectedChoiceId) {
          const choice = option.choices.find((c) => c.id === selectedChoiceId);
          if (choice) {
            total += choice.price * quantity;
          }
        }
      });
    }

    // Add addon prices
    if (item.addons) {
      item.addons.forEach((addon) => {
        if (selectedAddons[addon.id]) {
          total += addon.price * quantity;
        }
      });
    }

    return total;
  };

  // Check if all required options are selected
  const areRequiredOptionsSelected = () => {
    if (!item.options) return true;

    return item.options
      .filter((option) => option.required)
      .every((option) => selectedOptions[option.id]);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedOptions, selectedAddons);
    setAddToCartSuccess(true);

    // Close modal after delay
    setTimeout(() => {
      setAddToCartSuccess(false);
      onClose();
    }, 1000);
  };

  const totalPrice = calculateTotalPrice();
  const canAddToCart = areRequiredOptionsSelected();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-40 justify-end">
        <View className="bg-dark-card rounded-t-xl max-h-[80%]">
          {/* Drag handle */}
          <View className="items-center pt-2 pb-4">
            <View className="w-10 h-1 bg-gray-500 rounded-full" />
          </View>

          <ScrollView className="px-4 pb-24">
            {/* Item image */}
            <Image
              source={{ uri: item.thumbnail_url }}
              className="w-full h-48 rounded-lg"
              contentFit="cover"
            />

            {/* Item details */}
            <Text className="text-xl font-bold text-white mt-4">
              {item.name}
            </Text>
            <Text className="text-gray-400 mt-1">{item.description}</Text>
            <Text className="text-white font-bold text-lg mt-2">
              ${item.price.toFixed(2)}
            </Text>

            {/* Options */}
            {item.options &&
              item.options.map((option) => (
                <View key={option.id} className="mt-6">
                  <Text className="text-white font-bold mb-2">
                    {option.name}{" "}
                    {option.required && (
                      <Text className="text-[#FF3008]">*</Text>
                    )}
                  </Text>

                  {!selectedOptions[option.id] && option.required && (
                    <Text className="text-[#FF3008] text-sm mb-2">
                      Please select an option
                    </Text>
                  )}

                  {option.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice.id}
                      className={`flex-row justify-between items-center p-3 border border-gray-700 rounded-lg mb-2 ${selectedOptions[option.id] === choice.id ? "bg-gray-700" : ""}`}
                      onPress={() =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.id]: choice.id,
                        })
                      }
                    >
                      <Text className="text-white">{choice.name}</Text>
                      {choice.price > 0 && (
                        <Text className="text-white">
                          +${choice.price.toFixed(2)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

            {/* Add-ons */}
            {item.addons && item.addons.length > 0 && (
              <View className="mt-6">
                <Text className="text-white font-bold mb-2">Add-ons</Text>

                {item.addons.map((addon) => (
                  <TouchableOpacity
                    key={addon.id}
                    className={`flex-row justify-between items-center p-3 border border-gray-700 rounded-lg mb-2 ${selectedAddons[addon.id] ? "bg-gray-700" : ""}`}
                    onPress={() =>
                      setSelectedAddons({
                        ...selectedAddons,
                        [addon.id]: !selectedAddons[addon.id],
                      })
                    }
                  >
                    <Text className="text-white">{addon.name}</Text>
                    <Text className="text-white">
                      +${addon.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Quantity */}
            <View className="mt-6">
              <Text className="text-white font-bold mb-2">Quantity</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="bg-gray-700 w-10 h-10 rounded-full items-center justify-center"
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  <Minus size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold mx-4">
                  {quantity}
                </Text>
                <TouchableOpacity
                  className="bg-gray-700 w-10 h-10 rounded-full items-center justify-center"
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-dark-card border-t border-gray-800">
            {addToCartSuccess ? (
              <TouchableOpacity className="bg-green-600 py-3 px-4 rounded-lg flex-row justify-center items-center">
                <Check size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Added to Cart</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg flex-row justify-center items-center ${canAddToCart ? "bg-[#FF3008]" : "bg-gray-700"}`}
                onPress={canAddToCart ? handleAddToCart : undefined}
                disabled={!canAddToCart}
              >
                <Text className="text-white font-bold">
                  Add to Cart - ${totalPrice.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MenuItemDetailModal;
