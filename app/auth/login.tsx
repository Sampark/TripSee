import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, MapPin, Luggage, ArrowLeft } from 'lucide-react-native';
import { useProfile } from '../../hooks/useStorage';

export default function LoginScreen() {
  const { createGuestSession, createAuthenticatedSession } = useProfile();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestData, setGuestData] = useState({
    fullName: '',
    email: '',
  });
  const [guestErrors, setGuestErrors] = useState<{[key: string]: string}>({});
  const [guestLoading, setGuestLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGuestForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!guestData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (guestData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    } else if (guestData.fullName.length > 50) {
      newErrors.fullName = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s\-']+$/.test(guestData.fullName)) {
      newErrors.fullName = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!guestData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setGuestErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create authenticated session with email/password
      await createAuthenticatedSession({
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email,
      });
      
      Alert.alert('Welcome Back!', 'Login successful!', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Create authenticated session (simulated Google OAuth)
      await createAuthenticatedSession({
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      });
      
      Alert.alert('Welcome to TripSee!', 'Google login successful!', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Login Failed', 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!validateGuestForm()) return;

    try {
      setGuestLoading(true);
      
      // Create actual guest session with user data
      await createGuestSession({
        fullName: guestData.fullName.trim(),
        email: guestData.email.trim(),
      });
      
      setShowGuestModal(false);
      Alert.alert('Welcome, Guest!', 'You can now browse trips. Sign up anytime to save your favorites!', [
        { text: 'Start Exploring', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create guest session. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  const isGuestFormValid = () => {
    return guestData.fullName.trim().length >= 2 && 
           guestData.fullName.length <= 50 &&
           /^[a-zA-Z\s\-']+$/.test(guestData.fullName) &&
           /\S+@\S+\.\S+/.test(guestData.email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(tabs)/social')}
            accessibilityLabel="Go back to My Trips"
            accessibilityHint="Navigate back to the social page"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <View style={styles.logoIconContainer}>
                <Luggage size={32} color="#FFFFFF" />
                <MapPin size={24} color="#FFFFFF" style={styles.logoPin} />
              </View>
            </View>
          </View>
          <Text style={styles.appName}>TripSee</Text>
          <Text style={styles.tagline}>Plan. Explore. Remember.</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to access your trips and continue planning your next adventure
          </Text>
        </View>

        {/* Authentication Options */}
        <View style={styles.authSection}>
          {/* Google Login - Primary */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading}
            accessibilityLabel="Sign in with Google"
            accessibilityHint="Tap to sign in using your Google account"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#374151" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Guest Login - Secondary */}
          <TouchableOpacity
            style={[styles.guestButton, loading && styles.buttonDisabled]}
            onPress={() => setShowGuestModal(true)}
            disabled={loading}
            accessibilityLabel="Continue as guest"
            accessibilityHint="Tap to browse without creating an account"
          >
            <User size={20} color="#6B7280" />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email address input"
                  accessibilityHint="Enter your email address to sign in"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, errors.password && styles.inputError]}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password input"
                  accessibilityHint="Enter your password to sign in"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              accessibilityLabel="Sign in button"
              accessibilityHint="Tap to sign in with email and password"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword} accessibilityLabel="Forgot password">
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>

            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity accessibilityLabel="Go to sign up page">
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Guest Login Modal */}
      <Modal
        visible={showGuestModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGuestModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowGuestModal(false)}
              accessibilityLabel="Close guest login"
            >
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Continue as Guest</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.guestIntro}>
              <View style={styles.guestIconContainer}>
                <User size={32} color="#2563EB" />
              </View>
              <Text style={styles.guestIntroTitle}>Quick Access</Text>
              <Text style={styles.guestIntroText}>
                Get started immediately with guest access. You can browse trips and explore features.
              </Text>
            </View>

            <View style={styles.guestForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, guestErrors.fullName && styles.inputError]}
                    value={guestData.fullName}
                    onChangeText={(text) => {
                      setGuestData({ ...guestData, fullName: text });
                      if (guestErrors.fullName) {
                        setGuestErrors({ ...guestErrors, fullName: '' });
                      }
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    maxLength={50}
                    accessibilityLabel="Full name input"
                    accessibilityHint="Enter your full name for guest access"
                  />
                </View>
                {guestErrors.fullName && <Text style={styles.errorText}>{guestErrors.fullName}</Text>}
                <Text style={styles.characterCount}>{guestData.fullName.length}/50</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, guestErrors.email && styles.inputError]}
                    value={guestData.email}
                    onChangeText={(text) => {
                      setGuestData({ ...guestData, email: text });
                      if (guestErrors.email) {
                        setGuestErrors({ ...guestErrors, email: '' });
                      }
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Email address input"
                    accessibilityHint="Enter your email for guest access"
                  />
                </View>
                {guestErrors.email && <Text style={styles.errorText}>{guestErrors.email}</Text>}
              </View>

              <TouchableOpacity
                style={[
                  styles.guestContinueButton,
                  (!isGuestFormValid() || guestLoading) && styles.buttonDisabled
                ]}
                onPress={handleGuestLogin}
                disabled={!isGuestFormValid() || guestLoading}
                accessibilityLabel="Continue as guest"
                accessibilityHint="Tap to proceed with guest access"
              >
                {guestLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.guestContinueButtonText}>Continue as Guest</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.guestLimitations}>
              <Text style={styles.limitationsTitle}>Guest User Limitations</Text>
              <View style={styles.limitationsList}>
                <Text style={styles.limitationItem}>• Cannot save trips or favorites</Text>
                <Text style={styles.limitationItem}>• Limited access to social features</Text>
                <Text style={styles.limitationItem}>• No expense tracking or collaboration</Text>
                <Text style={styles.limitationItem}>• Data not synced across devices</Text>
              </View>
              <Text style={styles.upgradePrompt}>
                Create an account anytime to unlock all features!
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44, // Ensures minimum touch target size
    minWidth: 44,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPin: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  authSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 16,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeButton: {
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  signUpPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  // Guest Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  guestIntro: {
    alignItems: 'center',
    marginBottom: 32,
  },
  guestIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  guestIntroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  guestIntroText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  guestForm: {
    marginBottom: 32,
  },
  guestContinueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  guestContinueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestLimitations: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  limitationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  limitationsList: {
    marginBottom: 16,
  },
  limitationItem: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 4,
  },
  upgradePrompt: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    textAlign: 'center',
  },
});