import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { User, Settings, Bell, MapPin, Calendar, CreditCard, Shield, LogOut, CreditCard as Edit, Camera, X, Check, Mail, Plane, DollarSign, Chrome as Home, Calendar as CalendarIcon, CircleUser as UserCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile, useDataSharing } from '../../hooks/useStorage';
import JoinTripModal from '../../components/JoinTripModal';

export default function ProfileScreen() {
  const { profile, loading, isLoggedIn, updateProfile, signOut, checkLoginStatus } = useProfile();
  const { sharing, generateShareLink, importFromLink, exportData } = useDataSharing();

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    currentCity: '',
    state: '',
    country: '',
    preferredCurrency: '',
  });
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});
  const [travelPreferences, setTravelPreferences] = useState({
    destinationTypes: [] as string[],
    budgetRange: 'medium',
    accommodationType: 'hotel',
    travelStyle: 'leisure',
    groupSize: 'couple',
    seasonPreference: 'any',
  });
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // Update local state when profile loads
  React.useEffect(() => {
    const initializeProfile = async () => {
      // Check login status first
      const loginStatus = await checkLoginStatus();
      
      if (!loginStatus) {
        // No active session, redirect to login
        router.replace('/auth/login');
        return;
      }
      
      if (profile) {
        setNotifications(profile.preferences.notifications);
        setLocationSharing(profile.preferences.locationSharing);
        setPublicProfile(profile.preferences.publicProfile);
        setEditData({
          name: profile.name || '',
          currentCity: profile.currentCity || '',
          state: profile.state || '',
          country: profile.country || '',
          preferredCurrency: profile.preferredCurrency || 'USD',
        });
      }
    };
    
    if (!loading) {
      initializeProfile();
    }
  }, [profile, loading, checkLoginStatus]);

  // Separate effect for profile data updates
  React.useEffect(() => {
    if (profile && isLoggedIn) {
      setNotifications(profile.preferences.notifications);
      setLocationSharing(profile.preferences.locationSharing);
      setPublicProfile(profile.preferences.publicProfile);
      setEditData({
        name: profile.name || '',
        currentCity: profile.currentCity || '',
        state: profile.state || '',
        country: profile.country || '',
        preferredCurrency: profile.preferredCurrency || 'USD',
      });
      
      // Load travel preferences from local storage
      loadTravelPreferences().catch(console.error);
    }
  }, [profile, isLoggedIn]);

  // Load travel preferences from local storage
  const loadTravelPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('travelApp_userPreferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setTravelPreferences(parsed);
      }
    } catch (error) {
      console.error('Error loading travel preferences:', error);
    }
  };

  // Save travel preferences to local storage
  const saveTravelPreferences = async () => {
    try {
      setPreferencesLoading(true);
      
      // Save to local storage with error handling
      try {
        await AsyncStorage.setItem('travelApp_userPreferences', JSON.stringify(travelPreferences));
      } catch (storageError) {
        // Handle storage quota exceeded or other storage errors
        Alert.alert('Storage Error', 'Failed to save preferences. Please try again.');
        return;
      }
      
      setShowPreferencesModal(false);
      Alert.alert('Success', 'Travel preferences saved successfully!');
    } catch (error) {
      console.error('Error saving travel preferences:', error);
      Alert.alert('Error', 'Failed to save travel preferences. Please try again.');
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Use actual user data from profile
  const userStats = profile?.stats || {
    tripsCompleted: 0,
    placesVisited: 0,
    totalExpenses: 0,
    friendsConnected: 0,
  };

  const userName = profile?.name || 'TripSee User';
  const userEmail = profile?.email || 'user@example.com';
  const isGuest = profile?.userType === 'guest';

  const validateEditForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (editData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    try {
      setEditLoading(true);
      
      await updateProfile({
        name: editData.name.trim(),
        currentCity: editData.currentCity.trim(),
        state: editData.state.trim(),
        country: editData.country.trim(),
        preferredCurrency: editData.preferredCurrency,
      });

      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current profile values
    if (profile) {
      setEditData({
        name: profile.name || '',
        currentCity: profile.currentCity || '',
        state: profile.state || '',
        country: profile.country || '',
        preferredCurrency: profile.preferredCurrency || 'USD',
      });
    }
    setEditErrors({});
    setShowEditModal(false);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => Alert.alert('Opening camera...') },
        { text: 'Photo Library', onPress: () => Alert.alert('Opening photo library...') },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      `Are you sure you want to sign out? ${profile?.userType === 'guest' ? 'Your guest session will end.' : 'You will need to sign in again to access your account.'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Clear all user preferences and settings from local storage
              try {
                await AsyncStorage.removeItem('travelApp_userPreferences');
                await AsyncStorage.removeItem('travelApp_userSettings');
                await AsyncStorage.removeItem('travelApp_sessionData');
                // Clear any other app-specific storage keys
                const allKeys = await AsyncStorage.getAllKeys();
                const keysToRemove = allKeys.filter(key => key.startsWith('travelApp_'));
                await AsyncStorage.multiRemove(keysToRemove);
              } catch (storageError) {
                console.warn('Error clearing local storage:', storageError);
                // Continue with sign out even if storage clearing fails
              }
              
              // Use StorageService sign out method
              await signOut();
              
              // Navigate to login screen
              router.replace('/auth/login');
              
              // Show confirmation
              Alert.alert('Signed Out', 'You have been successfully signed out. All local data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const clearUserSession = async () => {
    // In a real app, this would:
    // 1. Clear authentication tokens
    // 2. Clear cached user data
    // 3. Reset app state
    // 4. Clear sensitive information from storage
    
    // Simulate session clearing
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate Share Link', 
          onPress: async () => {
            try {
              const shareLink = await generateShareLink();
              Alert.alert(
                'Share Link Generated',
                'Your travel data has been packaged into a shareable link. Share this with your travel partners to sync data.',
                [
                  { text: 'Copy Link', onPress: () => Alert.alert('Link copied to clipboard!') },
                  { text: 'OK' }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to generate share link');
            }
          }
        },
        { 
          text: 'Export JSON', 
          onPress: async () => {
            try {
              const data = await exportData();
              Alert.alert('Data Exported', `Exported ${data.trips.length} trips, ${data.places.length} places, and ${data.expenses.length} expenses.`);
            } catch (error) {
              Alert.alert('Error', 'Failed to export data');
            }
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.prompt(
      'Import Data',
      'Paste the share link from your travel partner:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: async (link) => {
            if (link) {
              try {
                await importFromLink(link);
                Alert.alert('Success', 'Travel data imported successfully!');
              } catch (error) {
                Alert.alert('Error', 'Failed to import data. Please check the link and try again.');
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const updatePreference = async (key: keyof typeof profile.preferences, value: boolean) => {
    if (profile) {
      await updateProfile({
        preferences: {
          ...profile.preferences,
          [key]: value,
        }
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <User size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Profile Not Found</Text>
          <Text style={styles.errorDescription}>
            Unable to load your profile. Please sign in again.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {/* Display default user icon for all users */}
            <View style={styles.defaultAvatar}>
              <User size={40} color={isGuest ? '#9CA3AF' : '#2563EB'} />
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          
          {/* Guest Badge */}
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>Guest User</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color="#2563EB" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          {/* Display additional profile information if available */}
          {profile && (
            <View style={styles.additionalInfo}>
              {profile.currentCity && profile.country && (
                <Text style={styles.locationText}>
                  📍 {profile.currentCity || ''}, {profile.country || ''}
                </Text>
              )}
              {profile.preferredCurrency && (
                <Text style={styles.currencyText}>
                  💰 Preferred Currency: {profile.preferredCurrency || 'USD'}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.tripsCompleted}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.placesVisited}</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>€{userStats.totalExpenses.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.friendsConnected}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          
          {renderSettingItem(
            <Plane size={20} color="#8B5CF6" />,
            'Travel Preferences',
            'Customize your travel style and preferences',
            () => setShowPreferencesModal(true)
          )}
          
          {renderSettingItem(
            <Bell size={20} color="#2563EB" />,
            'Notifications',
            'Trip updates and reminders',
            undefined,
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                updatePreference('notifications', value);
              }}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notifications ? '#2563EB' : '#6B7280'}
            />
          )}
          
          {renderSettingItem(
            <MapPin size={20} color="#10B981" />,
            'Location Sharing',
            'Share location with trip members',
            undefined,
            <Switch
              value={locationSharing}
              onValueChange={(value) => {
                setLocationSharing(value);
                updatePreference('locationSharing', value);
              }}
              trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
              thumbColor={locationSharing ? '#10B981' : '#6B7280'}
            />
          )}
          
          {renderSettingItem(
            <User size={20} color="#F59E0B" />,
            'Public Profile',
            'Allow others to find your profile',
            undefined,
            <Switch
              value={publicProfile}
              onValueChange={(value) => {
                setPublicProfile(value);
                updatePreference('publicProfile', value);
              }}
              trackColor={{ false: '#D1D5DB', true: '#FCD34D' }}
              thumbColor={publicProfile ? '#F59E0B' : '#6B7280'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingItem(
            <CreditCard size={20} color="#8B5CF6" />,
            'Payment Methods',
            'Manage your payment options',
            () => Alert.alert('Payment Methods', 'Payment management would be implemented here.')
          )}
          
          {renderSettingItem(
            <Calendar size={20} color="#EF4444" />,
            'Export Data',
            'Download your travel history',
            handleExportData
          )}
          
          {renderSettingItem(
            <Calendar size={20} color="#10B981" />,
            'Import Data',
            'Import data from travel partners',
            () => setShowJoinModal(true)
          )}
          
          {renderSettingItem(
            <Shield size={20} color="#06B6D4" />,
            'Privacy & Security',
            'Manage your privacy settings',
            () => Alert.alert('Privacy & Security', 'Privacy settings would be implemented here.')
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem(
            <Settings size={20} color="#6B7280" />,
            'Help Center',
            'Get help and support',
            () => Alert.alert('Help Center', 'Opening help center...')
          )}
          
          {renderSettingItem(
            <User size={20} color="#6B7280" />,
            'Contact Us',
            'Send feedback or report issues',
            () => Alert.alert('Contact Us', 'Opening contact form...')
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>TripSee v1.0.0</Text>
        </View>
      </ScrollView>

        <JoinTripModal
          visible={showJoinModal}
          onClose={() => setShowJoinModal(false)}
        />

        {/* Edit Profile Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCancelEdit}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancelEdit}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={handleSaveProfile}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Check size={24} color="#2563EB" />
                )}
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, editErrors.name && styles.inputError]}
                    value={editData.name}
                    onChangeText={(text) => {
                      setEditData({ ...editData, name: text });
                      if (editErrors.name) {
                        setEditErrors({ ...editErrors, name: '' });
                      }
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    accessibilityLabel="Full name input"
                    accessibilityHint="Enter your full name"
                  />
                </View>
                {editErrors.name && <Text style={styles.errorText}>{editErrors.name}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current City</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={editData.currentCity}
                    onChangeText={(text) => setEditData({ ...editData, currentCity: text })}
                    placeholder="Enter your current city"
                    placeholderTextColor="#9CA3AF"
                    accessibilityLabel="Current city input"
                    accessibilityHint="Enter the city where you currently live"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>State/Province</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={editData.state}
                    onChangeText={(text) => setEditData({ ...editData, state: text })}
                    placeholder="Enter your state or province"
                    placeholderTextColor="#9CA3AF"
                    accessibilityLabel="State or province input"
                    accessibilityHint="Enter your state or province"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Country</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={editData.country}
                    onChangeText={(text) => setEditData({ ...editData, country: text })}
                    placeholder="Enter your country"
                    placeholderTextColor="#9CA3AF"
                    accessibilityLabel="Country input"
                    accessibilityHint="Enter your country"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preferred Currency</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>💰</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editData.preferredCurrency}
                    onChangeText={(text) => setEditData({ ...editData, preferredCurrency: text.toUpperCase() })}
                    placeholder="USD"
                    placeholderTextColor="#9CA3AF"
                    maxLength={3}
                    autoCapitalize="characters"
                    accessibilityLabel="Preferred currency input"
                    accessibilityHint="Enter your preferred currency code (e.g., USD, EUR)"
                  />
                </View>
                <Text style={styles.inputHint}>Enter 3-letter currency code (e.g., USD, EUR, GBP)</Text>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                  disabled={editLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.saveButton, editLoading && styles.saveButtonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Travel Preferences Modal */}
        <Modal
          visible={showPreferencesModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPreferencesModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPreferencesModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Travel Preferences</Text>
              <TouchableOpacity 
                onPress={saveTravelPreferences}
                disabled={preferencesLoading}
              >
                {preferencesLoading ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Check size={24} color="#2563EB" />
                )}
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Destination Types */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Preferred Destinations</Text>
                <Text style={styles.preferenceDescription}>Select the types of places you love to visit</Text>
                <View style={styles.checkboxGroup}>
                  {['Beach', 'Mountains', 'Cities', 'Countryside', 'Historical Sites', 'Adventure Sports'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.checkboxItem,
                        travelPreferences.destinationTypes.includes(type) && styles.checkboxItemSelected
                      ]}
                      onPress={() => {
                        const newTypes = travelPreferences.destinationTypes.includes(type)
                          ? travelPreferences.destinationTypes.filter(t => t !== type)
                          : [...travelPreferences.destinationTypes, type];
                        setTravelPreferences({ ...travelPreferences, destinationTypes: newTypes });
                      }}
                    >
                      <Text style={[
                        styles.checkboxText,
                        travelPreferences.destinationTypes.includes(type) && styles.checkboxTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Budget Range */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Budget Range</Text>
                <Text style={styles.preferenceDescription}>Your typical travel budget per trip</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'budget', label: 'Budget (Under $1,000)', icon: '💰' },
                    { value: 'medium', label: 'Medium ($1,000 - $5,000)', icon: '💳' },
                    { value: 'luxury', label: 'Luxury ($5,000+)', icon: '💎' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioItem,
                        travelPreferences.budgetRange === option.value && styles.radioItemSelected
                      ]}
                      onPress={() => setTravelPreferences({ ...travelPreferences, budgetRange: option.value })}
                    >
                      <Text style={styles.radioIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.radioText,
                        travelPreferences.budgetRange === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Accommodation Type */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Accommodation Preference</Text>
                <Text style={styles.preferenceDescription}>Your preferred type of accommodation</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'hotel', label: 'Hotels & Resorts', icon: '🏨' },
                    { value: 'airbnb', label: 'Vacation Rentals', icon: '🏠' },
                    { value: 'hostel', label: 'Hostels & Budget', icon: '🛏️' },
                    { value: 'mixed', label: 'Mix of Options', icon: '🏘️' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioItem,
                        travelPreferences.accommodationType === option.value && styles.radioItemSelected
                      ]}
                      onPress={() => setTravelPreferences({ ...travelPreferences, accommodationType: option.value })}
                    >
                      <Text style={styles.radioIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.radioText,
                        travelPreferences.accommodationType === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Travel Style */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Travel Style</Text>
                <Text style={styles.preferenceDescription}>How do you prefer to travel?</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'leisure', label: 'Leisure & Relaxation', icon: '🏖️' },
                    { value: 'adventure', label: 'Adventure & Activities', icon: '🏔️' },
                    { value: 'cultural', label: 'Cultural & Historical', icon: '🏛️' },
                    { value: 'business', label: 'Business Travel', icon: '💼' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioItem,
                        travelPreferences.travelStyle === option.value && styles.radioItemSelected
                      ]}
                      onPress={() => setTravelPreferences({ ...travelPreferences, travelStyle: option.value })}
                    >
                      <Text style={styles.radioIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.radioText,
                        travelPreferences.travelStyle === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Group Size */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Typical Group Size</Text>
                <Text style={styles.preferenceDescription}>Who do you usually travel with?</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'solo', label: 'Solo Travel', icon: '🚶' },
                    { value: 'couple', label: 'Couple', icon: '👫' },
                    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
                    { value: 'group', label: 'Group of Friends', icon: '👥' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioItem,
                        travelPreferences.groupSize === option.value && styles.radioItemSelected
                      ]}
                      onPress={() => setTravelPreferences({ ...travelPreferences, groupSize: option.value })}
                    >
                      <Text style={styles.radioIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.radioText,
                        travelPreferences.groupSize === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Season Preference */}
              <View style={styles.preferenceGroup}>
                <Text style={styles.preferenceTitle}>Season Preference</Text>
                <Text style={styles.preferenceDescription}>When do you prefer to travel?</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'spring', label: 'Spring (Mar-May)', icon: '🌸' },
                    { value: 'summer', label: 'Summer (Jun-Aug)', icon: '☀️' },
                    { value: 'fall', label: 'Fall (Sep-Nov)', icon: '🍂' },
                    { value: 'winter', label: 'Winter (Dec-Feb)', icon: '❄️' },
                    { value: 'any', label: 'Any Season', icon: '🌍' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioItem,
                        travelPreferences.seasonPreference === option.value && styles.radioItemSelected
                      ]}
                      onPress={() => setTravelPreferences({ ...travelPreferences, seasonPreference: option.value })}
                    >
                      <Text style={styles.radioIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.radioText,
                        travelPreferences.seasonPreference === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.preferencesFooter}>
                <Text style={styles.preferencesFooterText}>
                  Your preferences help us recommend better destinations and experiences tailored to your travel style.
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
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  guestBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 6,
  },
  additionalInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  currencyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
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
  modalContent: {
    flex: 1,
    padding: 20,
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
  currencySymbol: {
    marginLeft: 12,
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 0,
    backgroundColor: 'transparent',
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
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  preferenceGroup: {
    marginBottom: 32,
  },
  preferenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  checkboxTextSelected: {
    color: '#2563EB',
  },
  radioGroup: {
    gap: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  radioIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  radioText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#2563EB',
  },
  preferencesFooter: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  preferencesFooterText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});