import { COURSES, Course, DAYS, DAY_FULL_NAMES, DayOfWeek } from '@/constants/courses';
import { useTheme } from '@/contexts/theme-context';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { StatusBar } from 'expo-status-bar';
import { Bell, BellRing } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function courseKey(course: Course): string {
  return `${course.code}-${course.day}-${course.time}`;
}

export default function HomeScreen() {
  const { prefs, formatTimeRange, isCourseNotified, toggleNotificationForCourse, getGreeting } = useUserPreferences();
  const { theme, colors } = useTheme();

  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => {
    const jsDay = new Date().getDay();
    const mapped = [5, 0, 1, 2, 3, 4, 5];
    return DAYS[mapped[jsDay]];
  });

  const isDark = theme === 'dark';
  const C = colors;

  // Use prefs.selectedCourses directly (not isCourseSelected callback) so useMemo reactivity works
  const selectedSet = useMemo(
    () => new Set(prefs.selectedCourses),
    [prefs.selectedCourses]
  );

  const deptCourseKeys = useMemo(() => {
    if (!prefs.department || !prefs.level) return new Set<string>();
    return new Set(
      COURSES
        .filter(c => c.dept === prefs.department && c.level === prefs.level)
        .map(courseKey)
    );
  }, [prefs.department, prefs.level]);

  const activeDays = useMemo(() => {
    return [...new Set(
      COURSES
        .filter(c => deptCourseKeys.has(courseKey(c)) || selectedSet.has(courseKey(c)))
        .map(c => c.day)
    )];
  }, [deptCourseKeys, selectedSet]);

  const coursesForDay = useMemo(() => {
    return COURSES.filter(c => {
      if (c.day !== activeDay) return false;
      const key = courseKey(c);
      return deptCourseKeys.has(key) || selectedSet.has(key);
    });
  }, [activeDay, deptCourseKeys, selectedSet]);

  const groupedCourses = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    coursesForDay.forEach(c => {
      if (!grouped[c.time]) grouped[c.time] = [];
      grouped[c.time].push(c);
    });
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [coursesForDay]);

  const notificationCount = useMemo(
    () => (prefs.notificationsEnabled ? prefs.notificationCourses.length : 0),
    [prefs.notificationsEnabled, prefs.notificationCourses]
  );

  const handleToggleNotification = async (course: Course) => {
    if (!prefs.notificationsEnabled) return;
    await toggleNotificationForCourse(courseKey(course));
  };

  if (!prefs.department || !prefs.level) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: C.textSecondary }]}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: C.textSecondary }]}>{getGreeting()}</Text>
          <Text style={[styles.title, { color: C.textPrimary }]}>
            <Text style={{ color: C.accent }}>{prefs.department}</Text> Level {prefs.level}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.badge, { backgroundColor: C.accentDim, borderColor: C.accent + '44' }]}>
              <View style={[styles.badgeDot, { backgroundColor: C.accent }]} />
              <Text style={[styles.badgeText, { color: C.accent }]}>{prefs.department} · L{prefs.level}</Text>
            </View>
            {notificationCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: C.greenDim, borderColor: C.green + '44' }]}>
                <Text style={[styles.notifBadgeText, { color: C.green }]}>🔔 {notificationCount} reminders on</Text>
              </View>
            )}
          </View>
        </View>

        {/* Day Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayStrip} contentContainerStyle={styles.dayStripInner}>
          {DAYS.map(day => {
            const hasClasses = activeDays.includes(day);
            const isActive = day === activeDay;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  { backgroundColor: C.bg3, borderColor: C.border },
                  isActive && { backgroundColor: C.accent, borderColor: C.accent },
                ]}
                onPress={() => setActiveDay(day)}>
                <Text style={[styles.dayChipText, { color: C.textSecondary }, isActive && { color: '#1a1600', fontWeight: '700' }]}>
                  {day}
                </Text>
                {hasClasses && !isActive && <View style={[styles.dayChipIndicator, { backgroundColor: C.accent }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Course List */}
        <View style={styles.courseList}>
          {groupedCourses.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayIcon}>📭</Text>
              <Text style={[styles.emptyDayText, { color: C.textSecondary }]}>No classes on {DAY_FULL_NAMES[activeDay]}</Text>
              <Text style={[styles.emptyDayHint, { color: C.textMuted }]}>Add extra courses in Settings</Text>
            </View>
          ) : (
            groupedCourses.map(([time, courses]) => (
              <View key={time} style={styles.timeGroup}>
                <Text style={[styles.timeLabel, { color: C.textMuted }]}>{formatTimeRange(time)}</Text>
                {courses.map(course => {
                  const key = courseKey(course);
                  const isNotified = isCourseNotified(key);
                  const isExtra = !deptCourseKeys.has(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.courseCard,
                        { backgroundColor: C.bg3, borderColor: C.border },
                        isExtra && { borderColor: C.purple + '55' },
                      ]}
                      activeOpacity={0.9}>
                      <View style={[
                        styles.courseAccent,
                        { backgroundColor: isNotified ? C.green : isExtra ? C.purple : C.accent },
                      ]} />
                      <View style={styles.courseTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.courseCode, { color: isExtra ? C.purple : C.accent }]}>{course.code}</Text>
                          {isExtra && (
                            <View style={[styles.extraBadge, { backgroundColor: C.purpleDim }]}>
                              <Text style={[styles.extraBadgeText, { color: C.purple }]}>{course.dept}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.courseRight}>
                          <View style={[styles.hallBadge, { backgroundColor: C.bg4 }]}>
                            <Text style={[styles.hallText, { color: C.textMuted }]}>{course.hall}</Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.bellButton, isNotified && { backgroundColor: C.greenDim }]}
                            onPress={() => handleToggleNotification(course)}>
                            {isNotified
                              ? <BellRing size={14} color={C.green} />
                              : <Bell size={14} color={C.textMuted} />}
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={[styles.courseName, { color: C.textPrimary }]}>{course.name}</Text>
                      <Text style={[styles.courseLecturer, { color: C.textSecondary }]}>{course.lecturer}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 20, paddingHorizontal: 20 },
  greeting: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 23, fontWeight: '800', letterSpacing: -0.4, lineHeight: 28 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  notifBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
  notifBadgeText: { fontSize: 10, fontWeight: '600' },
  dayStrip: { marginTop: 14, maxHeight: 50 },
  dayStripInner: { paddingHorizontal: 20, gap: 6 },
  dayChip: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20, borderWidth: 1, position: 'relative' },
  dayChipText: { fontSize: 11, fontWeight: '500' },
  dayChipIndicator: { position: 'absolute', bottom: 4, left: '50%', marginLeft: -1.5, width: 3, height: 3, borderRadius: 2 },
  courseList: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 100 },
  timeGroup: { marginBottom: 18 },
  timeLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7, paddingLeft: 2 },
  courseCard: { borderWidth: 1, borderRadius: 14, padding: 13, paddingLeft: 18, marginBottom: 7, position: 'relative', overflow: 'hidden' },
  courseAccent: { position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 2 },
  courseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  courseCode: { fontSize: 12, fontWeight: '700' },
  extraBadge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  extraBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  courseRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hallBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  hallText: { fontSize: 10, fontWeight: '500' },
  bellButton: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  courseName: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  courseLecturer: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  emptyDay: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: 20 },
  emptyDayIcon: { fontSize: 38, marginBottom: 12, opacity: 0.35 },
  emptyDayText: { fontSize: 13, fontWeight: '300' },
  emptyDayHint: { fontSize: 11, fontWeight: '300', marginTop: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyText: { fontSize: 14 },
});
