// app/components/RideshareHome.tsx
import React, { useState, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
  MapPin,
  ChevronDown,
  Clock,
  Car,
  X,
  Home as HomeIcon,
  Truck,
  Key,
  Fuel,
  Battery,
  CreditCard,
  Star,
  MessageSquare,
  Phone,
  ChevronRight,
  Calendar,
  Building,
  Briefcase,
  User,
  Compass,
  Search,
} from "lucide-react-native";

// Import the TopHeader component
import TopHeader from "./TopHeader";
import RoadsideScreen from "./RoadsideScreen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  eta: string;
  description: string;
  image: string;
}

interface ServiceOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  eta: string;
  description: string;
  image: any; // Allow both string and require()
}

interface Promotion {
  id: string;
  image: any; // Allow both string and require()
  headline: string;
  cta_text: string;
}

interface TripCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  image: any; // Allow both string and require()
}

interface Shortcut {
  id: string;
  icon: React.ReactNode;
  label: string;
  image: any; // Allow both string and require()
}

interface SavedLocation {
  id: string;
  label: string;
  address: string;
  icon: React.ReactNode;
}

interface RideshareHomeProps {
  onSwitchMode?: () => void;
  onToggleMode?: () => void;
  onNavigateToLanding?: () => void;
  userLocation?: string;
  mode?: "ride" | "roadside" | "food";
  onModeChange?: (mode: "ride" | "roadside" | "food") => void;
}

const ShortcutCard = ({
  shortcut,
  onPress,
}: {
  shortcut: Shortcut;
  onPress: (id: string) => void;
}) => {
  // FIX: Conditionally set the image source for local (require) vs remote (uri) assets.
  const imageSource =
    typeof shortcut.image === "string"
      ? { uri: shortcut.image }
      : shortcut.image;

  return (
    <TouchableOpacity
      className="mr-4 items-center"
      onPress={() => onPress(shortcut.id)}
    >
      <View className="w-20 h-20 rounded-xl overflow-hidden bg-dark-card shadow-sm">
        <Image
          source={imageSource}
          className="w-full h-full"
          contentFit="cover"
        />
      </View>
      <Text className="text-center mt-1 font-medium text-sm text-white">
        {shortcut.label}
      </Text>
    </TouchableOpacity>
  );
};

const ServiceCard = ({ service }: { service: ServiceOption }) => {
  // FIX: Conditionally set the image source for local (require) vs remote (uri) assets.
  const imageSource =
    typeof service.image === "string" ? { uri: service.image } : service.image;

  return (
    <TouchableOpacity className="w-[48%] mb-4">
      <View className="rounded-xl overflow-hidden bg-dark-card shadow-sm">
        <Image
          source={imageSource}
          className="w-full h-32"
          contentFit="cover"
        />
        <View className="p-3">
          <Text className="text-base font-bold text-white">{service.name}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} color="#888888" />
            <Text className="ml-1 text-xs text-gray-400">{service.eta}</Text>
          </View>
          <Text className="text-plug-green font-bold mt-1">
            {service.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PromotionCard = ({ promo }: { promo: Promotion }) => {
  // FIX: Conditionally set the image source for local (require) vs remote (uri) assets.
  const imageSource =
    typeof promo.image === "string" ? { uri: promo.image } : promo.image;

  return (
    <TouchableOpacity className="mr-4">
      <View className="w-64 h-36 rounded-xl overflow-hidden bg-dark-card shadow-sm">
        <Image
          source={imageSource}
          className="w-full h-full"
          contentFit="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
          <Text className="text-white text-base font-bold">
            {promo.headline}
          </Text>
          <TouchableOpacity className="bg-plug-green rounded-md px-3 py-1 mt-2 self-start">
            <Text className="text-white text-xs font-bold">
              {promo.cta_text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TripPlanCard = ({ card }: { card: TripCard }) => {
  // FIX: Conditionally set the image source for local (require) vs remote (uri) assets.
  const imageSource =
    typeof card.image === "string" ? { uri: card.image } : card.image;

  return (
    <TouchableOpacity className="mr-4">
      <View className="w-40 h-28 rounded-xl overflow-hidden bg-dark-card shadow-sm">
        <Image
          source={imageSource}
          className="w-full h-full"
          contentFit="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
          <Text className="text-white text-sm font-bold">{card.title}</Text>
          <Text className="text-white text-xs">{card.subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RideshareHome = ({
  onSwitchMode = () => {
    console.log("onSwitchMode");
  },
  onToggleMode = () => {
    console.log("onToggleMode");
  },
  onNavigateToLanding = () => {
    console.log("onNavigateToLanding");
  },
  userLocation = "Current Location",
  mode = "ride",
  onModeChange = (mode: "ride" | "roadside" | "food") => {
    console.log("onModeChange", mode);
  },
}: RideshareHomeProps) => {
  // State for bottom navigation
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [destination, setDestination] = useState("");
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showRideTracking, setShowRideTracking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [driverInfo, setDriverInfo] = useState({
    name: "Michael Johnson",
    photoUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    vehicle: "Toyota Prius • ABC123",
  });

  // Mock data for shortcuts
  const shortcuts: Shortcut[] = [
    {
      id: "ride",
      icon: <Car size={24} color="#4AFF00" />,
      label: "Ride Share",
      image: require("../../assets/sedan1.png"),
    },
    {
      id: "roadside",
      icon: <Truck size={24} color="#4AFF00" />,
      label: "Road Side",
      image: require("../../assets/towtruck1.png"),
    },
    {
      id: "reserve",
      icon: <Calendar size={24} color="#4AFF00" />,
      label: "Reserve",
      image: require("../../assets/calendar1.png"),
    },
    {
      id: "rental",
      icon: <Car size={24} color="#4AFF00" />,
      label: "Rental",
      image: require("../../assets/hands.png"),
    },
    {
      id: "food",
      icon: <Truck size={24} color="#4AFF00" />,
      label: "Food",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
    },
  ];

  // Mock data for ride options
  const rideOptions: RideOption[] = [
    {
      id: "economy",
      name: "Economy",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$12.99",
      eta: "3 min",
      description: "Affordable rides for up to 4 people",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    },
    {
      id: "comfort",
      name: "Comfort",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$18.50",
      eta: "4 min",
      description: "Newer cars with extra legroom",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
    },
    {
      id: "xl",
      name: "XL",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$24.75",
      eta: "6 min",
      description: "Spacious rides for groups up to 6",
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80",
    },
  ];

  // Mock data for services
  const roadsideServices: ServiceOption[] = [
    {
      id: "lux",
      name: "LUX Ride Share",
      icon: <Car size={20} color="#4AFF00" />,
      price: "$24.75",
      eta: "5 min",
      description: "Rides Starting –",
      image: require("../../assets/Luxrideshare.png"),
    },
    {
      id: "tow",
      name: "Tow Service",
      icon: <Truck size={24} color="#4AFF00" />,
      price: "$79.99",
      eta: "25 min",
      description: "Tows Starting –",
      image: require("../../assets/roadside.png"),
    },
    {
      id: "rental",
      name: "Car Rental",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$24.75",
      eta: "15 min",
      description: "Rides Starting –",
      image: require("../../assets/carrental.png"),
    },
    {
      id: "flat",
      name: "Flat Tire",
      icon: <Truck size={24} color="#4AFF00" />,
      price: "$24.75",
      eta: "18 min",
      description: "Rides Starting –",
      image: require("../../assets/flattire.png"),
    },
  ];

  // Mock data for promotions
  const promotions: Promotion[] = [
    {
      id: "promo1",
      image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
      headline: "50% off your next 3 rides",
      cta_text: "Apply Now",
    },
    {
      id: "promo2",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
      headline: "50% off at The Plug (new!)",
      cta_text: "Use Code: PLUG50",
    },
    {
      id: "promo3",
      image: require("../../assets/Luxrideshare.png"),
      headline: "Try our LUX service",
      cta_text: "Learn More",
    },
    {
      id: "promo4",
      image: require("../../assets/rideshare.png"),
      headline: "Refer a friend, get $50",
      cta_text: "Share Now",
    },
  ];

  // Mock data for trip planning cards
  const tripCards: TripCard[] = [
    {
      id: "rental",
      icon: <Car size={24} color="#4AFF00" />,
      title: "Easy car rentals",
      subtitle: "Book hourly or daily",
      image:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
    },
    {
      id: "reserve",
      icon: <Calendar size={24} color="#4AFF00" />,
      title: "Reserve and relax",
      subtitle: "Book up to 30 days ahead",
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80",
    },
    {
      id: "business",
      icon: <Briefcase size={24} color="#4AFF00" />,
      title: "Business travel",
      subtitle: "Manage work expenses",
      image: require("../../assets/luxrideshare2.png"),
    },
  ];

  // Mock data for saved locations
  const savedLocations: SavedLocation[] = [
    {
      id: "current",
      label: "Current location",
      address: userLocation,
      icon: <MapPin size={24} color="#4AFF00" />,
    },
    {
      id: "home",
      label: "Home",
      address: "123 Main Street",
      icon: <HomeIcon size={24} color="#4AFF00" />,
    },
    {
      id: "work",
      label: "Work",
      address: "456 Market Street",
      icon: <Building size={24} color="#4AFF00" />,
    },
  ];

  // Handle tab navigation
  const handleTabChange = (tab: string) => {
    try {
      setCurrentTab(tab);
      // Here you would load the appropriate content for the selected tab
      console.log(`Tab changed to: ${tab}`);

      if (tab === "services") {
        onModeChange("roadside");
      } else if (tab === "explore") {
        setShowSearchOverlay(true);
      }
    } catch (error) {
      // Show cached view on load failure
      console.error(`Failed to load ${tab} tab:`, error);
      Alert.alert(
        "Connection Error",
        "Unable to load content. Would you like to retry?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: () => handleTabChange(tab) },
        ],
      );
    }
  };

  // Handle shortcut selection
  const handleShortcutSelect = (shortcutId: string) => {
    if (shortcutId === "roadside") {
      onModeChange("roadside");
      setCurrentTab("services");
    } else if (shortcutId === "food") {
      onModeChange("food");
    } else if (shortcutId === "ride") {
      onModeChange("ride");
      setCurrentTab("home");
    }
  };

  // Handle ride selection
  const handleRideSelect = (rideId: string) => {
    setSelectedRideType(rideId);
  };

  // Handle search overlay animation
  useEffect(() => {
    if (showSearchOverlay) {
      // Animation logic would go here
    }
  }, [showSearchOverlay]);

  // Render bottom navigation
  const renderBottomNavigation = () => (
    <View className="flex-row justify-around items-center py-3 bg-dark-card border-t border-gray-800">
      <TouchableOpacity
        className="items-center"
        onPress={() => handleTabChange("home")}
      >
        <HomeIcon
          size={24}
          color={currentTab === "home" ? "#4AFF00" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${currentTab === "home" ? "text-plug-green" : "text-white"} font-medium`}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center"
        onPress={() => handleTabChange("services")}
      >
        <Truck
          size={24}
          color={currentTab === "services" ? "#4AFF00" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${currentTab === "services" ? "text-plug-green" : "text-white"}`}
        >
          Services
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center"
        onPress={() => handleTabChange("explore")}
      >
        <Compass
          size={24}
          color={currentTab === "explore" ? "#4AFF00" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${currentTab === "explore" ? "text-plug-green" : "text-white"}`}
        >
          Explore
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center"
        onPress={() => handleTabChange("account")}
      >
        <User
          size={24}
          color={currentTab === "account" ? "#4AFF00" : "#FFFFFF"}
        />
        <Text
          className={`text-xs mt-1 ${currentTab === "account" ? "text-plug-green" : "text-white"}`}
        >
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render search overlay
  const renderSearchOverlay = () => (
    <Modal
      visible={showSearchOverlay}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSearchOverlay(false)}
    >
      <View className="flex-1 bg-dark-bg">
        <View className="flex-row items-center justify-between px-4 py-3 bg-dark-card border-b border-gray-800">
          <TouchableOpacity onPress={() => setShowSearchOverlay(false)}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Where to?</Text>
          <TouchableOpacity className="flex-row items-center">
            <Calendar size={16} color="#4AFF00" />
            <Text className="ml-1 text-plug-green">Later</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold px-4 mt-4 text-white">
          Saved Locations
        </Text>
        <ScrollView className="max-h-60">
          {savedLocations.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center px-4 py-3 border-b border-gray-800"
              onPress={() => {
                setDestination(item.address);
                setShowSearchOverlay(false);
                setTimeout(() => {
                  setShowRouteOptions(true);
                }, 500);
              }}
            >
              <View className="mr-3">{item.icon}</View>
              <View className="flex-1">
                <Text className="text-base font-medium text-white">
                  {item.label}
                </Text>
                <Text className="text-sm text-gray-400">{item.address}</Text>
              </View>
              <ChevronRight size={20} color="#888888" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-lg font-bold px-4 mt-4 text-white">
          Suggestions
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2"
        >
          {shortcuts.map((shortcut) => (
            <ShortcutCard
              key={shortcut.id}
              shortcut={shortcut}
              onPress={handleShortcutSelect}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  // Render ride options bottom sheet
  const renderRideOptionsSheet = () => (
    <Modal
      visible={showRouteOptions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRouteOptions(false)}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-end">
        <View className="bg-dark-card rounded-t-3xl p-4">
          <View className="w-10 h-1 bg-gray-500 rounded-full self-center mb-4" />
          <Text className="text-xl font-bold text-white mb-4">
            Choose your ride
          </Text>

          {/* Payment Method Selection */}
          <TouchableOpacity className="flex-row items-center justify-between bg-dark-bg rounded-lg p-3 mb-4">
            <View className="flex-row items-center">
              <CreditCard size={20} color="#FFFFFF" />
              <Text className="ml-2 text-white">Visa •••• 4242</Text>
            </View>
            <ChevronDown size={16} color="#888888" />
          </TouchableOpacity>

          <ScrollView className="max-h-80">
            {rideOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className={`flex-row items-center p-4 mb-2 rounded-lg ${selectedRideType === option.id ? "bg-dark-bg border border-plug-green" : "bg-dark-bg"}`}
                onPress={() => handleRideSelect(option.id)}
              >
                <Image
                  source={{ uri: option.image }}
                  className="w-16 h-16 rounded-lg mr-3"
                  contentFit="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white">
                    {option.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={14} color="#888888" />
                    <Text className="ml-1 text-sm text-gray-400">
                      {option.eta} away
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-400 mt-1">
                    {option.description}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-white">
                  {option.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="bg-plug-green rounded-lg p-4 items-center mt-4"
            onPress={() => {
              setShowRouteOptions(false);
              // Simulate booking a ride and starting tracking
              setTimeout(() => {
                // Start ride tracking simulation
                setCurrentStatus(0); // Reset to first status
                setShowRideTracking(true);
                // Start the ride status updates
                startRideStatusUpdates();
              }, 1000);
            }}
          >
            <Text className="text-white font-bold text-lg">
              Confirm{" "}
              {selectedRideType
                ? rideOptions.find((r) => r.id === selectedRideType)?.name
                : rideOptions[0].name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render ride home screen
  const renderRideHomeScreen = () => (
    <ScrollView
      className="flex-1 bg-dark-bg"
      showsVerticalScrollIndicator={false}
    >
      {/* Location Bar */}
      <TouchableOpacity className="flex-row items-center px-4 py-3 bg-dark-card">
        <MapPin size={18} color="#4AFF00" />
        <View className="flex-1 ml-2">
          <Text className="text-sm font-medium text-white">Pickup at</Text>
          <Text className="text-base font-bold text-white">{userLocation}</Text>
        </View>
        <ChevronRight size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Shortcuts Row */}
      <View className="mt-4 px-4">
        <Text className="text-lg font-bold mb-3 text-white">Quick Access</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          {shortcuts.map((shortcut) => (
            <ShortcutCard
              key={shortcut.id}
              shortcut={shortcut}
              onPress={handleShortcutSelect}
            />
          ))}
        </ScrollView>
      </View>

      {/* Services Grid */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold mb-3 text-white">Services</Text>
        <View className="flex-row flex-wrap justify-between">
          {roadsideServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>
      </View>

      {/* Promotions Carousel */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold mb-3 text-white">Promotions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          {promotions.map((promo) => (
            <PromotionCard key={promo.id} promo={promo} />
          ))}
        </ScrollView>
      </View>

      {/* Trip Planning Section */}
      <View className="mt-6 px-4 pb-20">
        <Text className="text-lg font-bold mb-3 text-white">
          Plan your next trip
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          {tripCards.map((card) => (
            <TripPlanCard key={card.id} card={card} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  // Render roadside assistance screen
  const renderRoadsideScreen = () => (
    <ScrollView
      className="flex-1 bg-dark-bg"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 py-4">
        <Text className="text-xl font-bold text-white mb-4">
          Roadside Assistance
        </Text>
        <Text className="text-base text-gray-400 mb-6">
          Select the service you need:
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {roadsideServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Function to simulate ride status updates
  const startRideStatusUpdates = () => {
    // Simulate status updates every 10 seconds
    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => {
        const newStatus = prev + 1;
        if (newStatus >= 4) {
          // 4 statuses: Confirmed, Driver en route, Arrived, In progress
          clearInterval(statusInterval);
          return 4;
        }
        return newStatus;
      });
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(statusInterval);
  };

  // Render ride tracking modal
  const renderRideTrackingModal = () => (
    <Modal
      visible={showRideTracking}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setShowRideTracking(false)}
    >
      <View className="flex-1 bg-dark-bg">
        {/* Map View */}
        <View className="h-64 relative bg-gray-800">
          {/* Professional Map Background */}
          <View className="absolute inset-0 bg-gray-800">
            {/* Map Grid Pattern */}
            <View className="absolute inset-0 opacity-10">
              {/* Vertical lines */}
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={{
                    position: "absolute",
                    left: `${(i + 1) * 12.5}%`,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: "#4a5568",
                  }}
                />
              ))}
              {/* Horizontal lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={{
                    position: "absolute",
                    top: `${(i + 1) * 16.66}%`,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: "#4a5568",
                  }}
                />
              ))}
            </View>

            {/* Road Network */}
            <View className="absolute inset-x-10 inset-y-20">
              {/* Main road */}
              <View className="absolute top-2/5 inset-x-0 h-1 bg-gray-600 rounded" />
              {/* Vertical road */}
              <View className="absolute left-3/5 inset-y-0 w-1 bg-gray-600 rounded" />
            </View>
          </View>

          {/* Route Path */}
          <View className="absolute top-1/4 left-15 w-70 h-1 bg-white bg-opacity-30 rounded z-10">
            {/* Animated Progress */}
            <Animated.View
              className="absolute inset-y-0 left-0 bg-white rounded"
              style={{
                width: `${Math.min(100, currentStatus * 25)}%`,
              }}
            />
          </View>

          {/* Origin Marker */}
          <View className="absolute top-1/5 left-15 items-center z-20">
            <View className="w-5 h-5 rounded-full bg-white border-2 border-gray-800 items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-blue-400" />
            </View>
            <View className="bg-black bg-opacity-80 px-2 py-1 rounded mt-1">
              <Text className="text-white text-xs font-semibold">Pickup</Text>
            </View>
          </View>

          {/* Destination Marker */}
          <View className="absolute top-1/5 right-15 items-center z-20">
            <View className="w-5 h-5 rounded-full bg-white border-2 border-gray-800 items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-green-500" />
            </View>
            <View className="bg-black bg-opacity-80 px-2 py-1 rounded mt-1">
              <Text className="text-white text-xs font-semibold">
                Destination
              </Text>
            </View>
          </View>

          {/* Driver Car Marker */}
          <Animated.View
            className="absolute top-22 items-center z-30"
            style={{
              left: `${15 + Math.min(70, currentStatus * 17.5)}%`,
              transform: [{ scale: 1.1 }],
            }}
          >
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-md">
              <Text className="text-base">🚗</Text>
            </View>
          </Animated.View>

          {/* ETA Info Panel */}
          <View className="absolute bottom-4 inset-x-4 bg-dark-bg bg-opacity-80 p-3 rounded-lg">
            <Text className="text-white font-bold">
              {currentStatus < 4
                ? `Arriving in approximately ${25 - currentStatus * 5} minutes`
                : "Your driver has arrived!"}
            </Text>
            <View className="w-full h-1 bg-gray-700 rounded-full mt-2">
              <Animated.View
                className="h-full bg-plug-green rounded-full"
                style={{
                  width: `${Math.min(100, currentStatus * 25)}%`,
                }}
              />
            </View>
          </View>
        </View>

        {/* Ride Status */}
        <View className="p-4 bg-dark-card mt-4">
          <Text className="text-white font-bold text-lg mb-4">Ride Status</Text>

          {[
            "Ride Confirmed",
            "Driver En Route",
            "Driver Arrived",
            "In Progress",
            "Completed",
          ].map((status, index) => (
            <View key={status} className="flex-row items-center mb-4">
              <View className="mr-3">
                {index <= currentStatus ? (
                  <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                    <Text className="text-white text-base font-bold">✓</Text>
                  </View>
                ) : (
                  <View className="w-6 h-6 rounded-full border-2 border-gray-500 bg-transparent" />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className={`font-medium ${index <= currentStatus ? "text-white" : "text-gray-500"}`}
                >
                  {status}
                </Text>
                {index === currentStatus && (
                  <Text className="text-plug-green text-sm mt-1">
                    {index < 4 ? "In progress..." : "Completed"}
                  </Text>
                )}
              </View>
              {index === 2 && currentStatus >= 2 && (
                <Text className="text-white">
                  {currentStatus < 4
                    ? `${25 - currentStatus * 5} min`
                    : "Arrived"}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Driver Info */}
        <View className="p-4 bg-dark-card mt-4">
          <Text className="text-white font-bold text-lg mb-3">Your Driver</Text>

          <View className="flex-row items-center">
            <Image
              source={{ uri: driverInfo.photoUrl }}
              className="w-16 h-16 rounded-full bg-gray-700"
              transition={500}
            />
            <View className="ml-3 flex-1">
              <Text className="text-white font-medium">{driverInfo.name}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400">{driverInfo.vehicle}</Text>
              </View>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center mr-2">
                <Phone size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center">
                <MessageSquare size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          className="absolute top-4 left-4 bg-black bg-opacity-50 w-10 h-10 rounded-full items-center justify-center"
          onPress={() => setShowRideTracking(false)}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-dark-bg">
      <StatusBar style="light" />
      <TopHeader
        mode={mode === "roadside" ? "ride" : mode}
        onModeToggle={(newMode) =>
          onModeChange(newMode === "food" ? "food" : "ride")
        }
        location={userLocation}
        onSearchFocus={() => setShowSearchOverlay(true)}
        onSearchSubmit={(text) => {
          setDestination(text);
          setShowSearchOverlay(false);
          setTimeout(() => {
            setShowRouteOptions(true);
          }, 500);
        }}
      />

      {/* Main Content */}
      <View className="flex-1">
        {/* Ride Home Screen */}
        {mode === "ride" &&
          currentTab === "home" &&
          !showRouteOptions &&
          renderRideHomeScreen()}

        {/* Roadside Assistance Screen */}
        {mode === "roadside" && currentTab === "services" && (
          <RoadsideScreen
            userLocation={userLocation}
            onBack={() => {
              onModeChange("ride");
              setCurrentTab("home");
            }}
          />
        )}

        {/* Legacy Roadside Screen */}
        {mode === "roadside" &&
          currentTab !== "services" &&
          renderRoadsideScreen()}

        {/* Search Overlay */}
        {renderSearchOverlay()}

        {/* Ride Options */}
        {renderRideOptionsSheet()}

        {/* Ride Tracking Modal */}
        {renderRideTrackingModal()}
      </View>

      {/* Bottom Navigation */}
      {renderBottomNavigation()}
    </View>
  );
};

export default RideshareHome;
