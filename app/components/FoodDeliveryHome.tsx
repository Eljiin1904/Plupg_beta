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
import MobileImageComponent from "./MobileImageComponent";
import CartModal, { CartItem } from "./CartModal";
import DeliveryDetailsModal, { DeliveryDetails } from "./DeliveryDetailsModal";
import OrderReviewModal from "./OrderReviewModal";
import PaymentModal from "./PaymentModal";
import OrderTrackingModal from "./OrderTrackingModal";
import ExploreScreen from "./ExploreScreen";
import OrdersScreen from "./OrdersScreen";

interface CategoryProps {
  id: string;
  name: string;
  image: string;
}

interface RestaurantProps {
  id: string;
  name: string;
  image: string | number; // Type allows for require() results
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  distance: string;
}

interface CategorySectionProps {
  id: string;
  title: string;
  items: RestaurantProps[];
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
      source={
        typeof restaurant.image === "string"
          ? { uri: restaurant.image }
          : restaurant.image
      }
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

// CORRECTED: Uses the fixed MobileImageComponent and has only one image tag.
const HorizontalRestaurantCard = ({
  restaurant,
  onPress,
}: {
  restaurant: RestaurantProps;
  onPress: (r: RestaurantProps) => void;
}) => (
  <TouchableOpacity
    className="mr-4 w-48 bg-dark-card rounded-lg overflow-hidden shadow-sm"
    onPress={() => onPress(restaurant)}
  >
    <MobileImageComponent
      source={
        typeof restaurant.image === "string"
          ? { uri: restaurant.image }
          : restaurant.image
      }
      className="w-full h-32"
      contentFit="cover"
    />
    <View className="p-3">
      <View className="flex-row justify-between items-center">
        <Text
          className="text-base font-bold text-white flex-1"
          numberOfLines={1}
        >
          {restaurant.name}
        </Text>
        {restaurant.rating && (
          <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded ml-2">
            <Star size={12} color="#4AFF00" fill="#4AFF00" />
            <Text className="ml-1 text-xs font-medium text-white">
              {restaurant.rating}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row flex-wrap mt-1">
        {restaurant.categories.map((cat, idx) => (
          <Text key={idx} className="text-gray-400 text-xs" numberOfLines={1}>
            {cat}
            {idx < restaurant.categories.length - 1 ? " • " : ""}
          </Text>
        ))}
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-gray-400">{restaurant.deliveryTime}</Text>
        <Text className="text-xs text-gray-400">
          {restaurant.deliveryFee} • {restaurant.distance}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CategorySection = ({
  section,
  onSelectRestaurant,
}: {
  section: CategorySectionProps;
  onSelectRestaurant: (r: RestaurantProps) => void;
}) => (
  <View className="mt-6">
    <Text className="text-lg font-bold mb-3 text-white px-4">
      {section.title}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pb-2"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {section.items.map((item) => (
        <HorizontalRestaurantCard
          key={item.id}
          restaurant={item}
          onPress={onSelectRestaurant}
        />
      ))}
    </ScrollView>
  </View>
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
  const [showOrders, setShowOrders] = useState(false);

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

  const categorySections: CategorySectionProps[] = [
    {
      id: "nearby-restaurants",
      title: "Nearby Restaurants",
      items: [
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
      ],
    },
    {
      id: "groceries-more",
      title: "Groceries & More",
      items: [
        {
          id: "5",
          name: "Publix",
          image: require("../../assets/publix1.png"),
          rating: 4.6,
          deliveryTime: "30-45 min",
          deliveryFee: "$3.99",
          categories: ["Groceries", "Pharmacy"],
          distance: "1.5 mi",
        },
        {
          id: "6",
          name: "Walgreens",
          image: require("../../assets/walgreens1.png"),
          rating: 4.1,
          deliveryTime: "20-35 min",
          deliveryFee: "$2.99",
          categories: ["Pharmacy", "Health"],
          distance: "0.9 mi",
        },
      ],
    },
    {
      id: "adult-beverages",
      title: "Adult Beverages",
      items: [
        {
          id: "7",
          name: "ABC Liquor",
          image: require("../../assets/abc1.png"),
          rating: 4.4,
          deliveryTime: "25-40 min",
          deliveryFee: "$4.99",
          categories: ["Liquor", "Wine", "Beer"],
          distance: "2.1 mi",
        },
        {
          id: "8",
          name: "Total Wine Liquor",
          image: require("../../assets/total-wine-and-more1.png"),
          rating: 4.7,
          deliveryTime: "30-50 min",
          deliveryFee: "$5.99",
          categories: ["Wine", "Spirits", "Beer"],
          distance: "3.2 mi",
        },
      ],
    },
    {
      id: "puff-puff-pass",
      title: "Puff, Puff, Pass",
      items: [
        {
          id: "9",
          name: "Anchored Cannabis",
          image: require("../../assets/anchor1.png"),
          rating: 4.8,
          deliveryTime: "45-60 min",
          deliveryFee: "$6.99",
          categories: ["Cannabis", "Edibles"],
          distance: "4.1 mi",
        },
        {
          id: "10",
          name: "Cookies",
          image: require("../../assets/cookies1.png"),
          rating: 4.9,
          deliveryTime: "40-55 min",
          deliveryFee: "$7.99",
          categories: ["Cannabis", "Premium"],
          distance: "3.8 mi",
        },
      ],
    },
  ];

  // Keep original restaurants array for backward compatibility
  const restaurants: RestaurantProps[] = categorySections.flatMap(
    (section) => section.items,
  );

  const handleSelectRestaurant = (r: RestaurantProps) => {
    setSelectedRestaurant(r);
    setShowRestaurantDetail(true);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "orders") {
      setShowOrders(true);
    } else {
      setCurrentTab(tab);
      setShowOrders(false);
    }
  };

  const handleViewRestaurant = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (restaurant) {
      handleSelectRestaurant(restaurant);
    }
    setShowOrders(false);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.item_id === itemId
          ? { ...item, quantity, total_price: item.unit_price * quantity }
          : item,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.item_id !== itemId));
  };

  const convertToCartItem = (
    item: MenuItem,
    quantity: number,
    selectedOptions: { [key: string]: string },
    selectedAddons: { [key: string]: boolean },
  ): CartItem => {
    const selected_options = Object.entries(selectedOptions).map(
      ([optionId, choiceId]) => {
        const option = item.options?.find((opt) => opt.id === optionId);
        const choice = option?.choices.find((ch) => ch.id === choiceId);
        return {
          option_id: optionId,
          choice_id: choiceId,
          name: choice?.name || "",
          price: choice?.price || 0,
        };
      },
    );

    const add_ons = Object.entries(selectedAddons)
      .filter(([_, selected]) => selected)
      .map(([addonId, _]) => {
        const addon = item.addons?.find((add) => add.id === addonId);
        return {
          addon_id: addonId,
          name: addon?.name || "",
          price: addon?.price || 0,
        };
      });

    const optionsTotal = selected_options.reduce(
      (sum, opt) => sum + opt.price,
      0,
    );
    const addonsTotal = add_ons.reduce((sum, addon) => sum + addon.price, 0);
    const unit_price = item.price + optionsTotal + addonsTotal;

    return {
      item_id: item.id,
      name: item.name,
      quantity,
      unit_price,
      total_price: unit_price * quantity,
      thumbnail_url: item.thumbnail_url,
      selected_options,
      add_ons,
    };
  };

  return (
    <>
      {currentTab === "explore" ? (
        <ExploreScreen
          onSwitchMode={onSwitchMode}
          onSelectRestaurant={(restaurantId) => {
            const restaurant = restaurants.find((r) => r.id === restaurantId);
            if (restaurant) {
              handleSelectRestaurant(restaurant);
            }
          }}
        />
      ) : showOrders ? (
        <OrdersScreen
          onAddToCart={(items) => {
            setShowCart(true);
          }}
          onViewRestaurant={handleViewRestaurant}
        />
      ) : (
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

            {/* Category Sections with Horizontal Scroll */}
            <View className="pb-20">
              {categorySections.map((section) => (
                <CategorySection
                  key={section.id}
                  section={section}
                  onSelectRestaurant={handleSelectRestaurant}
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
              onCartPress={() => setShowCart(true)}
            />
          )}

          {showMenuItemDetail && selectedMenuItem && (
            <MenuItemDetailModal
              visible={showMenuItemDetail}
              item={selectedMenuItem}
              onClose={() => setShowMenuItemDetail(false)}
              onAddToCart={(
                item,
                quantity,
                selectedOptions,
                selectedAddons,
              ) => {
                const cartItem = convertToCartItem(
                  item,
                  quantity,
                  selectedOptions,
                  selectedAddons,
                );
                setCartItems([...cartItems, cartItem]);
                setShowMenuItemDetail(false);
              }}
            />
          )}

          {showCart && (
            <CartModal
              visible={showCart}
              cartItems={cartItems}
              onClose={() => setShowCart(false)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={() => {
                setShowCart(false);
                setShowDeliveryDetails(true);
              }}
            />
          )}

          <BottomNavigation
            currentTab={showOrders ? "orders" : currentTab}
            onTabChange={handleTabChange}
          />

          {/* Floating Cart Button */}
          <TouchableOpacity
            className="absolute bottom-20 right-5 bg-plug-green p-4 rounded-full shadow-lg"
            onPress={() => setShowCart(true)}
          >
            <ShoppingBag size={24} color="#FFFFFF" />
            {cartItems.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-[#00E676] w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs">{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      )}

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
          onContinue={() => {
            setShowOrderReview(false);
            setShowPayment(true);
          }}
          onEditDeliveryDetails={() => {
            setShowOrderReview(false);
            setShowDeliveryDetails(true);
          }}
          cartItems={cartItems}
        />
      )}

      {showPayment && (
        <PaymentModal
          visible={showPayment}
          onClose={() => setShowPayment(false)}
          onPlaceOrder={() => {
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
