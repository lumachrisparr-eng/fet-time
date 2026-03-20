import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export interface UserPreferences {
  department: string | null;
  level: number | null;
  theme: 'dark' | 'light';
  timeFormat: '24' | '12';
  weekStart: 'mon' | 'sun';
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  reminderMinutes: number;
  notificationCourses: string[];
  /** Keys of individually selected courses from any dept (format: "CODE-DAY-TIME") */
  selectedCourses: string[];
  lastImportedFile?: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  department: null,
  level: null,
  theme: 'dark',
  timeFormat: '24',
  weekStart: 'mon',
  hasCompletedOnboarding: false,
  notificationsEnabled: true,
  reminderMinutes: 10,
  notificationCourses: [],
  selectedCourses: [],
};

const STORAGE_KEY = 'userPreferences';

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrefs({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    try {
      const updated = { ...prefs, ...newPrefs };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setPrefs(updated);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }, [prefs]);

  const toggleNotificationForCourse = useCallback(async (courseKey: string) => {
    const current = new Set(prefs.notificationCourses);
    if (current.has(courseKey)) {
      current.delete(courseKey);
    } else {
      current.add(courseKey);
    }
    await savePreferences({ notificationCourses: Array.from(current) });
  }, [prefs.notificationCourses, savePreferences]);

  const isCourseNotified = useCallback((courseKey: string) => {
    return prefs.notificationsEnabled && prefs.notificationCourses.includes(courseKey);
  }, [prefs.notificationsEnabled, prefs.notificationCourses]);

  /** Toggle an individually selected course (from any dept) */
  const toggleSelectedCourse = useCallback(async (key: string) => {
    const current = new Set(prefs.selectedCourses);
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    await savePreferences({ selectedCourses: Array.from(current) });
  }, [prefs.selectedCourses, savePreferences]);

  const isCourseSelected = useCallback((key: string) => {
    return prefs.selectedCourses.includes(key);
  }, [prefs.selectedCourses]);

  const formatTime = useCallback((time: string) => {
    if (prefs.timeFormat === '24') return time;
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }, [prefs.timeFormat]);

  const formatTimeRange = useCallback((range: string) => {
    const [start, end] = range.split('-');
    return `${formatTime(start)} – ${formatTime(end)}`;
  }, [formatTime]);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return {
    prefs,
    isLoading,
    savePreferences,
    toggleNotificationForCourse,
    isCourseNotified,
    toggleSelectedCourse,
    isCourseSelected,
    formatTime,
    formatTimeRange,
    getGreeting,
    refresh: loadPreferences,
  };
}
