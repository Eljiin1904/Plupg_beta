import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
  Home,
  Wrench,
  Truck,
  Key,
  Fuel,
  Tool,
  Battery,
} from "lucide-react-native";

// Create a simple TopHeader component since we don't have access to the actual one
interface TopHeaderProps {
  mode: "food" | "ride" | "roadside";
  onSwitchMode?: () => void;
  onNavigateToLanding?: () => void;
  placeholder?: string;
  onModeChange?: (mode: "ride" | "roadside") => void;
}

const TopHeader = ({
  mode = "ride",
  onSwitchMode = () => {},
  onNavigateToLanding = () => {},
  placeholder = "Where to?",
  onModeChange = () => {},
}: TopHeaderProps) => {
  return (
    <View className="px-4 pt-12 pb-2 bg-dark-card border-b border-gray-800">
      <View className="flex-row items-center">
        <TouchableOpacity 
          className="mr-3" 
          onPress={onNavigateToLanding}
        >
          <Home size={24} color="#4AFF00" />
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${mode === "ride" ? "bg-plug-green" : "bg-gray-700"}`}
          onPress={() => onModeChange("ride")}
        >
          <Text
            className={`font-medium ${mode === "ride" ? "text-black" : "text-white"}`}
          >
            Ride
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${mode === "food" ? "bg-plug-green" : "bg-gray-700"}`}
          onPress={onSwitchMode}
        >
          <Text
            className={`font-medium ${mode === "food" ? "text-black" : "text-white"}`}
          >
            Food
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-3 bg-gray-700 rounded-full flex-row items-center px-4 py-2">
        <Search size={18} color="#FFFFFF" />
        <Text className="ml-2 text-gray-300">{placeholder}</Text>
      </View>
      
      {/* Ride/Roadside Toggle */}
      {mode !== "food" && (
        <View className="flex-row mt-3 justify-center">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${mode === "ride" ? "bg-plug-green" : "bg-gray-700"}`}
            onPress={() => onModeChange("ride")}
          >
            <Text
              className={`font-medium ${mode === "ride" ? "text-black" : "text-white"}`}
            >
              Ride
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${mode === "roadside" ? "bg-plug-green" : "bg-gray-700"}`}
            onPress={() => onModeChange("roadside")}
          >
            <Text
              className={`font-medium ${mode === "roadside" ? "text-black" : "text-white"}`}
            >
              Roadside
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  eta: string;
  description: string;
}

interface RideshareHomeProps {
  onSwitchMode?: () => void;
  onToggleMode?: () => void;
  onNavigateToLanding?: () => void;
  userLocation?: string;
  mode?: "ride" | "roadside";
  onModeChange?: (mode: "ride" | "roadside") => void;
}

const RideshareHome = ({
  onSwitchMode = () => {},
  onToggleMode = () => {},
  onNavigateToLanding = () => {},
  userLocation = "Current Location",
  mode = "ride",
  onModeChange = () => {},
}: RideshareHomeProps) => {
  const [destination, setDestination] = useState<string>("");
  const [showRouteOptions, setShowRouteOptions] = useState<boolean>(false);
  const [showRoadsideServices, setShowRoadsideServices] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [showServiceDetails, setShowServiceDetails] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showTracking, setShowTracking] = useState<boolean>(false);

  const rideOptions: RideOption[] = [
    {
      id: "economy",
      name: "Economy",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$12.99",
      eta: "3 min",
      description: "Affordable rides for up to 4 people",
    },
    {
      id: "comfort",
      name: "Comfort",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$18.50",
      eta: "4 min",
      description: "Newer cars with extra legroom",
    },
    {
      id: "xl",
      name: "XL",
      icon: <Car size={24} color="#4AFF00" />,
      price: "$24.75",
      eta: "6 min",
      description: "Spacious rides for groups up to 6",
    },
  ];
  
  const roadsideServices = [
    {
      id: "tow",
      name: "Tow",
      icon: <Truck size={24} color="#4AFF00" />,
      price: "$79.99",
      eta: "25 min",
      description: "Vehicle towing service up to 10 miles",
    },
    {
      id: "lockout",
      name: "Lockout",
      icon: <Key size={24} color="#4AFF00" />,
      price: "$49.99",
      eta: "20 min",
      description: "Vehicle lockout assistance",
    },
    {
      id: "fuel",
      name: "Fuel Delivery",
      icon: <Fuel size={24} color="#4AFF00" />,
      price: "$39.99",
      eta: "15 min",
      description: "Emergency fuel delivery (up to 2 gallons)",
    },
    {
      id: "tire",
      name: "Tire Change",
      icon: <Tool size={24} color="#4AFF00" />,
      price: "$59.99",
      eta: "18 min",
      description: "Flat tire change with your spare",
    },
    {
      id: "jump",
      name: "Jump Start",
      icon: <Battery size={24} color="#4AFF00" />,
      price: "$44.99",
      eta: "15 min",
      description: "Battery jump start service",
    },
  ];

  const handleDestinationSubmit = () => {
    if (destination.trim()) {
      setShowRouteOptions(true);
    }
  };

  const handleClearDestination = () => {
    setDestination("");
    setShowRouteOptions(false);
  };

  const handleRideSelect = (rideId: string) => {
    // In a real app, this would process the ride request
    console.log(`Selected ride: ${rideId}`);
  };
  
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowServiceDetails(true);
  };
  
  const handleRequestService = () => {
    setShowServiceDetails(false);
    setShowPayment(true);
  };
  
  const handleConfirmPayment = () => {
    setShowPayment(false);
    setShowTracking(true);
  };
  
  const handleBackToServices = () => {
    setShowServiceDetails(false);
    setSelectedService("");
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <StatusBar style="light" />
      <TopHeader
        mode={mode}
        onSwitchMode={onSwitchMode || onToggleMode}
        onNavigateToLanding={onNavigateToLanding}
        placeholder={mode === "ride" ? "Where to?" : "Current location"}
        onModeChange={onModeChange}
      />

      {/* Map View */}
      <View className="flex-1 relative">
        <Image
          source="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80"
          className="w-full h-full"
          contentFit="cover"
        />
        
        {mode === "ride" && !showRouteOptions && (
          /* Location Input Panel */
          <View className="absolute top-4 left-4 right-4 bg-dark-card rounded-lg shadow-md">
            <View className="flex-row items-center p-4 border-b border-gray-800">
              <MapPin size={20} color="#4AFF00" />
              <Text className="ml-3 text-base flex-1 text-white">
                {userLocation}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </View>

            <View className="flex-row items-center p-4">
              <View className="w-5 h-5 rounded-full bg-plug-green items-center justify-center">
                <Text className="text-black text-xs font-bold">B</Text>
              </View>
              <TextInput
                className="ml-3 text-base flex-1 text-white"
                placeholder="Where to?"
                placeholderTextColor="#AAAAAA"
                value={destination}
                onChangeText={setDestination}
                onSubmitEditing={handleDestinationSubmit}
              />
              {destination ? (
                <TouchableOpacity onPress={handleClearDestination}>
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <Search size={20} color="#FFFFFF" />
              )}
            </View>
          </View>
        )}
        
        {mode === "roadside" && !showServiceDetails && !showPayment && !showTracking && (
          <View className="absolute top-4 left-4 right-4 bg-dark-card rounded-lg shadow-md p-4">
            <Text className="text-xl font-bold text-white mb-4">Roadside Assistance</Text>
            <Text className="text-white mb-4">Select the service you need:</Text>
            
            <ScrollView className="max-h-80">
              {roadsideServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  className="flex-row items-center p-4 border-b border-gray-800"
                  onPress={() => handleServiceSelect(service.id)}
                >
                  <View className="mr-3">{service.icon}</View>

                  <View className="flex-1">
                    <Text className="text-base font-medium text-white">{service.name}</Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      {service.description}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-lg font-bold text-white">{service.price}</Text>
                    <View className="flex-row items-center mt-1 justify-end">
                      <Clock size={14} color="#AAAAAA" />
                      <Text className="text-sm text-gray-400 ml-1">
                        {service.eta}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Ride Options Panel */}
        {mode === "ride" && showRouteOptions && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />

            <Text className="text-xl font-bold px-4 mb-2 text-white">Choose a ride</Text>

            <ScrollView className="max-h-80">
              {rideOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-center p-4 border-b border-gray-800"
                  onPress={() => handleRideSelect(option.id)}
                >
                  <View className="mr-3">{option.icon}</View>

                  <View className="flex-1">
                    <Text className="text-base font-medium text-white">{option.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Clock size={14} color="#AAAAAA" />
                      <Text className="text-sm text-gray-400 ml-1">
                        {option.eta} away
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400 mt-1">
                      {option.description}
                    </Text>
                  </View>

                  <Text className="text-lg font-bold text-white">{option.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              className="m-4 p-4 bg-plug-green rounded-lg items-center"
              onPress={() => handleRideSelect(rideOptions[0].id)}
            >
              <Text className="text-black font-bold text-base">
                Confirm {rideOptions[0].name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Roadside Service Details */}
        {mode === "roadside" && showServiceDetails && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">
              {roadsideServices.find(s => s.id === selectedService)?.name}
            </Text>
            
            <View className="p-4 border-b border-gray-800">
              <Text className="text-white mb-2">Service Details:</Text>
              <Text className="text-gray-400 mb-4">
                {roadsideServices.find(s => s.id === selectedService)?.description}
              </Text>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Estimated arrival:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.eta}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Price:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.price}
                </Text>
              </View>
            </View>
            
            <View className="flex-row p-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center mr-2"
                onPress={handleBackToServices}
              >
                <Text className="text-white font-bold">Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-plug-green rounded-lg items-center ml-2"
                onPress={handleRequestService}
              >
                <Text className="text-black font-bold">Request Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Payment Screen */}
        {mode === "roadside" && showPayment && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">Payment</Text>
            
            <View className="p-4 border-b border-gray-800">
              <Text className="text-white mb-4">Service Summary:</Text>
              
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-400">
                  {roadsideServices.find(s => s.id === selectedService)?.name}
                </Text>
                <Text className="text-white">
                  {roadsideServices.find(s => s.id === selectedService)?.price}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-400">Service Fee</Text>
                <Text className="text-white">$4.99</Text>
              </View>
              
              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-white font-bold">Total</Text>
                <Text className="text-white font-bold">
                  ${(parseFloat(roadsideServices.find(s => s.id === selectedService)?.price.replace('
        
        {/* Tracking Screen */}
        {mode === "roadside" && showTracking && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">Service Tracking</Text>
            
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Status:</Text>
                <View className="bg-plug-green px-3 py-1 rounded">
                  <Text className="text-black font-bold">En Route</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Technician:</Text>
                <Text className="text-white">John D.</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">ETA:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.eta}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Service:</Text>
                <Text className="text-white">
                  {roadsideServices.find(s => s.id === selectedService)?.name}
                </Text>
              </View>
            </View>
            
            <View className="flex-row p-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center mr-2"
              >
                <Text className="text-white font-bold">Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center ml-2"
              >
                <Text className="text-white font-bold">Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideshareHome;
, '') || '0') + 4.99).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="m-4 p-4 bg-plug-green rounded-lg items-center"
              onPress={handleConfirmPayment}
            >
              <Text className="text-black font-bold text-base">Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tracking Screen */}
        {mode === "roadside" && showTracking && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">Service Tracking</Text>
            
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Status:</Text>
                <View className="bg-plug-green px-3 py-1 rounded">
                  <Text className="text-black font-bold">En Route</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Technician:</Text>
                <Text className="text-white">John D.</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">ETA:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.eta}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Service:</Text>
                <Text className="text-white">
                  {roadsideServices.find(s => s.id === selectedService)?.name}
                </Text>
              </View>
            </View>
            
            <View className="flex-row p-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center mr-2"
              >
                <Text className="text-white font-bold">Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center ml-2"
              >
                <Text className="text-white font-bold">Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideshareHome;
, '')) + 4.99).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="m-4 p-4 bg-plug-green rounded-lg items-center"
              onPress={handleConfirmPayment}
            >
              <Text className="text-black font-bold text-base">Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tracking Screen */}
        {mode === "roadside" && showTracking && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">Service Tracking</Text>
            
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Status:</Text>
                <View className="bg-plug-green px-3 py-1 rounded">
                  <Text className="text-black font-bold">En Route</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Technician:</Text>
                <Text className="text-white">John D.</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">ETA:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.eta}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Service:</Text>
                <Text className="text-white">
                  {roadsideServices.find(s => s.id === selectedService)?.name}
                </Text>
              </View>
            </View>
            
            <View className="flex-row p-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center mr-2"
              >
                <Text className="text-white font-bold">Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center ml-2"
              >
                <Text className="text-white font-bold">Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideshareHome;
, '') || '0') + 4.99).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="m-4 p-4 bg-plug-green rounded-lg items-center"
              onPress={handleConfirmPayment}
            >
              <Text className="text-black font-bold text-base">Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tracking Screen */}
        {mode === "roadside" && showTracking && (
          <View className="absolute bottom-0 left-0 right-0 bg-dark-card rounded-t-xl shadow-lg">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto my-3" />
            
            <Text className="text-xl font-bold px-4 mb-2 text-white">Service Tracking</Text>
            
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Status:</Text>
                <View className="bg-plug-green px-3 py-1 rounded">
                  <Text className="text-black font-bold">En Route</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Technician:</Text>
                <Text className="text-white">John D.</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">ETA:</Text>
                <Text className="text-white font-bold">
                  {roadsideServices.find(s => s.id === selectedService)?.eta}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white">Service:</Text>
                <Text className="text-white">
                  {roadsideServices.find(s => s.id === selectedService)?.name}
                </Text>
              </View>
            </View>
            
            <View className="flex-row p-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center mr-2"
              >
                <Text className="text-white font-bold">Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-700 rounded-lg items-center ml-2"
              >
                <Text className="text-white font-bold">Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideshareHome;
