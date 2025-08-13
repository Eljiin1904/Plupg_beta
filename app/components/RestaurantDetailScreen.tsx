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
import { SafeAreaView } from "react-native-safe-area-context";
import { Star, ShoppingBag, X } from "lucide-react-native";
import MobileImageComponent from "./MobileImageComponent";

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

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  options?: MenuItemOption[];
  addons?: MenuItemAddon[];
}

interface RestaurantDetailScreenProps {
  restaurant: RestaurantProps;
  onClose: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
  cartCount: number;
  onCartPress?: () => void;
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
      <MobileImageComponent
        source={{ uri: item.thumbnail_url }}
        className="w-24 h-24 rounded-lg"
        style={{ width: 96, height: 96, minHeight: 96 }}
        contentFit="cover"
        fallbackSource={require("../../assets/carrental.png")}
        cachePolicy="memory-disk"
        transition={200}
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
  onCartPress,
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
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { id: "regular", name: "Regular", price: 0 },
            { id: "large", name: "Large", price: 1.5 },
          ],
        },
      ],
      addons: [
        { id: "cheese", name: "Extra Cheese", price: 0.99 },
        { id: "bacon", name: "Bacon", price: 1.99 },
        { id: "onions", name: "Extra Onions", price: 0.5 },
        { id: "pickles", name: "Extra Pickles", price: 0.5 },
      ],
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
      options: [
        {
          id: "spice",
          name: "Spice Level",
          required: false,
          choices: [
            { id: "mild", name: "Mild", price: 0 },
            { id: "spicy", name: "Spicy", price: 0 },
          ],
        },
      ],
      addons: [
        { id: "cheese", name: "Cheese", price: 0.99 },
        { id: "lettuce", name: "Extra Lettuce", price: 0.5 },
        { id: "tomato", name: "Tomato", price: 0.5 },
      ],
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
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { id: "regular", name: "Regular", price: 0 },
            { id: "large", name: "Large", price: 1.5 },
          ],
        },
      ],
      addons: [
        { id: "extra_cheese", name: "Extra Cheese", price: 0.99 },
        { id: "bacon", name: "Bacon", price: 1.99 },
        { id: "mushrooms", name: "Mushrooms", price: 1.5 },
        { id: "onions", name: "Grilled Onions", price: 0.75 },
      ],
    },
    {
      id: "item4",
      category_id: "cat3",
      name: "French Fries",
      description: "Golden crispy fries, perfectly salted.",
      price: 3.99,
      thumbnail_url:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80",
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { id: "small", name: "Small", price: 0 },
            { id: "medium", name: "Medium", price: 1.0 },
            { id: "large", name: "Large", price: 2.0 },
          ],
        },
      ],
      addons: [
        { id: "cheese_sauce", name: "Cheese Sauce", price: 1.25 },
        { id: "ranch", name: "Ranch Dip", price: 0.75 },
        { id: "ketchup", name: "Extra Ketchup", price: 0.25 },
      ],
    },
    {
      id: "item5",
      category_id: "cat4",
      name: "Soft Drink",
      description: "Refreshing carbonated beverage.",
      price: 2.49,
      thumbnail_url:
        "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300&q=80",
      options: [
        {
          id: "size",
          name: "Size",
          required: true,
          choices: [
            { id: "small", name: "Small (16oz)", price: 0 },
            { id: "medium", name: "Medium (20oz)", price: 0.5 },
            { id: "large", name: "Large (32oz)", price: 1.0 },
          ],
        },
        {
          id: "flavor",
          name: "Flavor",
          required: true,
          choices: [
            { id: "coke", name: "Coca-Cola", price: 0 },
            { id: "pepsi", name: "Pepsi", price: 0 },
            { id: "sprite", name: "Sprite", price: 0 },
            { id: "orange", name: "Orange Soda", price: 0 },
          ],
        },
      ],
      addons: [
        { id: "ice", name: "Extra Ice", price: 0 },
        { id: "lemon", name: "Lemon Slice", price: 0.25 },
      ],
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
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "#121212",
      }}
    >
      {/* Fixed Header - Absolutely positioned above hero image */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: "rgba(30,30,30,0.95)",
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCartPress && onCartPress()}
          style={{ marginLeft: 12 }}
        >
          <View>
            <ShoppingBag size={28} color="#FFFFFF" />
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "#00E676",
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}
                >
                  {cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        className="flex-1"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with Parallax */}
        <Animated.View
          style={{
            height: headerHeight,
            transform: [{ scale: headerScale }],
            opacity: headerOpacity,
          }}
        >
          <MobileImageComponent
            source={{ uri: restaurant.image }}
            style={{ width: "100%", height: "100%", minHeight: headerHeight }}
            contentFit="cover"
            fallbackSource={require("../../assets/carrental.png")}
            cachePolicy="memory-disk"
            priority="high"
            transition={200}
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
              <Star size={14} color="#00E676" fill="#00E676" />
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

        {/* Menu Categories - Sticky Header */}
        <View className="bg-dark-card sticky top-0 z-10">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-gray-800"
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {menuCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-3 mr-2 ${activeCategory === category.id ? "border-b-2 border-[#00E676]" : ""}`}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  className={`font-medium ${activeCategory === category.id ? "text-[#00E676]" : "text-white"}`}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items - Full Screen List */}
        <View className="bg-dark-card flex-1 min-h-screen">
          {menuCategories.map((category) => (
            <View
              key={category.id}
              className={activeCategory === category.id ? "block" : "hidden"}
            >
              <Text className="text-xl font-bold text-white p-4 pb-2">
                {category.title}
              </Text>
              {menuItems
                .filter((item) => item.category_id === category.id)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onPress={() => onSelectMenuItem(item)}
                  />
                ))}
            </View>
          ))}

          {/* Bottom padding for safe scrolling */}
          <View className="h-32" />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default RestaurantDetailScreen;
