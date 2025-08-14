// App.tsx

import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Import your screens/components
import HomeScreen from './app/components/FoodDeliveryHome';
import ExploreScreen from './app/components/ExploreScreen';
import RestaurantDetailScreen from './app/components/RestaurantDetailScreen';
import VideoFeedScreen from './app/components/VideoCard';
// Import any other screens you have

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings if needed
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested', // Common warning when using FlatList inside ScrollView
]);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any resources, fonts, or assets here if needed
        // await Font.loadAsync({
        //   'custom-font': require('./assets/fonts/custom-font.ttf'),
        // });
        
        // Artificially delay for demonstration (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#000000" />
          <View style={styles.container}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#121212' }
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Explore" component={ExploreScreen} />
              {/* These screens are handled as modals within their parent components */}
              {/* <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} /> */}
              {/* <Stack.Screen name="VideoFeed" component={VideoFeedScreen} /> */}
              {/* Add other screens as needed */}
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});