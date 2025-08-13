// Redux slice for orders state management
// Note: This is a TypeScript file that would typically be used with Redux Toolkit
// For this Expo app, we'll create a simplified version that can be adapted

import { PastItem, PastItemGroup, PastOrder } from "../api/ordersApi";

// State interface
export interface OrdersState {
  // Past items
  pastItemGroups: PastItemGroup[];
  pastOrders: PastOrder[];

  // UI state
  isLoadingPastItems: boolean;
  isLoadingPastOrders: boolean;
  pastItemsError: string | null;
  pastOrdersError: string | null;

  // Reorder state
  isReordering: boolean;
  reorderError: string | null;

  // Current tab
  activeTab: "past_items" | "past_orders";
}

// Initial state
export const initialOrdersState: OrdersState = {
  pastItemGroups: [],
  pastOrders: [],
  isLoadingPastItems: false,
  isLoadingPastOrders: false,
  pastItemsError: null,
  pastOrdersError: null,
  isReordering: false,
  reorderError: null,
  activeTab: "past_items",
};

// Action types
export const ORDERS_ACTIONS = {
  // Past items actions
  FETCH_PAST_ITEMS_START: "orders/fetchPastItemsStart",
  FETCH_PAST_ITEMS_SUCCESS: "orders/fetchPastItemsSuccess",
  FETCH_PAST_ITEMS_ERROR: "orders/fetchPastItemsError",

  // Past orders actions
  FETCH_PAST_ORDERS_START: "orders/fetchPastOrdersStart",
  FETCH_PAST_ORDERS_SUCCESS: "orders/fetchPastOrdersSuccess",
  FETCH_PAST_ORDERS_ERROR: "orders/fetchPastOrdersError",

  // Reorder actions
  REORDER_START: "orders/reorderStart",
  REORDER_SUCCESS: "orders/reorderSuccess",
  REORDER_ERROR: "orders/reorderError",

  // UI actions
  SET_ACTIVE_TAB: "orders/setActiveTab",
  CLEAR_ERRORS: "orders/clearErrors",

  // Reset
  RESET_STATE: "orders/resetState",
} as const;

// Action creators
export const ordersActions = {
  // Past items actions
  fetchPastItemsStart: () => ({ type: ORDERS_ACTIONS.FETCH_PAST_ITEMS_START }),
  fetchPastItemsSuccess: (itemGroups: PastItemGroup[]) => ({
    type: ORDERS_ACTIONS.FETCH_PAST_ITEMS_SUCCESS,
    payload: itemGroups,
  }),
  fetchPastItemsError: (error: string) => ({
    type: ORDERS_ACTIONS.FETCH_PAST_ITEMS_ERROR,
    payload: error,
  }),

  // Past orders actions
  fetchPastOrdersStart: () => ({
    type: ORDERS_ACTIONS.FETCH_PAST_ORDERS_START,
  }),
  fetchPastOrdersSuccess: (orders: PastOrder[]) => ({
    type: ORDERS_ACTIONS.FETCH_PAST_ORDERS_SUCCESS,
    payload: orders,
  }),
  fetchPastOrdersError: (error: string) => ({
    type: ORDERS_ACTIONS.FETCH_PAST_ORDERS_ERROR,
    payload: error,
  }),

  // Reorder actions
  reorderStart: () => ({ type: ORDERS_ACTIONS.REORDER_START }),
  reorderSuccess: () => ({ type: ORDERS_ACTIONS.REORDER_SUCCESS }),
  reorderError: (error: string) => ({
    type: ORDERS_ACTIONS.REORDER_ERROR,
    payload: error,
  }),

  // UI actions
  setActiveTab: (tab: "past_items" | "past_orders") => ({
    type: ORDERS_ACTIONS.SET_ACTIVE_TAB,
    payload: tab,
  }),
  clearErrors: () => ({ type: ORDERS_ACTIONS.CLEAR_ERRORS }),

  // Reset
  resetState: () => ({ type: ORDERS_ACTIONS.RESET_STATE }),
};

// Reducer function
export const ordersReducer = (
  state: OrdersState = initialOrdersState,
  action: any,
): OrdersState => {
  switch (action.type) {
    // Past items cases
    case ORDERS_ACTIONS.FETCH_PAST_ITEMS_START:
      return {
        ...state,
        isLoadingPastItems: true,
        pastItemsError: null,
      };

    case ORDERS_ACTIONS.FETCH_PAST_ITEMS_SUCCESS:
      return {
        ...state,
        pastItemGroups: action.payload,
        isLoadingPastItems: false,
        pastItemsError: null,
      };

    case ORDERS_ACTIONS.FETCH_PAST_ITEMS_ERROR:
      return {
        ...state,
        isLoadingPastItems: false,
        pastItemsError: action.payload,
      };

    // Past orders cases
    case ORDERS_ACTIONS.FETCH_PAST_ORDERS_START:
      return {
        ...state,
        isLoadingPastOrders: true,
        pastOrdersError: null,
      };

    case ORDERS_ACTIONS.FETCH_PAST_ORDERS_SUCCESS:
      return {
        ...state,
        pastOrders: action.payload,
        isLoadingPastOrders: false,
        pastOrdersError: null,
      };

    case ORDERS_ACTIONS.FETCH_PAST_ORDERS_ERROR:
      return {
        ...state,
        isLoadingPastOrders: false,
        pastOrdersError: action.payload,
      };

    // Reorder cases
    case ORDERS_ACTIONS.REORDER_START:
      return {
        ...state,
        isReordering: true,
        reorderError: null,
      };

    case ORDERS_ACTIONS.REORDER_SUCCESS:
      return {
        ...state,
        isReordering: false,
        reorderError: null,
      };

    case ORDERS_ACTIONS.REORDER_ERROR:
      return {
        ...state,
        isReordering: false,
        reorderError: action.payload,
      };

    // UI cases
    case ORDERS_ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };

    case ORDERS_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        pastItemsError: null,
        pastOrdersError: null,
        reorderError: null,
      };

    // Reset case
    case ORDERS_ACTIONS.RESET_STATE:
      return initialOrdersState;

    default:
      return state;
  }
};

// Selectors
export const ordersSelectors = {
  getPastItemGroups: (state: { orders: OrdersState }) =>
    state.orders.pastItemGroups,
  getPastOrders: (state: { orders: OrdersState }) => state.orders.pastOrders,
  getIsLoadingPastItems: (state: { orders: OrdersState }) =>
    state.orders.isLoadingPastItems,
  getIsLoadingPastOrders: (state: { orders: OrdersState }) =>
    state.orders.isLoadingPastOrders,
  getPastItemsError: (state: { orders: OrdersState }) =>
    state.orders.pastItemsError,
  getPastOrdersError: (state: { orders: OrdersState }) =>
    state.orders.pastOrdersError,
  getIsReordering: (state: { orders: OrdersState }) =>
    state.orders.isReordering,
  getReorderError: (state: { orders: OrdersState }) =>
    state.orders.reorderError,
  getActiveTab: (state: { orders: OrdersState }) => state.orders.activeTab,
};

// Thunk actions (for async operations)
export const ordersThunks = {
  fetchPastItems: () => async (dispatch: any) => {
    try {
      dispatch(ordersActions.fetchPastItemsStart());

      const { ordersApi } = await import("../api/ordersApi");
      const itemGroups = await ordersApi.fetchPastItems();

      dispatch(ordersActions.fetchPastItemsSuccess(itemGroups));
    } catch (error: any) {
      dispatch(
        ordersActions.fetchPastItemsError(
          error.message || "Failed to fetch past items",
        ),
      );
    }
  },

  fetchPastOrders: () => async (dispatch: any) => {
    try {
      dispatch(ordersActions.fetchPastOrdersStart());

      const { ordersApi } = await import("../api/ordersApi");
      const orders = await ordersApi.fetchPastOrders();

      dispatch(ordersActions.fetchPastOrdersSuccess(orders));
    } catch (error: any) {
      dispatch(
        ordersActions.fetchPastOrdersError(
          error.message || "Failed to fetch past orders",
        ),
      );
    }
  },

  addItemToCart: (itemId: string) => async (dispatch: any) => {
    try {
      const { ordersApi } = await import("../api/ordersApi");
      const result = await ordersApi.addItemToCart(itemId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to add item to cart",
      };
    }
  },

  reorderPastOrder: (orderId: string) => async (dispatch: any) => {
    try {
      dispatch(ordersActions.reorderStart());

      const { ordersApi } = await import("../api/ordersApi");
      const result = await ordersApi.reorderPastOrder(orderId);

      if (!result.success && result.unavailableItems) {
        // Some items are unavailable
        dispatch(ordersActions.reorderSuccess());
        return {
          success: false,
          unavailableItems: result.unavailableItems,
          availableItems: result.availableItems,
        };
      }

      dispatch(ordersActions.reorderSuccess());
      return { success: true };
    } catch (error: any) {
      dispatch(
        ordersActions.reorderError(error.message || "Failed to reorder"),
      );
      return {
        success: false,
        message: error.message || "Failed to reorder",
      };
    }
  },
};

// Hook for using orders state (would be used with React Context or Redux)
export const useOrdersState = () => {
  // This would typically use useSelector from react-redux
  // For now, we'll provide the structure
  return {
    pastItemGroups: [],
    pastOrders: [],
    isLoadingPastItems: false,
    isLoadingPastOrders: false,
    activeTab: "past_items" as const,
  };
};
