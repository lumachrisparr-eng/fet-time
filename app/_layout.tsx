import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { ThemeProvider } from '@/contexts/theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    
    AsyncStorage.getItem('userPreferences').then((prefs) => {
      const hasCompletedOnboarding = prefs ? JSON.parse(prefs).hasCompletedOnboarding : false;
      
      if (!hasCompletedOnboarding && !inOnboarding) {
        router.replace('/onboarding');
      } else if (hasCompletedOnboarding && inOnboarding) {
        router.replace('/(tabs)');
      }
    });
  }, [segments, isReady]);

  const checkOnboardingStatus = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      setIsReady(true);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsReady(true);
    }
  };

  return (
    <ThemeProvider>
      <NavThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </NavThemeProvider>
    </ThemeProvider>
  );
}
