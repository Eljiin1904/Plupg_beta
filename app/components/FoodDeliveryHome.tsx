// FoodDeliveryHome.tsx

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  MapPin,
  ChevronRight,
  Star,
  Home,
  ShoppingBag,
  Compass,
  ClipboardList,
  User,
} from "lucide-react-native";

import TopHeader from "./TopHeader";
import RestaurantDetailScreen from "./RestaurantDetailScreen";
import MenuItemDetailModal, { MenuItem } from "./MenuItemDetailModal";
import CartModal, { CartItem } from "./CartModal";
import DeliveryDetailsModal, { DeliveryDetails } from "./DeliveryDetailsModal";
import OrderReviewModal from "./OrderReviewModal";
import PaymentModal from "./PaymentModal";
import OrderTrackingModal from "./OrderTrackingModal";

interface CategoryProps {
  id: string;
  name: string;
  image: string;
}

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

const CategoryCard = ({ category }: { category: CategoryProps }) => (
  <TouchableOpacity className="mr-4 w-24">
    <View className="rounded-lg overflow-hidden bg-dark-card">
      <Image
        source={{ uri: category.image }}
        className="w-24 h-24 rounded-lg"
        contentFit="cover"
      />
    </View>
    <Text className="text-center mt-1 font-medium text-sm text-white">
      {category.name}
    </Text>
  </TouchableOpacity>
);

const RestaurantCard = ({
  restaurant,
  onPress,
}: {
  restaurant: RestaurantProps;
  onPress: (r: RestaurantProps) => void;
}) => (
  <TouchableOpacity
    className="mb-4 bg-dark-card rounded-lg overflow-hidden shadow-sm"
    onPress={() => onPress(restaurant)}
  >
    <Image
      source={{ uri: restaurant.image }}
      className="w-full h-40"
      contentFit="cover"
    />
    <View className="p-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-white">{restaurant.name}</Text>
        <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded">
          <Star size={14} color="#4AFF00" fill="#4AFF00" />
          <Text className="ml-1 text-sm font-medium text-white">
            {restaurant.rating}
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap mt-1">
        {restaurant.categories.map((cat, idx) => (
          <Text key={idx} className="text-gray-400 text-sm">
            {cat}
            {idx < restaurant.categories.length - 1 ? " • " : ""}
          </Text>
        ))}
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-400">{restaurant.deliveryTime}</Text>
        <Text className="text-sm text-gray-400">
          {restaurant.deliveryFee} • {restaurant.distance}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({
  currentTab,
  onTabChange,
}: BottomNavigationProps) => (
  <View className="flex-row justify-around items-center py-3 bg-dark-card border-t border-gray-800">
    {[
      { key: "home", Icon: Home, label: "Home" },
      { key: "grocery", Icon: ShoppingBag, label: "Grocery" },
      { key: "explore", Icon: Compass, label: "Explore" },
      { key: "orders", Icon: ClipboardList, label: "Orders" },
      { key: "account", Icon: User, label: "Account" },
    ].map(({ key, Icon, label }) => (
      <TouchableOpacity
        key={key}
        className="items-center"
        onPress={() => onTabChange(key)}
      >
        <Icon size={24} color={currentTab === key ? "#4AFF00" : "#FFFFFF"} />
        <Text
          className={`text-xs mt-1 ${
            currentTab === key ? "text-plug-green" : "text-white"
          } font-medium`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

interface FoodDeliveryHomeProps {
  onSwitchMode?: () => void;
  onToggleMode?: () => void;
  onNavigateToLanding?: () => void;
}

const FoodDeliveryHome = ({
  onSwitchMode = () => console.log("Switch mode"),
  onToggleMode = () => console.log("Toggle mode"),
  onNavigateToLanding = () => console.log("Navigate to landing"),
}: FoodDeliveryHomeProps) => {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [destination, setDestination] = useState<string>("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantProps | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false);
  const [showMenuItemDetail, setShowMenuItemDetail] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // ─────── mock data ───────
  const categories: CategoryProps[] = [
    {
      id: "1",
      name: "Fast Food",
      image:
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&q=80",
    },
    {
      id: "2",
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80",
    },
    {
      id: "3",
      name: "Sushi",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80",
    },
    {
      id: "4",
      name: "Mexican",
      image:
        "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&q=80",
    },
    {
      id: "5",
      name: "Dessert",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80",
    },
    {
      id: "6",
      name: "Healthy",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
    },
  ];

  const restaurants: RestaurantProps[] = [
    {
      id: "1",
      name: "Burger King",
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80",
      rating: 4.5,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
      categories: ["Fast Food", "Burgers"],
      distance: "1.2 mi",
    },
    {
      id: "2",
      name: "Pizza Hut",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
      rating: 4.2,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.99",
      categories: ["Pizza", "Italian"],
      distance: "2.5 mi",
    },
    {
      id: "3",
      name: "Chipotle",
      image:
        "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400&q=80",
      rating: 4.7,
      deliveryTime: "10-20 min",
      deliveryFee: "$0.99",
      categories: ["Mexican", "Healthy"],
      distance: "0.8 mi",
    },
    {
      id: "4",
      name: "Starbucks",
      image:
        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=400&q=80",
      rating: 4.3,
      deliveryTime: "5-15 min",
      deliveryFee: "$1.49",
      categories: ["Coffee", "Breakfast"],
      distance: "0.5 mi",
    },
  ];

  const handleSelectRestaurant = (r: RestaurantProps) => {
    setSelectedRestaurant(r);
    setShowRestaurantDetail(true);
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-dark-bg">
        <TopHeader
          mode="food"
          onModeToggle={(mode) => {
            if (mode === "ride") onSwitchMode();
          }}
          location="123 Main Street"
          onSearchFocus={() => console.log("Search focused")}
          onSearchSubmit={(text) => setDestination(text)}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Location Bar */}
          <TouchableOpacity className="flex-row items-center px-4 py-3 bg-dark-card">
            <MapPin size={18} color="#4AFF00" />
            <View className="flex-1 ml-2">
              <Text className="text-sm font-medium text-white">
                Delivery to
              </Text>
              <Text className="text-base font-bold text-white">
                123 Main Street
              </Text>
            </View>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Categories */}
          <View className="mt-4 px-4">
            <Text className="text-lg font-bold mb-3 text-white">
              Categories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pb-2"
            >
              {categories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </ScrollView>
          </View>

          {/* Featured Promotion */}
          <TouchableOpacity className="mt-4 mx-4 rounded-lg overflow-hidden">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
              }}
              className="w-full h-40 rounded-lg"
              contentFit="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
              <Text className="text-white text-xl font-bold">
                50% OFF Your First Order
              </Text>
              <Text className="text-white">Use code: PLUG50</Text>
            </View>
          </TouchableOpacity>

          {/* Nearby Restaurants */}
          <View className="mt-6 px-4 pb-20">
            <Text className="text-lg font-bold mb-3 text-white">
              Nearby Restaurants
            </Text>
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                onPress={handleSelectRestaurant}
              />
            ))}
          </View>
        </ScrollView>

        {/* Detail & Modals */}
        {showRestaurantDetail && selectedRestaurant && (
          <RestaurantDetailScreen
            restaurant={selectedRestaurant}
            onClose={() => setShowRestaurantDetail(false)}
            onSelectMenuItem={(item) => {
              setSelectedMenuItem(item);
              setShowMenuItemDetail(true);
            }}
            cartCount={cartItems.length}
          />
        )}

        {showMenuItemDetail && selectedMenuItem && (
          <MenuItemDetailModal
            visible={showMenuItemDetail}
            item={selectedMenuItem}
            onClose={() => setShowMenuItemDetail(false)}
            onAddToCart={(newItem) => {
              setCartItems([...cartItems, newItem]);
              setShowMenuItemDetail(false);
            }}
          />
        )}

        {showCart && (
          <CartModal
            visible={showCart}
            items={cartItems}
            onClose={() => setShowCart(false)}
            onCheckout={() => {
              setShowCart(false);
              setShowDeliveryDetails(true);
            }}
          />
        )}

        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Floating Cart Button */}
        <TouchableOpacity
          className="absolute bottom-20 right-5 bg-plug-green p-4 rounded-full shadow-lg"
          onPress={() => setShowCart(true)}
        >
          <ShoppingBag size={24} color="#FFFFFF" />
          {cartItems.length > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs">{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Other Modals */}
      {showDeliveryDetails && (
        <DeliveryDetailsModal
          visible={showDeliveryDetails}
          onClose={() => setShowDeliveryDetails(false)}
          onContinue={() => {
            setShowDeliveryDetails(false);
            setShowOrderReview(true);
          }}
        />
      )}

      {showOrderReview && (
        <OrderReviewModal
          visible={showOrderReview}
          onClose={() => setShowOrderReview(false)}
          onConfirm={() => {
            setShowOrderReview(false);
            setShowPayment(true);
          }}
        />
      )}

      {showPayment && (
        <PaymentModal
          visible={showPayment}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={() => {
            setShowPayment(false);
            setShowOrderTracking(true);
          }}
        />
      )}

      {showOrderTracking && (
        <OrderTrackingModal
          visible={showOrderTracking}
          onClose={() => setShowOrderTracking(false)}
          restaurantName={selectedRestaurant?.name || "Restaurant"}
        />
      )}
    </>
  );
};

export default FoodDeliveryHome;
