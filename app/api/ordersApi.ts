// Mock API for orders functionality
// In a real app, these would be actual HTTP requests to your backend

export interface PastItem {
  itemId: string;
  name: string;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
  restaurantId: string;
  restaurantName: string;
}

export interface PastItemGroup {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoUrl: string;
  deliveryInfo: { fee: number; time: number };
  items: PastItem[];
}

export interface PastOrder {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  orderDate: string;
  totalPrice: number;
  itemCount: number;
  itemSummary: string;
  reorderAction: "reorder" | "view_store";
  items: PastItem[];
}

// Mock data
const mockPastItems: PastItem[] = [
  {
    itemId: "item_001",
    name: "Whopper Burger",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    price: 7.99,
    isAvailable: true,
    restaurantId: "rest_001",
    restaurantName: "Burger King",
  },
  {
    itemId: "item_002",
    name: "Chicken Sandwich",
    imageUrl:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80",
    price: 6.99,
    isAvailable: true,
    restaurantId: "rest_001",
    restaurantName: "Burger King",
  },
  {
    itemId: "item_003",
    name: "Pepperoni Pizza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    price: 12.99,
    isAvailable: false,
    restaurantId: "rest_002",
    restaurantName: "Pizza Hut",
  },
  {
    itemId: "item_004",
    name: "Burrito Bowl",
    imageUrl:
      "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400&q=80",
    price: 9.99,
    isAvailable: true,
    restaurantId: "rest_003",
    restaurantName: "Chipotle",
  },
  {
    itemId: "item_005",
    name: "Caramel Macchiato",
    imageUrl:
      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=400&q=80",
    price: 4.99,
    isAvailable: true,
    restaurantId: "rest_004",
    restaurantName: "Starbucks",
  },
];

const mockPastOrders: PastOrder[] = [
  {
    orderId: "order_001",
    restaurantId: "rest_001",
    restaurantName: "Burger King",
    orderDate: "2024-01-15T18:30:00Z",
    totalPrice: 24.97,
    itemCount: 3,
    itemSummary: "Whopper Burger, Chicken Sandwich, French Fries",
    reorderAction: "reorder",
    items: [
      {
        itemId: "item_001",
        name: "Whopper Burger",
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
        price: 7.99,
        isAvailable: true,
        restaurantId: "rest_001",
        restaurantName: "Burger King",
      },
      {
        itemId: "item_002",
        name: "Chicken Sandwich",
        imageUrl:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80",
        price: 6.99,
        isAvailable: true,
        restaurantId: "rest_001",
        restaurantName: "Burger King",
      },
      {
        itemId: "item_006",
        name: "French Fries",
        imageUrl:
          "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80",
        price: 3.99,
        isAvailable: true,
        restaurantId: "rest_001",
        restaurantName: "Burger King",
      },
    ],
  },
  {
    orderId: "order_002",
    restaurantId: "rest_003",
    restaurantName: "Chipotle",
    orderDate: "2024-01-12T12:15:00Z",
    totalPrice: 19.98,
    itemCount: 2,
    itemSummary: "Burrito Bowl, Guacamole",
    reorderAction: "reorder",
    items: [
      {
        itemId: "item_004",
        name: "Burrito Bowl",
        imageUrl:
          "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400&q=80",
        price: 9.99,
        isAvailable: true,
        restaurantId: "rest_003",
        restaurantName: "Chipotle",
      },
      {
        itemId: "item_007",
        name: "Guacamole",
        imageUrl:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80",
        price: 2.5,
        isAvailable: true,
        restaurantId: "rest_003",
        restaurantName: "Chipotle",
      },
    ],
  },
  {
    orderId: "order_003",
    restaurantId: "rest_002",
    restaurantName: "Pizza Hut",
    orderDate: "2024-01-10T19:45:00Z",
    totalPrice: 18.99,
    itemCount: 1,
    itemSummary: "Large Pepperoni Pizza",
    reorderAction: "view_store",
    items: [
      {
        itemId: "item_003",
        name: "Pepperoni Pizza",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
        price: 12.99,
        isAvailable: false,
        restaurantId: "rest_002",
        restaurantName: "Pizza Hut",
      },
    ],
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const ordersApi = {
  // Fetch past items grouped by restaurant
  async fetchPastItems(): Promise<PastItemGroup[]> {
    await delay(800);

    // Group items by restaurant
    const groupedItems: { [key: string]: PastItemGroup } = {};

    mockPastItems.forEach((item) => {
      if (!groupedItems[item.restaurantId]) {
        groupedItems[item.restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogoUrl: `https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=100&q=80`,
          deliveryInfo: { fee: 2.99, time: 25 },
          items: [],
        };
      }
      groupedItems[item.restaurantId].items.push(item);
    });

    return Object.values(groupedItems);
  },

  // Fetch past orders
  async fetchPastOrders(): Promise<PastOrder[]> {
    await delay(600);
    return mockPastOrders;
  },

  // Add item to cart
  async addItemToCart(
    itemId: string,
  ): Promise<{ success: boolean; message?: string }> {
    await delay(300);

    const item = mockPastItems.find((i) => i.itemId === itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (!item.isAvailable) {
      return {
        success: false,
        message: "This item is currently unavailable",
      };
    }

    return { success: true };
  },

  // Reorder entire past order
  async reorderPastOrder(orderId: string): Promise<{
    success: boolean;
    unavailableItems?: PastItem[];
    availableItems?: PastItem[];
  }> {
    await delay(1000);

    const order = mockPastOrders.find((o) => o.orderId === orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const availableItems = order.items.filter((item) => item.isAvailable);
    const unavailableItems = order.items.filter((item) => !item.isAvailable);

    if (unavailableItems.length > 0) {
      return {
        success: false,
        unavailableItems,
        availableItems,
      };
    }

    return { success: true, availableItems };
  },

  // Add multiple items from order to cart
  async addMultipleItemsFromOrder(
    items: PastItem[],
  ): Promise<{ success: boolean }> {
    await delay(500);

    // In a real app, this would add all available items to the cart
    return { success: true };
  },
};

// Error types
export class OrdersApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "OrdersApiError";
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): OrdersApiError => {
  if (error instanceof OrdersApiError) {
    return error;
  }

  // Network or other errors
  return new OrdersApiError(
    "An unexpected error occurred. Please try again.",
    "UNKNOWN_ERROR",
  );
};
