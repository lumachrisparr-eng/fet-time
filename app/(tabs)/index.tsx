import { COURSES, Course, DAYS, DAY_FULL_NAMES, DayOfWeek } from '@/constants/courses';
import { useTheme } from '@/contexts/theme-context';
import { CustomCourse, useUserPreferences } from '@/hooks/use-user-preferences';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, BellRing } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function courseKey(course: Course): string {
  return `${course.code}-${course.day}-${course.time}`;
}

export default function HomeScreen() {
  const { prefs, formatTimeRange, isCourseNotified, toggleNotificationForCourse, getGreeting, refresh, removeCustomCourse, updateCustomCourse, hideOfficialCourse, updateOfficialCourse } = useUserPreferences();
  const { theme, colors } = useTheme();

  // Selected Course Actions
  const [selectedActionCourse, setSelectedActionCourse] = useState<any>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', code: '', time: '', hall: '', lecturer: '' });

  // Refresh prefs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

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

  // Custom courses from CSV import as a Course-compatible list
  const customAsCourses = useMemo(
    () => (prefs.customCourses ?? []) as (CustomCourse & { isCustom: true })[],
    [prefs.customCourses]
  );

  const deptCourseKeys = useMemo(() => {
    if (!prefs.department || !prefs.level) return new Set<string>();
    return new Set(
      COURSES
        .filter(c => c.dept === prefs.department && c.level === prefs.level)
        .map(courseKey)
    );
  }, [prefs.department, prefs.level]);

  // If not default timetable, grab the custom one
  const activeTb = useMemo(() => prefs.timetables.find(t => t.id === prefs.activeTimetableId), [prefs]);

  const activeDays = useMemo(() => {
    if (activeTb) return [...new Set(activeTb.courses.map(c => c.day))] as DayOfWeek[];
    const customDays = customAsCourses.map(c => c.day);
    return [...new Set([
      ...COURSES
        .filter(c => deptCourseKeys.has(courseKey(c)) || selectedSet.has(courseKey(c)))
        .map(c => {
           // check if override changed the day
           const override = prefs.courseOverrides?.[courseKey(c)];
           return override?.day || c.day;
        }),
      ...customDays,
    ])] as DayOfWeek[];
  }, [activeTb, deptCourseKeys, selectedSet, customAsCourses, prefs.courseOverrides]);

  const coursesForDay = useMemo(() => {
    if (activeTb) return activeTb.courses.filter(c => c.day === activeDay);
    const std = COURSES.filter(c => {
      const key = courseKey(c);
      if (prefs.hiddenCourses?.includes(key)) return false;
      if (!(deptCourseKeys.has(key) || selectedSet.has(key))) return false;
      const override = prefs.courseOverrides?.[key];
      const effDay = override?.day || c.day;
      return effDay === activeDay;
    }).map(c => {
      const origKey = courseKey(c);
      const override = prefs.courseOverrides?.[origKey];
      return override ? { ...c, ...override, _originalKey: origKey } : { ...c, _originalKey: origKey };
    });
    const custom = customAsCourses.filter(c => c.day === activeDay);
    return [...std, ...custom] as Course[];
  }, [activeTb, activeDay, deptCourseKeys, selectedSet, customAsCourses, prefs.hiddenCourses, prefs.courseOverrides]);

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
                        (isExtra || (course as any).isCustom) && { borderColor: C.purple + '55' },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedActionCourse(course);
                        setIsEditingCourse(false);
                        setEditForm({
                          name: course.name, code: course.code, time: course.time, hall: course.hall, lecturer: course.lecturer
                        });
                      }}
                    >
                      <View style={[
                        styles.courseAccent,
                        { backgroundColor: isNotified ? C.green : (isExtra || (course as any).isCustom) ? C.purple : C.accent },
                      ]} />
                      <View style={styles.courseTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.courseCode, { color: (isExtra || (course as any).isCustom) ? C.purple : C.accent }]}>{course.code}</Text>
                          {(course as any).isCustom && (
                            <View style={[styles.extraBadge, { backgroundColor: C.purpleDim }]}>
                              <Text style={[styles.extraBadgeText, { color: C.purple }]}>CUSTOM</Text>
                            </View>
                          )}
                          {isExtra && !(course as any).isCustom && (
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

      {/* ── Action Modal ── */}
      <Modal visible={!!selectedActionCourse} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
           <View style={{ backgroundColor: C.bg, borderRadius: 16, padding: 20 }}>
             
             {isEditingCourse ? (
               <View>
                 <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary, marginBottom: 12 }}>Edit Course</Text>
                 
                 <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: '600' }}>COURSE CODE</Text>
                 <TextInput
                   style={[styles.editInput, { color: C.textPrimary, borderColor: C.border }]}
                   value={editForm.code} onChangeText={t => setEditForm(f => ({ ...f, code: t }))}
                 />

                 <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: '600' }}>COURSE NAME</Text>
                 <TextInput
                   style={[styles.editInput, { color: C.textPrimary, borderColor: C.border }]}
                   value={editForm.name} onChangeText={t => setEditForm(f => ({ ...f, name: t }))}
                 />

                 <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: '600' }}>TIME (e.g. 08:00-10:00)</Text>
                 <TextInput
                   style={[styles.editInput, { color: C.textPrimary, borderColor: C.border }]}
                   value={editForm.time} onChangeText={t => setEditForm(f => ({ ...f, time: t }))}
                 />

                 <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: '600' }}>ROOM / HALL</Text>
                 <TextInput
                   style={[styles.editInput, { color: C.textPrimary, borderColor: C.border }]}
                   value={editForm.hall} onChangeText={t => setEditForm(f => ({ ...f, hall: t }))}
                 />

                 <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: '600' }}>LECTURER</Text>
                 <TextInput
                   style={[styles.editInput, { color: C.textPrimary, borderColor: C.border }]}
                   value={editForm.lecturer} onChangeText={t => setEditForm(f => ({ ...f, lecturer: t }))}
                 />

                 <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                   <TouchableOpacity 
                      style={{ flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border }}
                      onPress={() => setIsEditingCourse(false)}
                   >
                     <Text style={{ color: C.textPrimary, fontWeight: '600' }}>Cancel</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                     style={{ flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: C.accent }}
                     onPress={async () => {
                        if (selectedActionCourse.isCustom) {
                           await updateCustomCourse(selectedActionCourse.id, editForm);
                        } else {
                           await updateOfficialCourse(selectedActionCourse._originalKey, editForm);
                        }
                        refresh();
                        setSelectedActionCourse(null);
                     }}
                   >
                     <Text style={{ color: '#1a1600', fontWeight: '600' }}>Save</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             ) : (
               <View>
                 <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary, marginBottom: 8 }}>
                   {selectedActionCourse?.code}
                 </Text>
                 <Text style={{ fontSize: 14, color: C.textSecondary, marginBottom: 20 }}>
                   {selectedActionCourse?.name}
                 </Text>
                 
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                      <TouchableOpacity 
                        style={{ flex: 1, backgroundColor: C.purple, padding: 14, borderRadius: 10, alignItems: 'center' }}
                        onPress={() => setIsEditingCourse(true)}
                      >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Edit Course</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ flex: 1, backgroundColor: C.red || 'red', padding: 14, borderRadius: 10, alignItems: 'center' }}
                        onPress={async () => {
                           if (selectedActionCourse.isCustom) {
                             await removeCustomCourse(selectedActionCourse.id);
                           } else {
                             await hideOfficialCourse(selectedActionCourse._originalKey);
                           }
                           refresh();
                           setSelectedActionCourse(null);
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Delete Course</Text>
                      </TouchableOpacity>
                    </View>

                 <TouchableOpacity 
                    style={{ padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border }}
                    onPress={() => setSelectedActionCourse(null)}
                 >
                   <Text style={{ color: C.textPrimary, fontWeight: '600' }}>Close Options</Text>
                 </TouchableOpacity>
               </View>
             )}
           </View>
        </View>
      </Modal>

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
  editInput: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      fontSize: 14,
  }
});
