import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayOfWeek } from '@/constants/courses';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface CustomCourse {
  id: string; // unique ID so we can edit/delete
  code: string;
  name: string;
  day: DayOfWeek;
  time: string;
  hall: string;
  lecturer: string;
  dept: string;
  level: number;
  isCustom: true;
}

export interface CustomTimetable {
  id: string;
  name: string;
  courses: CustomCourse[];
}

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
  selectedCourses: string[];
  hiddenCourses: string[]; // keys of official courses the user has deleted/hidden
  courseOverrides: Record<string, any>; // user edits perfectly overlaying official courses
  customCourses: CustomCourse[]; // custom courses merged into 'default' timetable
  timetables: CustomTimetable[]; // arbitrary other timetables
  activeTimetableId: string | 'default';
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
  hiddenCourses: [],
  courseOverrides: {},
  customCourses: [],
  timetables: [],
  activeTimetableId: 'default',
};

const STORAGE_KEY = 'userPreferences';

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  // Always-fresh ref so callbacks never have stale prefs
  const prefsRef = useRef<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loaded = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        prefsRef.current = loaded;
        setPrefs(loaded);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ALWAYS reads fresh from AsyncStorage before merging — prevents the stale
   * closure bug where theme-context writes directly to storage and savePreferences
   * would overwrite it with the stale in-memory value.
   */
  const savePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const fresh: UserPreferences = stored
        ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
        : { ...DEFAULT_PREFERENCES };
      const updated = { ...fresh, ...newPrefs };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      prefsRef.current = updated;
      setPrefs(updated);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }, []); // no deps — reads live from storage every call

  const toggleNotificationForCourse = useCallback(async (courseKey: string) => {
    const current = new Set(prefsRef.current.notificationCourses);
    if (current.has(courseKey)) current.delete(courseKey); else current.add(courseKey);
    await savePreferences({ notificationCourses: Array.from(current) });
  }, [savePreferences]);

  const isCourseNotified = useCallback((courseKey: string) => {
    return prefs.notificationsEnabled && prefs.notificationCourses.includes(courseKey);
  }, [prefs.notificationsEnabled, prefs.notificationCourses]);

  const toggleSelectedCourse = useCallback(async (key: string) => {
    const current = new Set(prefsRef.current.selectedCourses);
    if (current.has(key)) current.delete(key); else current.add(key);
    await savePreferences({ selectedCourses: Array.from(current) });
  }, [savePreferences]);

  const isCourseSelected = useCallback((key: string) => {
    return prefs.selectedCourses.includes(key);
  }, [prefs.selectedCourses]);

  const hideOfficialCourse = useCallback(async (key: string) => {
    const current = new Set(prefsRef.current.hiddenCourses || []);
    current.add(key);
    await savePreferences({ hiddenCourses: Array.from(current) });
  }, [savePreferences]);

  const updateOfficialCourse = useCallback(async (key: string, updates: any) => {
    const currentMap = { ...(prefsRef.current.courseOverrides || {}) };
    currentMap[key] = { ...(currentMap[key] || {}), ...updates };
    await savePreferences({ courseOverrides: currentMap });
  }, [savePreferences]);

  const removeCustomCourse = useCallback(async (customId: string) => {
    if (prefsRef.current.activeTimetableId === 'default') {
      const updated = prefsRef.current.customCourses.filter(c => c.id !== customId);
      await savePreferences({ customCourses: updated });
    } else {
      const updatedTimetables = prefsRef.current.timetables.map(t => {
        if (t.id === prefsRef.current.activeTimetableId) {
          return { ...t, courses: t.courses.filter(c => c.id !== customId) };
        }
        return t;
      });
      await savePreferences({ timetables: updatedTimetables });
    }
  }, [savePreferences]);

  const updateCustomCourse = useCallback(async (customId: string, updates: Partial<CustomCourse>) => {
    if (prefsRef.current.activeTimetableId === 'default') {
      const updated = prefsRef.current.customCourses.map(c => c.id === customId ? { ...c, ...updates } : c);
      await savePreferences({ customCourses: updated });
    } else {
      const updatedTimetables = prefsRef.current.timetables.map(t => {
        if (t.id === prefsRef.current.activeTimetableId) {
          return { ...t, courses: t.courses.map(c => c.id === customId ? { ...c, ...updates } : c) };
        }
        return t;
      });
      await savePreferences({ timetables: updatedTimetables });
    }
  }, [savePreferences]);

  const createTimetable = useCallback(async (name: string, courses: CustomCourse[]) => {
    const newTb: CustomTimetable = { id: Date.now().toString(), name, courses };
    const updated = [...prefsRef.current.timetables, newTb];
    await savePreferences({ timetables: updated, activeTimetableId: newTb.id });
  }, [savePreferences]);

  const deleteTimetable = useCallback(async (id: string) => {
    const updated = prefsRef.current.timetables.filter(t => t.id !== id);
    let active = prefsRef.current.activeTimetableId;
    if (active === id) active = 'default';
    await savePreferences({ timetables: updated, activeTimetableId: active });
  }, [savePreferences]);

  const setActiveTimetable = useCallback(async (id: string | 'default') => {
    await savePreferences({ activeTimetableId: id });
  }, [savePreferences]);

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
    hideOfficialCourse,
    updateOfficialCourse,
    removeCustomCourse,
    updateCustomCourse,
    createTimetable,
    deleteTimetable,
    setActiveTimetable,
    formatTime,
    formatTimeRange,
    getGreeting,
    refresh: loadPreferences,
  };
}
