import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Mail size={48} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Mail size={48} color="#2563EB" />
          </View>
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email address input"
              accessibilityHint="Enter your email to receive password reset instructions"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
          accessibilityLabel="Send reset email"
          accessibilityHint="Tap to send password reset email"
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity accessibilityLabel="Go back to login">
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 12,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  resetButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToLoginButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});