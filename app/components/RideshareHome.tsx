// app/components/RideshareHome.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  Easing,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
  MapPin,
  ChevronDown,
  Clock,
  Car,
  Search,
  X,
  Home as HomeIcon,
  Truck,
  Key,
  Fuel,
  Tool,
  Battery,
  CreditCard,
  Star,
  MessageSquare,
  Phone,
  ChevronRight,
  Calendar,
  Building,
  Briefcase,
  Settings,
  User,
  Heart,
  Compass,
} from "lucide-react-native";

// Import the TopHeader component
import TopHeader from "./TopHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  eta: string;
  description: string;
}

interface ServiceOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  eta: string;
  description: string;
}

interface Promotion {
  id: string;
  image: string;
  headline: string;
  cta_text: string;
}

interface TripCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface Suggestion {
  id: string;
  icon: React.ReactNode;
  label: string;
  promo_flag?: boolean;
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

const RideshareHome = ({
  onSwitchMode = () => {},
  onToggleMode = () => {},
  onNavigateToLanding = () => {},
  userLocation = "Current Location",
  mode = "ride",
  onModeChange = () => {},
}: RideshareHomeProps) => {
  // Placeholder text for search bar
  const placeholder = mode === "ride" ? "Where to?" : "Search for services";
  // State for ride flow
  const [destination, setDestination] = useState("");
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [currentTab, setCurrentTab] = useState("home");
  const [driverStatus, setDriverStatus] = useState<
    "idle" | "assigned" | "arriving" | "arrived" | "started" | "completed"
  >("idle");
  const [showTripSummary, setShowTripSummary] = useState(false);
  const [tipAmount, setTipAmount] = useState(2);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  // Mock driver data
  const driverInfo = {
    name: "Michael Chen",
    rating: 4.92,
    vehicle: "Tesla Model 3",
    licensePlate: "ABC123",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    eta: "3 min",
  };

  // Mock pricing breakdown
  const pricingBreakdown = {
    base: 5.99,
    distanceFee: 4.5,
    timeFee: 2.25,
    surgeMultiplier: 1.2,
    promoDiscount: -2.0,
    totalEstimate: 12.99,
  };

  // State for roadside flow
  const [selectedService, setSelectedService] = useState("");
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showServicePayment, setShowServicePayment] = useState(false);
  const [showServiceTracking, setShowServiceTracking] = useState(false);

  // Animation values
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const searchOverlayOpacity = useRef(new Animated.Value(0)).current;
  const driverMarkerPulse = useRef(new Animated.Value(1)).current;
  const driverMarkerPosition = useRef(new Animated.Value(0)).current;
  const routeProgress = useRef(new Animated.Value(0)).current;

  // Map control states
  const [isMapCentered, setIsMapCentered] = useState(true);

  // Additional car markers for ambient traffic
  const [trafficCars, setTrafficCars] = useState([
    { id: "car1", position: { top: "30%", left: "20%" }, rotation: 45 },
    { id: "car2", position: { top: "50%", left: "70%" }, rotation: 180 },
    { id: "car3", position: { top: "70%", left: "40%" }, rotation: 270 },
    { id: "car4", position: { top: "40%", left: "60%" }, rotation: 90 },
  ]);

  // Mock data for ride options
  const rideOptions: RideOption[] = [
    {
      id: "economy",
      name: "Economy",
      icon: <Car size={24} color="#1FBAD6" />,
      price: "$12.99",
      eta: "3 min",
      description: "Affordable rides for up to 4 people",
    },
    {
      id: "comfort",
      name: "Comfort",
      icon: <Car size={24} color="#1FBAD6" />,
      price: "$18.50",
      eta: "4 min",
      description: "Newer cars with extra legroom",
    },
    {
      id: "xl",
      name: "XL",
      icon: <Car size={24} color="#1FBAD6" />,
      price: "$24.75",
      eta: "6 min",
      description: "Spacious rides for groups up to 6",
    },
  ];

  // Mock data for roadside services
  const roadsideServices: ServiceOption[] = [
    {
      id: "tow",
      name: "Tow",
      icon: <Truck size={24} color="#1FBAD6" />,
      price: "$79.99",
      eta: "25 min",
      description: "Vehicle towing service up to 10 miles",
    },
    {
      id: "lockout",
      name: "Lockout",
      icon: <Key size={24} color="#1FBAD6" />,
      price: "$49.99",
      eta: "20 min",
      description: "Vehicle lockout assistance",
    },
    {
      id: "fuel",
      name: "Fuel Delivery",
      icon: <Fuel size={24} color="#1FBAD6" />,
      price: "$39.99",
      eta: "15 min",
      description: "Emergency fuel delivery (up to 2 gallons)",
    },
    {
      id: "tire",
      name: "Tire Change",
      icon: <Tool size={24} color="#1FBAD6" />,
      price: "$59.99",
      eta: "18 min",
      description: "Flat tire change with your spare",
    },
    {
      id: "jump",
      name: "Jump Start",
      icon: <Battery size={24} color="#1FBAD6" />,
      price: "$44.99",
      eta: "15 min",
      description: "Battery jump start service",
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
        "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&q=80",
      headline: "Try our new premium service",
      cta_text: "Learn More",
    },
    {
      id: "promo3",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      headline: "Refer friends, get $10 credit",
      cta_text: "Share Now",
    },
  ];

  // Mock data for trip planning cards
  const tripCards: TripCard[] = [
    {
      id: "rental",
      icon: <Car size={24} color="#1FBAD6" />,
      title: "Easy car rentals",
      subtitle: "Book hourly or daily",
    },
    {
      id: "reserve",
      icon: <Calendar size={24} color="#1FBAD6" />,
      title: "Reserve and relax",
      subtitle: "Book up to 30 days ahead",
    },
    {
      id: "business",
      icon: <Briefcase size={24} color="#1FBAD6" />,
      title: "Business travel",
      subtitle: "Manage work expenses",
    },
  ];

  // Mock data for suggestions
  const suggestions: Suggestion[] = [
    {
      id: "roadside",
      icon: <Truck size={24} color="#1FBAD6" />,
      label: "Roadside",
    },
    {
      id: "reserve",
      icon: <Calendar size={24} color="#1FBAD6" />,
      label: "Reserve",
    },
    {
      id: "rental",
      icon: <Car size={24} color="#1FBAD6" />,
      label: "Rental Cars",
    },
    {
      id: "food",
      icon: <Truck size={24} color="#1FBAD6" />,
      label: "Food",
      promo_flag: true,
    },
  ];

  // Mock data for saved locations
  const savedLocations: SavedLocation[] = [
    {
      id: "current",
      label: "Current location",
      address: userLocation,
      icon: <MapPin size={24} color="#1FBAD6" />,
    },
    {
      id: "home",
      label: "Home",
      address: "123 Main Street",
      icon: <HomeIcon size={24} color="#1FBAD6" />,
    },
    {
      id: "work",
      label: "Work",
      address: "456 Market Street",
      icon: <Building size={24} color="#1FBAD6" />,
    },
  ];

  // Handle destination input and search
  const handleDestinationSubmit = () => {
    if (destination.trim()) {
      setShowSearchOverlay(false);
      // Simulate API call to fetch ride options
      setTimeout(() => {
        setShowRouteOptions(true);
      }, 500);
    }
  };

  const handleClearDestination = () => {
    setDestination("");
    setShowRouteOptions(false);
  };

  // Handle ride selection
  const handleRideSelect = (rideId: string) => {
    setSelectedRideType(rideId);
  };

  // Handle ride confirmation
  const handleConfirmRide = () => {
    setShowRouteOptions(false);
    setShowPayment(true);
  };

  // Handle payment selection
  const handlePaymentSelect = (paymentMethod: string) => {
    // Simulate payment processing
    setShowPayment(false);
    setShowTracking(true);

    // Start driver marker pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(driverMarkerPulse, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(driverMarkerPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Simulate driver assignment after 2 seconds
    setTimeout(() => {
      setDriverStatus("assigned");

      // Synchronize driver movement and route progress
      Animated.parallel([
        Animated.timing(driverMarkerPosition, {
          toValue: 0.3,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(routeProgress, {
          toValue: 0.3,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();
    }, 2000);

    // Simulate driver arriving after 5 seconds
    setTimeout(() => {
      setDriverStatus("arriving");

      // Continue synchronized movement
      Animated.parallel([
        Animated.timing(driverMarkerPosition, {
          toValue: 0.7,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(routeProgress, {
          toValue: 0.7,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();
    }, 5000);

    // Simulate driver arrived after 8 seconds
    setTimeout(() => {
      setDriverStatus("arrived");

      // Continue synchronized movement
      Animated.parallel([
        Animated.timing(driverMarkerPosition, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(routeProgress, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();
    }, 8000);

    // Simulate trip started after 10 seconds
    setTimeout(() => {
      setDriverStatus("started");

      // Complete synchronized movement
      Animated.parallel([
        Animated.timing(driverMarkerPosition, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(routeProgress, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();
    }, 10000);

    // Simulate trip completed after 15 seconds
    setTimeout(() => {
      setDriverStatus("completed");
      setShowTripSummary(true);
    }, 15000);

    // Animate traffic cars
    const trafficInterval = setInterval(() => {
      setTrafficCars((prev) =>
        prev.map((car) => ({
          ...car,
          position: {
            top: `${Math.random() * 70 + 10}%`,
            left: `${Math.random() * 70 + 10}%`,
          },
          rotation: Math.random() * 360,
        })),
      );
    }, 3000);

    // Clear interval when trip is completed
    setTimeout(() => {
      clearInterval(trafficInterval);
    }, 15000);
  };

  // Handle trip completion
  const handleTripComplete = () => {
    setShowTripSummary(false);
    setShowTracking(false);
    setDriverStatus("idle");
    setSelectedRideType("");
    setDestination("");

    // Reset animations
    driverMarkerPosition.setValue(0);
    routeProgress.setValue(0);
  };

  // Handle map recenter
  const handleRecenterMap = () => {
    setIsMapCentered(true);
    // In a real app, this would recenter the map on the driver
    console.log("Recentering map...");
  };

  // Handle service selection for roadside assistance
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowServiceDetails(true);
  };

  // Handle request service for roadside assistance
  const handleRequestService = () => {
    setShowServiceDetails(false);
    setShowServicePayment(true);
  };

  // Handle payment confirmation for roadside assistance
  const handleConfirmPayment = () => {
    setShowServicePayment(false);
    setShowServiceTracking(true);
  };

  // Handle back to services list
  const handleBackToServices = () => {
    setShowServiceDetails(false);
    setSelectedService("");
  };

  // Handle tab navigation
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);

    if (tab === "services") {
      onModeChange("roadside");
    } else if (tab === "explore") {
      setShowSearchOverlay(true);
    }
  };

  // Handle search overlay animation
  useEffect(() => {
    if (showSearchOverlay) {
      Animated.timing(searchOverlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchOverlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showSearchOverlay]);

  // Render promotion card
  const renderPromotionCard = ({ item }: { item: Promotion }) => (
    <View style={styles.promotionCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.promotionImage}
        contentFit="cover"
      />
      <View style={styles.promotionOverlay}>
        <Text style={styles.promotionHeadline}>{item.headline}</Text>
        <TouchableOpacity style={styles.promotionButton}>
          <Text style={styles.promotionButtonText}>{item.cta_text}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render trip planning card
  const renderTripCard = ({ item }: { item: TripCard }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripCardIconContainer}>{item.icon}</View>
      <Text style={styles.tripCardTitle}>{item.title}</Text>
      <Text style={styles.tripCardSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  // Render suggestion tile
  const renderSuggestionTile = ({ item }: { item: Suggestion }) => (
    <TouchableOpacity
      style={styles.suggestionTile}
      onPress={() => {
        if (item.id === "roadside") {
          onModeChange("roadside");
          setCurrentTab("services");
        } else if (item.id === "food") {
          onModeChange("food");
        }
      }}
    >
      <View style={styles.suggestionIconContainer}>{item.icon}</View>
      <Text style={styles.suggestionLabel}>{item.label}</Text>
      {item.promo_flag && <View style={styles.promoFlag} />}
    </TouchableOpacity>
  );

  // Render saved location row
  const renderSavedLocation = ({ item }: { item: SavedLocation }) => (
    <TouchableOpacity style={styles.savedLocationRow}>
      <View style={styles.savedLocationIcon}>{item.icon}</View>
      <View style={styles.savedLocationTextContainer}>
        <Text style={styles.savedLocationLabel}>{item.label}</Text>
        <Text style={styles.savedLocationAddress}>{item.address}</Text>
      </View>
      <ChevronRight size={20} color="#888888" />
    </TouchableOpacity>
  );

  // Render bottom navigation
  const renderBottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        style={styles.navTab}
        onPress={() => handleTabChange("home")}
      >
        <HomeIcon
          size={24}
          color={currentTab === "home" ? "#1FBAD6" : "#888888"}
        />
        <Text
          style={[
            styles.navTabText,
            currentTab === "home" && styles.activeTabText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => handleTabChange("services")}
      >
        <Truck
          size={24}
          color={currentTab === "services" ? "#1FBAD6" : "#888888"}
        />
        <Text
          style={[
            styles.navTabText,
            currentTab === "services" && styles.activeTabText,
          ]}
        >
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => handleTabChange("explore")}
      >
        <Compass
          size={24}
          color={currentTab === "explore" ? "#1FBAD6" : "#888888"}
        />
        <Text
          style={[
            styles.navTabText,
            currentTab === "explore" && styles.activeTabText,
          ]}
        >
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => handleTabChange("account")}
      >
        <User
          size={24}
          color={currentTab === "account" ? "#1FBAD6" : "#888888"}
        />
        <Text
          style={[
            styles.navTabText,
            currentTab === "account" && styles.activeTabText,
          ]}
        >
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render search overlay
  const renderSearchOverlay = () => (
    <Animated.View
      style={[styles.searchOverlay, { opacity: searchOverlayOpacity }]}
      pointerEvents={showSearchOverlay ? "auto" : "none"}
    >
      <View style={styles.searchOverlayHeader}>
        <TouchableOpacity
          style={styles.searchOverlayCloseButton}
          onPress={() => setShowSearchOverlay(false)}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.searchOverlayTitle}>Where to?</Text>
        <TouchableOpacity style={styles.laterButton}>
          <Calendar size={16} color="#00E676" />
          <Text style={styles.laterButtonText}>Later</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Saved Locations</Text>
      <ScrollView style={styles.savedLocationsContainer}>
        {savedLocations.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.savedLocationRow}
            onPress={() => {
              setDestination(item.address);
              setShowSearchOverlay(false);
              setTimeout(() => {
                setShowRouteOptions(true);
              }, 500);
            }}
          >
            <View style={styles.savedLocationIcon}>{item.icon}</View>
            <View style={styles.savedLocationTextContainer}>
              <Text style={styles.savedLocationLabel}>{item.label}</Text>
              <Text style={styles.savedLocationAddress}>{item.address}</Text>
            </View>
            <ChevronRight size={20} color="#888888" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Suggestions</Text>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestionTile}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      />
    </Animated.View>
  );

  // Render ride home screen
  const renderRideHomeScreen = () => (
    <ScrollView
      style={styles.homeScrollView}
      showsVerticalScrollIndicator={false}
    >
      {/* Promotions Carousel */}
      <View style={styles.sectionContainer}>
        <FlatList
          data={promotions}
          renderItem={renderPromotionCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={280 + 16} // card width + margin
          decelerationRate="fast"
          contentContainerStyle={styles.promotionsContainer}
        />
        <View style={styles.paginationDots}>
          {promotions.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, index === 0 && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Trip Planning Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Plan your next trip</Text>
        <FlatList
          data={tripCards}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tripCardsContainer}
        />
      </View>

      {/* Suggestions Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>More ways to use</Text>
        <View style={styles.suggestionsGrid}>
          {suggestions.map((item) => (
            <View key={item.id} style={styles.suggestionGridItem}>
              {renderSuggestionTile({ item })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Render roadside assistance screen
  const renderRoadsideScreen = () => (
    <View style={styles.roadsideContainer}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#2d3748",
        }}
      >
        {/* Map Grid Pattern */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        >
          {/* Grid lines for professional map look */}
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={{
                position: "absolute",
                left: `${(i + 1) * 10}%`,
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: "#4a5568",
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={{
                position: "absolute",
                top: `${(i + 1) * 12.5}%`,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "#4a5568",
              }}
            />
          ))}
        </View>
      </View>

      {/* Roadside Services List */}
      {!showServiceDetails && !showServicePayment && !showServiceTracking && (
        <View style={styles.serviceListContainer}>
          <Text style={styles.serviceListTitle}>Roadside Assistance</Text>
          <Text style={styles.serviceListSubtitle}>
            Select the service you need:
          </Text>
          <ScrollView style={styles.serviceList}>
            {roadsideServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServiceSelect(service.id)}
              >
                <View style={styles.serviceIconContainer}>{service.icon}</View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>
                <View style={styles.servicePricing}>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                  <View style={styles.serviceEtaContainer}>
                    <Clock size={14} color="#888888" />
                    <Text style={styles.serviceEta}>{service.eta}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Service Details */}
      {showServiceDetails && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>
            {roadsideServices.find((s) => s.id === selectedService)?.name}
          </Text>
          <View style={styles.serviceDetailsContainer}>
            <Text style={styles.serviceDetailsLabel}>Service Details:</Text>
            <Text style={styles.serviceDetailsText}>
              {
                roadsideServices.find((s) => s.id === selectedService)
                  ?.description
              }
            </Text>
            <View style={styles.serviceDetailRow}>
              <Text style={styles.serviceDetailLabel}>Estimated arrival:</Text>
              <Text style={styles.serviceDetailValue}>
                {roadsideServices.find((s) => s.id === selectedService)?.eta}
              </Text>
            </View>
            <View style={styles.serviceDetailRow}>
              <Text style={styles.serviceDetailLabel}>Price:</Text>
              <Text style={styles.serviceDetailValue}>
                {roadsideServices.find((s) => s.id === selectedService)?.price}
              </Text>
            </View>
          </View>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleBackToServices}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRequestService}
            >
              <Text style={styles.primaryButtonText}>Request Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Payment */}
      {showServicePayment && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>Payment</Text>
          <View style={styles.paymentSummaryContainer}>
            <Text style={styles.paymentSummaryTitle}>Service Summary:</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>
                {roadsideServices.find((s) => s.id === selectedService)?.name}
              </Text>
              <Text style={styles.paymentValue}>
                {roadsideServices.find((s) => s.id === selectedService)?.price}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <Text style={styles.paymentValue}>$4.99</Text>
            </View>
            <View style={styles.paymentTotalRow}>
              <Text style={styles.paymentTotalLabel}>Total</Text>
              <Text style={styles.paymentTotalValue}>
                {"$" +
                  (
                    parseFloat(
                      roadsideServices
                        .find((s) => s.id === selectedService)
                        ?.price.replace("$", "") || "0",
                    ) + 4.99
                  ).toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.paymentButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tracking */}
      {showServiceTracking && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>Service Tracking</Text>
          <View style={styles.trackingContainer}>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>En Route</Text>
              </View>
            </View>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Technician:</Text>
              <Text style={styles.trackingValue}>John D.</Text>
            </View>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>ETA:</Text>
              <Text style={styles.trackingValue}>
                {roadsideServices.find((s) => s.id === selectedService)?.eta}
              </Text>
            </View>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Service:</Text>
              <Text style={styles.trackingValue}>
                {roadsideServices.find((s) => s.id === selectedService)?.name}
              </Text>
            </View>
          </View>
          <View style={styles.trackingActionsContainer}>
            <TouchableOpacity style={styles.trackingActionButton}>
              <Text style={styles.trackingActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trackingActionButton}>
              <Text style={styles.trackingActionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // Render ride options bottom sheet
  const renderRideOptionsSheet = () => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.rideOptionsSheet}
      onPress={() => setShowRouteOptions(false)}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setShowRouteOptions(false);
          setSelectedRideType("");
        }}
      >
        <ChevronRight
          size={24}
          color="#FFFFFF"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </TouchableOpacity>

      <View style={styles.bottomSheetHandle} />
      <Text style={styles.bottomSheetTitle}>Choose your ride</Text>

      {/* Payment Method Selection */}
      <TouchableOpacity
        style={styles.paymentMethodSelector}
        onPress={() => setShowPayment(true)}
      >
        <CreditCard size={20} color="#FFFFFF" />
        <Text style={styles.paymentMethodText}>Visa •••• 4242</Text>
        <ChevronDown size={16} color="#888888" />
      </TouchableOpacity>

      <ScrollView style={styles.rideOptionsList}>
        {rideOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.rideOptionCard,
              selectedRideType === option.id && styles.selectedRideOption,
            ]}
            onPress={() => handleRideSelect(option.id)}
          >
            <View style={styles.rideOptionIcon}>{option.icon}</View>
            <View style={styles.rideOptionInfo}>
              <Text style={styles.rideOptionName}>{option.name}</Text>
              <View style={styles.rideOptionEtaContainer}>
                <Clock size={14} color="#888888" />
                <Text style={styles.rideOptionEta}>{option.eta} away</Text>
              </View>
              <Text style={styles.rideOptionDescription}>
                {option.description}
              </Text>
            </View>
            <Text style={styles.rideOptionPrice}>{option.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.confirmRideButton}
        onPress={handleConfirmRide}
      >
        <Text style={styles.confirmRideButtonText}>
          Confirm{" "}
          {selectedRideType
            ? rideOptions.find((r) => r.id === selectedRideType)?.name
            : rideOptions[0].name}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render payment method selection modal
  const renderPaymentMethodModal = () => (
    <Modal
      visible={showPayment}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPayment(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.paymentModalContainer}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>Payment Method</Text>

          <ScrollView style={styles.paymentMethodsList}>
            <TouchableOpacity
              style={[styles.paymentMethodCard, styles.selectedPaymentMethod]}
              onPress={() => handlePaymentSelect("visa")}
            >
              <CreditCard size={24} color="#00E676" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>Visa •••• 4242</Text>
                <Text style={styles.paymentMethodExpiry}>Expires 04/25</Text>
              </View>
              <View style={styles.paymentMethodCheckmark}>
                <View style={styles.checkmarkCircle} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentMethodCard}
              onPress={() => handlePaymentSelect("mastercard")}
            >
              <CreditCard size={24} color="#00E676" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>
                  Mastercard •••• 5678
                </Text>
                <Text style={styles.paymentMethodExpiry}>Expires 08/24</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addPaymentButton}>
              <Text style={styles.addPaymentButtonText}>
                + Add Payment Method
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.confirmPaymentButton}
            onPress={() => handlePaymentSelect("visa")}
          >
            <Text style={styles.confirmPaymentButtonText}>
              Confirm Payment Method
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render driver tracking view
  const renderDriverTracking = () => (
    <View style={styles.driverTrackingContainer}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setShowTracking(false);
          setDriverStatus("idle");
        }}
      >
        <ChevronRight
          size={24}
          color="#FFFFFF"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </TouchableOpacity>

      {/* Professional Enhanced Map with Animated Route */}
      <View style={styles.mapContainer}>
        {/* Professional Dark Map Background */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#2d3748",
          }}
        >
          {/* Map Grid Pattern */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
            }}
          >
            {/* Vertical lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={{
                  position: "absolute",
                  left: `${(i + 1) * 10}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: "#4a5568",
                }}
              />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: "absolute",
                  top: `${(i + 1) * 12.5}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: "#4a5568",
                }}
              />
            ))}
          </View>

          {/* Road Network */}
          <View
            style={{
              position: "absolute",
              top: "15%",
              left: "10%",
              right: "10%",
              bottom: "15%",
            }}
          >
            {/* Main horizontal road */}
            <View
              style={{
                position: "absolute",
                top: "60%",
                left: 0,
                right: 0,
                height: 6,
                backgroundColor: "#4a5568",
                borderRadius: 3,
              }}
            />
            {/* Vertical road */}
            <View
              style={{
                position: "absolute",
                left: "70%",
                top: 0,
                bottom: 0,
                width: 6,
                backgroundColor: "#4a5568",
                borderRadius: 3,
              }}
            />
            {/* Diagonal connecting road */}
            <View
              style={{
                position: "absolute",
                top: "30%",
                left: "20%",
                width: "50%",
                height: 4,
                backgroundColor: "#4a5568",
                borderRadius: 2,
                transform: [{ rotate: "25deg" }],
              }}
            />
          </View>
        </View>

        {/* Professional Origin Marker */}
        <View style={[styles.locationMarker, { top: "65%", left: "20%" }]}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              borderWidth: 3,
              borderColor: "#2d3748",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#4299e1",
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
              Pickup
            </Text>
          </View>
        </View>

        {/* Professional Destination Marker */}
        <View style={[styles.locationMarker, { top: "25%", left: "70%" }]}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              borderWidth: 3,
              borderColor: "#2d3748",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#48bb78",
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
              Destination
            </Text>
          </View>
        </View>

        {/* Professional Route Path - Curved to match car movement */}
        <View
          style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            width: "50%",
            height: 6,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            transform: [{ rotate: "25deg" }],
            zIndex: 2,
          }}
        >
          {/* Animated progress indicator */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 3,
              width: routeProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>

        {/* Professional Driver Car Marker - Following the route path */}
        <Animated.View
          style={[
            styles.driverMarkerContainer,
            {
              top: driverMarkerPosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ["65%", "47%", "25%"],
              }),
              left: driverMarkerPosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ["20%", "45%", "70%"],
              }),
              transform: [{ scale: driverMarkerPulse }],
            },
          ]}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18 }}>🚗</Text>
          </View>
        </Animated.View>

        {/* Professional Recenter Button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 10,
          }}
          onPress={handleRecenterMap}
        >
          <MapPin size={20} color={isMapCentered ? "#4299e1" : "#718096"} />
        </TouchableOpacity>
      </View>

      {/* Driver status banner */}
      {driverStatus === "assigned" && (
        <View style={styles.driverStatusBanner}>
          <Text style={styles.driverStatusText}>Driver assigned</Text>
          <Text style={styles.driverEtaText}>Arriving in {driverInfo.eta}</Text>
        </View>
      )}

      {driverStatus === "arriving" && (
        <View style={styles.driverStatusBanner}>
          <Text style={styles.driverStatusText}>Driver is on the way</Text>
          <Text style={styles.driverEtaText}>Arriving in {driverInfo.eta}</Text>
        </View>
      )}

      {driverStatus === "arrived" && (
        <View style={[styles.driverStatusBanner, styles.driverArrivedBanner]}>
          <Text style={styles.driverStatusText}>Driver has arrived</Text>
          <Text style={styles.driverEtaText}>Meet at pickup location</Text>
        </View>
      )}

      {driverStatus === "started" && (
        <View style={styles.tripProgressContainer}>
          <View style={styles.tripProgressBar}>
            <View style={[styles.tripProgressFill, { width: "60%" }]} />
          </View>
          <Text style={styles.tripEtaText}>Arriving in 5 minutes</Text>
        </View>
      )}

      {/* Driver info card */}
      <View style={styles.driverInfoCard}>
        <View style={styles.driverInfoHeader}>
          <Text style={styles.driverInfoTitle}>
            {driverStatus === "started"
              ? "On the way to destination"
              : "Your driver is coming"}
          </Text>
          {driverStatus === "started" && (
            <Text style={styles.tripTimeRemaining}>5 min</Text>
          )}
        </View>

        <View style={styles.driverInfoContent}>
          <Image
            source={{ uri: driverInfo.photoUrl }}
            style={styles.driverPhoto}
            contentFit="cover"
            transition={500}
          />

          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driverInfo.name}</Text>
            <View style={styles.driverRatingContainer}>
              <Star size={14} color="#FFD700" />
              <Text style={styles.driverRatingText}>{driverInfo.rating}</Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {driverInfo.vehicle} • {driverInfo.licensePlate}
            </Text>
          </View>

          <View style={styles.driverContactButtons}>
            <TouchableOpacity style={styles.driverContactButton}>
              <MessageSquare size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.driverContactButton}>
              <Phone size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Render trip summary modal
  const renderTripSummaryModal = () => (
    <Modal
      visible={showTripSummary}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTripSummary(false)}
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.tripSummaryScrollView}>
          <View style={styles.tripSummaryContainer}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.tripSummaryTitle}>You've arrived!</Text>

            <View style={styles.tripSummaryContent}>
              {/* Fare breakdown */}
              <View style={styles.fareBreakdownContainer}>
                <Text style={styles.fareBreakdownTitle}>Fare Breakdown</Text>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Base fare</Text>
                  <Text style={styles.fareValue}>
                    ${pricingBreakdown.base.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Distance</Text>
                  <Text style={styles.fareValue}>
                    ${pricingBreakdown.distanceFee.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Time</Text>
                  <Text style={styles.fareValue}>
                    ${pricingBreakdown.timeFee.toFixed(2)}
                  </Text>
                </View>
                {pricingBreakdown.surgeMultiplier > 1 && (
                  <View style={styles.fareRow}>
                    <Text style={styles.fareLabel}>
                      Surge (x{pricingBreakdown.surgeMultiplier})
                    </Text>
                    <Text style={styles.fareValue}>
                      $
                      {(
                        (pricingBreakdown.base +
                          pricingBreakdown.distanceFee +
                          pricingBreakdown.timeFee) *
                        (pricingBreakdown.surgeMultiplier - 1)
                      ).toFixed(2)}
                    </Text>
                  </View>
                )}
                {pricingBreakdown.promoDiscount < 0 && (
                  <View style={styles.fareRow}>
                    <Text style={styles.fareLabel}>Promotion</Text>
                    <Text style={styles.fareValue}>
                      ${pricingBreakdown.promoDiscount.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.fareTotalRow}>
                  <Text style={styles.fareTotalLabel}>Total</Text>
                  <Text style={styles.fareTotalValue}>
                    ${pricingBreakdown.totalEstimate.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Tip slider */}
              <View style={styles.tipContainer}>
                <Text style={styles.tipTitle}>
                  Add a tip for {driverInfo.name}
                </Text>
                <View style={styles.tipButtonsContainer}>
                  {[0, 1, 2, 5].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.tipButton,
                        tipAmount === amount && styles.selectedTipButton,
                      ]}
                      onPress={() => setTipAmount(amount)}
                    >
                      <Text
                        style={[
                          styles.tipButtonText,
                          tipAmount === amount && styles.selectedTipButtonText,
                        ]}
                      >
                        {amount === 0 ? "No tip" : `$${amount}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingTitle}>Rate your trip</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Star
                        size={32}
                        color={star <= rating ? "#FFD700" : "#555555"}
                        fill={star <= rating ? "#FFD700" : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Feedback */}
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>
                  Add feedback (optional)
                </Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Tell us about your experience"
                  placeholderTextColor="#888888"
                  multiline
                  numberOfLines={3}
                  value={feedback}
                  onChangeText={setFeedback}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTripComplete}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
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
      <View style={styles.content}>
        {/* Professional Map Background (for ride mode) */}
        {mode === "ride" && !showTracking && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "#2d3748",
            }}
          >
            {/* Map Grid Pattern */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.08,
              }}
            >
              {/* Vertical lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={{
                    position: "absolute",
                    left: `${(i + 1) * 8.33}%`,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: "#4a5568",
                  }}
                />
              ))}
              {/* Horizontal lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={{
                    position: "absolute",
                    top: `${(i + 1) * 10}%`,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: "#4a5568",
                  }}
                />
              ))}
            </View>

            {/* Road Network */}
            <View
              style={{
                position: "absolute",
                top: "20%",
                left: "10%",
                right: "10%",
                bottom: "20%",
              }}
            >
              {/* Main roads */}
              <View
                style={{
                  position: "absolute",
                  top: "30%",
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: "#4a5568",
                  borderRadius: 2,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: "70%",
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: "#4a5568",
                  borderRadius: 2,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  left: "30%",
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: "#4a5568",
                  borderRadius: 2,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  left: "70%",
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: "#4a5568",
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        )}

        {/* Ride Home Screen */}
        {mode === "ride" &&
          currentTab === "home" &&
          !showRouteOptions &&
          !showTracking &&
          renderRideHomeScreen()}

        {/* Ride Options */}
        {mode === "ride" &&
          showRouteOptions &&
          !showTracking &&
          renderRideOptionsSheet()}

        {/* Driver Tracking */}
        {mode === "ride" && showTracking && renderDriverTracking()}

        {/* Roadside Assistance Screen */}
        {mode === "roadside" && renderRoadsideScreen()}

        {/* Search Overlay */}
        {renderSearchOverlay()}

        {/* Payment Method Modal */}
        {renderPaymentMethodModal()}

        {/* Trip Summary Modal */}
        {renderTripSummaryModal()}
      </View>

      {/* Bottom Navigation */}
      {renderBottomNavigation()}
    </View>
  );
};

const styles = StyleSheet.create({
  savedLocationsContainer: {
    maxHeight: 200,
  },
  tripSummaryScrollView: {
    maxHeight: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  // Search container styles removed - functionality moved to TopHeader
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  locationMarker: {
    position: "absolute",
    alignItems: "center",
    zIndex: 5,
  },
  originMarker: {
    backgroundColor: "#1FBAD6",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  destinationMarker: {
    backgroundColor: "#00E676",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  markerLabel: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  markerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  routePathContainer: {
    position: "absolute",
    top: "70%",
    left: "20%",
    width: "50%",
    height: 4,
    backgroundColor: "transparent",
    transform: [{ rotate: "-45deg" }],
    zIndex: 2,
  },
  routePath: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 2,
  },
  routeProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#1FBAD6",
    borderRadius: 2,
  },
  driverMarkerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  driverMarker: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  trafficCar: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.7)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  recenterButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  recenterButtonInner: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  recenterButtonActive: {
    backgroundColor: "#1FBAD6",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  paymentModalContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  paymentMethodsList: {
    maxHeight: 300,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderWidth: 2,
    borderColor: "#00E676",
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    fontFamily: "Roboto",
  },
  paymentMethodExpiry: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  paymentMethodCheckmark: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00E676",
  },
  addPaymentButton: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addPaymentButtonText: {
    fontSize: 16,
    color: "#00E676",
    fontFamily: "Roboto",
  },
  confirmPaymentButton: {
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  confirmPaymentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  driverTrackingContainer: {
    flex: 1,
    position: "relative",
  },
  driverStatusBanner: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    flexDirection: "column",
    alignItems: "center",
  },
  driverArrivedBanner: {
    backgroundColor: "#00E676",
  },
  driverStatusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  driverEtaText: {
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  tripProgressContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
  },
  tripProgressBar: {
    height: 6,
    backgroundColor: "#333333",
    borderRadius: 3,
    marginBottom: 8,
  },
  tripProgressFill: {
    height: 6,
    backgroundColor: "#00E676",
    borderRadius: 3,
  },
  tripEtaText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  driverInfoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  driverInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  driverInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  tripTimeRemaining: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00E676",
    fontFamily: "Roboto",
  },
  driverInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  driverRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  driverRatingText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 4,
    fontFamily: "Roboto",
  },
  vehicleInfo: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  driverContactButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverContactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tripSummaryContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  tripSummaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  tripSummaryContent: {
    maxHeight: 500,
  },
  fareBreakdownContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  fareBreakdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    fontFamily: "Roboto",
  },
  fareValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  fareTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#444444",
  },
  fareTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  fareTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  tipContainer: {
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  tipButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedTipButton: {
    backgroundColor: "#00E676",
  },
  tipButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  selectedTipButtonText: {
    fontWeight: "bold",
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  feedbackInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    height: 100,
    textAlignVertical: "top",
    fontFamily: "Roboto",
  },
  submitButton: {
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  pricingBreakdownContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  pricingBreakdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    fontFamily: "Roboto",
  },
  pricingValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  pricingTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#444444",
  },
  pricingTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  pricingTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  paymentMethodSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    fontFamily: "Roboto",
  },
  whereToButton: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  whereToText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#888888",
    fontFamily: "Roboto",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navTabText: {
    fontSize: 10,
    marginTop: 4,
    color: "#888888",
    fontFamily: "Roboto",
  },
  activeTabText: {
    color: "#1FBAD6",
  },
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#121212",
    zIndex: 10,
  },
  searchOverlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  searchOverlayCloseButton: {
    padding: 4,
  },
  searchOverlayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  laterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  laterButtonText: {
    marginLeft: 4,
    color: "#00E676",
    fontFamily: "Roboto",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    margin: 16,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  savedLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  savedLocationIcon: {
    marginRight: 16,
  },
  savedLocationTextContainer: {
    flex: 1,
  },
  savedLocationLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  savedLocationAddress: {
    fontSize: 14,
    color: "#888888",
    marginTop: 2,
    fontFamily: "Roboto",
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionTile: {
    width: 100,
    height: 100,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  promoFlag: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00E676",
  },
  homeScrollView: {
    flex: 1,
    backgroundColor: "#121212",
  },
  sectionContainer: {
    marginVertical: 16,
  },
  promotionsContainer: {
    paddingHorizontal: 16,
  },
  promotionCard: {
    width: 280,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  promotionImage: {
    width: "100%",
    height: "100%",
  },
  promotionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  promotionHeadline: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  promotionButton: {
    backgroundColor: "#00E676",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  promotionButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#00E676",
  },
  tripCardsContainer: {
    paddingHorizontal: 16,
  },
  tripCard: {
    width: 160,
    height: 100,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  tripCardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  tripCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  tripCardSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  suggestionGridItem: {
    width: "50%",
    paddingRight: 8,
    paddingBottom: 8,
  },
  roadsideContainer: {
    flex: 1,
    position: "relative",
  },
  serviceListContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  serviceListSubtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  serviceList: {
    maxHeight: 400,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  serviceIconContainer: {
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  serviceDescription: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  servicePricing: {
    alignItems: "flex-end",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  serviceEtaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  serviceEta: {
    fontSize: 12,
    color: "#888888",
    marginLeft: 4,
    fontFamily: "Roboto",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#555555",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  serviceDetailsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 16,
    marginBottom: 16,
  },
  serviceDetailsLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  serviceDetailsText: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  serviceDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceDetailLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    fontFamily: "Roboto",
  },
  serviceDetailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  paymentSummaryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 16,
    marginBottom: 16,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "Roboto",
  },
  paymentValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  paymentTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  paymentTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  paymentButton: {
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  trackingContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 16,
    marginBottom: 16,
  },
  trackingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  trackingLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    fontFamily: "Roboto",
  },
  trackingValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  statusBadge: {
    backgroundColor: "#00E676",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  trackingActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackingActionButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  trackingActionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  rideOptionsSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: "80%",
  },
  rideOptionsList: {
    maxHeight: 300,
  },
  rideOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  selectedRideOption: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#00E676",
  },
  rideOptionIcon: {
    marginRight: 12,
  },
  rideOptionInfo: {
    flex: 1,
  },
  rideOptionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  rideOptionEtaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rideOptionEta: {
    fontSize: 12,
    color: "#888888",
    marginLeft: 4,
    fontFamily: "Roboto",
  },
  rideOptionDescription: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Roboto",
  },
  rideOptionPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  confirmRideButton: {
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  confirmRideButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  tripSummaryScrollView: {
    maxHeight: 500,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default RideshareHome;
