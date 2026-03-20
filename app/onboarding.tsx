import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const departments = [
  { code: 'CEF', name: 'Computer Engineering' },
  { code: 'EEF', name: 'Electrical Engineering' },
  { code: 'CIV', name: 'Civil Engineering' },
  { code: 'MEF', name: 'Mechanical Engineering' },
  { code: 'CPE', name: 'Chemical & Petroleum Engineering', fullWidth: true },
];

const levels = ['200', '300', '400', '500'];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setTheme: applyTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [timeFormat, setTimeFormat] = useState<'24' | '12'>('24');
  const [weekStart, setWeekStart] = useState<'mon' | 'sun'>('mon');
  const [showError, setShowError] = useState(false);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleDeptSelect = (code: string) => {
    setSelectedDept(code);
    setShowError(false);
  };

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setShowError(false);
  };

  const goToStep2 = () => {
    if (!selectedDept || !selectedLevel) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setCurrentStep(2);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
  };

  const goBack = () => {
    setCurrentStep(1);
    fadeAnim.setValue(0);
    slideAnim.setValue(-30);
  };

  const finish = async () => {
    const userPrefs = {
      department: selectedDept,
      level: selectedLevel ? parseInt(selectedLevel) : null,
      theme,
      timeFormat,
      weekStart,
      hasCompletedOnboarding: true,
      notificationsEnabled: true,
      reminderMinutes: 10,
      notificationCourses: [],
      selectedCourses: [],
    };
    
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(userPrefs));
      // Apply theme to context immediately so app opens in chosen theme
      applyTheme(theme);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const openTimetable = () => {
    router.replace('/(tabs)');
  };

  const getPreviewCourse = () => {
    const courses: Record<string, { code: string; name: string }> = {
      EEN: { code: 'EEF262', name: 'Physics for Engineering II' },
      CIV: { code: 'CIV202', name: 'Materials Science & Technology' },
      MEF: { code: 'MEF204', name: 'Basics of Mechanical Drawing' },
      CPE: { code: 'CPE208', name: 'Chemical Process Principle' },
      CEN: { code: 'CEF238', name: 'C/C++ Programming' },
    };
    return courses[selectedDept || 'CEN'] || { code: 'CEF238', name: 'C/C++ Programming' };
  };

  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.screen,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}>
      {/* Step Indicator */}
      <View style={styles.steps}>
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={styles.stepDot} />
        <View style={styles.stepDot} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>University of Buea · FET</Text>
        </View>
        <Text style={styles.headline}>
          Your{'\n'}<Text style={styles.headlineAccent}>timetable,</Text>{'\n'}your way.
        </Text>
        <Text style={styles.subline}>
          Tell us where you are and we'll show you exactly what matters.
        </Text>
      </View>

      {/* Department Section */}
      <Text style={styles.sectionLabel}>Your department</Text>
      <View style={styles.deptGrid}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept.code}
            style={[
              styles.deptCard,
              dept.fullWidth && styles.deptCardFullWidth,
              selectedDept === dept.code && styles.deptCardSelected,
            ]}
            onPress={() => handleDeptSelect(dept.code)}>
            <View style={[
              styles.deptCheck,
              selectedDept === dept.code && styles.deptCheckSelected,
            ]}>
              {selectedDept === dept.code && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={[
              styles.deptCode,
              selectedDept === dept.code && styles.deptCodeSelected,
            ]}>
              {dept.code}
            </Text>
            <Text style={styles.deptName}>{dept.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Level Section */}
      <Text style={styles.sectionLabel}>Your level</Text>
      <View style={styles.levelRow}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelBtn,
              selectedLevel === level && styles.levelBtnSelected,
            ]}
            onPress={() => handleLevelSelect(level)}>
            <Text style={[
              styles.levelNum,
              selectedLevel === level && styles.levelNumSelected,
            ]}>
              {level}
            </Text>
            <Text style={styles.levelSub}>LEVEL</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {showError && (
          <Text style={styles.errorMsg}>
            Please select your department and level to continue.
          </Text>
        )}
        <TouchableOpacity style={styles.ctaBtn} onPress={goToStep2}>
          <Text style={styles.ctaBtnText}>Next</Text>
          <Text style={styles.ctaBtnArrow}>→</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>Step 1 of 2 · You can change this anytime in Settings</Text>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => {
    const course = getPreviewCourse();
    return (
      <Animated.View
        style={[
          styles.screen,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        {/* Step Indicator */}
        <View style={styles.steps}>
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Almost there</Text>
          </View>
          <Text style={styles.headline}>
            Set your{'\n'}<Text style={styles.headlineAccent}>preferences.</Text>
          </Text>
          <Text style={styles.subline}>
            These can always be changed later from your settings.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Display Settings */}
          <Text style={styles.sectionLabel}>Display settings</Text>
          <View style={styles.prefsRow}>
            <View style={styles.prefCard}>
              <Text style={styles.prefLabel}>Theme</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[styles.toggleOpt, theme === 'dark' && styles.toggleOptActive]}
                  onPress={() => setTheme('dark')}>
                  <Text style={[styles.toggleText, theme === 'dark' && styles.toggleTextActive]}>
                    Dark
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleOpt, theme === 'light' && styles.toggleOptActive]}
                  onPress={() => setTheme('light')}>
                  <Text style={[styles.toggleText, theme === 'light' && styles.toggleTextActive]}>
                    Light
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.prefCard}>
              <Text style={styles.prefLabel}>Time format</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[styles.toggleOpt, timeFormat === '24' && styles.toggleOptActive]}
                  onPress={() => setTimeFormat('24')}>
                  <Text style={[styles.toggleText, timeFormat === '24' && styles.toggleTextActive]}>
                    24h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleOpt, timeFormat === '12' && styles.toggleOptActive]}
                  onPress={() => setTimeFormat('12')}>
                  <Text style={[styles.toggleText, timeFormat === '12' && styles.toggleTextActive]}>
                    12h
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Week Start */}
          <Text style={styles.sectionLabel}>First day of week</Text>
          <View style={[styles.prefsRow, { marginBottom: 28 }]}>
            <View style={[styles.prefCard, { flex: 1 }]}>
              <Text style={styles.prefLabel}>Starts on</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[styles.toggleOpt, weekStart === 'mon' && styles.toggleOptActive]}
                  onPress={() => setWeekStart('mon')}>
                  <Text style={[styles.toggleText, weekStart === 'mon' && styles.toggleTextActive]}>
                    Mon
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleOpt, weekStart === 'sun' && styles.toggleOptActive]}
                  onPress={() => setWeekStart('sun')}>
                  <Text style={[styles.toggleText, weekStart === 'sun' && styles.toggleTextActive]}>
                    Sun
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Preview Card */}
          <Text style={styles.sectionLabel}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewAccent} />
            <Text style={styles.previewTime}>
              {timeFormat === '12' ? '9:00 AM – 11:00 AM' : '09:00 – 11:00'}
            </Text>
            <Text style={styles.previewCourse}>
              {course.code} · {course.name}
            </Text>
            <Text style={styles.previewLocation}>FET-BGFL · Dr. Nguti</Text>
            <View style={styles.previewTags}>
              <View style={styles.previewTagAccent}>
                <Text style={styles.previewTagAccentText}>{selectedDept}</Text>
              </View>
              <View style={styles.previewTag}>
                <Text style={styles.previewTagText}>Level {selectedLevel}</Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaWrap}>
            <TouchableOpacity style={styles.ctaBtn} onPress={finish}>
              <Text style={styles.ctaBtnText}>Open my timetable</Text>
              <Text style={styles.ctaBtnArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goBack}>
              <Text style={styles.backLink}>← Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const renderDoneScreen = () => (
    <Animated.View
      style={[
        styles.doneScreen,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}>
      <View style={styles.doneIcon}>
        <Text style={styles.doneIconText}>🎓</Text>
      </View>
      <Text style={styles.doneTitle}>You're all set!</Text>
      <Text style={styles.doneSub}>
        Your personalised timetable is ready. Classes filtered for{' '}
        <Text style={styles.doneHighlight}>{selectedDept} Level {selectedLevel}</Text>.
      </Text>
      <View style={styles.doneTag}>
        <View style={styles.doneTagDot} />
        <Text style={styles.doneTagText}>
          {selectedDept} · Level {selectedLevel} · {theme === 'dark' ? 'Dark mode' : 'Light mode'}
        </Text>
      </View>
      <TouchableOpacity style={styles.openBtn} onPress={openTimetable}>
        <Text style={styles.openBtnText}>Open timetable →</Text>
      </TouchableOpacity>
      <Text style={styles.doneNote}>Change preferences anytime in Settings</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderDoneScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0e0c',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  steps: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
  },
  stepDot: {
    height: 3,
    width: 10,
    borderRadius: 2,
    backgroundColor: '#4a4840',
  },
  stepDotActive: {
    backgroundColor: '#f5c842',
    width: 28,
  },
  header: {
    marginBottom: 28,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,200,66,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f5c842',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#f5c842',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.6,
    color: '#f0ede6',
  },
  headlineAccent: {
    color: '#f5c842',
  },
  subline: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '300',
    color: '#8a877e',
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#4a4840',
    marginBottom: 10,
  },
  deptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  deptCard: {
    width: (width - 58) / 2,
    backgroundColor: '#1f1e19',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
    position: 'relative',
  },
  deptCardFullWidth: {
    width: width - 48,
  },
  deptCardSelected: {
    borderColor: '#f5c842',
    backgroundColor: 'rgba(245,200,66,0.12)',
  },
  deptCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deptCheckSelected: {
    backgroundColor: '#f5c842',
    borderColor: '#f5c842',
  },
  checkmark: {
    color: '#1a1600',
    fontSize: 12,
    fontWeight: '700',
  },
  deptCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f0ede6',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  deptCodeSelected: {
    color: '#f5c842',
  },
  deptName: {
    fontSize: 10,
    fontWeight: '400',
    color: '#8a877e',
    lineHeight: 14,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  levelBtn: {
    flex: 1,
    backgroundColor: '#1f1e19',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  levelBtnSelected: {
    borderColor: '#f5c842',
    backgroundColor: 'rgba(245,200,66,0.12)',
  },
  levelNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8a877e',
  },
  levelNumSelected: {
    color: '#f5c842',
  },
  levelSub: {
    fontSize: 9,
    color: '#4a4840',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  prefsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  prefCard: {
    flex: 1,
    backgroundColor: '#1f1e19',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
  },
  prefLabel: {
    fontSize: 10,
    color: '#4a4840',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#171612',
    borderRadius: 8,
    padding: 3,
  },
  toggleOpt: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
  },
  toggleOptActive: {
    backgroundColor: '#f5c842',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4a4840',
  },
  toggleTextActive: {
    color: '#1a1600',
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  previewAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 3,
    height: '100%',
    backgroundColor: '#f5c842',
  },
  previewTime: {
    fontSize: 10,
    color: '#4a4840',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  previewCourse: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f0ede6',
    marginBottom: 3,
  },
  previewLocation: {
    fontSize: 12,
    color: '#8a877e',
  },
  previewTags: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 6,
  },
  previewTagAccent: {
    backgroundColor: 'rgba(245,200,66,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  previewTagAccentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f5c842',
  },
  previewTag: {
    backgroundColor: '#171612',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  previewTagText: {
    fontSize: 10,
    color: '#8a877e',
  },
  ctaWrap: {
    marginTop: 'auto',
  },
  errorMsg: {
    fontSize: 11,
    color: '#e05c4b',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaBtn: {
    backgroundColor: '#f5c842',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1600',
    letterSpacing: -0.2,
  },
  ctaBtnArrow: {
    fontSize: 18,
    color: '#1a1600',
  },
  ctaNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#4a4840',
    marginTop: 12,
    fontWeight: '300',
  },
  backLink: {
    textAlign: 'center',
    fontSize: 13,
    color: '#8a877e',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  doneScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  doneIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(245,200,66,0.12)',
    borderWidth: 2,
    borderColor: '#f5c842',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  doneIconText: {
    fontSize: 32,
  },
  doneTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#f0ede6',
    marginBottom: 10,
  },
  doneSub: {
    fontSize: 13,
    color: '#8a877e',
    fontWeight: '300',
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 24,
  },
  doneHighlight: {
    color: '#f5c842',
    fontWeight: '500',
  },
  doneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f1e19',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  doneTagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f5c842',
  },
  doneTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f0ede6',
  },
  openBtn: {
    width: '100%',
    backgroundColor: '#f5c842',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
  },
  openBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1600',
    textAlign: 'center',
  },
  doneNote: {
    marginTop: 20,
    fontSize: 11,
    color: '#4a4840',
  },
});
