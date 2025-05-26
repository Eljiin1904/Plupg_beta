import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Search, MapPin, ChevronDown } from "lucide-react-native";

type Mode = "food" | "ride";

interface TopHeaderProps {
  mode?: Mode;
  onModeToggle?: (mode: Mode) => void;
  location?: string;
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

const TopHeader = ({
  mode = "food",
  onModeToggle = () => {},
  location = "Current Location",
}: TopHeaderProps) => {
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

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

  return (
    <View
      style={[
        styles.container,
        mode === "food" ? styles.foodMode : styles.rideMode,
      ]}
    >
      {/* Location and Mode Toggle */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.locationContainer}>
          <MapPin size={16} color={mode === "food" ? "#FF3008" : "#1FBAD6"} />
          <Text
            style={[
              styles.locationText,
              mode === "food" ? styles.foodText : styles.rideText,
            ]}
            numberOfLines={1}
          >
            {location}
          </Text>
          <ChevronDown
            size={16}
            color={mode === "food" ? "#FF3008" : "#1FBAD6"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeToggle,
            mode === "food" ? styles.foodToggle : styles.rideToggle,
          ]}
          onPress={() => onModeToggle(mode === "food" ? "ride" : "food")}
        >
          <Text style={styles.modeToggleText}>
            {mode === "food" ? "Ride" : "Food"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          mode === "food" ? styles.foodSearch : styles.rideSearch,
        ]}
      >
        <Search
          size={20}
          color={mode === "food" ? "#FF3008" : "#1FBAD6"}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  foodMode: {
    borderBottomColor: "#FFEBE8",
  },
  rideMode: {
    borderBottomColor: "#E6F8FB",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 4,
    flex: 1,
  },
  foodText: {
    color: "#333333",
    fontFamily: "System",
  },
  rideText: {
    color: "#333333",
    fontFamily: "System",
  },
  modeToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  foodToggle: {
    backgroundColor: "#FFEBE8",
  },
  rideToggle: {
    backgroundColor: "#E6F8FB",
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  foodSearch: {
    backgroundColor: "#FFEBE8",
  },
  rideSearch: {
    backgroundColor: "#E6F8FB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    padding: 0,
  },
});

export default TopHeader;
