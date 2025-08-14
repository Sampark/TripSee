import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Plus, MapPin, Calendar, Users, MoveVertical as MoreVertical, Eye, Map, Luggage, LogIn, List } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips, usePlaces, useProfile } from '@/hooks/useStorage';
import { router } from 'expo-router';
import TripSharingModal from '@/components/TripSharingModal';
import TripDetailsModal from '@/components/trip/TripDetailsModal';
import DateTimePicker from '@/components/common/DateTimePicker';

export default function TripsScreen() {
  const { trips, loading, addTrip, updateTrip: updateTripFromHook, deleteTrip: deleteTripFromHook } = useTrips();
  const { places } = usePlaces();
  const { profile, isLoggedIn, updateUserStats, checkLoginStatus } = useProfile();
  const [dataLoading, setDataLoading] = useState(true);
  const [userTrips, setUserTrips] = useState<any[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: '',
    destinationData: null as any,
    startDate: '',
    endDate: '',
    plannedDurationDays: 0,
    datesNotDecided: false,
    visibility: 'private' as 'public' | 'private',
  });

  // Check authentication and load user trips
  useEffect(() => {
    const initializeTripsData = async () => {
      try {
        setDataLoading(true);
        
        // Check if user is logged in
        const loginStatus = await checkLoginStatus();
        
        if (!loginStatus) {
          // For non-logged in users, show empty state instead of redirecting
          setUserTrips([]);
          setDataLoading(false);
          return;
        }

        // Filter trips based on user roles (Admin, Traveller, Viewer)
        if (!loading && profile?.email) {
          const userEmail = profile.email;
          
          // Get trips where user has any role
          const filteredTrips = trips.filter(trip => {
            // Check if user is creator/owner
            if (trip.createdBy === userEmail) return true;
            
            // Check if user is a collaborator with any role
            const isCollaborator = trip.collaborators?.some((collaborator: any) => 
              collaborator.email === userEmail && 
              ['admin', 'traveller', 'viewer'].includes(collaborator.role.toLowerCase())
            );
            
            return isCollaborator;
          });
          
          setUserTrips(filteredTrips);
        } else {
          setUserTrips(trips);
        }
      } catch (error) {
        console.error('Error loading trips data:', error);
        Alert.alert('Error', 'Failed to load trips data. Please try again.');
      } finally {
        setDataLoading(false);
      }
    };

    if (!loading) {
      initializeTripsData();
    }
  }, [loading, trips, profile, checkLoginStatus]);

  // Calculate places count for each trip
  const getTripPlacesCount = (tripId: string) => {
    return places.filter(place => place.tripId === tripId).length;
  };

  // Custom updateTrip function that also updates selectedTrip
  const updateTrip = async (tripId: string, updates: any) => {
    try {
      await updateTripFromHook(tripId, updates);
      
      // Update selectedTrip if it's the same trip
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip((prev: any) => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  // Custom deleteTrip function that also clears selectedTrip
  const deleteTrip = async (tripId: string) => {
    try {
      await deleteTripFromHook(tripId);
      
      // Clear selectedTrip if it's the same trip
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(null);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  const handleCreateTrip = async () => {
    if (!newTrip.title || !newTrip.destination) {
      Alert.alert('Error', 'Please fill in trip title and destination');
      return;
    }

    // If checkbox is checked, require duration
    if (newTrip.datesNotDecided && !newTrip.plannedDurationDays) {
      Alert.alert('Error', 'Please provide the number of days for your trip');
      return;
    }

    // If checkbox is not checked, require both dates
    if (!newTrip.datesNotDecided && (!newTrip.startDate || !newTrip.endDate)) {
      Alert.alert('Error', 'Please provide both start date and end date for your trip');
      return;
    }

    // Validate date order if both dates are provided and checkbox is not checked
    if (!newTrip.datesNotDecided && newTrip.startDate && newTrip.endDate) {
      const startDate = new Date(newTrip.startDate);
      const endDate = new Date(newTrip.endDate);
      if (startDate > endDate) {
        Alert.alert('Error', 'Start date cannot be later than end date');
        return;
      }
    }

    try {
      // Determine trip status based on checkbox state
      const hasDates = !newTrip.datesNotDecided && newTrip.startDate && newTrip.endDate;
      
      await addTrip({
        title: newTrip.title,
        destination: newTrip.destination,
        startDate: newTrip.datesNotDecided ? undefined : newTrip.startDate,
        endDate: newTrip.datesNotDecided ? undefined : newTrip.endDate,
        plannedDurationDays: newTrip.datesNotDecided ? newTrip.plannedDurationDays : undefined,
        visibility: newTrip.visibility,
        image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
        participants: 1,
        places: 0,
        createdBy: profile?.email || '',
        collaborators: [],
        invitations: [],
        currency: 'INR',
        partners: [],
        fellowTravellers: []
      });

      setNewTrip({ title: '', destination: '', destinationData: null, startDate: '', endDate: '', plannedDurationDays: 0, datesNotDecided: false, visibility: 'private' });
      setShowCreateModal(false);
      Alert.alert('Success', 'Trip created successfully!');
      
      // Update user stats after creating a trip
      await updateUserStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDestinationSelect = (destination: any) => {
    setNewTrip({ 
      ...newTrip, 
      destination: destination.name,
      destinationData: destination
    });
  };

  const handleTripMenu = (trip: any) => {
    setSelectedTrip(trip);
    setShowSharingModal(true);
  };

  const handleTripDetails = (trip: any) => {
    setSelectedTrip(trip);
    setSelectedTripTab('overview');
    setShowDetailsModal(true);
  };

  const handleTripItinerary = (trip: any) => {
    setSelectedTrip(trip);
    setSelectedTripTab('itinerary');
    setShowDetailsModal(true);
  };

  const handleTripMap = (trip: any) => {
    setSelectedTrip(trip);
    setSelectedTripTab('map');
    setShowDetailsModal(true);
  };

  const [selectedTripTab, setSelectedTripTab] = useState<'overview' | 'map' | 'itinerary'>('overview');

  // Show loading screen while initializing
  if (dataLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Luggage size={28} color="#111827" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>My Trips</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading your trips...</Text>
          <Text style={styles.loadingSubtext}>Fetching trips where you're an admin, traveller, or viewer</Text>
        </View>
      </SafeAreaView>
    );
  }

  if(!isLoggedIn){
    return (<SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Luggage size={28} color="#111827" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>My Trips</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Luggage size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyDescription}>
            Sign in to create your trip itineraries and start your adventure.
          </Text>
          <TouchableOpacity style={styles.signInPromptButton} onPress={() => router.push('/auth/login')}>
            <LogIn size={20} color="#FFFFFF" />
            <Text style={styles.signInPromptButtonText}>Sign In to Create Trip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Luggage size={28} color="#111827" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>My Trips</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Trips Found</Text>
            <Text style={styles.emptyDescription}>
              You don't have any trips yet. Create your first trip to get started!
            </Text>
            <TouchableOpacity
              style={styles.createFirstTripButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.createFirstTripText}>Create Your First Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userTrips.map((trip) => (
          <TouchableOpacity 
            key={trip.id} 
            style={styles.tripCard}
            onPress={() => handleTripDetails(trip)}
          >
            <Image source={{ uri: trip.image }} style={styles.tripImage} />
            
            {/* Privacy Indicator */}
            <View style={[styles.privacyBadge, trip.visibility === 'public' ? styles.publicBadge : styles.privateBadge]}>
              <Text style={styles.privacyText}>
                {trip.visibility === 'public' ? 'Public' : 'Private'}
              </Text>
            </View>
            
            <View style={styles.tripContent}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <TouchableOpacity 
                  style={styles.tripMenu}
                  onPress={() => handleTripMenu(trip)}
                >
                  <MoreVertical size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.tripDetail}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.tripDestination}>{trip.destination}</Text>
              </View>
              
              <View style={styles.tripDetail}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.tripDates}>
                  {trip.startDate && trip.endDate ? (
                    `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
                  ) : (
                    trip.plannedDurationDays ? `${trip.plannedDurationDays} days planned` : 'Dates not set'
                  )}
                </Text>
              </View>
              
              <View style={styles.tripStats}>
                <View style={styles.statItem}>
                  <Users size={16} color="#2563EB" />
                  <Text style={styles.statText}>{trip.participants}</Text>
                </View>
                <View style={styles.statItem}>
                  <MapPin size={16} color="#10B981" />
                  <Text style={styles.statText}>
                    {getTripPlacesCount(trip.id)} {getTripPlacesCount(trip.id) === 1 ? 'place' : 'places'}
                  </Text>
                </View>
              </View>

              <View style={styles.tripActions}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleTripDetails(trip)}
                >
                  <Eye size={16} color="#2563EB" />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={() => {
                    setSelectedTrip(trip);
                    setShowDetailsModal(true);
                    setSelectedTripTab('map');
                  }}
                >
                  <Map size={16} color="#10B981" />
                  <Text style={styles.mapButtonText}>Map View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.itineraryButton}
                  onPress={() => {
                    setSelectedTrip(trip);
                    setShowDetailsModal(true);
                    setSelectedTripTab('itinerary');
                  }}
                >
                  <List size={16} color="#10B981" />
                  <Text style={styles.itineraryButtonText}>Itinerary</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Trip</Text>
            <TouchableOpacity onPress={handleCreateTrip}>
              <Text style={styles.saveButton}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trip Title</Text>
              <TextInput
                style={styles.textInput}
                value={newTrip.title}
                onChangeText={(text) => setNewTrip({ ...newTrip, title: text })}
                placeholder="Enter trip title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destination</Text>
              <TextInput
                style={styles.textInput}
                value={newTrip.destination}
                onChangeText={(text) => setNewTrip({ ...newTrip, destination: text })}
                placeholder="Where are you going?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Checkbox for dates not decided */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setNewTrip({ ...newTrip, datesNotDecided: !newTrip.datesNotDecided })}
              >
                {newTrip.datesNotDecided && (
                  <Text style={styles.checkboxText}>✓</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Dates are not decided yet
              </Text>
            </View>

                        {/* Date fields - mandatory when checkbox is unchecked */}
            {!newTrip.datesNotDecided && (
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <DateTimePicker
                    value={newTrip.startDate}
                    onChange={(date) => setNewTrip({ ...newTrip, startDate: date })}
                    placeholder="Start Date"
                    label="Start Date *"
                    mode="date"
                    minimumDate={new Date()}
                    maximumDate={newTrip.endDate ? new Date(newTrip.endDate) : undefined}
                  />
                </View>

                <View style={styles.dateInput}>
                  <DateTimePicker
                    value={newTrip.endDate}
                    onChange={(date) => setNewTrip({ ...newTrip, endDate: date })}
                    placeholder="End Date"
                    label="End Date *"
                    mode="date"
                    minimumDate={newTrip.startDate ? new Date(newTrip.startDate) : new Date()}
                  />
                </View>
              </View>
            )}

            {/* Duration field - mandatory when checkbox is checked */}
            {newTrip.datesNotDecided && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Trip Duration (Days) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTrip.plannedDurationDays ? newTrip.plannedDurationDays.toString() : ''}
                  onChangeText={(text) => {
                    const days = parseInt(text) || 0;
                    setNewTrip({ ...newTrip, plannedDurationDays: days });
                  }}
                  placeholder="Enter number of days (required)"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <Text style={styles.inputHelper}>
                  Please provide the number of days for your trip planning
                </Text>
              </View>
            )}

            <View style={[styles.inputGroup, styles.visibilitySection]}>
              <Text style={styles.inputLabel}>Trip Visibility</Text>
              <View style={styles.visibilitySelector}>
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    newTrip.visibility === 'private' && styles.visibilityOptionActive
                  ]}
                  onPress={() => setNewTrip({ ...newTrip, visibility: 'private' })}
                >
                  <Text style={[
                    styles.visibilityOptionText,
                    newTrip.visibility === 'private' && styles.visibilityOptionTextActive
                  ]}>
                    Private
                  </Text>
                  <Text style={styles.visibilityDescription}>
                    Only you and invited collaborators can see this trip
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    newTrip.visibility === 'public' && styles.visibilityOptionActive
                  ]}
                  onPress={() => setNewTrip({ ...newTrip, visibility: 'public' })}
                >
                  <Text style={[
                    styles.visibilityOptionText,
                    newTrip.visibility === 'public' && styles.visibilityOptionTextActive
                  ]}>
                    Public
                  </Text>
                  <Text style={styles.visibilityDescription}>
                    Anyone can discover and view this trip
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

        </SafeAreaView>
      </Modal>

      {selectedTrip && (
        <TripSharingModal
          visible={showSharingModal}
          trip={selectedTrip}
          onClose={() => {
            setShowSharingModal(false);
            setSelectedTrip(null);
          }}
        />
      )}

      {selectedTrip && (
        <TripDetailsModal
          visible={showDetailsModal}
          trip={selectedTrip}
          initialTab={selectedTripTab}
          onTripUpdate={updateTrip}
          onTripDelete={deleteTrip}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTrip(null);
            setSelectedTripTab('overview');
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'relative',
  },
  privacyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  publicBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
  },
  privateBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.9)',
  },
  privacyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  tripMenu: {
    padding: 4,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripDates: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '500',
  },
  tripActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 6,
  },
  itineraryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3',
    paddingVertical: 8,
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  itineraryButtonText: {
    color: '#A16207',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstTripButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstTripText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  visibilitySection: {
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputHelper: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  destinationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  destinationText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  signInPromptButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  visibilitySelector: {
    gap: 12,
  },
  visibilityOption: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  visibilityOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  visibilityOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  visibilityOptionTextActive: {
    color: '#2563EB',
  },
  visibilityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});