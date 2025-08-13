import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingBag, AlertCircle, RefreshCw } from "lucide-react-native";

import {
  ordersApi,
  PastItemGroup,
  PastOrder,
  PastItem,
} from "../api/ordersApi";
import PastOrderItemCard from "./PastOrderItemCard";
import PastOrderSummaryCard from "./PastOrderSummaryCard";

interface OrdersScreenProps {
  onAddToCart?: (items: any[]) => void;
  onViewRestaurant?: (restaurantId: string) => void;
}

const OrdersScreen = ({
  onAddToCart = () => console.log("Add to cart"),
  onViewRestaurant = (id) => console.log("View restaurant", id),
}: OrdersScreenProps) => {
  const [activeTab, setActiveTab] = useState<"past_items" | "past_orders">(
    "past_items",
  );
  const [pastItemGroups, setPastItemGroups] = useState<PastItemGroup[]>([]);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [isLoadingPastItems, setIsLoadingPastItems] = useState(false);
  const [isLoadingPastOrders, setIsLoadingPastOrders] = useState(false);
  const [pastItemsError, setPastItemsError] = useState<string | null>(null);
  const [pastOrdersError, setPastOrdersError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load past items on component mount
  useEffect(() => {
    loadPastItems();
  }, []);

  // Load past orders when tab is switched
  useEffect(() => {
    if (activeTab === "past_orders" && pastOrders.length === 0) {
      loadPastOrders();
    }
  }, [activeTab]);

  const loadPastItems = async () => {
    try {
      setIsLoadingPastItems(true);
      setPastItemsError(null);
      const itemGroups = await ordersApi.fetchPastItems();
      setPastItemGroups(itemGroups);
    } catch (error: any) {
      setPastItemsError(error.message || "Failed to load past items");
    } finally {
      setIsLoadingPastItems(false);
    }
  };

  const loadPastOrders = async () => {
    try {
      setIsLoadingPastOrders(true);
      setPastOrdersError(null);
      const orders = await ordersApi.fetchPastOrders();
      setPastOrders(orders);
    } catch (error: any) {
      setPastOrdersError(error.message || "Failed to load past orders");
    } finally {
      setIsLoadingPastOrders(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "past_items") {
      await loadPastItems();
    } else {
      await loadPastOrders();
    }
    setRefreshing(false);
  };

  const handleAddItemToCart = async (itemId: string) => {
    return await ordersApi.addItemToCart(itemId);
  };

  const handleReorder = async (orderId: string) => {
    return await ordersApi.reorderPastOrder(orderId);
  };

  const handleViewStore = (restaurantId: string) => {
    onViewRestaurant(restaurantId);
  };

  const renderTabButton = (
    tab: "past_items" | "past_orders",
    label: string,
  ) => (
    <TouchableOpacity
      className={`flex-1 py-3 items-center border-b-2 ${
        activeTab === tab ? "border-[#00E676]" : "border-transparent"
      }`}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        className={`font-medium ${
          activeTab === tab ? "text-[#00E676]" : "text-white"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = (
    message: string,
    actionText: string,
    onAction: () => void,
  ) => (
    <View className="flex-1 items-center justify-center p-8">
      <ShoppingBag size={64} color="#666666" />
      <Text className="text-white text-lg font-bold mt-4 text-center">
        {message}
      </Text>
      <TouchableOpacity
        className="bg-[#00E676] py-3 px-6 rounded-lg mt-4"
        onPress={onAction}
      >
        <Text className="text-white font-bold">{actionText}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = (error: string, onRetry: () => void) => (
    <View className="flex-1 items-center justify-center p-8">
      <AlertCircle size={64} color="#00E676" />
      <Text className="text-white text-lg font-bold mt-4 text-center">
        Something went wrong
      </Text>
      <Text className="text-gray-400 text-center mt-2">{error}</Text>
      <TouchableOpacity
        className="bg-[#00E676] py-3 px-6 rounded-lg mt-4 flex-row items-center"
        onPress={onRetry}
      >
        <RefreshCw size={16} color="#FFFFFF" />
        <Text className="text-white font-bold ml-2">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPastItems = () => {
    if (isLoadingPastItems) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00E676" />
          <Text className="text-white mt-2">Loading past items...</Text>
        </View>
      );
    }

    if (pastItemsError) {
      return renderErrorState(pastItemsError, loadPastItems);
    }

    if (pastItemGroups.length === 0) {
      return renderEmptyState("No past items found", "Start Ordering", () =>
        console.log("Navigate to home"),
      );
    }

    return (
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00E676"
          />
        }
      >
        {pastItemGroups.map((group) => (
          <View key={group.restaurantId} className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold text-lg">
                {group.restaurantName}
              </Text>
              <Text className="text-gray-400 text-sm">
                ${group.deliveryInfo.fee.toFixed(2)} • {group.deliveryInfo.time}{" "}
                min
              </Text>
            </View>

            {group.items.map((item) => (
              <PastOrderItemCard
                key={item.itemId}
                item={item}
                onAddToCart={handleAddItemToCart}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderPastOrders = () => {
    if (isLoadingPastOrders) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00E676" />
          <Text className="text-white mt-2">Loading past orders...</Text>
        </View>
      );
    }

    if (pastOrdersError) {
      return renderErrorState(pastOrdersError, loadPastOrders);
    }

    if (pastOrders.length === 0) {
      return renderEmptyState("No past orders found", "Start Ordering", () =>
        console.log("Navigate to home"),
      );
    }

    return (
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00E676"
          />
        }
      >
        {pastOrders.map((order) => (
          <PastOrderSummaryCard
            key={order.orderId}
            order={order}
            onReorder={handleReorder}
            onViewStore={handleViewStore}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="p-4 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Your Orders</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-dark-card border-b border-gray-800">
        {renderTabButton("past_items", "Past Items")}
        {renderTabButton("past_orders", "Past Orders")}
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "past_items" ? renderPastItems() : renderPastOrders()}
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;
