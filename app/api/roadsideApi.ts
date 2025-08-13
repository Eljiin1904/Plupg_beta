// Mock API for roadside assistance services
// In a real app, these would be actual HTTP requests to your backend

export interface ServiceOption {
  id: string;
  name: string;
  iconUri: string;
  price: string;
  basePrice: number;
  variablePrice: number;
  eta: string;
  description: string;
  requiresInput: boolean;
  inputType?: "miles" | "gallons" | "tires" | "none";
}

export interface ServiceBooking {
  bookingId: string;
  serviceId: string;
  technicianId: string;
  serviceType: string;
  inputValue?: number;
  estimatedCost: number;
  paymentMethod: string;
  status: "requested" | "en_route" | "arrived" | "in_progress" | "completed";
  timestamp: string;
  eta: string;
}

export interface TechnicianInfo {
  id: string;
  name: string;
  photoUrl: string;
  vehicle: string;
  phone: string;
  rating: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationUpdate {
  technicianId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Mock data
const mockServiceOptions: ServiceOption[] = [
  {
    id: "tow",
    name: "Tow Service",
    iconUri:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    price: "$79.99",
    basePrice: 79.99,
    variablePrice: 2.0,
    eta: "25 min",
    description: "Professional towing service to your destination",
    requiresInput: true,
    inputType: "miles",
  },
  {
    id: "lockout",
    name: "Lockout Service",
    iconUri:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    price: "$49.99",
    basePrice: 49.99,
    variablePrice: 0,
    eta: "15 min",
    description: "Quick and safe vehicle lockout assistance",
    requiresInput: false,
    inputType: "none",
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    iconUri:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80",
    price: "$24.99",
    basePrice: 24.99,
    variablePrice: 3.5,
    eta: "20 min",
    description: "Emergency fuel delivery to your location",
    requiresInput: true,
    inputType: "gallons",
  },
  {
    id: "tire",
    name: "Tire Change",
    iconUri:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    price: "$39.99",
    basePrice: 39.99,
    variablePrice: 15.0,
    eta: "30 min",
    description: "Professional tire change service",
    requiresInput: true,
    inputType: "tires",
  },
  {
    id: "battery",
    name: "Dead Battery",
    iconUri:
      "https://images.unsplash.com/photo-1609592806596-4d1b5e5e0e0e?w=400&q=80",
    price: "$34.99",
    basePrice: 34.99,
    variablePrice: 0,
    eta: "18 min",
    description: "Jump start or battery replacement service",
    requiresInput: false,
    inputType: "none",
  },
];

const mockTechnicians: TechnicianInfo[] = [
  {
    id: "tech_001",
    name: "Mike Rodriguez",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    vehicle: "Ford F-150 • TRK789",
    phone: "(555) 123-4567",
    rating: 4.9,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: "tech_002",
    name: "Sarah Johnson",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=200&q=80",
    vehicle: "Chevrolet Silverado • TRK456",
    phone: "(555) 987-6543",
    rating: 4.8,
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
    },
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const roadsideApi = {
  // Fetch available services
  async fetchServices(): Promise<ServiceOption[]> {
    await delay(800);
    return mockServiceOptions;
  },

  // Book a service
  async bookService(bookingData: {
    serviceId: string;
    inputValue?: number;
    estimatedCost: number;
    paymentMethod: string;
    userLocation: {
      latitude: number;
      longitude: number;
    };
  }): Promise<ServiceBooking> {
    await delay(1500);

    const service = mockServiceOptions.find(
      (s) => s.id === bookingData.serviceId,
    );
    const technician =
      mockTechnicians[Math.floor(Math.random() * mockTechnicians.length)];

    if (!service) {
      throw new Error("Service not found");
    }

    const booking: ServiceBooking = {
      bookingId: `RS${Date.now()}`,
      serviceId: bookingData.serviceId,
      technicianId: technician.id,
      serviceType: service.name,
      inputValue: bookingData.inputValue,
      estimatedCost: bookingData.estimatedCost,
      paymentMethod: bookingData.paymentMethod,
      status: "requested",
      timestamp: new Date().toISOString(),
      eta: service.eta,
    };

    return booking;
  },

  // Get technician info
  async getTechnicianInfo(technicianId: string): Promise<TechnicianInfo> {
    await delay(500);

    const technician = mockTechnicians.find((t) => t.id === technicianId);
    if (!technician) {
      throw new Error("Technician not found");
    }

    return technician;
  },

  // Get booking status
  async getBookingStatus(bookingId: string): Promise<ServiceBooking> {
    await delay(300);

    // Mock booking status - in real app this would fetch from backend
    const mockBooking: ServiceBooking = {
      bookingId,
      serviceId: "tow",
      technicianId: "tech_001",
      serviceType: "Tow Service",
      estimatedCost: 89.99,
      paymentMethod: "Visa •••• 4242",
      status: "en_route",
      timestamp: new Date().toISOString(),
      eta: "20 min",
    };

    return mockBooking;
  },

  // Get technician location updates
  async getTechnicianLocation(technicianId: string): Promise<LocationUpdate> {
    await delay(200);

    // Simulate moving technician
    const baseLocation = { latitude: 37.7749, longitude: -122.4194 };
    const randomOffset = () => (Math.random() - 0.5) * 0.01;

    return {
      technicianId,
      latitude: baseLocation.latitude + randomOffset(),
      longitude: baseLocation.longitude + randomOffset(),
      timestamp: new Date().toISOString(),
    };
  },

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: ServiceBooking["status"],
  ): Promise<ServiceBooking> {
    await delay(500);

    // Mock status update
    const mockBooking: ServiceBooking = {
      bookingId,
      serviceId: "tow",
      technicianId: "tech_001",
      serviceType: "Tow Service",
      estimatedCost: 89.99,
      paymentMethod: "Visa •••• 4242",
      status,
      timestamp: new Date().toISOString(),
      eta: status === "completed" ? "0 min" : "15 min",
    };

    return mockBooking;
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
    await delay(800);

    // Mock cancellation
    return { success: true };
  },

  // Get service history
  async getServiceHistory(userId: string): Promise<ServiceBooking[]> {
    await delay(600);

    // Mock service history
    return [
      {
        bookingId: "RS1234567",
        serviceId: "tow",
        technicianId: "tech_001",
        serviceType: "Tow Service",
        estimatedCost: 89.99,
        paymentMethod: "Visa •••• 4242",
        status: "completed",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        eta: "0 min",
      },
    ];
  },

  // Rate service
  async rateService(
    bookingId: string,
    rating: number,
    feedback?: string,
  ): Promise<{ success: boolean }> {
    await delay(500);

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    return { success: true };
  },
};

// Error types
export class RoadsideApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "RoadsideApiError";
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): RoadsideApiError => {
  if (error instanceof RoadsideApiError) {
    return error;
  }

  // Network or other errors
  return new RoadsideApiError(
    "An unexpected error occurred. Please try again.",
    "UNKNOWN_ERROR",
  );
};
