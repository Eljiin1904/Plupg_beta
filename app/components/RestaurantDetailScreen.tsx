import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star, ShoppingBag, X } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RestaurantProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  distance: string;
}

interface MenuCategory {
  id: string;
  title: string;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
}

interface RestaurantDetailScreenProps {
  restaurant: RestaurantProps;
  onClose: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
  cartCount: number;
}

const MenuItemCard = ({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="flex-row p-3 border-b border-gray-800"
      onPress={onPress}
    >
      <Image
        source={{ uri: item.thumbnail_url }}
        className="w-24 h-24 rounded-lg"
        contentFit="cover"
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-white font-bold text-base">{item.name}</Text>
        <Text className="text-gray-400 text-sm mt-1" numberOfLines={2}>
          {item.description}
        </Text>
        <Text className="text-white font-bold mt-2">
          ${item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RestaurantDetailScreen = ({
  restaurant,
  onClose,
  onSelectMenuItem,
  cartCount = 0,
}: RestaurantDetailScreenProps) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    { id: "cat1", title: "Popular Items" },
    { id: "cat2", title: "Burgers" },
    { id: "cat3", title: "Sides" },
    { id: "cat4", title: "Beverages" },
    { id: "cat5", title: "Desserts" },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "item1",
      category_id: "cat1",
      name: "Whopper Burger",
      description:
        "Our signature flame-grilled beef patty topped with tomatoes, lettuce, mayo, ketchup, pickles, and onions.",
      price: 7.99,
      thumbnail_url:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    },
    {
      id: "item2",
      category_id: "cat1",
      name: "Chicken Sandwich",
      description:
        "Crispy chicken fillet with fresh lettuce and creamy mayo on a toasted bun.",
      price: 6.99,
      thumbnail_url:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80",
    },
    {
      id: "item3",
      category_id: "cat2",
      name: "Double Cheeseburger",
      description:
        "Two flame-grilled beef patties with melted American cheese.",
      price: 8.99,
      thumbnail_url:
        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80",
    },
    {
      id: "item4",
      category_id: "cat3",
      name: "French Fries",
      description: "Golden crispy fries, perfectly salted.",
      price: 3.99,
      thumbnail_url:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80",
    },
    {
      id: "item5",
      category_id: "cat4",
      name: "Soft Drink",
      description: "Refreshing carbonated beverage.",
      price: 2.49,
      thumbnail_url:
        "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300&q=80",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("cat1");
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = 180;
  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="flex-row justify-between items-center px-4 py-2 bg-dark-card">
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <ShoppingBag size={20} color="#FFFFFF" />
          {cartCount > 0 && (
            <View className="bg-[#FF3008] rounded-full w-5 h-5 items-center justify-center absolute -top-1 -right-1">
              <Text className="text-white text-xs font-bold">{cartCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Animated.ScrollView
        className="flex-1"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {/* Hero Image with Parallax */}
        <Animated.View
          style={{
            height: headerHeight,
            transform: [{ scale: headerScale }],
            opacity: headerOpacity,
          }}
        >
          <Image
            source={{ uri: restaurant.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </Animated.View>

        {/* Restaurant Info */}
        <View className="p-4 bg-dark-card">
          <Text className="text-2xl font-bold text-white">
            {restaurant.name}
          </Text>

          <View className="flex-row items-center mt-1">
            <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded mr-2">
              <Star size={14} color="#FF3008" fill="#FF3008" />
              <Text className="ml-1 text-sm font-medium text-white">
                {restaurant.rating}
              </Text>
            </View>

            <Text className="text-gray-400 text-sm">
              {restaurant.deliveryTime} • {restaurant.deliveryFee}
            </Text>
          </View>

          <View className="flex-row flex-wrap mt-2">
            {restaurant.categories?.map((category, index) => (
              <Text key={index} className="text-gray-400 text-sm">
                {category}
                {index < restaurant.categories.length - 1 ? " • " : ""}
              </Text>
            )) || (
              <Text className="text-gray-400 text-sm">
                Fast Food • Burgers • American
              </Text>
            )}
          </View>
        </View>

        {/* Menu Categories */}
        <View className="bg-dark-card mt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-gray-800"
          >
            {menuCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-3 ${activeCategory === category.id ? "border-b-2 border-[#FF3008]" : ""}`}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  className={`font-medium ${activeCategory === category.id ? "text-[#FF3008]" : "text-white"}`}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items */}
          <View className="pb-20">
            {menuItems
              .filter((item) => item.category_id === activeCategory)
              .map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onPress={() => onSelectMenuItem(item)}
                />
              ))}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantDetailScreen;
