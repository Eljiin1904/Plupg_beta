import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { Search } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

type Mode = "food" | "ride";
type HeaderState = "collapsed" | "expanded";

interface TopHeaderProps {
  mode?: Mode;
  onModeToggle?: (mode: Mode) => void;
  location?: string;
  onSearchFocus?: () => void;
  onSearchSubmit?: (text: string) => void;
}

const foodPlaceholders = [
  "Search for restaurants, cuisines, dishes...",
  "Craving pizza? Search here...",
  "Find your favorite food...",
  "Hungry? Discover nearby options...",
];

const ridePlaceholders = [
  "Where to?",
  "Enter destination",
  "Search for a location",
  "Find your destination",
];

const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 120;
const ANIMATION_DURATION = 200;

const TopHeader = ({
  mode = "food",
  onModeToggle = (mode: Mode) => {
    console.log("Mode toggled to:", mode);
  },
  location = "Current Location",
  onSearchFocus = () => {
    console.log("Search focused");
  },
  onSearchSubmit = (text: string) => {
    console.log("Search submitted with:", text);
  },
}: TopHeaderProps) => {
  const [placeholder, setPlaceholder] = useState("");
  const [searchText, setSearchText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [headerState, setHeaderState] = useState<HeaderState>("collapsed");
  const [lastTapTime, setLastTapTime] = useState(0);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  // Animation values
  const headerHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const toggleButtonsPosition = useRef(new Animated.Value(0)).current;

  // Rotate placeholders every 5 seconds
  useEffect(() => {
    const placeholders = mode === "food" ? foodPlaceholders : ridePlaceholders;
    setPlaceholder(placeholders[placeholderIndex]);

    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [mode, placeholderIndex]);

  // Update placeholder when mode changes
  useEffect(() => {
    const placeholders = mode === "food" ? foodPlaceholders : ridePlaceholders;
    setPlaceholder(placeholders[0]);
    setPlaceholderIndex(0);
  }, [mode]);

  const toggleHeaderState = () => {
    const now = Date.now();
    // Debounce to prevent animation jank (300ms)
    if (now - lastTapTime < 300) {
      return;
    }
    setLastTapTime(now);

    const newState = headerState === "collapsed" ? "expanded" : "collapsed";
    setHeaderState(newState);

    try {
      Animated.parallel([
        Animated.timing(headerHeight, {
          toValue: newState === "expanded" ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(searchOpacity, {
          toValue: newState === "expanded" ? 1 : 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(toggleButtonsPosition, {
          toValue: newState === "expanded" ? -20 : 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error("Animation failed:", error);
      // Revert to last stable state
      setHeaderState(headerState);
    }
  };

  const handleModeToggle = (selectedMode: Mode) => {
    onModeToggle(selectedMode);
  };

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => headerState === "expanded" && toggleHeaderState()}
    >
      <Animated.View style={[styles.container, { height: headerHeight }]}>
        {/* Top Row with Logo, Mode Indicator, and Search Icon */}
        <View style={styles.topRow}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/the-plug-logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Mode Indicator */}
          <Animated.View
            style={[
              styles.modeIndicatorContainer,
              {
                transform: [
                  {
                    translateY:
                      headerState === "expanded" ? 0 : toggleButtonsPosition,
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "food" && styles.activeModeButton,
              ]}
              onPress={() => handleModeToggle("food")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "food" && styles.activeModeText,
                ]}
              >
                Food
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "ride" && styles.activeModeButton,
              ]}
              onPress={() => handleModeToggle("ride")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "ride" && styles.activeModeText,
                ]}
              >
                Ride
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Search Icon */}
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={toggleHeaderState}
          >
            <Search size={24} color="#00E676" />
          </TouchableOpacity>
        </View>

        {/* Search Bar (only visible in expanded state) */}
        <Animated.View
          style={[styles.searchContainer, { opacity: searchOpacity }]}
          pointerEvents={headerState === "expanded" ? "auto" : "none"}
        >
          <Search size={20} color="#00E676" />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={onSearchFocus}
            onSubmitEditing={() => onSearchSubmit(searchText)}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: "#121212", // Dark mode background
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  modeIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    position: "relative",
    zIndex: 10,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4, // More streamlined, not pill-shaped
    backgroundColor: "rgba(64, 64, 64, 0.6)", // 60% opacity grey
    width: 100,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  activeModeButton: {
    backgroundColor: "#00E676", // Solid green when active
  },
  modeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Montserrat_600SemiBold",
  },
  activeModeText: {
    color: "#FFFFFF",
  },
  searchIconButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    padding: 0,
    fontFamily: "Montserrat_400Regular",
  },
});

export default TopHeader;
