import { useState, useEffect, useCallback } from 'react';
import StorageService, { Trip, Place, Expense, UserProfile, TripInvitation, TripCollaborator } from '../services/StorageService';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const savedTrips = await StorageService.getTrips();
      setTrips(savedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const profile = await StorageService.getProfile();
      const userEmail = profile?.email || 'user@example.com';
      
      const newTrip: Trip = {
        ...trip,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visibility: trip.visibility || 'private',
        shareId: trip.visibility === 'private' ? StorageService.generateUniqueShareId() : undefined,
        createdBy: userEmail,
        collaborators: [{
          id: `owner_${Date.now()}`,
          email: userEmail,
          name: userEmail.split('@')[0],
          role: 'owner',
          joinedAt: new Date().toISOString(),
        }],
        invitations: [],
      };
      await StorageService.addTrip(newTrip);
      setTrips(prev => [...prev, newTrip]);
      return newTrip;
    } catch (error) {
      console.error('Error adding trip:', error);
      throw error;
    }
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      await StorageService.updateTrip(tripId, updates);
      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
      ));
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await StorageService.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  return {
    trips,
    loading,
    addTrip,
    updateTrip,
    deleteTrip,
    refreshTrips: loadTrips,
    getPublicTrips: StorageService.getPublicTrips.bind(StorageService),
    findTripByShareId: StorageService.findTripByShareId.bind(StorageService),
    addTripPartner: StorageService.addTripPartner.bind(StorageService),
    removeTripPartner: StorageService.removeTripPartner.bind(StorageService),
    addFellowTraveller: StorageService.addFellowTraveller.bind(StorageService),
    removeFellowTraveller: StorageService.removeFellowTraveller.bind(StorageService),
  };
}

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const savedPlaces = await StorageService.getPlaces();
      setPlaces(savedPlaces);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPlace = async (place: Omit<Place, 'id'>) => {
    try {
      const newPlace: Place = {
        ...place,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      await StorageService.addPlace(newPlace);
      setPlaces(prev => [...prev, newPlace]);
      return newPlace;
    } catch (error) {
      console.error('Error adding place:', error);
      throw error;
    }
  };

  const updatePlace = async (placeId: string, updates: Partial<Place>) => {
    try {
      await StorageService.updatePlace(placeId, updates);
      setPlaces(prev => prev.map(place => 
        place.id === placeId ? { ...place, ...updates } : place
      ));
    } catch (error) {
      console.error('Error updating place:', error);
      throw error;
    }
  };

  const toggleSaved = async (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    if (place) {
      await updatePlace(placeId, { saved: !place.saved });
    }
  };

  return {
    places,
    loading,
    addPlace,
    updatePlace,
    toggleSaved,
    refreshPlaces: loadPlaces,
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const savedExpenses = await StorageService.getExpenses();
      setExpenses(savedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const newExpense: Expense = {
        ...expense,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      await StorageService.addExpense(newExpense);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    refreshExpenses: loadExpenses,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Memoize checkLoginStatus to prevent infinite re-renders
  const checkLoginStatus = useCallback(async () => {
    return await StorageService.isUserLoggedIn();
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [savedProfile, loginStatus] = await Promise.all([
        StorageService.getProfile(),
        StorageService.isUserLoggedIn()
      ]);
      
      setProfile(savedProfile);
      setIsLoggedIn(loginStatus);
    } catch (error) {
      console.error('Error loading profile:', error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (profile) {
        const updatedProfile = { ...profile, ...updates };
        await StorageService.saveProfile(updatedProfile);
        setProfile(updatedProfile);
        
        // Update stats if trips or places are modified
        if (updates.stats) {
          const trips = await StorageService.getTrips();
          const places = await StorageService.getPlaces();
          const expenses = await StorageService.getExpenses();
          
          const calculatedStats = {
            tripsCompleted: trips.length,
            placesVisited: places.length,
            totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
            friendsConnected: updatedProfile.stats?.friendsConnected || 0,
          };
          
          const profileWithStats = { ...updatedProfile, stats: calculatedStats };
          await StorageService.saveProfile(profileWithStats);
          setProfile(profileWithStats);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    isLoggedIn,
    updateProfile,
    refreshProfile: loadProfile,
    createGuestSession: StorageService.createGuestSession.bind(StorageService),
    createAuthenticatedSession: StorageService.createAuthenticatedSession.bind(StorageService),
    signOut: StorageService.signOut.bind(StorageService),
    checkLoginStatus,
    // Helper function to update user stats
    updateUserStats: async () => {
      if (profile) {
        const trips = await StorageService.getTrips();
        const places = await StorageService.getPlaces();
        const expenses = await StorageService.getExpenses();
        
        const updatedStats = {
          tripsCompleted: trips.length,
          placesVisited: places.length,
          totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
          friendsConnected: profile.stats?.friendsConnected || 0,
        };
        
        await updateProfile({ stats: updatedStats });
      }
    },
  };
}

export function useDataSharing() {
  const [sharing, setSharing] = useState(false);

  const generateShareLink = async (): Promise<string> => {
    try {
      setSharing(true);
      const shareLink = await StorageService.generateShareableLink();
      return shareLink;
    } catch (error) {
      console.error('Error generating share link:', error);
      throw error;
    } finally {
      setSharing(false);
    }
  };

  const importFromLink = async (link: string): Promise<void> => {
    try {
      setSharing(true);
      await StorageService.importFromShareableLink(link);
    } catch (error) {
      console.error('Error importing from link:', error);
      throw error;
    } finally {
      setSharing(false);
    }
  };

  const exportData = async () => {
    try {
      setSharing(true);
      return await StorageService.exportAllData();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    } finally {
      setSharing(false);
    }
  };

  return {
    sharing,
    generateShareLink,
    importFromLink,
    exportData,
  };
}

export function useTripSharing() {
  const [loading, setLoading] = useState(false);

  const sendInvitation = async (tripId: string, email: string, role: 'editor' | 'viewer') => {
    try {
      setLoading(true);
      const profile = await StorageService.getProfile();
      const invitedBy = profile?.email || 'user@example.com';
      
      const invitation = await StorageService.sendTripInvitation(tripId, email, role, invitedBy);
      return invitation;
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'declined') => {
    try {
      setLoading(true);
      const profile = await StorageService.getProfile();
      const userEmail = profile?.email || 'user@example.com';
      
      await StorageService.respondToInvitation(invitationId, response, userEmail);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserInvitations = async () => {
    try {
      const profile = await StorageService.getProfile();
      const userEmail = profile?.email || 'user@example.com';
      
      return await StorageService.getUserInvitations(userEmail);
    } catch (error) {
      console.error('Error getting user invitations:', error);
      return [];
    }
  };

  return {
    loading,
    sendInvitation,
    respondToInvitation,
    getUserInvitations,
  };
}