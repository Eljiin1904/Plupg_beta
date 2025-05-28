import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import {
  MapPin,
  Search,
  ChevronRight,
  Star,
  Home,
  ShoppingBag,
  Heart,
  User,
  Plus,
  Minus,
  Check,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopHeader from "./TopHeader";
import MenuItemDetailModal, { MenuItem } from "./MenuItemDetailModal";
import CartModal, { CartItem } from "./CartModal";
import DeliveryDetailsModal, { DeliveryDetails } from "./DeliveryDetailsModal";
import OrderReviewModal from "./OrderReviewModal";
import PaymentModal from "./PaymentModal";
import OrderTrackingModal from "./OrderTrackingModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  options?: MenuItemOption[];
  addons?: MenuItemAddon[];
}

interface MenuItemOption {
  id: string;
  name: string;
  required: boolean;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
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

const CategoryCard = ({
  category = {
    id: "1",
    name: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&q=80",
  },
  onPress,
}: {
  category?: CategoryProps;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity className="mr-4 w-20" onPress={onPress}>
      <View className="rounded-lg overflow-hidden bg-dark-card">
        <Image
          source={{ uri: category.image }}
          className="w-20 h-20 rounded-lg"
          contentFit="cover"
        />
      </View>
      <Text className="text-center mt-1 font-medium text-sm text-white">
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const RestaurantCard = ({
  restaurant = {
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
  onPress,
}: {
  restaurant?: RestaurantProps;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      className="mb-4 bg-dark-card rounded-lg overflow-hidden shadow-sm"
      onPress={onPress}
    >
      <View>
        <Image
          source={{ uri: restaurant.image }}
          className="w-full h-40"
          contentFit="cover"
        />
        <View className="p-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-white">
              {restaurant.name}
            </Text>
            <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded">
              <Star size={14} color="#FF3008" fill="#FF3008" />
              <Text className="ml-1 text-sm font-medium text-white">
                {restaurant.rating}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap mt-1">
            {restaurant.categories.map((category, index) => (
              <Text key={index} className="text-gray-400 text-sm">
                {category}
                {index < restaurant.categories.length - 1 ? " • " : ""}
              </Text>
            ))}
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-sm text-gray-400">
              {restaurant.deliveryTime}
            </Text>
            <Text className="text-sm text-gray-400">
              {restaurant.deliveryFee} • {restaurant.distance}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

const BottomNavigation = ({ activeTab = "browse" }) => {
  return (
    <View className="flex-row justify-around items-center py-3 bg-dark-card border-t border-gray-800">
      <TouchableOpacity className="items-center">
        <Search
          size={24}
          color={activeTab === "browse" ? "#FF3008" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "browse" ? "text-[#FF3008]" : "text-white"} font-medium`}
        >
          Browse
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <ShoppingBag
          size={24}
          color={activeTab === "orders" ? "#FF3008" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "orders" ? "text-[#FF3008]" : "text-white"}`}
        >
          Orders
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <Heart
          size={24}
          color={activeTab === "saved" ? "#FF3008" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "saved" ? "text-[#FF3008]" : "text-white"}`}
        >
          Saved
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <User
          size={24}
          color={activeTab === "account" ? "#FF3008" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "account" ? "text-[#FF3008]" : "text-white"}`}
        >
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface FoodDeliveryHomeProps {
  onSwitchMode?: () => void;
  onToggleMode?: () => void;
  onNavigateToLanding?: () => void;
}

const FoodDeliveryHome = ({
  onSwitchMode = () => {},
  onToggleMode = () => {},
  onNavigateToLanding = () => {},
}: FoodDeliveryHomeProps) => {
  // State for restaurant detail view
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantProps | null>(null);
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // State for item detail modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // State for options and add-ons in the item detail modal
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: boolean;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  // State for cart and checkout flow
  const [showCartModal, setShowCartModal] = useState(false);
  const [showDeliveryDetailsModal, setShowDeliveryDetailsModal] =
    useState(false);
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderTrackingModal, setShowOrderTrackingModal] = useState(false);

  // Delivery details state
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    address: "123 Main Street",
    instructions: "",
    phone: "",
    deliveryTime: "ASAP",
  });

  // Order summary calculations
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const modalY = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Mock data for categories
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

  // Mock data for restaurants
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

  // Mock data for menu categories and items
  const mockMenuCategories: MenuCategory[] = [
    { id: "cat1", title: "Popular Items" },
    { id: "cat2", title: "Burgers" },
    { id: "cat3", title: "Sides" },
    { id: "cat4", title: "Beverages" },
    { id: "cat5", title: "Desserts" },
  ];

  const mockMenuItems: MenuItem[] = [
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
          id: "opt1",
          name: "Size",
          required: true,
          choices: [
            { id: "size1", name: "Regular", price: 0 },
            { id: "size2", name: "Large", price: 2 },
          ],
        },
        {
          id: "opt2",
          name: "Cheese",
          required: false,
          choices: [
            { id: "cheese1", name: "American", price: 1 },
            { id: "cheese2", name: "Cheddar", price: 1 },
            { id: "cheese3", name: "None", price: 0 },
          ],
        },
      ],
      addons: [
        { id: "addon1", name: "Extra Patty", price: 2.99 },
        { id: "addon2", name: "Bacon", price: 1.99 },
        { id: "addon3", name: "Avocado", price: 1.49 },
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
  ];

  // Handle restaurant selection
  const handleRestaurantPress = (restaurant: RestaurantProps) => {
    setSelectedRestaurant(restaurant);
    // Simulate API call to fetch restaurant menu
    setMenuCategories(mockMenuCategories);
    setMenuItems(mockMenuItems);
    setActiveCategory(mockMenuCategories[0].id);
    setShowRestaurantDetail(true);
  };

  // Handle menu item selection
  const handleMenuItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  // Calculate order summary values
  const calculateOrderSummary = () => {
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

    // Calculate taxes (assume 8%)
    const taxRate = 0.08;
    const taxes = subtotal * taxRate;

    // Delivery fee
    const deliveryFee = 2.99;

    // Calculate tip
    const tipAmount = (subtotal * tipPercentage) / 100;

    // Calculate total
    const total = subtotal + taxes + deliveryFee + tipAmount - promoDiscount;

    return {
      subtotal,
      taxes,
      deliveryFee,
      tipAmount,
      total,
    };
  };

  // Handle add to cart from menu item detail modal
  const handleAddToCart = () => {
    if (!selectedItem) return;

    const item = selectedItem;
    // Calculate total price for the item
    let itemTotalPrice = item.price * quantity;

    // Add option prices
    const selectedOptionsList: {
      option_id: string;
      choice_id: string;
      name: string;
      price: number;
    }[] = [];

    if (item.options) {
      item.options.forEach((option) => {
        const selectedChoiceId = selectedOptions[option.id];
        if (selectedChoiceId) {
          const choice = option.choices.find((c) => c.id === selectedChoiceId);
          if (choice) {
            itemTotalPrice += choice.price * quantity;
            selectedOptionsList.push({
              option_id: option.id,
              choice_id: choice.id,
              name: `${option.name}: ${choice.name}`,
              price: choice.price,
            });
          }
        }
      });
    }

    // Add addon prices
    const selectedAddonsList: {
      addon_id: string;
      name: string;
      price: number;
    }[] = [];

    if (item.addons) {
      item.addons.forEach((addon) => {
        if (selectedAddons[addon.id]) {
          itemTotalPrice += addon.price * quantity;
          selectedAddonsList.push({
            addon_id: addon.id,
            name: addon.name,
            price: addon.price,
          });
        }
      });
    }

    // Create cart item
    const newCartItem: CartItem = {
      item_id: item.id,
      name: item.name,
      quantity: quantity,
      unit_price: item.price,
      total_price: itemTotalPrice,
      thumbnail_url: item.thumbnail_url,
      selected_options: selectedOptionsList,
      add_ons: selectedAddonsList,
    };

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.item_id === item.id &&
        JSON.stringify(cartItem.selected_options) ===
          JSON.stringify(selectedOptionsList) &&
        JSON.stringify(cartItem.add_ons) === JSON.stringify(selectedAddonsList),
    );

    let updatedCartItems;
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedCartItems = [...cartItems];
      const existingItem = updatedCartItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      updatedCartItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        total_price:
          (existingItem.total_price / existingItem.quantity) * newQuantity,
      };
    } else {
      // Add new item
      updatedCartItems = [...cartItems, newCartItem];
    }

    // Update cart
    setCartItems(updatedCartItems);
    setCartCount(
      updatedCartItems.reduce((sum, item) => sum + item.quantity, 0),
    );

    // Show success message and close modal after delay
    setAddToCartSuccess(true);
    setTimeout(() => {
      setAddToCartSuccess(false);
      setShowItemDetail(false);
    }, 1000);
  };

  // Handle updating item quantity in cart
  const handleUpdateCartItemQuantity = (
    itemId: string,
    newQuantity: number,
  ) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.item_id === itemId) {
        const unitPrice = item.total_price / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          total_price: unitPrice * newQuantity,
        };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    setCartCount(
      updatedCartItems.reduce((sum, item) => sum + item.quantity, 0),
    );
  };

  // Handle removing item from cart
  const handleRemoveCartItem = (itemId: string) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.item_id !== itemId,
    );
    setCartItems(updatedCartItems);
    setCartCount(
      updatedCartItems.reduce((sum, item) => sum + item.quantity, 0),
    );
  };

  // Handle proceeding to checkout from cart
  const handleProceedToCheckout = () => {
    setShowCartModal(false);
    setShowDeliveryDetailsModal(true);
  };

  // Handle continuing from delivery details to order review
  const handleContinueToOrderReview = (details: DeliveryDetails) => {
    setDeliveryDetails(details);
    setShowDeliveryDetailsModal(false);
    setShowOrderReviewModal(true);
  };

  // Handle continuing from order review to payment
  const handleContinueToPayment = () => {
    setShowOrderReviewModal(false);
    setShowPaymentModal(true);
  };

  // Handle placing order
  const handlePlaceOrder = () => {
    setShowPaymentModal(false);
    setShowOrderTrackingModal(true);

    // Clear cart after order is placed
    setCartItems([]);
    setCartCount(0);
    setPromoDiscount(0);
  };

  // Render restaurant detail view
  const renderRestaurantDetail = () => {
    if (!selectedRestaurant) return null;

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
      <Modal
        visible={showRestaurantDetail}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowRestaurantDetail(false)}
      >
        <SafeAreaView className="flex-1 bg-dark-bg">
          <View className="flex-row justify-between items-center px-4 py-2 bg-dark-card">
            <TouchableOpacity onPress={() => setShowRestaurantDetail(false)}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => cartCount > 0 && setShowCartModal(true)}
            >
              <ShoppingBag size={20} color="#FFFFFF" />
              {cartCount > 0 && (
                <View className="bg-[#FF3008] rounded-full w-5 h-5 items-center justify-center absolute -top-1 -right-1">
                  <Text className="text-white text-xs font-bold">
                    {cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
                source={{ uri: selectedRestaurant.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
            </Animated.View>

            {/* Restaurant Info */}
            <View className="p-4 bg-dark-card">
              <Text className="text-2xl font-bold text-white">
                {selectedRestaurant.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded mr-2">
                  <Star size={14} color="#FF3008" fill="#FF3008" />
                  <Text className="ml-1 text-sm font-medium text-white">
                    {selectedRestaurant.rating}
                  </Text>
                </View>

                <Text className="text-gray-400 text-sm">
                  {selectedRestaurant.deliveryTime} •{" "}
                  {selectedRestaurant.deliveryFee}
                </Text>
              </View>

              <View className="flex-row flex-wrap mt-2">
                {selectedRestaurant.categories.map((category, index) => (
                  <Text key={index} className="text-gray-400 text-sm">
                    {category}
                    {index < selectedRestaurant.categories.length - 1
                      ? " • "
                      : ""}
                  </Text>
                ))}
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
                      onPress={() => handleMenuItemPress(item)}
                    />
                  ))}
              </View>
            </View>
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  // Calculate total price for the selected item with options and add-ons
  const calculateTotalPrice = () => {
    if (!selectedItem) return 0;

    let total = selectedItem.price * quantity;

    // Add option prices
    if (selectedItem.options) {
      selectedItem.options.forEach((option) => {
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
    if (selectedItem.addons) {
      selectedItem.addons.forEach((addon) => {
        if (selectedAddons[addon.id]) {
          total += addon.price * quantity;
        }
      });
    }

    return total;
  };

  // Check if all required options are selected
  const areRequiredOptionsSelected = () => {
    if (!selectedItem || !selectedItem.options) return true;

    return selectedItem.options
      .filter((option) => option.required)
      .every((option) => selectedOptions[option.id]);
  };

  // Reset state when modal opens with new item
  React.useEffect(() => {
    if (showItemDetail && selectedItem) {
      setQuantity(1);
      setSelectedAddons({});
      setAddToCartSuccess(false);

      // Initialize default selections for required options
      if (selectedItem.options) {
        const defaultOptions: { [key: string]: string } = {};
        selectedItem.options.forEach((option) => {
          if (option.required && option.choices.length > 0) {
            defaultOptions[option.id] = option.choices[0].id;
          }
        });
        setSelectedOptions(defaultOptions);
      } else {
        setSelectedOptions({});
      }
    }
  }, [showItemDetail, selectedItem]);

  // Render item detail modal
  const renderItemDetailModal = () => {
    if (!selectedItem) return null;

    const totalPrice = calculateTotalPrice();
    const canAddToCart = areRequiredOptionsSelected();

    return (
      <MenuItemDetailModal
        visible={showItemDetail}
        item={selectedItem}
        onClose={() => setShowItemDetail(false)}
        onAddToCart={(item, qty, options, addons) => {
          handleAddToCart(item, qty, options, addons);
        }}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <TopHeader
        mode="food"
        onModeToggle={onSwitchMode || onToggleMode}
        location="123 Main Street"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Location Bar */}
        <TouchableOpacity className="flex-row items-center px-4 py-3 bg-dark-card">
          <MapPin size={18} color="#FF3008" />
          <View className="flex-1 ml-2">
            <Text className="text-sm font-medium text-white">Delivery to</Text>
            <Text className="text-base font-bold text-white">
              123 Main Street
            </Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Categories */}
        <View className="mt-4 px-4">
          <Text className="text-lg font-bold mb-3 text-white">Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
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
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => handleRestaurantPress(restaurant)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Cart button with count */}
      {cartCount > 0 && (
        <TouchableOpacity
          className="absolute bottom-20 right-4 bg-[#FF3008] w-14 h-14 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowCartModal(true)}
        >
          <ShoppingBag size={24} color="#FFFFFF" />
          <View className="absolute top-0 right-0 bg-white rounded-full w-6 h-6 items-center justify-center">
            <Text className="text-[#FF3008] font-bold text-xs">
              {cartCount} {cartCount === 1 ? "item" : "items"} - $
              {calculateOrderSummary().subtotal.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <BottomNavigation activeTab="browse" />

      {/* Restaurant Detail Modal */}
      {renderRestaurantDetail()}

      {/* Item Detail Modal */}
      {renderItemDetailModal()}

      {/* Cart Modal */}
      <CartModal
        visible={showCartModal}
        cartItems={cartItems}
        onClose={() => setShowCartModal(false)}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleProceedToCheckout}
      />

      {/* Delivery Details Modal */}
      <DeliveryDetailsModal
        visible={showDeliveryDetailsModal}
        onClose={() => setShowDeliveryDetailsModal(false)}
        onContinue={handleContinueToOrderReview}
        initialDetails={deliveryDetails}
      />

      {/* Order Review Modal */}
      <OrderReviewModal
        visible={showOrderReviewModal}
        onClose={() => setShowOrderReviewModal(false)}
        onContinue={handleContinueToPayment}
        onEditDeliveryDetails={() => {
          setShowOrderReviewModal(false);
          setShowDeliveryDetailsModal(true);
        }}
        cartItems={cartItems}
        deliveryDetails={deliveryDetails}
        subtotal={calculateOrderSummary().subtotal}
        tax={calculateOrderSummary().taxes}
        deliveryFee={calculateOrderSummary().deliveryFee}
        tip={calculateOrderSummary().tipAmount}
        discount={promoDiscount}
        total={calculateOrderSummary().total}
      />

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPlaceOrder={handlePlaceOrder}
        total={calculateOrderSummary().total}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        visible={showOrderTrackingModal}
        onClose={() => setShowOrderTrackingModal(false)}
        restaurantName={selectedRestaurant?.name || "Restaurant"}
      />
    </SafeAreaView>
  );
};

export default FoodDeliveryHome;
