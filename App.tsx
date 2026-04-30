import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { Home, History, Car, Settings, Camera } from 'lucide-react-native';

// Stores
import { useAuthStore } from './src/store/useAuthStore';
import { initDatabase } from './src/services/databaseService';

// Screens - Auth
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';

// Screens - Tabs
import HomeScreen from './src/screens/tabs/HomeScreen';
import HistoryScreen from './src/screens/tabs/HistoryScreen';
import VehiclesScreen from './src/screens/tabs/VehiclesScreen';
import SettingsScreen from './src/screens/tabs/SettingsScreen';
import CameraScreen from './src/screens/tabs/CameraScreen';

// Screens - Inspection
import InspectionScreen from './src/screens/inspection/InspectionScreen';
import InspectionChecklistScreen from './src/screens/inspection/InspectionChecklistScreen';
import InspectionDetailsScreen from './src/screens/inspection/InspectionDetailsScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#0787e2',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Vehicles" 
        component={VehiclesScreen} 
        options={{
          tabBarIcon: ({ color }) => <Car size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
          tabBarButton: () => null, // Hidden from tab bar but part of tab stack
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Inspection" component={InspectionScreen} />
      <Stack.Screen name="InspectionChecklist" component={InspectionChecklistScreen} />
      <Stack.Screen name="InspectionDetails" component={InspectionDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, isLoading: authLoading, initialize } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await initialize();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    setup();
  }, []);

  if (!isReady || authLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
