// Redux slice for roadside assistance state management
// Note: This is a TypeScript file that would typically be used with Redux Toolkit
// For this Expo app, we'll create a simplified version that can be adapted

import {
  ServiceOption,
  ServiceBooking,
  TechnicianInfo,
  LocationUpdate,
} from "../api/roadsideApi";

// State interface
export interface RoadsideState {
  // Service options
  serviceOptions: ServiceOption[];
  selectedService: ServiceOption | null;

  // Booking state
  currentServiceBooking: ServiceBooking | null;
  bookingHistory: ServiceBooking[];

  // Technician tracking
  technicianInfo: TechnicianInfo | null;
  technicianLocation: LocationUpdate | null;
  serviceStatusIndex: number; // 0-4 for the 5 status stages

  // UI state
  isLoading: boolean;
  error: string | null;
  showServiceDetails: boolean;
  showTechnicianTracking: boolean;

  // Location
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

// Initial state
export const initialRoadsideState: RoadsideState = {
  serviceOptions: [],
  selectedService: null,
  currentServiceBooking: null,
  bookingHistory: [],
  technicianInfo: null,
  technicianLocation: null,
  serviceStatusIndex: 0,
  isLoading: false,
  error: null,
  showServiceDetails: false,
  showTechnicianTracking: false,
  userLocation: null,
};

// Action types
export const ROADSIDE_ACTIONS = {
  // Service actions
  FETCH_SERVICES_START: "roadside/fetchServicesStart",
  FETCH_SERVICES_SUCCESS: "roadside/fetchServicesSuccess",
  FETCH_SERVICES_ERROR: "roadside/fetchServicesError",
  SELECT_SERVICE: "roadside/selectService",

  // Booking actions
  BOOK_SERVICE_START: "roadside/bookServiceStart",
  BOOK_SERVICE_SUCCESS: "roadside/bookServiceSuccess",
  BOOK_SERVICE_ERROR: "roadside/bookServiceError",
  UPDATE_BOOKING_STATUS: "roadside/updateBookingStatus",
  CANCEL_BOOKING: "roadside/cancelBooking",

  // Technician tracking
  SET_TECHNICIAN_INFO: "roadside/setTechnicianInfo",
  UPDATE_TECHNICIAN_LOCATION: "roadside/updateTechnicianLocation",
  UPDATE_SERVICE_STATUS: "roadside/updateServiceStatus",

  // UI actions
  SET_LOADING: "roadside/setLoading",
  SET_ERROR: "roadside/setError",
  CLEAR_ERROR: "roadside/clearError",
  SHOW_SERVICE_DETAILS: "roadside/showServiceDetails",
  HIDE_SERVICE_DETAILS: "roadside/hideServiceDetails",
  SHOW_TECHNICIAN_TRACKING: "roadside/showTechnicianTracking",
  HIDE_TECHNICIAN_TRACKING: "roadside/hideTechnicianTracking",

  // Location
  SET_USER_LOCATION: "roadside/setUserLocation",

  // Reset
  RESET_STATE: "roadside/resetState",
} as const;

// Action creators
export const roadsideActions = {
  // Service actions
  fetchServicesStart: () => ({ type: ROADSIDE_ACTIONS.FETCH_SERVICES_START }),
  fetchServicesSuccess: (services: ServiceOption[]) => ({
    type: ROADSIDE_ACTIONS.FETCH_SERVICES_SUCCESS,
    payload: services,
  }),
  fetchServicesError: (error: string) => ({
    type: ROADSIDE_ACTIONS.FETCH_SERVICES_ERROR,
    payload: error,
  }),
  selectService: (service: ServiceOption) => ({
    type: ROADSIDE_ACTIONS.SELECT_SERVICE,
    payload: service,
  }),

  // Booking actions
  bookServiceStart: () => ({ type: ROADSIDE_ACTIONS.BOOK_SERVICE_START }),
  bookServiceSuccess: (booking: ServiceBooking) => ({
    type: ROADSIDE_ACTIONS.BOOK_SERVICE_SUCCESS,
    payload: booking,
  }),
  bookServiceError: (error: string) => ({
    type: ROADSIDE_ACTIONS.BOOK_SERVICE_ERROR,
    payload: error,
  }),
  updateBookingStatus: (status: ServiceBooking["status"]) => ({
    type: ROADSIDE_ACTIONS.UPDATE_BOOKING_STATUS,
    payload: status,
  }),
  cancelBooking: () => ({ type: ROADSIDE_ACTIONS.CANCEL_BOOKING }),

  // Technician tracking
  setTechnicianInfo: (info: TechnicianInfo) => ({
    type: ROADSIDE_ACTIONS.SET_TECHNICIAN_INFO,
    payload: info,
  }),
  updateTechnicianLocation: (location: LocationUpdate) => ({
    type: ROADSIDE_ACTIONS.UPDATE_TECHNICIAN_LOCATION,
    payload: location,
  }),
  updateServiceStatus: (statusIndex: number) => ({
    type: ROADSIDE_ACTIONS.UPDATE_SERVICE_STATUS,
    payload: statusIndex,
  }),

  // UI actions
  setLoading: (loading: boolean) => ({
    type: ROADSIDE_ACTIONS.SET_LOADING,
    payload: loading,
  }),
  setError: (error: string) => ({
    type: ROADSIDE_ACTIONS.SET_ERROR,
    payload: error,
  }),
  clearError: () => ({ type: ROADSIDE_ACTIONS.CLEAR_ERROR }),
  showServiceDetails: () => ({ type: ROADSIDE_ACTIONS.SHOW_SERVICE_DETAILS }),
  hideServiceDetails: () => ({ type: ROADSIDE_ACTIONS.HIDE_SERVICE_DETAILS }),
  showTechnicianTracking: () => ({
    type: ROADSIDE_ACTIONS.SHOW_TECHNICIAN_TRACKING,
  }),
  hideTechnicianTracking: () => ({
    type: ROADSIDE_ACTIONS.HIDE_TECHNICIAN_TRACKING,
  }),

  // Location
  setUserLocation: (location: { latitude: number; longitude: number }) => ({
    type: ROADSIDE_ACTIONS.SET_USER_LOCATION,
    payload: location,
  }),

  // Reset
  resetState: () => ({ type: ROADSIDE_ACTIONS.RESET_STATE }),
};

// Reducer function
export const roadsideReducer = (
  state: RoadsideState = initialRoadsideState,
  action: any,
): RoadsideState => {
  switch (action.type) {
    // Service cases
    case ROADSIDE_ACTIONS.FETCH_SERVICES_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ROADSIDE_ACTIONS.FETCH_SERVICES_SUCCESS:
      return {
        ...state,
        serviceOptions: action.payload,
        isLoading: false,
        error: null,
      };

    case ROADSIDE_ACTIONS.FETCH_SERVICES_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case ROADSIDE_ACTIONS.SELECT_SERVICE:
      return {
        ...state,
        selectedService: action.payload,
      };

    // Booking cases
    case ROADSIDE_ACTIONS.BOOK_SERVICE_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ROADSIDE_ACTIONS.BOOK_SERVICE_SUCCESS:
      return {
        ...state,
        currentServiceBooking: action.payload,
        bookingHistory: [action.payload, ...state.bookingHistory],
        isLoading: false,
        error: null,
        serviceStatusIndex: 0,
      };

    case ROADSIDE_ACTIONS.BOOK_SERVICE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case ROADSIDE_ACTIONS.UPDATE_BOOKING_STATUS:
      return {
        ...state,
        currentServiceBooking: state.currentServiceBooking
          ? { ...state.currentServiceBooking, status: action.payload }
          : null,
      };

    case ROADSIDE_ACTIONS.CANCEL_BOOKING:
      return {
        ...state,
        currentServiceBooking: null,
        selectedService: null,
        technicianInfo: null,
        serviceStatusIndex: 0,
      };

    // Technician tracking cases
    case ROADSIDE_ACTIONS.SET_TECHNICIAN_INFO:
      return {
        ...state,
        technicianInfo: action.payload,
      };

    case ROADSIDE_ACTIONS.UPDATE_TECHNICIAN_LOCATION:
      return {
        ...state,
        technicianLocation: action.payload,
      };

    case ROADSIDE_ACTIONS.UPDATE_SERVICE_STATUS:
      return {
        ...state,
        serviceStatusIndex: action.payload,
      };

    // UI cases
    case ROADSIDE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ROADSIDE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ROADSIDE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ROADSIDE_ACTIONS.SHOW_SERVICE_DETAILS:
      return {
        ...state,
        showServiceDetails: true,
      };

    case ROADSIDE_ACTIONS.HIDE_SERVICE_DETAILS:
      return {
        ...state,
        showServiceDetails: false,
      };

    case ROADSIDE_ACTIONS.SHOW_TECHNICIAN_TRACKING:
      return {
        ...state,
        showTechnicianTracking: true,
      };

    case ROADSIDE_ACTIONS.HIDE_TECHNICIAN_TRACKING:
      return {
        ...state,
        showTechnicianTracking: false,
      };

    // Location cases
    case ROADSIDE_ACTIONS.SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };

    // Reset case
    case ROADSIDE_ACTIONS.RESET_STATE:
      return initialRoadsideState;

    default:
      return state;
  }
};

// Selectors
export const roadsideSelectors = {
  getServiceOptions: (state: { roadside: RoadsideState }) =>
    state.roadside.serviceOptions,
  getSelectedService: (state: { roadside: RoadsideState }) =>
    state.roadside.selectedService,
  getCurrentBooking: (state: { roadside: RoadsideState }) =>
    state.roadside.currentServiceBooking,
  getTechnicianInfo: (state: { roadside: RoadsideState }) =>
    state.roadside.technicianInfo,
  getTechnicianLocation: (state: { roadside: RoadsideState }) =>
    state.roadside.technicianLocation,
  getServiceStatus: (state: { roadside: RoadsideState }) =>
    state.roadside.serviceStatusIndex,
  getIsLoading: (state: { roadside: RoadsideState }) =>
    state.roadside.isLoading,
  getError: (state: { roadside: RoadsideState }) => state.roadside.error,
  getUserLocation: (state: { roadside: RoadsideState }) =>
    state.roadside.userLocation,
  getBookingHistory: (state: { roadside: RoadsideState }) =>
    state.roadside.bookingHistory,
};

// Thunk actions (for async operations)
// Note: These would typically use Redux Toolkit's createAsyncThunk
// For now, we'll provide the structure for manual implementation

export const roadsideThunks = {
  fetchServices: () => async (dispatch: any) => {
    try {
      dispatch(roadsideActions.fetchServicesStart());

      // Import the API function dynamically to avoid circular dependencies
      const { roadsideApi } = await import("../api/roadsideApi");
      const services = await roadsideApi.fetchServices();

      dispatch(roadsideActions.fetchServicesSuccess(services));
    } catch (error: any) {
      dispatch(
        roadsideActions.fetchServicesError(
          error.message || "Failed to fetch services",
        ),
      );
    }
  },

  bookService: (bookingData: any) => async (dispatch: any, getState: any) => {
    try {
      dispatch(roadsideActions.bookServiceStart());

      const { roadsideApi } = await import("../api/roadsideApi");
      const booking = await roadsideApi.bookService(bookingData);

      dispatch(roadsideActions.bookServiceSuccess(booking));

      // Fetch technician info
      const technicianInfo = await roadsideApi.getTechnicianInfo(
        booking.technicianId,
      );
      dispatch(roadsideActions.setTechnicianInfo(technicianInfo));
    } catch (error: any) {
      dispatch(
        roadsideActions.bookServiceError(
          error.message || "Failed to book service",
        ),
      );
    }
  },

  startLocationTracking: (technicianId: string) => async (dispatch: any) => {
    const { roadsideApi } = await import("../api/roadsideApi");

    // Start periodic location updates
    const updateLocation = async () => {
      try {
        const location = await roadsideApi.getTechnicianLocation(technicianId);
        dispatch(roadsideActions.updateTechnicianLocation(location));
      } catch (error) {
        console.error("Failed to update technician location:", error);
      }
    };

    // Update location every 10 seconds
    const intervalId = setInterval(updateLocation, 10000);

    // Initial update
    updateLocation();

    // Return cleanup function
    return () => clearInterval(intervalId);
  },
};

// Hook for using roadside state (would be used with React Context or Redux)
export const useRoadsideState = () => {
  // This would typically use useSelector from react-redux
  // For now, we'll provide the structure
  return {
    serviceOptions: [],
    selectedService: null,
    currentBooking: null,
    technicianInfo: null,
    isLoading: false,
    error: null,
  };
};
