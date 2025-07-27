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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Camera, Calendar, MapPin, Globe, DollarSign, ChevronDown } from 'lucide-react-native';
import StorageService from '../../services/StorageService';

interface ProfileData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  currentCity: string;
  state: string;
  country: string;
  email: string;
  profilePhoto: string;
  preferredCurrency: string;
}

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    currentCity: '',
    state: '',
    country: '',
    email: 'user@example.com', // Pre-populated from registration
    profilePhoto: '',
    preferredCurrency: 'USD',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Other'];
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!profileData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!profileData.gender) {
        newErrors.gender = 'Please select your gender';
      }
      if (!profileData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    }

    if (step === 2) {
      if (!profileData.currentCity.trim()) {
        newErrors.currentCity = 'Current city is required';
      }
      if (!profileData.country) {
        newErrors.country = 'Please select your country';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    try {
      // Save profile data to local storage
      const userProfile = {
        id: Date.now().toString(),
        name: profileData.fullName,
        email: profileData.email,
        avatar: profileData.profilePhoto || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        preferences: {
          notifications: true,
          locationSharing: false,
          publicProfile: true,
        },
        stats: {
          tripsCompleted: 0,
          placesVisited: 0,
          totalExpenses: 0,
          friendsConnected: 0,
        },
        // Additional profile data
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        currentCity: profileData.currentCity,
        state: profileData.state,
        country: profileData.country,
        preferredCurrency: profileData.preferredCurrency,
      };
      
      await StorageService.saveProfile(userProfile);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Profile Complete!', 'Your profile has been set up successfully.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => {
          setProfileData({ ...profileData, profilePhoto: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' });
          Alert.alert('Photo Updated', 'Profile photo has been updated.');
        }},
        { text: 'Photo Library', onPress: () => {
          setProfileData({ ...profileData, profilePhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' });
          Alert.alert('Photo Updated', 'Profile photo has been updated.');
        }},
      ]
    );
  };

  const openDatePicker = () => {
    // Always use custom date picker for consistency
    setShowDatePicker(true);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 3</Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>Tell us a bit about yourself</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <View style={styles.inputContainer}>
          <User size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, errors.fullName && styles.inputError]}
            value={profileData.fullName}
            onChangeText={(text) => {
              setProfileData({ ...profileData, fullName: text });
              if (errors.fullName) {
                setErrors({ ...errors, fullName: '' });
              }
            }}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="Full name input"
            accessibilityHint="Enter your first and last name"
          />
        </View>
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender *</Text>
        <TouchableOpacity
          style={[styles.pickerButton, errors.gender && styles.inputError]}
          onPress={() => setShowGenderPicker(true)}
          accessibilityLabel="Gender selector"
          accessibilityHint="Tap to select your gender"
        >
          <Text style={[styles.pickerText, !profileData.gender && styles.placeholderText]}>
            {profileData.gender || 'Select your gender'}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth *</Text>
        <TouchableOpacity
          style={[styles.pickerButton, errors.dateOfBirth && styles.inputError]}
          onPress={openDatePicker}
          accessibilityLabel="Date of birth selector"
          accessibilityHint="Tap to select your date of birth"
        >
          <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
          <Text style={[styles.pickerText, !profileData.dateOfBirth && styles.placeholderText]}>
            {profileData.dateOfBirth || 'Select your date of birth'}
          </Text>
        </TouchableOpacity>
        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location Information</Text>
      <Text style={styles.stepDescription}>Where are you based?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current City *</Text>
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, errors.currentCity && styles.inputError]}
            value={profileData.currentCity}
            onChangeText={(text) => {
              setProfileData({ ...profileData, currentCity: text });
              if (errors.currentCity) {
                setErrors({ ...errors, currentCity: '' });
              }
            }}
            placeholder="Enter your current city"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="Current city input"
            accessibilityHint="Enter the city where you currently live"
          />
        </View>
        {errors.currentCity && <Text style={styles.errorText}>{errors.currentCity}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>State/Province</Text>
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={profileData.state}
            onChangeText={(text) => setProfileData({ ...profileData, state: text })}
            placeholder="Enter your state or province"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="State or province input"
            accessibilityHint="Enter your state or province (optional)"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Country *</Text>
        <TouchableOpacity
          style={[styles.pickerButton, errors.country && styles.inputError]}
          onPress={() => setShowCountryPicker(true)}
          accessibilityLabel="Country selector"
          accessibilityHint="Tap to select your country"
        >
          <Globe size={20} color="#6B7280" style={styles.inputIcon} />
          <Text style={[styles.pickerText, !profileData.country && styles.placeholderText]}>
            {profileData.country || 'Select your country'}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[styles.inputContainer, styles.disabledInput]}>
          <Text style={styles.disabledText}>{profileData.email}</Text>
        </View>
        <Text style={styles.inputHint}>Email cannot be changed after registration</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Optional Information</Text>
      <Text style={styles.stepDescription}>Customize your experience (optional)</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Profile Photo</Text>
        <View style={styles.photoContainer}>
          {profileData.profilePhoto ? (
            <Image source={{ uri: profileData.profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color="#6B7280" />
            </View>
          )}
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handlePhotoUpload}
            accessibilityLabel="Upload profile photo"
            accessibilityHint="Tap to upload or change your profile photo"
          >
            <Camera size={16} color="#2563EB" />
            <Text style={styles.photoButtonText}>
              {profileData.profilePhoto ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Currency</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowCurrencyPicker(true)}
          accessibilityLabel="Currency selector"
          accessibilityHint="Tap to select your preferred currency"
        >
          <DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
          <Text style={styles.pickerText}>
            {currencies.find(c => c.code === profileData.preferredCurrency)?.name || 'Select currency'}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderProgressBar()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your travel experience
          </Text>
        </View>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep(currentStep - 1)}
            accessibilityLabel="Go back to previous step"
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Alert.alert(
              'Cancel Registration',
              'Are you sure you want to cancel? Your progress will be lost.',
              [
                { text: 'Continue Setup', style: 'cancel' },
                { 
                  text: 'Cancel', 
                  style: 'destructive',
                  onPress: () => router.replace('/auth/login')
                }
              ]
            );
          }}
          accessibilityLabel="Cancel registration"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          accessibilityLabel={currentStep === 3 ? "Complete profile setup" : "Continue to next step"}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Complete Profile' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gender Picker Modal */}
      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setProfileData({ ...profileData, gender: option });
                  setShowGenderPicker(false);
                  if (errors.gender) {
                    setErrors({ ...errors, gender: '' });
                  }
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Country Picker Modal */}
      <Modal visible={showCountryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <ScrollView style={styles.modalScroll}>
              {countries.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setProfileData({ ...profileData, country: option });
                    setShowCountryPicker(false);
                    if (errors.country) {
                      setErrors({ ...errors, country: '' });
                    }
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowCountryPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={styles.modalOption}
                onPress={() => {
                  setProfileData({ ...profileData, preferredCurrency: currency.code });
                  setShowCurrencyPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {currency.symbol} {currency.name} ({currency.code})
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowCurrencyPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
  },
  disabledText: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  photoContainer: {
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  modalCancel: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});