import { COURSES, DAYS, DayOfWeek } from '@/constants/courses';
import { useTheme } from '@/contexts/theme-context';
import { CustomCourse, useUserPreferences } from '@/hooks/use-user-preferences';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { Check, FileText, Sparkles, Upload, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const departments = [
  { code: 'CEF', name: 'Computer Eng.' },
  { code: 'EEF', name: 'Electrical Eng.' },
  { code: 'CIV', name: 'Civil Eng.' },
  { code: 'MEF', name: 'Mechanical Eng.' },
  { code: 'CPE', name: 'Chemical & Petroleum Eng.' },
];

const levels = ['200', '300', '400', '500'];
const reminderOptions = [5, 10, 15, 30, 60];

function courseKey(code: string, day: string, time: string) {
  return `${code}-${day}-${time}`;
}

// ─── Custom Toast ─────────────────────────────────────────────────────────────
function useToast(colors: any) {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string, type: 'success' | 'error' = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, type });
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setToast(null));
    }, 2500);
  };

  const ToastComponent = toast ? (
    <Animated.View
      style={[
        toastStyles.toast,
        {
          opacity,
          backgroundColor: colors.bg3,
          borderColor: toast.type === 'success' ? colors.green + '55' : colors.red + '55',
        },
      ]}
      pointerEvents="none">
      <Text style={{ fontSize: 16, marginRight: 8 }}>{toast.type === 'success' ? '✓' : '✕'}</Text>
      <Text style={[toastStyles.msg, { color: toast.type === 'success' ? colors.green : colors.red }]}>
        {toast.msg}
      </Text>
    </Animated.View>
  ) : null;

  return { show, ToastComponent };
}

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  msg: { fontSize: 13, fontWeight: '600', flex: 1 },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { prefs, savePreferences, toggleSelectedCourse, isCourseSelected, createTimetable, setActiveTimetable, deleteTimetable } = useUserPreferences();
  const { theme, setTheme, colors: C } = useTheme();
  const [localDept, setLocalDept] = useState<string | null>(null);
  const [localLevel, setLocalLevel] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // AI Flow Modals
  const [showParseModal, setShowParseModal] = useState(false);
  const [pendingAIParsed, setPendingAIParsed] = useState<CustomCourse[]>([]);
  const [pendingFilename, setPendingFilename] = useState('');
  const [newTbName, setNewTbName] = useState('');
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const { show: showToast, ToastComponent } = useToast(C);

  const isDark = theme === 'dark';

  // Sync local dept/level once prefs load from storage
  useEffect(() => {
    if (prefs.department !== undefined) setLocalDept(prefs.department);
    if (prefs.level !== undefined) setLocalLevel(prefs.level?.toString() ?? null);
  }, [prefs.department, prefs.level]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const selectDept = (code: string) => setLocalDept(code);
  const selectLevel = (lvl: string) => setLocalLevel(lvl);

  const handleSave = async () => {
    if (!localDept || !localLevel) {
      showToast('Please select a department and level', 'error');
      return;
    }
    const ok = await savePreferences({
      department: localDept,
      level: parseInt(localLevel),
    });
    showToast(ok ? 'Settings saved ✓' : 'Save failed, try again', ok ? 'success' : 'error');
  };

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const toggleNotifications = () => {
    savePreferences({ notificationsEnabled: !prefs.notificationsEnabled });
  };

  const setReminder = (min: number) => savePreferences({ reminderMinutes: min });
  const setTimeFormat = (f: '24' | '12') => savePreferences({ timeFormat: f });

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setIsUploading(true);
        
        try {
          // Simulate AI processing delay (3 seconds)
          await new Promise(res => setTimeout(res, 3000));

          // Mock parsed courses. In reality this would be the AI API output.
          // Since it's a simulation, we construct some mock courses or try to parse as CSV if it IS a CSV.
          let newCustomCourses: CustomCourse[] = [];
          
          if (file.name.endsWith('.csv')) {
            const content = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
            const lines = content.split('\n').filter(l => l.trim() !== '');
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
              if (cols.length >= 4) {
                const dayStr = cols[2].toUpperCase().substring(0, 3) as DayOfWeek;
                if (DAYS.includes(dayStr)) {
                  newCustomCourses.push({
                     id: Math.random().toString(36).substring(2, 10),
                     code: cols[0], name: cols[1], day: dayStr, time: cols[3],
                     hall: cols[4] || 'TBA', lecturer: cols[5] || 'TBA',
                     dept: cols[6] || 'EXT', level: parseInt(cols[7]) || 100, isCustom: true
                  });
                }
              }
            }
          } else {
             // Mock AI response for PDF/DOCX
             newCustomCourses = [
               { id: Math.random().toString(36).substring(2, 10), code: 'AI101', name: 'Intro to AI parsed from ' + file.name, day: 'MON', time: '08:00-10:00', hall: 'TBA', lecturer: 'AI Bot', dept: 'EXT', level: 100, isCustom: true },
               { id: Math.random().toString(36).substring(2, 10), code: 'AI102', name: 'Advanced AI Parsed Core', day: 'TUE', time: '10:00-12:00', hall: 'TBA', lecturer: 'AI Bot', dept: 'EXT', level: 200, isCustom: true }
             ];
          }
          
          if (newCustomCourses.length > 0) {
             setPendingAIParsed(newCustomCourses);
             setPendingFilename(file.name);
             setShowParseModal(true);
          } else {
            showToast('No valid courses found in file', 'error');
          }
        } catch (readErr) {
          console.error(readErr);
          showToast('Failed to process file automatically.', 'error');
        } finally {
          setIsUploading(false);
        }
      }
    } catch {
      setIsUploading(false);
      showToast('Failed to open file picker', 'error');
    }
  };

  // ── Course-picker data ───────────────────────────────────────────────────────

  const uniqueCourses = useMemo(() => {
    const seen = new Set<string>();
    return COURSES.filter(c => {
      const k = `${c.code}||${c.name}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.toLowerCase();
    return uniqueCourses.filter(c => {
      const ok = !q || c.code.toLowerCase().includes(q)
        || c.name.toLowerCase().includes(q)
        || c.lecturer.toLowerCase().includes(q);
      return ok && (!filterDept || c.dept === filterDept);
    });
  }, [uniqueCourses, courseSearch, filterDept]);

  // All session keys for a given code+name
  const allKeysOf = (code: string, name: string) =>
    COURSES.filter(c => c.code === code && c.name === name)
           .map(c => courseKey(c.code, c.day, c.time));

  const isAdded = (code: string, name: string) =>
    allKeysOf(code, name).some(k => isCourseSelected(k));

  const toggleCourse = async (code: string, name: string) => {
    const keys = allKeysOf(code, name);
    for (const k of keys) await toggleSelectedCourse(k);
  };

  const selectedCount = prefs.selectedCourses.length;

  // Unique added course summaries (for chips)
  const addedCourses = useMemo(() => {
    const seen = new Set<string>();
    return COURSES.filter(c => {
      const k = `${c.code}||${c.name}`;
      if (seen.has(k)) return false;
      const key = courseKey(c.code, c.day, c.time);
      if (!isCourseSelected(key)) return false;
      seen.add(k);
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.selectedCourses]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={s.header}>
          <Text style={[s.pageTitle, { color: C.textPrimary }]}>Settings</Text>
          <Text style={[s.pageSub, { color: C.textSecondary }]}>Personalise your experience</Text>
        </View>

        {/* ── Active Timetable ── */}
        <SectionLabel label="Timetables" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <TouchableOpacity 
              style={[s.deptRow, { borderBottomColor: C.border, borderBottomWidth: 1 }, prefs.activeTimetableId === 'default' && {backgroundColor: C.accentDim}]}
              onPress={() => setActiveTimetable('default')}
            >
              <View style={s.deptRowLeft}>
                <View style={[s.deptCodeBadge, { backgroundColor: prefs.activeTimetableId === 'default' ? C.accent : C.bg4, width: 32 }]}>
                  <Text style={{ fontSize: 13, fontWeight: '700' }}>T1</Text>
                </View>
                <View>
                  <Text style={[s.deptNameText, { color: C.textPrimary, fontWeight: '600' }]}>Main Timetable</Text>
                  <Text style={[s.rowSub, { color: C.textSecondary, marginTop: 0 }]}>Based on Department/Level settings</Text>
                </View>
              </View>
              {prefs.activeTimetableId === 'default' && <Check size={16} color={C.accent} />}
            </TouchableOpacity>

            {prefs.timetables.map((tb, i) => {
              const active = prefs.activeTimetableId === tb.id;
              return (
                <View key={tb.id} style={[s.deptRow, { borderBottomColor: C.border, borderBottomWidth: i===prefs.timetables.length-1?0:1 }, active && {backgroundColor: C.accentDim}]}>
                  <TouchableOpacity style={s.deptRowLeft} onPress={() => setActiveTimetable(tb.id)}>
                    <View style={[s.deptCodeBadge, { backgroundColor: active ? C.accent : C.bg4, width: 32 }]}>
                      <Text style={{ fontSize: 13, fontWeight: '700' }}>T*</Text>
                    </View>
                    <View>
                      <Text style={[s.deptNameText, { color: C.textPrimary, fontWeight: '600' }]}>{tb.name}</Text>
                      <Text style={[s.rowSub, { color: C.textSecondary, marginTop: 0 }]}>{tb.courses.length} AI parsed courses</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {active && <Check size={16} color={C.accent} />}
                    <TouchableOpacity onPress={() => deleteTimetable(tb.id)}>
                      <X size={16} color={C.red || 'red'} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </View>

        {/* ── Department ── */}
        <SectionLabel label="Department" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
          {departments.map((dept, i) => {
            const active = localDept === dept.code;
            return (
              <TouchableOpacity
                key={dept.code}
                onPress={() => selectDept(dept.code)}
                style={[
                  s.deptRow,
                  { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: C.border },
                  active && { backgroundColor: C.accentDim },
                ]}>
                <View style={s.deptRowLeft}>
                  <View style={[
                    s.deptCodeBadge,
                    { backgroundColor: active ? C.accent : C.bg4 },
                  ]}>
                    <Text style={[s.deptCodeText, { color: active ? '#1a1600' : C.textSecondary }]}>
                      {dept.code}
                    </Text>
                  </View>
                  <Text style={[s.deptNameText, { color: active ? C.textPrimary : C.textSecondary }]}>
                    {dept.name}
                  </Text>
                </View>
                {active && <Check size={16} color={C.accent} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Level ── */}
        <SectionLabel label="Level" colors={C} />
        <View style={[s.levelRow, { gap: 8 }]}>
          {levels.map(lvl => {
            const active = localLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                onPress={() => selectLevel(lvl)}
                style={[
                  s.levelBtn,
                  { backgroundColor: active ? C.accent : C.bg3, borderColor: active ? C.accent : C.border },
                ]}>
                <Text style={[s.levelBtnNum, { color: active ? '#1a1600' : C.textSecondary }]}>{lvl}</Text>
                <Text style={[s.levelBtnSub, { color: active ? '#1a1600' + 'aa' : C.textMuted }]}>LEVEL</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save dept+level */}
        <TouchableOpacity style={[s.saveBtn, { backgroundColor: C.accent }]} onPress={handleSave}>
          <Text style={s.saveBtnText}>Apply dept & level</Text>
          <Check size={15} color="#1a1600" />
        </TouchableOpacity>

        {/* ── Extra Courses ── */}
        <SectionLabel label="Extra Courses" colors={C} />
        <TouchableOpacity
          style={[s.extraBtn, { backgroundColor: C.bg3, borderColor: C.purple + '55' }]}
          onPress={() => setShowCourseModal(true)}>
          <View style={[s.extraIcon, { backgroundColor: C.purpleDim }]}>
            <Text style={{ fontSize: 18 }}>📚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.extraBtnTitle, { color: C.textPrimary }]}>Browse &amp; add courses</Text>
            <Text style={[s.extraBtnSub, { color: C.textSecondary }]}>
              {selectedCount > 0
                ? `${selectedCount} course${selectedCount !== 1 ? 's' : ''} added from other depts`
                : 'Add individual courses from any department'}
            </Text>
          </View>
          <View style={[s.badge, { backgroundColor: C.purpleDim }]}>
            <Text style={[s.badgeNum, { color: C.purple }]}>{selectedCount}</Text>
          </View>
        </TouchableOpacity>

        {addedCourses.length > 0 && (
          <View style={s.chips}>
            {addedCourses.map(c => (
              <TouchableOpacity
                key={c.code + c.name}
                style={[s.chip, { backgroundColor: C.purpleDim, borderColor: C.purple + '44' }]}
                onPress={() => toggleCourse(c.code, c.name)}>
                <Text style={[s.chipCode, { color: C.purple }]}>{c.code}</Text>
                <X size={10} color={C.purple} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Display ── */}
        <SectionLabel label="Display" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
          <View style={[s.row, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
            <View>
              <Text style={[s.rowLabel, { color: C.textPrimary }]}>Dark mode</Text>
              <Text style={[s.rowSub, { color: C.textSecondary }]}>Easy on the eyes</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme}
              trackColor={{ false: C.bg4, true: C.accent }} thumbColor="#fff" />
          </View>
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: C.textPrimary }]}>Time format</Text>
            <View style={[s.seg, { backgroundColor: C.bg4 }]}>
              {(['24', '12'] as const).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[s.segOpt, prefs.timeFormat === f && { backgroundColor: C.accent }]}
                  onPress={() => setTimeFormat(f)}>
                  <Text style={[s.segText, { color: C.textSecondary },
                    prefs.timeFormat === f && { color: '#1a1600', fontWeight: '700' }]}>
                    {f}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Notifications ── */}
        <SectionLabel label="Notifications" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
          <View style={[s.row, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
            <View>
              <Text style={[s.rowLabel, { color: C.textPrimary }]}>Class reminders</Text>
              <Text style={[s.rowSub, { color: C.textSecondary }]}>Get notified before each class</Text>
            </View>
            <Switch value={prefs.notificationsEnabled} onValueChange={toggleNotifications}
              trackColor={{ false: C.bg4, true: C.accent }} thumbColor="#fff" />
          </View>
          <View style={{ padding: 14, opacity: prefs.notificationsEnabled ? 1 : 0.4 }}>
            <Text style={[s.subLabel, { color: C.textMuted }]}>Remind me before class</Text>
            <View style={s.reminderRow}>
              {reminderOptions.map(min => {
                const active = prefs.reminderMinutes === min;
                return (
                  <TouchableOpacity
                    key={min}
                    style={[s.minBtn,
                      { backgroundColor: active ? C.accentDim : C.bg4, borderColor: active ? C.accent : C.border }]}
                    onPress={() => setReminder(min)}
                    disabled={!prefs.notificationsEnabled}>
                    <Text style={[s.minText, { color: active ? C.accent : C.textSecondary }]}>
                      {min}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[s.notifStatus,
              { backgroundColor: prefs.notificationsEnabled ? C.greenDim : C.bg4,
                borderColor: prefs.notificationsEnabled ? C.green + '44' : C.border }]}>
              <Text style={{ fontSize: 15 }}>{prefs.notificationsEnabled ? '🔔' : '🔕'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.notifTitle, { color: prefs.notificationsEnabled ? C.green : C.textSecondary }]}>
                  {prefs.notificationsEnabled ? 'Reminders active' : 'Reminders off'}
                </Text>
                <Text style={[s.notifSub, { color: C.textSecondary }]}>
                  {prefs.notificationsEnabled
                    ? `${prefs.reminderMinutes} min before each class`
                    : 'Enable to get class reminders'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Upload ── */}
        <SectionLabel label="AI Timetable Import" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
          <View style={[s.row, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
            <View style={[s.uploadIcon, { backgroundColor: C.purpleDim, borderColor: C.purple + '44' }]}>
              <Upload size={16} color={C.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowLabel, { color: C.textPrimary }]}>Upload new timetable</Text>
              <Text style={[s.rowSub, { color: C.textSecondary }]}>AI parses PDF, Excel or CSV</Text>
            </View>
          </View>
          {prefs.lastImportedFile && (
            <View style={[s.lastImport, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
              <FileText size={12} color={C.textMuted} />
              <Text style={[s.lastImportText, { color: C.textSecondary }]} numberOfLines={1}>
                Last: {prefs.lastImportedFile}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.dropzone,
              { borderColor: C.border2, backgroundColor: C.bg4 },
              isUploading && { borderColor: C.purple, backgroundColor: C.purpleDim }]}
            onPress={handleFileUpload}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <Sparkles size={26} color={C.purple} style={{ marginBottom: 8 }} />
                <Text style={[s.dropTitle, { color: C.textPrimary }]}>Processing…</Text>
                <Text style={[s.dropSub, { color: C.textSecondary }]}>AI is parsing your timetable</Text>
              </>
            ) : (
              <>
                <FileText size={26} color={C.textSecondary} style={{ marginBottom: 8 }} />
                <Text style={[s.dropTitle, { color: C.textPrimary }]}>Tap to choose a file</Text>
                <View style={s.fileTypes}>
                  <View style={[s.fileTag, { borderColor: C.border2 }]}>
                    <Text style={[s.fileTagText, { color: C.textMuted }]}>PDF, DOCX, XLSX, CSV</Text>
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
          <View style={s.aiNote}>
            <Sparkles size={13} color={C.purple} />
            <Text style={[s.aiNoteText, { color: C.textSecondary }]}>
              AI extracts courses and adds them to your timetable
            </Text>
          </View>
        </View>

        {/* ── About ── */}
        <SectionLabel label="About" colors={C} />
        <View style={[s.card, { backgroundColor: C.bg3, borderColor: C.border }]}>
          {[
            ['Semester', '2nd Sem 2025/2026'],
            ['Faculty', 'FET · University of Buea'],
            ['Courses loaded', String(COURSES.length)],
            ['Source', 'Official timetable PDF'],
          ].map(([label, value], i, arr) => (
            <View key={label}
              style={[s.row, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
              <Text style={[s.rowLabel, { color: C.textPrimary }]}>{label}</Text>
              <Text style={[s.aboutValue, { color: C.accent }]}>{value}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Toast */}
      {ToastComponent}

      {/* ── Course Selection Modal ── */}
      <Modal visible={showCourseModal} animationType="slide" presentationStyle="pageSheet"
        onRequestClose={() => setShowCourseModal(false)}>
        <SafeAreaView style={[s.modalWrap, { backgroundColor: C.bg }]}>
          {/* Modal Header */}
          <View style={[s.modalHead, { borderBottomColor: C.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[s.modalTitle, { color: C.textPrimary }]}>Add Extra Courses</Text>
              <Text style={[s.modalSub, { color: C.textSecondary }]}>
                {selectedCount > 0 ? `${selectedCount} added` : 'Tap a course to add to your timetable'}
              </Text>
            </View>
            <TouchableOpacity style={[s.closeBtn, { backgroundColor: C.bg4 }]}
              onPress={() => setShowCourseModal(false)}>
              <X size={17} color={C.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={[s.search, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <Text style={{ color: C.textMuted, marginRight: 8, fontSize: 15 }}>🔍</Text>
            <TextInput
              style={[s.searchInput, { color: C.textPrimary }]}
              placeholder="Code, course name, lecturer…"
              placeholderTextColor={C.textMuted}
              value={courseSearch}
              onChangeText={setCourseSearch}
            />
            {courseSearch.length > 0 && (
              <TouchableOpacity onPress={() => setCourseSearch('')}>
                <X size={14} color={C.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Dept filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 44, marginVertical: 8 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 7, alignItems: 'center' }}>
            {[null, 'CEF', 'EEF', 'CIV', 'MEF', 'CPE'].map(d => {
              const active = filterDept === d;
              return (
                <TouchableOpacity
                  key={d ?? 'all'}
                  style={[s.filterChip,
                    { backgroundColor: active ? C.accentDim : C.bg3, borderColor: active ? C.accent : C.border }]}
                  onPress={() => setFilterDept(d)}>
                  <Text style={[s.filterText, { color: active ? C.accent : C.textSecondary }]}>
                    {d ?? 'All'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* List */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            {filteredCourses.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 34, marginBottom: 12 }}>🔍</Text>
                <Text style={{ color: C.textSecondary, fontSize: 13 }}>No courses match</Text>
              </View>
            )}
            {filteredCourses.map(c => {
              const added = isAdded(c.code, c.name);
              const isOwn = c.dept === prefs.department && c.level === prefs.level;
              return (
                <TouchableOpacity
                  key={c.code + c.name}
                  style={[
                    s.courseCard,
                    { backgroundColor: C.bg3, borderColor: C.border },
                    added && { borderColor: C.purple, backgroundColor: C.purpleDim },
                    isOwn && { borderColor: C.accent + '55', backgroundColor: C.accentDim },
                  ]}
                  onPress={() => { if (!isOwn) toggleCourse(c.code, c.name); }}
                  activeOpacity={isOwn ? 1 : 0.75}>
                  <View style={s.courseCardTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 }}>
                      <Text style={[s.courseCode, { color: added ? C.purple : isOwn ? C.accent : C.textPrimary }]}>
                        {c.code}
                      </Text>
                      <View style={[s.deptTag, { backgroundColor: added ? C.purple + '22' : C.bg4 }]}>
                        <Text style={[s.deptTagText, { color: added ? C.purple : C.textMuted }]}>{c.dept}</Text>
                      </View>
                      {isOwn && (
                        <View style={[s.deptTag, { backgroundColor: C.accentDim }]}>
                          <Text style={[s.deptTagText, { color: C.accent }]}>My dept</Text>
                        </View>
                      )}
                    </View>
                    {!isOwn && (
                      <View style={[s.checkCircle,
                        { borderColor: added ? C.purple : C.border },
                        added && { backgroundColor: C.purple }]}>
                        {added && <Check size={10} color="#fff" />}
                      </View>
                    )}
                  </View>
                  <Text style={[s.courseName, { color: C.textPrimary }]} numberOfLines={2}>{c.name}</Text>
                  {c.lecturer ? <Text style={[s.courseLect, { color: C.textSecondary }]} numberOfLines={1}>{c.lecturer}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={[s.modalFooter, { backgroundColor: C.bg, borderTopColor: C.border }]}>
            <Text style={[s.footerText, { color: C.textSecondary }]}>
              {selectedCount} extra course{selectedCount !== 1 ? 's' : ''} in your timetable
            </Text>
            <TouchableOpacity style={[s.doneBtn, { backgroundColor: C.accent }]}
              onPress={() => setShowCourseModal(false)}>
              <Text style={s.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Parse Review Modal ── */}
      <Modal visible={showParseModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[s.modalWrap, { backgroundColor: C.bg }]}>
          <View style={[s.modalHead, { borderBottomColor: C.border }]}>
             <View style={{ flex: 1 }}>
               <Text style={[s.modalTitle, { color: C.textPrimary }]}>AI Parsed Courses</Text>
               <Text style={[s.modalSub, { color: C.textSecondary }]}>Found {pendingAIParsed.length} courses in {pendingFilename}</Text>
             </View>
             <TouchableOpacity style={[s.closeBtn, { backgroundColor: C.bg4 }]} onPress={() => setShowParseModal(false)}>
               <X size={17} color={C.textSecondary} />
             </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, padding: 16 }}>
             {pendingAIParsed.map(c => (
               <View key={c.id} style={[s.courseCard, { backgroundColor: C.bg3, borderColor: C.border }]}>
                  <View style={s.courseCardTop}>
                     <Text style={[s.courseCode, { color: C.accent }]}>{c.code}</Text>
                     <View style={[s.deptTag, { backgroundColor: C.bg4 }]}><Text style={{fontSize: 9, color: C.textMuted}}>{c.day} {c.time}</Text></View>
                  </View>
                  <Text style={[s.courseName, { color: C.textPrimary }]}>{c.name}</Text>
               </View>
             ))}
             
             <Text style={[s.sectionLabel, { color: C.textMuted, marginTop: 20, marginHorizontal: 0 }]}>CREATE NEW TIMETABLE?</Text>
             <TextInput 
               style={[s.searchInput, { borderColor: C.border, borderWidth: 1, marginTop: 8 }]} 
               placeholder="e.g. My Custom PDF Schedule"
               placeholderTextColor={C.textMuted}
               value={newTbName}
               onChangeText={setNewTbName}
             />
             <TouchableOpacity 
               style={[s.saveBtn, { backgroundColor: C.accent, marginTop: 12, marginHorizontal: 0 }]}
               onPress={async () => {
                 if (!newTbName) return showToast('Enter a name for the new timetable', 'error');
                 await createTimetable(newTbName, pendingAIParsed);
                 await savePreferences({ lastImportedFile: pendingFilename });
                 setShowParseModal(false);
                 setNewTbName('');
                 showToast('Created new timetable!', 'success');
               }}
             >
               <Text style={s.saveBtnText}>Save as New Timetable</Text>
               <Sparkles size={16} color="#000" />
             </TouchableOpacity>
             
             <View style={{ height: 20 }} />
             <Text style={[s.sectionLabel, { color: C.textMuted, marginHorizontal: 0 }]}>OR MERGE WITH CURRENT</Text>
             <TouchableOpacity 
               style={[s.saveBtn, { backgroundColor: C.bg3, borderColor: C.border, borderWidth: 1, marginHorizontal: 0, marginTop: 8 }]}
               onPress={async () => {
                 if (prefs.activeTimetableId === 'default') {
                   await savePreferences({ customCourses: [...prefs.customCourses, ...pendingAIParsed], lastImportedFile: pendingFilename });
                 } else {
                   const tbs = prefs.timetables.map(t => {
                     if (t.id === prefs.activeTimetableId) return { ...t, courses: [...t.courses, ...pendingAIParsed] };
                     return t;
                   });
                   await savePreferences({ timetables: tbs, lastImportedFile: pendingFilename });
                 }
                 setShowParseModal(false);
                 showToast('Merged into active timetable', 'success');
               }}
             >
               <Text style={[s.saveBtnText, { color: C.textPrimary }]}>Merge with active timetable</Text>
             </TouchableOpacity>
             <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function SectionLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[s.sectionLabel, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_MX = 20;

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 24, paddingHorizontal: CARD_MX, paddingBottom: 8 },
  pageTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  pageSub: { fontSize: 12, fontWeight: '300', marginTop: 3 },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    marginHorizontal: CARD_MX, marginTop: 20, marginBottom: 8,
  },
  // Card (list-style)
  card: {
    marginHorizontal: CARD_MX, borderWidth: 1, borderRadius: 16, overflow: 'hidden',
  },
  // Department rows
  deptRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 13,
  },
  deptRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deptCodeBadge: {
    width: 48, height: 28, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  deptCodeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },
  deptNameText: { fontSize: 13, fontWeight: '400' },
  // Level
  levelRow: { flexDirection: 'row', marginHorizontal: CARD_MX },
  levelBtn: {
    flex: 1, borderWidth: 1.5, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
  },
  levelBtnNum: { fontSize: 16, fontWeight: '800' },
  levelBtnSub: { fontSize: 8, letterSpacing: 0.6, marginTop: 2 },
  // Save button
  saveBtn: {
    marginHorizontal: CARD_MX, marginTop: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 13,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1600' },
  // Extra courses
  extraBtn: {
    marginHorizontal: CARD_MX, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 14,
  },
  extraIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  extraBtnTitle: { fontSize: 14, fontWeight: '600' },
  extraBtnSub: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  badge: { minWidth: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeNum: { fontSize: 12, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginHorizontal: CARD_MX, marginTop: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
  },
  chipCode: { fontSize: 11, fontWeight: '700' },
  // Rows
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowLabel: { fontSize: 13, fontWeight: '500' },
  rowSub: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  aboutValue: { fontSize: 12, fontWeight: '600' },
  // Segmented
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 2 },
  segOpt: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  segText: { fontSize: 11, fontWeight: '500' },
  // Notifications
  subLabel: { fontSize: 10, letterSpacing: 0.4, marginBottom: 8 },
  reminderRow: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  minBtn: { flex: 1, borderWidth: 1.5, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  minText: { fontSize: 11, fontWeight: '600' },
  notifStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, padding: 12 },
  notifTitle: { fontSize: 12, fontWeight: '600' },
  notifSub: { fontSize: 10, marginTop: 1 },
  // Upload
  uploadIcon: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginRight: 2,
  },
  lastImport: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10 },
  lastImportText: { fontSize: 11, flex: 1 },
  dropzone: {
    margin: 14, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14,
    paddingVertical: 26, paddingHorizontal: 16, alignItems: 'center',
  },
  dropTitle: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  dropSub: { fontSize: 11, fontWeight: '300' },
  fileTypes: { flexDirection: 'row', gap: 6, marginTop: 10 },
  fileTag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  fileTagText: { fontSize: 10, fontWeight: '600' },
  aiNote: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  aiNoteText: { fontSize: 11, fontStyle: 'italic', flex: 1 },
  // Modal
  modalWrap: { flex: 1 },
  modalHead: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  modalSub: { fontSize: 12, fontWeight: '300', marginTop: 2 },
  closeBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 12,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 13 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  filterText: { fontSize: 11, fontWeight: '600' },
  courseCard: { borderWidth: 1.5, borderRadius: 14, padding: 13, marginBottom: 8 },
  courseCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  courseCode: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  deptTag: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  deptTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  courseName: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  courseLect: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  modalFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderTopWidth: 1,
  },
  footerText: { fontSize: 13 },
  doneBtn: { borderRadius: 10, paddingHorizontal: 22, paddingVertical: 10 },
  doneBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1600' },
});
