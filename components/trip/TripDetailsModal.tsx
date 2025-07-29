import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { X, MapPin, Calendar, Users, Plus, Map as MapIcon, List, Settings, Eye, Trash2, Shield, Globe, Lock, Check, UserPlus, Mail, Pencil, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlaces, useProfile, useTrips } from '../../hooks/useStorage';
import ItineraryBuilder from './ItineraryBuilder';
import PlaceSelector from '../PlaceSelector';
import DatePickerModal from '../common/DatePickerModal';
import AdminActionsModal from './AdminActionsModal';
import { Trip } from '@/services/StorageService';

let TripMapView: any = null;
if (Platform.OS !== 'web') {
  TripMapView = require('./TripMapView').default;
}


interface TripDetailsModalProps {
  visible: boolean;
  trip: any;
  onClose: () => void;
  onTripUpdate?: (tripId: string, updates: any) => void;
  initialTab?: 'overview' | 'map' | 'itinerary';
}

export default function TripDetailsModal({ visible, trip, onClose, onTripUpdate, initialTab = 'overview' }: TripDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'itinerary'>('overview');
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [editingDates, setEditingDates] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer'>('viewer');
  const { places } = usePlaces();
  const { profile } = useProfile();
  const { addTripPartner, removeTripPartner } = useTrips();
  const insets = useSafeAreaInsets();

  // Partner management state
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
  });
  const [partnerErrors, setPartnerErrors] = useState<{[key: string]: string}>({});

  // Determine user role for this trip
  useEffect(() => {
    if (profile && trip) {
      const userEmail = profile.email;
      
      // Check if user is the creator/owner
      if (trip.createdBy === userEmail) {
        setUserRole('owner');
        return;
      }
      
      // Check collaborator role
      const collaborator = trip.collaborators?.find((c: any) => c.email === userEmail);
      if (collaborator) {
        setUserRole(collaborator.role);
        return;
      }
      
      // Default to viewer for public trips or if user has trip ID
      setUserRole('viewer');
    }
  }, [profile, trip]);

  // Set active tab based on initialTab prop
  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [initialTab, visible]);

  // Initialize temp dates when editing starts
  useEffect(() => {
    if (editingDates && trip) {
      setTempStartDate(trip.startDate);
      setTempEndDate(trip.endDate);
    }
  }, [editingDates, trip]);
  const tripPlaces = places.filter(place => place.tripId === trip.id);
  const canEdit = userRole === 'owner' || userRole === 'editor';
  const canDelete = userRole === 'owner';

  const validatePartnerForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!newPartner.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (newPartner.email && !/\S+@\S+\.\S+/.test(newPartner.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setPartnerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPartner = async () => {
    if (!validatePartnerForm()) return;
    
    try {
      const profile = await useProfile().profile;
      const addedBy = profile?.email || 'user@example.com';
      
      await addTripPartner(trip.id, {
        name: newPartner.name.trim(),
        email: newPartner.email.trim() || undefined,
        addedBy,
      });
      
      setNewPartner({ name: '', email: '' });
      setShowAddPartnerModal(false);
      Alert.alert('Success', `${newPartner.name} has been added as a travel partner!`);
      
      // Refresh trip data if callback provided
      if (onTripUpdate) {
        onTripUpdate(trip.id, {});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add travel partner. Please try again.');
    }
  };

  const handleRemovePartner = (partnerId: string, partnerName: string) => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to remove travel partners.');
      return;
    }
    
    Alert.alert(
      'Remove Partner',
      `Remove ${partnerName} from this trip?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTripPartner(trip.id, partnerId);
              Alert.alert('Success', `${partnerName} has been removed from the trip.`);
              
              if (onTripUpdate) {
                onTripUpdate(trip.id, {});
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove travel partner.');
            }
          }
        }
      ]
    );
  };
  const handleAddPlace = () => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to add places to this trip.');
      return;
    }
    setShowPlaceSelector(true);
  };

  const handleDeletePlace = (placeId: string, placeName: string) => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to delete places from this trip.');
      return;
    }
    
    Alert.alert(
      'Delete Place',
      `Are you sure you want to remove "${placeName}" from this trip?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call updatePlace to remove tripId
            Alert.alert('Success', `${placeName} has been removed from the trip.`);
          }
        }
      ]
    );
  };

  const handleEditDates = () => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to modify trip dates.');
      return;
    }
    setEditingDates(true);
  };

  const handleSaveDates = () => {
    // Validate dates
    const startDate = new Date(tempStartDate);
    const endDate = new Date(tempEndDate);
    
    if (startDate > endDate) {
      Alert.alert('Invalid Dates', 'Start date cannot be later than end date.');
      return;
    }
    
    // Save dates
    if (onTripUpdate) {
      onTripUpdate(trip.id, {
        startDate: tempStartDate,
        endDate: tempEndDate,
      });
    }
    
    setEditingDates(false);
    Alert.alert('Success', 'Trip dates have been updated successfully.');
  };

  const handleCancelDateEdit = () => {
    setEditingDates(false);
    setTempStartDate(trip.startDate);
    setTempEndDate(trip.endDate);
  };

  const handleDateSelect = (date: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setTempStartDate(date);
      setShowStartDatePicker(false);
    } else {
      setTempEndDate(date);
      setShowEndDatePicker(false);
    }
  };

  const openDatePicker = (type: 'start' | 'end') => {
    // Use consistent custom date picker across all platforms
    if (type === 'start') {
      setShowStartDatePicker(true);
    } else {
      setShowEndDatePicker(true);
    }
  };
  const handleDeleteTrip = () => {
    if (!canDelete) {
      Alert.alert('Permission Denied', 'Only the trip owner can delete this trip.');
      return;
    }
    
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Trip Deleted', 'The trip has been deleted successfully.');
            onClose();
          }
        }
      ]
    );
  };

  const handleTogglePrivacy = () => {
    if (!canDelete) {
      Alert.alert('Permission Denied', 'Only the trip owner can change privacy settings.');
      return;
    }
    
    const newVisibility = trip.visibility === 'public' ? 'private' : 'public';
    Alert.alert(
      'Change Privacy',
      `Make this trip ${newVisibility}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Privacy Updated', `Trip is now ${newVisibility}.`);
          }
        }
      ]
    );
  };

  const handleAdminAction = (action: string, data?: any) => {
    switch (action) {
      case 'delete':
        handleDeleteTrip();
        break;
      case 'privacy':
        handleTogglePrivacy();
        break;
      case 'collaborators':
        setShowAddPartnerModal(true);
        break;
      case 'transfer-ownership':
        Alert.alert('Transfer Ownership', 'This feature will be implemented soon.');
        break;
      case 'archive':
        Alert.alert('Archive Trip', 'This feature will be implemented soon.');
        break;
      case 'export':
        Alert.alert('Export Data', 'This feature will be implemented soon.');
        break;
      case 'share-settings':
        Alert.alert('Share Settings', 'This feature will be implemented soon.');
        break;
      case 'advanced-settings':
        Alert.alert('Advanced Settings', 'This feature will be implemented soon.');
        break;
      default:
        console.log('Unknown admin action:', action);
    }
    setShowAdminModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate trip duration in days and nights
  const calculateTripDuration = () => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // Include both start and end days
    const nights = days - 1; // Nights are always one less than days
    
    return { days, nights };
  };

  const { days, nights } = calculateTripDuration();
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return '#F59E0B';
      case 'editor': return '#2563EB';
      case 'viewer': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Shield size={16} color="#F59E0B" />;
      case 'editor': return <Pencil size={16} color="#2563EB" />;
      case 'viewer': return <Eye size={16} color="#6B7280" />;
      default: return <Eye size={16} color="#6B7280" />;
    }
  };

  const getTripStatus = (trip: Trip) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (today < startDate) {
      return {
        status: 'UPCOMING',
        color: '#1D267D', // dark blue
        icon: <Calendar size={12} color="#1D267D" />,
        banner: {
          text: 'Your trip is coming up!',
          color: '#E0F2FE', // sky blue background
          textColor: '#1D267D',
        }
      };
    } else if (today >= startDate && today <= endDate) {
      return {
        status: 'IN PROGRESS',
        color: '#22C55E', // green
        icon: <MapPin size={12} color="#22C55E" />,
        banner: {
          text: 'Your trip is in progress!',
          color: '#DCFCE7', // light green background
          textColor: '#22C55E',
        }
      };
    } else if (today > endDate) {
      return {
        status: 'COMPLETED',
        color: '#6B7280', // gray
        icon: <CheckCircle size={12} color="#6B7280" />,
        banner: {
          text: 'Completed',
          color: '#F3F4F6', // light gray background
          textColor: '#6B7280',
        }
      };
    } else {
      return {
        status: 'UNKNOWN',
        color: '#F59E0B', // amber
        icon: <AlertTriangle size={12} color="#F59E0B" />,
        banner: {
          text: 'Unknown',
          color: '#FEF3C7', // light amber background
          textColor: '#F59E0B',
        }
      };
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Trip Header */}
      <View style={styles.tripHeader}>
        <Image source={{ uri: trip.image }} style={styles.tripHeaderImage} />
        <View style={styles.tripHeaderOverlay}>
          <View style={styles.privacyBadge}>
            {trip.visibility === 'public' ? (
              <>
                <Globe size={16} color="#FFFFFF" />
                <Text style={styles.privacyText}>Public</Text>
              </>
            ) : (
              <>
                <Lock size={16} color="#FFFFFF" />
                <Text style={styles.privacyText}>Private</Text>
              </>
            )}
          </View>
          
          <View style={styles.userRoleBadge}>
            {getRoleIcon(userRole)}
            <Text style={[styles.roleText, { color: getRoleColor(userRole) }]}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Text>
          </View>
        </View>
      </View>
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={[styles.tripDetail, { justifyContent: 'space-between' }]}>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            {(() => {
              const tripStatus = getTripStatus(trip);
              return (
                <View style={[styles.tripStatusBadge, { backgroundColor: tripStatus.banner.color }]}>
                  {tripStatus.icon}
                  <Text style={[styles.statusText, { color: tripStatus.color, marginLeft: 4 }]}>
                    {tripStatus.status.charAt(0).toUpperCase() + tripStatus.status.slice(1)}
                  </Text>
                </View>
              );
            })()}
          </View>
        <View style={styles.tripDetail}>
          <MapPin size={20} color="#6B7280" />
          <Text style={styles.tripDestination}>{trip.destination}</Text>
        </View>
        
        <View style={[styles.tripDetail, editingDates ? { alignItems: 'flex-start' } : {}]}>
          <Calendar size={20} color="#6B7280" />
          <View style={styles.dateContainer}>
            {editingDates ? (
              <View style={styles.dateEditContainer}>
                <TouchableOpacity
                  style={styles.dateEditButton}
                  onPress={() => openDatePicker('start')}
                  accessibilityLabel="Start Date"
                  accessibilityHint="Tap to open calendar and select trip start date"
                >
                  <Text style={styles.dateEditText}>
                    {tempStartDate ? formatDateForDisplay(tempStartDate) : 'Start Date'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.dateSeparator}>to</Text>
                
                <TouchableOpacity
                  style={styles.dateEditButton}
                  onPress={() => openDatePicker('end')}
                  accessibilityLabel="End Date"
                  accessibilityHint="Tap to open calendar and select trip end date"
                >
                  <Text style={styles.dateEditText}>
                    {tempEndDate ? formatDateForDisplay(tempEndDate) : 'End Date'}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.dateEditActions}>
                  <TouchableOpacity
                    style={styles.cancelDateButton}
                    onPress={handleCancelDateEdit}
                  >
                    <Text style={styles.cancelDateText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.saveDateButton}
                    onPress={handleSaveDates}
                  >
                    <Check size={16} color="#FFFFFF" />
                    <Text style={styles.saveDateText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.dateViewContainer}>
                {/* Trip Duration Display */}
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {days} Day{days !== 1 ? 's' : ''}, {nights} Night{nights !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {canEdit && (
                    <TouchableOpacity
                      style={[styles.editDateButton, { marginLeft: 8, padding: 4, borderRadius: 4 }]}
                      onPress={handleEditDates}
                      accessibilityLabel="Edit trip dates"
                      accessibilityHint="Tap to edit the trip start and end dates"
                    >
                      <Pencil size={18} color="#2563EB" />
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        </View>
        <View style={styles.tripDetail}>
          <Text style={styles.tripDates} numberOfLines={1} ellipsizeMode="tail">
            {formatDate(trip.startDate)} 
            <Text style={{ color: '#6B7280', fontWeight: '500' }}>  to  </Text>
            {formatDate(trip.endDate)}
          </Text>
        </View>
        <View style={styles.tripDetail}>
          <Users size={20} color="#6B7280" />
          <Text style={styles.tripParticipants}>
            {(trip.collaborators?.length || 1) + (trip.partners?.length || 0)} member{((trip.collaborators?.length || 1) + (trip.partners?.length || 0)) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Places Section */}
      <View style={styles.placesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Places ({tripPlaces.length})</Text>
          {canEdit && (
            <TouchableOpacity style={styles.addPlaceButton} onPress={handleAddPlace}>
              <Plus size={16} color="#2563EB" />
              <Text style={styles.addPlaceText}>Add Place</Text>
            </TouchableOpacity>
          )}
        </View>

        {tripPlaces.length === 0 ? (
          <View style={styles.emptyPlaces}>
            <MapPin size={48} color="#D1D5DB" />
            <Text style={styles.emptyPlacesTitle}>No Places Added</Text>
            <Text style={styles.emptyPlacesDescription}>
              {canEdit 
                ? 'Start building your itinerary by adding places to visit.'
                : 'This trip doesn\'t have any places added yet.'
              }
            </Text>
          </View>
        ) : (
          tripPlaces.map((place, index) => (
            <View key={place.id} style={styles.placeCard}>
              <Image source={{ uri: place.image }} style={styles.placeImage} />
              <View style={styles.placeContent}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeCategory}>{place.category}</Text>
                <View style={styles.placeDetail}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.placeLocation}>{place.location}</Text>
                </View>
              </View>
              
              {canEdit && (
                <TouchableOpacity
                  style={styles.deletePlaceButton}
                  onPress={() => handleDeletePlace(place.id, place.name)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      {/* Travel Partners */}
      <View style={styles.partnersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Travel Partners ({trip.partners?.length || 0})</Text>
          {canEdit && (
            <TouchableOpacity 
              style={styles.addPartnerButton} 
              onPress={() => setShowAddPartnerModal(true)}
            >
              <UserPlus size={16} color="#2563EB" />
              <Text style={styles.addPartnerText}>Add Partner</Text>
            </TouchableOpacity>
          )}
        </View>

        {trip.partners && trip.partners.length > 0 ? (
          trip.partners.map((partner: any) => (
            <View key={partner.id} style={styles.partnerItem}>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                {partner.email && (
                  <Text style={styles.partnerEmail}>{partner.email}</Text>
                )}
                <Text style={styles.partnerAddedDate}>
                  Added {new Date(partner.addedAt).toLocaleDateString()}
                </Text>
              </View>
              {canEdit && (
                <TouchableOpacity
                  style={styles.removePartnerButton}
                  onPress={() => handleRemovePartner(partner.id, partner.name)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyPartners}>
            <Users size={32} color="#D1D5DB" />
            <Text style={styles.emptyPartnersText}>No travel partners added yet</Text>
            {canEdit && (
              <Text style={styles.emptyPartnersSubtext}>
                Add partners to split expenses and collaborate on the trip
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Collaborators */}
      {trip.collaborators && trip.collaborators.length > 0 && (
        <View style={styles.collaboratorsSection}>
          <Text style={styles.sectionTitle}>Collaborators</Text>
          {trip.collaborators.map((collaborator: any) => (
            <View key={collaborator.id} style={styles.collaboratorItem}>
              <View style={styles.collaboratorInfo}>
                <Text style={styles.collaboratorName}>{collaborator.name}</Text>
                <Text style={styles.collaboratorEmail}>{collaborator.email}</Text>
              </View>
              <View style={[styles.collaboratorRole, { backgroundColor: `${getRoleColor(collaborator.role)}20` }]}>
                {getRoleIcon(collaborator.role)}
                <Text style={[styles.collaboratorRoleText, { color: getRoleColor(collaborator.role) }]}>
                  {collaborator.role}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ color: '#6B7280', fontSize: 16, textAlign: 'center' }}>
            Map view is not available on web.
          </Text>
        </View>
      );
    }
    // Defensive: tripPlaces may not be defined if not loaded yet
    // If tripPlaces is undefined, pass an empty array to avoid runtime error
    return <TripMapView trip={trip} places={tripPlaces || []} />;
  };

  const renderItinerary = () => (
    <ItineraryBuilder trip={trip} />
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
          {userRole === 'owner' && (
            <TouchableOpacity
              onPress={() => setShowAdminModal(true)}
              accessibilityLabel="Admin actions"
              accessibilityHint="Open admin panel for trip management"
            >
              <Settings size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.tabBar, { paddingTop: 0 }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <List size={20} color={activeTab === 'overview' ? '#2563EB' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'map' && styles.tabActive]}
            onPress={() => setActiveTab('map')}
          >
            <MapIcon size={20} color={activeTab === 'map' ? '#2563EB' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>
              Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'itinerary' && styles.tabActive]}
            onPress={() => setActiveTab('itinerary')}
          >
            <Calendar size={20} color={activeTab === 'itinerary' ? '#2563EB' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'itinerary' && styles.tabTextActive]}>
              Itinerary
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'map' && renderMap()}
          {activeTab === 'itinerary' && renderItinerary()}
        </View>

        <PlaceSelector
          visible={showPlaceSelector}
          tripId={trip.id}
          onClose={() => setShowPlaceSelector(false)}
        />
        
        {/* Date Picker Modals */}
        <DatePickerModal
          visible={showStartDatePicker}
          onClose={() => setShowStartDatePicker(false)}
          onDateSelect={(date) => handleDateSelect(date, 'start')}
          title="Start Date"
          initialDate={tempStartDate}
          minDate={new Date().toISOString().split('T')[0]}
          maxDate={tempEndDate || undefined}
        />

        <DatePickerModal
          visible={showEndDatePicker}
          onClose={() => setShowEndDatePicker(false)}
          onDateSelect={(date) => handleDateSelect(date, 'end')}
          title="End Date"
          initialDate={tempEndDate}
          minDate={tempStartDate || new Date().toISOString().split('T')[0]}
        />

        {/* Add Partner Modal */}
        <Modal
          visible={showAddPartnerModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                setShowAddPartnerModal(false);
                setNewPartner({ name: '', email: '' });
                setPartnerErrors({});
              }}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Travel Partner</Text>
              <TouchableOpacity onPress={handleAddPartner}>
                <Text style={styles.saveButton}>Add</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={[styles.nameInput, partnerErrors.name && styles.inputError]}
                  value={newPartner.name}
                  onChangeText={(text) => {
                    setNewPartner({ ...newPartner, name: text });
                    if (partnerErrors.name) {
                      setPartnerErrors({ ...partnerErrors, name: '' });
                    }
                  }}
                  placeholder="Enter partner's name"
                  accessibilityLabel="Partner name"
                  accessibilityHint="Enter the name of your travel partner"
                />
                {partnerErrors.name && (
                  <Text style={styles.errorText}>{partnerErrors.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, partnerErrors.email && styles.inputError]}
                    value={newPartner.email}
                    onChangeText={(text) => {
                      setNewPartner({ ...newPartner, email: text });
                      if (partnerErrors.email) {
                        setPartnerErrors({ ...partnerErrors, email: '' });
                      }
                    }}
                    placeholder="partner@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Partner email"
                    accessibilityHint="Enter your travel partner's email address"
                  />
                </View>
                {partnerErrors.email && (
                  <Text style={styles.errorText}>{partnerErrors.email}</Text>
                )}
              </View>

              <View style={styles.partnerFormInfo}>
                <Text style={styles.partnerFormInfoTitle}>About Travel Partners</Text>
                <Text style={styles.partnerFormInfoText}>
                  • Partners can be added to expense splits{'\n'}
                  • Email is optional but helps with notifications{'\n'}
                  • Partners don't automatically get trip access{'\n'}
                  • Use collaborators for full trip editing access
                </Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>

      {/* Admin Actions Modal */}
      <AdminActionsModal
        visible={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        trip={trip}
        userRole={userRole}
        onAction={handleAdminAction}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
  },
  tripHeader: {
    position: 'relative',
    height: 200,
  },
  tripHeaderImage: {
    width: '100%',
    height: '100%',
  },
  tripHeaderOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  privacyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusText:{
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  tripStatusBadge:{
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    fontSize: 6,
    fontWeight: '100',
  },
  tripInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tripTitle: {
    fontSize: 24,
    alignItems: 'center',
    fontWeight: '700',
    color: '#111827',
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDestination: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripDates: {
    fontSize: 12,
    color: '#6B7280',
  },
  tripParticipants: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripDurationContainer: {
    marginBottom: 12,
    marginLeft: 28, // Align with other trip details
  },
  durationBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  dateContainer: {
    flex: 1,
    marginLeft: 8,
  },
  dateViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateEditContainer: {
    gap: 12,
  },
  dates: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  dateEditButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dateEditText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  dateSeparator: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  dateEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelDateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  cancelDateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  saveDateText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  editDateButton: {
    padding: 0,
  },
  adminControls: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  placesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addPlaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPlaceText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyPlaces: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPlacesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPlacesDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 4,
  },
  placeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  deletePlaceButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collaboratorsSection: {
    padding: 20,
  },
  collaboratorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  collaboratorEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  collaboratorRole: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  collaboratorRoleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  partnersSection: {
    padding: 20,
  },
  addPartnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPartnerText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
  partnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  partnerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  partnerAddedDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  removePartnerButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
  },
  emptyPartners: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPartnersText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyPartnersSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
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
  nameInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderRadius: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  partnerFormInfo: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  partnerFormInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  partnerFormInfoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  fellowTravellersSection: {
    padding: 20,
  },
  addTravellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addTravellerText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
  travellerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  travellerInfo: {
    flex: 1,
  },
  travellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  travellerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  travellerAddedDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  removeTravellerButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
  },
  emptyTravellers: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTravellersText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyTravellersSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  travellerFormInfo: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  travellerFormInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  travellerFormInfoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});