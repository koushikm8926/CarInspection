import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/useAuthStore';
import { initDatabase } from '../src/services/databaseService';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      await initialize();
    };
    setup();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated and not in auth group
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated and in auth group
        router.replace('/');
      }
      
      // Hide splash screen once initial navigation is determined
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="inspection/checklist/[id]" options={{ title: 'Checklist', headerShown: false }} />
        <Stack.Screen name="inspection/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="inspection/details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ title: 'Sign Up', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
