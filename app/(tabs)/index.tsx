import { COURSES, Course, DAYS, DAY_FULL_NAMES, DayOfWeek } from '@/constants/courses';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { StatusBar } from 'expo-status-bar';
import { Bell, BellRing } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function courseKey(course: Course): string {
  return `${course.code}-${course.day}-${course.time}`;
}

export default function HomeScreen() {
  const { prefs, formatTimeRange, isCourseNotified, toggleNotificationForCourse, getGreeting } = useUserPreferences();
  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => {
    const dayIndex = Math.min(Math.max(new Date().getDay() - 1, 0), 5);
    return DAYS[dayIndex];
  });

  const activeDays = useMemo(() => {
    if (!prefs.department || !prefs.level) return [];
    return [...new Set(
      COURSES
        .filter(c => c.dept === prefs.department && c.level === prefs.level)
        .map(c => c.day)
    )];
  }, [prefs.department, prefs.level]);

  const coursesForDay = useMemo(() => {
    if (!prefs.department || !prefs.level) return [];
    return COURSES.filter(
      c => c.dept === prefs.department && 
           c.level === prefs.level && 
           c.day === activeDay
    );
  }, [prefs.department, prefs.level, activeDay]);

  const groupedCourses = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    coursesForDay.forEach(c => {
      if (!grouped[c.time]) grouped[c.time] = [];
      grouped[c.time].push(c);
    });
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [coursesForDay]);

  const notificationCount = useMemo(() => {
    if (!prefs.notificationsEnabled) return 0;
    return prefs.notificationCourses.length;
  }, [prefs.notificationsEnabled, prefs.notificationCourses]);

  const handleToggleNotification = async (course: Course) => {
    if (!prefs.notificationsEnabled) {
      // Could show a toast here
      return;
    }
    await toggleNotificationForCourse(courseKey(course));
  };

  if (!prefs.department || !prefs.level) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>
            <Text style={styles.titleAccent}>{prefs.department}</Text> Level {prefs.level}
          </Text>
          <View style={styles.meta}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{prefs.department} · L{prefs.level}</Text>
            </View>
            {notificationCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>🔔 {notificationCount} reminders on</Text>
              </View>
            )}
          </View>
        </View>

        {/* Day Strip */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.dayStrip}
          contentContainerStyle={styles.dayStripInner}>
          {DAYS.map(day => {
            const hasClasses = activeDays.includes(day);
            const isActive = day === activeDay;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  isActive && styles.dayChipActive,
                  hasClasses && styles.dayChipHasClasses,
                ]}
                onPress={() => setActiveDay(day)}>
                <Text style={[
                  styles.dayChipText,
                  isActive && styles.dayChipTextActive,
                ]}>
                  {day}
                </Text>
                {hasClasses && !isActive && <View style={styles.dayChipIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Course List */}
        <View style={styles.courseList}>
          {groupedCourses.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayIcon}>📭</Text>
              <Text style={styles.emptyDayText}>No classes on {DAY_FULL_NAMES[activeDay]}</Text>
            </View>
          ) : (
            groupedCourses.map(([time, courses]) => (
              <View key={time} style={styles.timeGroup}>
                <Text style={styles.timeLabel}>{formatTimeRange(time)}</Text>
                {courses.map(course => {
                  const key = courseKey(course);
                  const isNotified = isCourseNotified(key);
                  return (
                    <TouchableOpacity 
                      key={key} 
                      style={[
                        styles.courseCard,
                        isNotified && styles.courseCardNotified,
                      ]}
                      activeOpacity={0.9}>
                      <View style={[
                        styles.courseAccent,
                        isNotified && styles.courseAccentNotified,
                      ]} />
                      <View style={styles.courseTop}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <View style={styles.courseRight}>
                          <View style={styles.hallBadge}>
                            <Text style={styles.hallText}>{course.hall}</Text>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.bellButton,
                              isNotified && styles.bellButtonActive,
                            ]}
                            onPress={() => handleToggleNotification(course)}>
                            {isNotified ? (
                              <BellRing size={14} color="#4cbb7f" />
                            ) : (
                              <Bell size={14} color="#4a4840" />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.courseName}>{course.name}</Text>
                      <Text style={styles.courseLecturer}>{course.lecturer}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0f0e0c',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8a877e',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#f0ede6',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  titleAccent: {
    color: '#f5c842',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245,200,66,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#f5c842',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f5c842',
  },
  notifBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76,187,127,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76,187,127,0.2)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4cbb7f',
  },
  dayStrip: {
    marginTop: 14,
    maxHeight: 50,
  },
  dayStripInner: {
    paddingHorizontal: 20,
    gap: 6,
  },
  dayChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: '#1f1e19',
    position: 'relative',
  },
  dayChipActive: {
    backgroundColor: '#f5c842',
    borderColor: '#f5c842',
  },
  dayChipHasClasses: {
    // No special style, just for indicator
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8a877e',
  },
  dayChipTextActive: {
    color: '#1a1600',
    fontWeight: '700',
  },
  dayChipIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -1.5,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#f5c842',
  },
  courseList: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 100,
  },
  timeGroup: {
    marginBottom: 18,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4a4840',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 7,
    paddingLeft: 2,
  },
  courseCard: {
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 13,
    paddingLeft: 18,
    marginBottom: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  courseCardNotified: {
    // Slight highlight for notified courses
  },
  courseAccent: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#f5c842',
  },
  courseAccentNotified: {
    backgroundColor: '#4cbb7f',
  },
  courseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f5c842',
  },
  courseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hallBadge: {
    backgroundColor: '#272620',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hallText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4a4840',
  },
  bellButton: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellButtonActive: {
    backgroundColor: 'rgba(76,187,127,0.12)',
  },
  courseName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
    lineHeight: 18,
  },
  courseLecturer: {
    fontSize: 11,
    color: '#8a877e',
    fontWeight: '300',
    marginTop: 2,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 20,
  },
  emptyDayIcon: {
    fontSize: 38,
    marginBottom: 12,
    opacity: 0.35,
  },
  emptyDayText: {
    fontSize: 13,
    color: '#8a877e',
    fontWeight: '300',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: '#8a877e',
  },
});
