import { COURSES } from '@/constants/courses';
import { useTheme } from '@/contexts/theme-context';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import { Check, ChevronDown, ChevronUp, FileText, Sparkles, Upload, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
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

const { width, height } = Dimensions.get('window');

const departments = [
  { code: 'CEF', name: 'Computer Eng.' },
  { code: 'EEF', name: 'Electrical Eng.' },
  { code: 'CIV', name: 'Civil Eng.' },
  { code: 'MEF', name: 'Mechanical Eng.' },
  { code: 'CPE', name: 'Chemical & Petroleum Eng.', fullWidth: true },
];

const levels = ['200', '300', '400', '500'];
const reminderOptions = [5, 10, 15, 30, 60];

function courseKey(code: string, day: string, time: string) {
  return `${code}-${day}-${time}`;
}

export default function SettingsScreen() {
  const { prefs, savePreferences, toggleSelectedCourse, isCourseSelected } = useUserPreferences();
  const { theme, setTheme, colors } = useTheme();
  const [localDept, setLocalDept] = useState(prefs.department);
  const [localLevel, setLocalLevel] = useState(prefs.level?.toString() || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string | null>(null);

  useEffect(() => {
    setLocalDept(prefs.department);
    setLocalLevel(prefs.level?.toString() || null);
  }, [prefs.department, prefs.level]);

  const isDark = theme === 'dark';

  const handleSave = async () => {
    const success = await savePreferences({
      department: localDept,
      level: localLevel ? parseInt(localLevel) : null,
    });
    if (success) Alert.alert('Saved', 'Settings applied successfully');
  };

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const toggleNotifications = () => {
    savePreferences({ notificationsEnabled: !prefs.notificationsEnabled });
  };

  const setReminder = (minutes: number) => savePreferences({ reminderMinutes: minutes });
  const setTimeFormat = (format: '24' | '12') => savePreferences({ timeFormat: format });

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setIsUploading(true);
        setTimeout(async () => {
          setIsUploading(false);
          await savePreferences({ lastImportedFile: file.name });
          Alert.alert('Upload Complete', `"${file.name}" uploaded successfully.`, [{ text: 'OK' }]);
        }, 2000);
      }
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  /* ----- Course selection modal data ----- */
  const uniqueCourses = useMemo(() => {
    const seen = new Set<string>();
    return COURSES.filter(c => {
      const k = `${c.code}-${c.name}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.toLowerCase();
    return uniqueCourses.filter(c => {
      const matchSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.lecturer.toLowerCase().includes(q);
      const matchDept = !filterDept || c.dept === filterDept;
      return matchSearch && matchDept;
    });
  }, [uniqueCourses, courseSearch, filterDept]);

  const selectedCount = prefs.selectedCourses.length;

  // ---- colour shortcuts ----
  const C = colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: C.textPrimary }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: C.textSecondary }]}>Personalise your experience.</Text>
        </View>

        {/* Department & Level */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Department</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <View style={styles.deptGrid}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept.code}
                  style={[
                    styles.deptMini,
                    { backgroundColor: C.bg4, borderColor: C.border },
                    dept.fullWidth && styles.deptMiniFullWidth,
                    localDept === dept.code && { borderColor: C.accent, backgroundColor: C.accentDim },
                  ]}
                  onPress={() => setLocalDept(dept.code)}>
                  <Text style={[styles.deptMiniCode, { color: C.textSecondary }, localDept === dept.code && { color: C.accent }]}>
                    {dept.code}
                  </Text>
                  <Text style={[styles.deptMiniName, { color: C.textMuted }]}>{dept.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 14, color: C.textMuted }]}>Level</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <View style={styles.levelRow}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelMini,
                    { backgroundColor: C.bg4, borderColor: C.border },
                    localLevel === level && { borderColor: C.accent, backgroundColor: C.accentDim },
                  ]}
                  onPress={() => setLocalLevel(level)}>
                  <Text style={[styles.levelMiniText, { color: C.textSecondary }, localLevel === level && { color: C.accent }]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Extra Courses ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Extra Courses</Text>
          <TouchableOpacity
            style={[styles.extraCoursesBtn, { backgroundColor: C.bg3, borderColor: C.purpleDim }]}
            onPress={() => setShowCourseModal(true)}>
            <View style={[styles.extraIcon, { backgroundColor: C.purpleDim }]}>
              <Text style={{ fontSize: 16 }}>📚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.extraBtnTitle, { color: C.textPrimary }]}>Browse & add courses</Text>
              <Text style={[styles.extraBtnSub, { color: C.textSecondary }]}>
                {selectedCount > 0 ? `${selectedCount} course${selectedCount > 1 ? 's' : ''} added from other depts` : 'Add courses from any department'}
              </Text>
            </View>
            <ChevronDown size={16} color={C.textMuted} />
          </TouchableOpacity>

          {/* Selected extras chips */}
          {prefs.selectedCourses.length > 0 && (
            <View style={styles.selectedChips}>
              {COURSES.filter(c => prefs.selectedCourses.includes(courseKey(c.code, c.day, c.time)))
                .reduce<typeof COURSES>((acc, c) => {
                  const k = `${c.code}-${c.name}`;
                  if (!acc.find(x => `${x.code}-${x.name}` === k)) acc.push(c);
                  return acc;
                }, [])
                .map(c => {
                  const allKeys = COURSES.filter(x => x.code === c.code && x.name === c.name).map(x => courseKey(x.code, x.day, x.time));
                  return (
                    <TouchableOpacity
                      key={c.code + c.name}
                      style={[styles.chip, { backgroundColor: C.purpleDim, borderColor: C.purple + '44' }]}
                      onPress={async () => {
                        for (const k of allKeys) {
                          if (isCourseSelected(k)) await toggleSelectedCourse(k);
                        }
                      }}>
                      <Text style={[styles.chipText, { color: C.purple }]}>{c.code}</Text>
                      <X size={10} color={C.purple} style={{ marginLeft: 3 }} />
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Display</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <View style={[styles.row, { borderBottomColor: C.border }]}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: C.textPrimary }]}>Dark mode</Text>
                <Text style={[styles.rowSub, { color: C.textSecondary }]}>Easy on the eyes</Text>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: C.bg4, true: C.accent }} thumbColor="#fff" />
            </View>
            <View style={[styles.row, { borderBottomColor: C.border }]}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: C.textPrimary }]}>Time format</Text>
              </View>
              <View style={[styles.segmented, { backgroundColor: C.bg4 }]}>
                {(['24', '12'] as const).map(f => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.segmentOption, prefs.timeFormat === f && { backgroundColor: C.accent }]}
                    onPress={() => setTimeFormat(f)}>
                    <Text style={[styles.segmentText, { color: C.textSecondary }, prefs.timeFormat === f && { color: '#1a1600', fontWeight: '700' }]}>
                      {f}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Notifications</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <View style={[styles.notifHeader, { borderBottomColor: C.border }]}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: C.textPrimary }]}>Class reminders</Text>
                <Text style={[styles.rowSub, { color: C.textSecondary }]}>Get notified before each class</Text>
              </View>
              <Switch value={prefs.notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ false: C.bg4, true: C.accent }} thumbColor="#fff" />
            </View>
            <View style={{ opacity: prefs.notificationsEnabled ? 1 : 0.4, padding: 12 }}>
              <Text style={[styles.roptLabel, { color: C.textMuted }]}>Remind me before class:</Text>
              <View style={styles.reminderOpts}>
                {reminderOptions.map(min => (
                  <TouchableOpacity
                    key={min}
                    style={[styles.ropt, { backgroundColor: C.bg4, borderColor: C.border }, prefs.reminderMinutes === min && { borderColor: C.accent, backgroundColor: C.accentDim }]}
                    onPress={() => setReminder(min)}
                    disabled={!prefs.notificationsEnabled}>
                    <Text style={[styles.roptText, { color: C.textSecondary }, prefs.reminderMinutes === min && { color: C.accent, fontWeight: '700' }]}>
                      {min} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.notifStatus, { backgroundColor: C.greenDim, borderColor: C.green + '33' }]}>
                <Text style={styles.notifStatusIcon}>🔔</Text>
                <View>
                  <Text style={[styles.notifStatusTitle, { color: C.green }]}>
                    {prefs.notificationsEnabled ? 'Notifications active' : 'Notifications disabled'}
                  </Text>
                  <Text style={[styles.notifStatusSub, { color: C.textSecondary }]}>
                    {prefs.notificationsEnabled ? `Reminding ${prefs.reminderMinutes} min before each class` : 'Enable to get class reminders'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* AI Upload */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>AI Timetable Import</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <View style={[styles.uploadHeader, { borderBottomColor: C.border }]}>
              <View style={[styles.uploadIcon, { backgroundColor: C.purpleDim, borderColor: C.purple + '33' }]}>
                <Upload size={18} color={C.purple} />
              </View>
              <View>
                <Text style={[styles.uploadTitle, { color: C.textPrimary }]}>Upload new timetable</Text>
                <Text style={[styles.uploadSub, { color: C.textSecondary }]}>AI parses any PDF or Excel file</Text>
              </View>
            </View>
            {prefs.lastImportedFile && (
              <View style={[styles.lastImport, { borderBottomColor: C.border }]}>
                <FileText size={12} color={C.textMuted} />
                <Text style={[styles.lastImportText, { color: C.textSecondary }]}>Last: {prefs.lastImportedFile}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.dropzone, { borderColor: C.border2, backgroundColor: C.bg4 }, isUploading && { borderColor: C.purple, backgroundColor: C.purpleDim }]}
              onPress={handleFileUpload}
              disabled={isUploading}>
              {isUploading ? (
                <>
                  <Sparkles size={28} color={C.purple} style={{ marginBottom: 10 }} />
                  <Text style={[styles.dropzoneTitle, { color: C.textPrimary }]}>Processing...</Text>
                  <Text style={[styles.dropzoneSub, { color: C.textSecondary }]}>AI is parsing your timetable</Text>
                </>
              ) : (
                <>
                  <FileText size={28} color={C.textSecondary} style={{ marginBottom: 10 }} />
                  <Text style={[styles.dropzoneTitle, { color: C.textPrimary }]}>Tap to upload timetable</Text>
                  <Text style={[styles.dropzoneSub, { color: C.textSecondary }]}>Browse for PDF, Excel, or CSV files</Text>
                  <View style={styles.fileTypes}>
                    {['PDF','XLSX','XLS','CSV'].map(t => (
                      <Text key={t} style={[styles.fileType, { borderColor: C.border2, color: C.textMuted }]}>{t}</Text>
                    ))}
                  </View>
                </>
              )}
            </TouchableOpacity>
            <View style={styles.aiNote}>
              <Sparkles size={14} color={C.purple} />
              <Text style={[styles.aiNoteText, { color: C.textSecondary }]}>AI will extract courses and add them to your timetable</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>About</Text>
          <View style={[styles.cardGroup, { backgroundColor: C.bg3, borderColor: C.border }]}>
            {[
              { label: 'Semester', value: '2nd Sem 2025/2026' },
              { label: 'Faculty', value: 'FET · UB' },
              { label: 'Total courses loaded', value: String(COURSES.length) },
              { label: 'Source', value: 'Built-in' },
            ].map((item, i, arr) => (
              <View key={item.label} style={[styles.row, { borderBottomColor: C.border }, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={[styles.rowLabel, { color: C.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.rowValue, { color: C.accent }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: C.accent }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Apply changes</Text>
          <Check size={16} color="#1a1600" />
        </TouchableOpacity>
        <Text style={[styles.saveNote, { color: C.textMuted }]}>Changes reflect immediately on Home tab</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Course Selection Modal ── */}
      <Modal visible={showCourseModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCourseModal(false)}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: C.bg }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
            <View>
              <Text style={[styles.modalTitle, { color: C.textPrimary }]}>Add Extra Courses</Text>
              <Text style={[styles.modalSub, { color: C.textSecondary }]}>Tap a course to add it to your timetable</Text>
            </View>
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: C.bg4 }]} onPress={() => setShowCourseModal(false)}>
              <X size={18} color={C.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={[styles.searchBar, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <Text style={{ fontSize: 14, color: C.textMuted, marginRight: 8 }}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: C.textPrimary }]}
              placeholder="Search by code, name or lecturer..."
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 7 }}>
            {[null, 'CEF', 'EEF', 'CIV', 'MEF', 'CPE'].map(d => (
              <TouchableOpacity
                key={d ?? 'all'}
                style={[styles.filterChip, { backgroundColor: C.bg3, borderColor: C.border }, filterDept === d && { backgroundColor: C.accentDim, borderColor: C.accent }]}
                onPress={() => setFilterDept(d)}>
                <Text style={[styles.filterChipText, { color: C.textSecondary }, filterDept === d && { color: C.accent }]}>
                  {d ?? 'All'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Course list */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
            {filteredCourses.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>🔍</Text>
                <Text style={[{ color: C.textSecondary, fontSize: 13 }]}>No courses match your search</Text>
              </View>
            )}
            {filteredCourses.map(c => {
              // All session keys for this course code+name
              const allKeys = COURSES.filter(x => x.code === c.code && x.name === c.name).map(x => courseKey(x.code, x.day, x.time));
              const isAdded = allKeys.some(k => isCourseSelected(k));
              const isOwn = c.dept === prefs.department && c.level === prefs.level;

              return (
                <TouchableOpacity
                  key={c.code + c.name}
                  style={[
                    styles.modalCourseCard,
                    { backgroundColor: C.bg3, borderColor: C.border },
                    isAdded && { borderColor: C.purple, backgroundColor: C.purpleDim },
                    isOwn && { borderColor: C.accent + '55', backgroundColor: C.accentDim },
                  ]}
                  onPress={async () => {
                    if (isOwn) return; // already in main timetable
                    for (const k of allKeys) {
                      await toggleSelectedCourse(k);
                    }
                  }}
                  activeOpacity={isOwn ? 1 : 0.8}>
                  <View style={styles.modalCardTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                      <Text style={[styles.modalCode, { color: isAdded ? C.purple : isOwn ? C.accent : C.textPrimary }]}>{c.code}</Text>
                      <View style={[styles.deptTag, { backgroundColor: C.bg4 }]}>
                        <Text style={[styles.deptTagText, { color: C.textMuted }]}>{c.dept}</Text>
                      </View>
                      {isOwn && (
                        <View style={[styles.deptTag, { backgroundColor: C.accentDim }]}>
                          <Text style={[styles.deptTagText, { color: C.accent }]}>Your dept</Text>
                        </View>
                      )}
                    </View>
                    {!isOwn && (
                      <View style={[styles.checkCircle, { borderColor: isAdded ? C.purple : C.border }, isAdded && { backgroundColor: C.purple }]}>
                        {isAdded && <Check size={10} color="#fff" />}
                      </View>
                    )}
                  </View>
                  <Text style={[styles.modalName, { color: C.textPrimary }]}>{c.name}</Text>
                  {c.lecturer ? <Text style={[styles.modalLecturer, { color: C.textSecondary }]}>{c.lecturer}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Bottom bar */}
          <View style={[styles.modalFooter, { backgroundColor: C.bg, borderTopColor: C.border }]}>
            <Text style={[styles.modalFooterText, { color: C.textSecondary }]}>
              {selectedCount} extra course{selectedCount !== 1 ? 's' : ''} added
            </Text>
            <TouchableOpacity style={[styles.modalDoneBtn, { backgroundColor: C.accent }]} onPress={() => setShowCourseModal(false)}>
              <Text style={styles.modalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 18 },
  title: { fontSize: 23, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 12, fontWeight: '300', marginTop: 3 },
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  cardGroup: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 12 },
  deptMini: { width: (width - 72) / 2, borderWidth: 1.5, borderRadius: 10, padding: 10 },
  deptMiniFullWidth: { width: width - 64 },
  deptMiniCode: { fontSize: 14, fontWeight: '700' },
  deptMiniName: { fontSize: 9, marginTop: 2 },
  levelRow: { flexDirection: 'row', gap: 6, padding: 12 },
  levelMini: { flex: 1, borderWidth: 1.5, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  levelMiniText: { fontSize: 12, fontWeight: '700' },
  extraCoursesBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 14 },
  extraIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  extraBtnTitle: { fontSize: 14, fontWeight: '600' },
  extraBtnSub: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  selectedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  rowLeft: { flexDirection: 'column', gap: 2 },
  rowLabel: { fontSize: 13, fontWeight: '500' },
  rowSub: { fontSize: 11, fontWeight: '300' },
  rowValue: { fontSize: 12, fontWeight: '600' },
  segmented: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 2 },
  segmentOption: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  segmentText: { fontSize: 11, fontWeight: '500' },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  roptLabel: { fontSize: 10, marginBottom: 8, letterSpacing: 0.4 },
  reminderOpts: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  ropt: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  roptText: { fontSize: 11, fontWeight: '500' },
  notifStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 4 },
  notifStatusIcon: { fontSize: 16 },
  notifStatusTitle: { fontSize: 12, fontWeight: '500' },
  notifStatusSub: { fontSize: 10, marginTop: 1 },
  uploadHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1 },
  uploadIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { fontSize: 13, fontWeight: '500' },
  uploadSub: { fontSize: 11, fontWeight: '300', marginTop: 1 },
  lastImport: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  lastImportText: { fontSize: 11 },
  dropzone: { margin: 14, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 28, paddingHorizontal: 16, alignItems: 'center' },
  dropzoneTitle: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  dropzoneSub: { fontSize: 11, fontWeight: '300', lineHeight: 16 },
  fileTypes: { flexDirection: 'row', gap: 6, marginTop: 10 },
  fileType: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, fontSize: 10, fontWeight: '600', borderWidth: 1 },
  aiNote: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  aiNoteText: { fontSize: 11, fontStyle: 'italic' },
  saveBtn: { marginHorizontal: 20, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1600' },
  saveNote: { textAlign: 'center', fontSize: 10, marginTop: 8, marginBottom: 24 },
  // Modal
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  modalSub: { fontSize: 12, fontWeight: '300', marginTop: 2 },
  modalClose: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  searchInput: { flex: 1, fontSize: 13 },
  filterRow: { marginTop: 10, maxHeight: 44 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 11, fontWeight: '600' },
  modalCourseCard: { borderWidth: 1.5, borderRadius: 14, padding: 12, marginBottom: 8 },
  modalCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  modalCode: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  deptTag: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  deptTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  modalName: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  modalLecturer: { fontSize: 11, fontWeight: '300', marginTop: 2 },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  modalFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderTopWidth: 1 },
  modalFooterText: { fontSize: 13 },
  modalDoneBtn: { borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  modalDoneBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1600' },
});
