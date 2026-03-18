import { COURSES } from '@/constants/courses';
import { useTheme } from '@/contexts/theme-context';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import { Check, FileText, Sparkles, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const departments = [
  { code: 'CEN', name: 'Computer Eng.' },
  { code: 'EEN', name: 'Electrical Eng.' },
  { code: 'CIV', name: 'Civil Eng.' },
  { code: 'MEF', name: 'Mechanical Eng.' },
  { code: 'CPE', name: 'Chemical & Petroleum Eng.', fullWidth: true },
];

const levels = ['200', '300', '400', '500'];
const reminderOptions = [5, 10, 15, 30, 60];

export default function SettingsScreen() {
  const { prefs, savePreferences, refresh } = useUserPreferences();
  const { theme, setTheme, colors } = useTheme();
  const [localDept, setLocalDept] = useState(prefs.department);
  const [localLevel, setLocalLevel] = useState(prefs.level?.toString() || null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync local state with preferences when they load
  useEffect(() => {
    setLocalDept(prefs.department);
    setLocalLevel(prefs.level?.toString() || null);
  }, [prefs.department, prefs.level]);

  const handleSave = async () => {
    const success = await savePreferences({
      department: localDept,
      level: localLevel ? parseInt(localLevel) : null,
    });
    if (success) {
      Alert.alert('Success', 'Settings saved successfully');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const toggleNotifications = () => {
    savePreferences({ notificationsEnabled: !prefs.notificationsEnabled });
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setIsUploading(true);
        
        // Simulate AI processing
        setTimeout(() => {
          setIsUploading(false);
          Alert.alert(
            'Upload Complete',
            `File "${file.name}" uploaded successfully. AI parsing would happen here.`,
            [{ text: 'OK' }]
          );
        }, 2000);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const setReminder = (minutes: number) => {
    savePreferences({ reminderMinutes: minutes });
  };

  const setTimeFormat = (format: '24' | '12') => {
    savePreferences({ timeFormat: format });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Personalise your experience.</Text>
        </View>

        {/* Department & Level */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Department</Text>
          <View style={styles.cardGroup}>
            <View style={styles.deptGrid}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept.code}
                  style={[
                    styles.deptMini,
                    dept.fullWidth && styles.deptMiniFullWidth,
                    localDept === dept.code && styles.deptMiniSelected,
                  ]}
                  onPress={() => setLocalDept(dept.code)}>
                  <Text style={[
                    styles.deptMiniCode,
                    localDept === dept.code && styles.deptMiniCodeSelected,
                  ]}>
                    {dept.code}
                  </Text>
                  <Text style={styles.deptMiniName}>{dept.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Level</Text>
          <View style={styles.cardGroup}>
            <View style={styles.levelRow}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelMini,
                    localLevel === level && styles.levelMiniSelected,
                  ]}
                  onPress={() => setLocalLevel(level)}>
                  <Text style={[
                    styles.levelMiniText,
                    localLevel === level && styles.levelMiniTextSelected,
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Display</Text>
          <View style={styles.cardGroup}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Dark mode</Text>
                <Text style={styles.rowSub}>Easy on the eyes</Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#272620', true: '#f5c842' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Time format</Text>
              </View>
              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[
                    styles.segmentOption,
                    prefs.timeFormat === '24' && styles.segmentOptionActive,
                  ]}
                  onPress={() => setTimeFormat('24')}>
                  <Text style={[
                    styles.segmentText,
                    prefs.timeFormat === '24' && styles.segmentTextActive,
                  ]}>
                    24h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentOption,
                    prefs.timeFormat === '12' && styles.segmentOptionActive,
                  ]}
                  onPress={() => setTimeFormat('12')}>
                  <Text style={[
                    styles.segmentText,
                    prefs.timeFormat === '12' && styles.segmentTextActive,
                  ]}>
                    12h
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notifications</Text>
          <View style={styles.notifPanel}>
            <View style={styles.notifHeader}>
              <View style={styles.rowLeft}>
                <Text style={styles.notifTitle}>Class reminders</Text>
                <Text style={styles.rowSub}>Get notified before each class</Text>
              </View>
              <Switch
                value={prefs.notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#272620', true: '#f5c842' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={{ opacity: prefs.notificationsEnabled ? 1 : 0.4 }}>
              <Text style={styles.roptLabel}>Remind me before class:</Text>
              <View style={styles.reminderOpts}>
                {reminderOptions.map((min) => (
                  <TouchableOpacity
                    key={min}
                    style={[
                      styles.ropt,
                      prefs.reminderMinutes === min && styles.roptSelected,
                    ]}
                    onPress={() => setReminder(min)}
                    disabled={!prefs.notificationsEnabled}>
                    <Text style={[
                      styles.roptText,
                      prefs.reminderMinutes === min && styles.roptTextSelected,
                    ]}>
                      {min} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.notifStatus}>
                <Text style={styles.notifStatusIcon}>🔔</Text>
                <View>
                  <Text style={styles.notifStatusTitle}>
                    {prefs.notificationsEnabled ? 'Notifications active' : 'Notifications disabled'}
                  </Text>
                  <Text style={styles.notifStatusSub}>
                    {prefs.notificationsEnabled 
                      ? `Reminding ${prefs.reminderMinutes} min before each class`
                      : 'Enable to get class reminders'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* AI Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI Timetable Import</Text>
          <View style={styles.uploadPanel}>
            <View style={styles.uploadHeader}>
              <View style={styles.uploadIcon}>
                <Upload size={18} color="#a78bfa" />
              </View>
              <View>
                <Text style={styles.uploadTitle}>Upload new timetable</Text>
                <Text style={styles.uploadSub}>AI parses any PDF or Excel — no hardcoding</Text>
              </View>
            </View>

            {/* Drop Zone */}
            <TouchableOpacity 
              style={[styles.dropzone, isUploading && styles.dropzoneUploading]} 
              onPress={handleFileUpload}
              disabled={isUploading}>
              {isUploading ? (
                <>
                  <Sparkles size={28} color="#a78bfa" style={{ marginBottom: 10 }} />
                  <Text style={styles.dropzoneTitle}>Processing...</Text>
                  <Text style={styles.dropzoneSub}>AI is parsing your timetable</Text>
                </>
              ) : (
                <>
                  <FileText size={28} color="#8a877e" style={{ marginBottom: 10 }} />
                  <Text style={styles.dropzoneTitle}>Tap to upload timetable</Text>
                  <Text style={styles.dropzoneSub}>Browse for PDF, Excel, or CSV files</Text>
                  <View style={styles.fileTypes}>
                    <Text style={styles.fileType}>PDF</Text>
                    <Text style={styles.fileType}>XLSX</Text>
                    <Text style={styles.fileType}>XLS</Text>
                    <Text style={styles.fileType}>CSV</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Note */}
            <View style={styles.aiNote}>
              <Sparkles size={14} color="#a78bfa" />
              <Text style={styles.aiNoteText}>
                AI will extract courses and add them to your timetable
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.cardGroup}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Semester</Text>
              </View>
              <Text style={styles.rowValue}>2nd Sem 2025/2026</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Faculty</Text>
              </View>
              <Text style={styles.rowValue}>FET · UB</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Total courses loaded</Text>
              </View>
              <Text style={styles.rowValue}>{COURSES.length}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Source</Text>
              </View>
              <Text style={styles.rowValue}>Built-in</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Apply changes</Text>
          <Check size={16} color="#1a1600" />
        </TouchableOpacity>
        
        <Text style={styles.saveNote}>Changes reflect immediately on Home tab</Text>
        <View style={{ height: 40 }} />
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
    paddingBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#f0ede6',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    color: '#8a877e',
    fontWeight: '300',
    marginTop: 3,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#4a4840',
    marginBottom: 10,
  },
  cardGroup: {
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  deptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    padding: 12,
  },
  deptMini: {
    width: (width - 72) / 2,
    backgroundColor: '#272620',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: 10,
  },
  deptMiniFullWidth: {
    width: width - 64,
  },
  deptMiniSelected: {
    borderColor: '#f5c842',
    backgroundColor: 'rgba(245,200,66,0.12)',
  },
  deptMiniCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8a877e',
  },
  deptMiniCodeSelected: {
    color: '#f5c842',
  },
  deptMiniName: {
    fontSize: 9,
    color: '#4a4840',
    marginTop: 2,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 6,
    padding: 12,
  },
  levelMini: {
    flex: 1,
    backgroundColor: '#272620',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  levelMiniSelected: {
    borderColor: '#f5c842',
    backgroundColor: 'rgba(245,200,66,0.12)',
  },
  levelMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8a877e',
  },
  levelMiniTextSelected: {
    color: '#f5c842',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  rowLeft: {
    flexDirection: 'column',
    gap: 2,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
  },
  rowSub: {
    fontSize: 11,
    color: '#8a877e',
    fontWeight: '300',
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f5c842',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#272620',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  segmentOption: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  segmentOptionActive: {
    backgroundColor: '#f5c842',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8a877e',
  },
  segmentTextActive: {
    color: '#1a1600',
    fontWeight: '700',
  },
  notifPanel: {
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
  },
  roptLabel: {
    fontSize: 10,
    color: '#4a4840',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    letterSpacing: 0.4,
  },
  reminderOpts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    padding: 12,
  },
  ropt: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: '#272620',
  },
  roptSelected: {
    borderColor: '#f5c842',
    backgroundColor: 'rgba(245,200,66,0.12)',
  },
  roptText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8a877e',
  },
  roptTextSelected: {
    color: '#f5c842',
    fontWeight: '700',
  },
  notifStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(76,187,127,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76,187,127,0.2)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 14,
    marginBottom: 12,
  },
  notifStatusIcon: {
    fontSize: 16,
  },
  notifStatusTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4cbb7f',
  },
  notifStatusSub: {
    fontSize: 10,
    color: '#8a877e',
    marginTop: 1,
  },
  uploadPanel: {
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  uploadIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
  },
  uploadSub: {
    fontSize: 11,
    color: '#8a877e',
    fontWeight: '300',
    marginTop: 1,
  },
  dropzone: {
    margin: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#272620',
  },
  dropzoneUploading: {
    borderColor: '#a78bfa',
    backgroundColor: 'rgba(167,139,250,0.12)',
  },
  dropzoneTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
    marginBottom: 4,
  },
  dropzoneSub: {
    fontSize: 11,
    color: '#8a877e',
    fontWeight: '300',
    lineHeight: 16,
  },
  fileTypes: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  fileType: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    color: '#4a4840',
  },
  aiNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  aiNoteText: {
    fontSize: 11,
    color: '#8a877e',
    fontStyle: 'italic',
  },
  saveBtn: {
    marginHorizontal: 20,
    backgroundColor: '#f5c842',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1600',
  },
  saveNote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#4a4840',
    marginTop: 8,
    marginBottom: 24,
  },
});
