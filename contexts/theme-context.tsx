import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#0f0e0c',
  bg2: '#171612',
  bg3: '#1f1e19',
  bg4: '#272620',
  bg5: '#2e2d27',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.13)',
  textPrimary: '#f0ede6',
  textSecondary: '#8a877e',
  textMuted: '#4a4840',
  accent: '#f5c842',
  accentDim: 'rgba(245,200,66,0.12)',
  accentDim2: 'rgba(245,200,66,0.06)',
  green: '#4cbb7f',
  greenDim: 'rgba(76,187,127,0.12)',
  blue: '#5b9cf5',
  purple: '#a78bfa',
  purpleDim: 'rgba(167,139,250,0.12)',
  red: '#e05c4b',
  tabBg: '#0c0b09',
};

const lightColors = {
  bg: '#f4f1ea',
  bg2: '#ece8de',
  bg3: '#ffffff',
  bg4: '#e8e3d8',
  bg5: '#ddd8cb',
  border: 'rgba(0,0,0,0.07)',
  border2: 'rgba(0,0,0,0.13)',
  textPrimary: '#1a1812',
  textSecondary: '#6b6860',
  textMuted: '#b0ada5',
  accent: '#b8900a',
  accentDim: 'rgba(184,144,10,0.12)',
  accentDim2: 'rgba(184,144,10,0.06)',
  green: '#2a9d60',
  greenDim: 'rgba(42,157,96,0.12)',
  blue: '#2563eb',
  purple: '#7c3aed',
  purpleDim: 'rgba(124,58,237,0.12)',
  red: '#c0392b',
  tabBg: '#ece8de',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const { theme: savedTheme } = JSON.parse(prefs);
        if (savedTheme) {
          setThemeState(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      const current = prefs ? JSON.parse(prefs) : {};
      await AsyncStorage.setItem('userPreferences', JSON.stringify({
        ...current,
        theme: newTheme,
      }));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
