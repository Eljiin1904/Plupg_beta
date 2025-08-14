import React, { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ViewToken,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Home,
  ShoppingBag,
  Compass,
  ClipboardList,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoCard from "./VideoCard";
import mockExploreVideos, { ExploreVideo } from "../data/mockExploreVideos";
import TopHeader from "./TopHeader";
import MobileImageComponent from './MobileImageComponent';

interface CategoryProps {
  id: string;
  name: string;
  image: string;
}

interface ExploreScreenProps {
  onSwitchMode?: () => void;
  onSelectRestaurant?: (restaurantId: string) => void;
  onNavigateToHome?: () => void;
}

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToHome?: () => void;
}

const BottomNavigation = ({
  currentTab,
  onTabChange,
  onNavigateToHome = () => console.log("Navigate to home"),
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
        onPress={() => {
          if (key === "home") {
            onNavigateToHome();
          } else {
            onTabChange(key);
          }
        }}
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

const CategoryCard = ({ category }: { category: CategoryProps }) => (
  <TouchableOpacity className="mr-4 w-24">
    <View className="rounded-lg overflow-hidden bg-dark-card">
      <MobileImageComponent
        source={category.image} // Can be string or { uri: string }
        style={{ width: 96, height: 96 }} // Explicit dimensions
        className="w-24 h-24 rounded-lg"
        contentFit="cover"
        showLoadingIndicator={true}
      />
    </View>
    <Text className="text-center mt-1 font-medium text-sm text-white">
      {category.name}
    </Text>
  </TouchableOpacity>
);
const RestaurantCard = ({ restaurant }: { restaurant: any }) => (
  <TouchableOpacity className="mr-4">
    <View className="rounded-lg overflow-hidden">
      <MobileImageComponent
        source={restaurant.image}
        style={{ width: 150, height: 150 }} // Explicit dimensions
        className="w-36 h-36"
        contentFit="cover"
      />
      {/* Rest of the card */}
    </View>
  </TouchableOpacity>
);

const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSwitchMode = () => console.log("Switch mode"),
  onSelectRestaurant = (id) => console.log("Select restaurant", id),
  onNavigateToHome = () => console.log("Navigate to home"),
}) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<string>("explore");
  const flatListRef = useRef<FlatList>(null);

  // Category data from FoodDeliveryHome
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
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 500,
    waitForInteraction: true,
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].isViewable) {
        const newIndex = viewableItems[0].index ?? 0;
        console.log("Changing active video to index:", newIndex);
        setActiveVideoIndex(newIndex);
      }
    },
    [],
  );

  const handleOrderNow = useCallback(
    (restaurantId: string) => {
      onSelectRestaurant(restaurantId);
    },
    [onSelectRestaurant],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ExploreVideo; index: number }) => (
      <VideoCard
        key={item.id}
        video={item}
        isActive={index === activeVideoIndex}
        onOrderNow={handleOrderNow}
      />
    ),
    [activeVideoIndex, handleOrderNow],
  );

  const keyExtractor = useCallback((item: ExploreVideo) => item.id, []);

  const handleModeToggle = useCallback(
    (mode: string) => {
      if (mode === "ride") onSwitchMode();
    },
    [onSwitchMode],
  );

  if (mockExploreVideos.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        <TopHeader mode="food" onModeToggle={handleModeToggle} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nothing to explore yet. Check back soon!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <TopHeader mode="food" onModeToggle={handleModeToggle} />

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Explore</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={flatListRef}
        data={mockExploreVideos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfigRef.current}
        snapToAlignment="start"
        decelerationRate="fast"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews={true}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 1,
        }}
        onScrollBeginDrag={() => {
          console.log("Scroll started, pausing all videos");
        }}
        onMomentumScrollEnd={() => {
          console.log("Scroll ended, resuming active video");
        }}
        style={styles.videoList}
      />

      <BottomNavigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onNavigateToHome={onNavigateToHome}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  videoList: {
    flex: 1,
  },
});

export default ExploreScreen;
