import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  participants: number;
  places: number;
  createdAt: string;
  updatedAt: string;
  visibility: 'public' | 'private';
  shareId?: string;
  createdBy: string;
  collaborators: TripCollaborator[];
  invitations: TripInvitation[];
  currency: string;
  partners: TripPartner[];
  fellowTravellers: FellowTraveller[];
}

export interface TripCollaborator {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface TripInvitation {
  id: string;
  email: string;
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  role: 'editor' | 'viewer';
}

export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  location: string;
  estimatedTime: string;
  price: string;
  saved: boolean;
  tripId?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  tripId: string;
  createdAt: string;
  paidBy: string; // User who paid
  splitBetween: string[]; // Array of user emails/names
  settled: boolean;
  settledAt?: string;
  currency: string;
  exchangeRate?: number; // For currency conversion
}

export interface TripPartner {
  id: string;
  name: string;
  email?: string;
  addedAt: string;
  addedBy: string;
}

export interface FellowTraveller {
  id: string;
  name: string;
  email?: string;
  addedAt: string;
  addedBy: string;
}

export interface ExpenseSettlement {
  id: string;
  fromUser: string;
  toUser: string;
  amount: number;
  currency: string;
  tripId: string;
  settledAt: string;
  status: 'paid' | 'received';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: 'guest' | 'authenticated'; // Track user authentication type
  isActive: boolean; // Track if user session is active
  preferences: {
    notifications: boolean;
    locationSharing: boolean;
    publicProfile: boolean;
  };
  stats: {
    tripsCompleted: number;
    placesVisited: number;
    totalExpenses: number;
    friendsConnected: number;
  };
  // Additional profile fields from registration
  gender?: string;
  dateOfBirth?: string;
  currentCity?: string;
  state?: string;
  country?: string;
  preferredCurrency?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface SharedData {
  trips: Trip[];
  places: Place[];
  expenses: Expense[];
  profile: UserProfile;
  lastSync: string;
}

class StorageService {
  private static readonly KEYS = {
    TRIPS: 'travel_trips',
    PLACES: 'travel_places',
    EXPENSES: 'travel_expenses',
    PROFILE: 'user_profile',
    USER_SESSION: 'user_session',
    SHARED_DATA: 'shared_data',
    PUBLIC_TRIPS: 'public_trips',
    TRIP_INVITATIONS: 'trip_invitations',
    EXPENSE_SETTLEMENTS: 'expense_settlements',
  };

  // Trip Management
  async saveTrips(trips: Trip[]): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.TRIPS, JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
      throw error;
    }
  }

  async getTrips(): Promise<Trip[]> {
    try {
      const tripsJson = await AsyncStorage.getItem(StorageService.KEYS.TRIPS);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error loading trips:', error);
      return [];
    }
  }

  async addTrip(trip: Trip): Promise<void> {
    try {
      const trips = await this.getTrips();
      trips.push(trip);
      await this.saveTrips(trips);
      
      // If trip is public, add to public feed
      if (trip.visibility === 'public') {
        await this.addToPublicFeed(trip);
      }
    } catch (error) {
      console.error('Error adding trip:', error);
      throw error;
    }
  }

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      const trips = await this.getTrips();
      const index = trips.findIndex(trip => trip.id === tripId);
      if (index !== -1) {
        const oldTrip = trips[index];
        trips[index] = { ...trips[index], ...updates, updatedAt: new Date().toISOString() };
        await this.saveTrips(trips);
        
        // Handle visibility changes
        if (oldTrip.visibility !== updates.visibility) {
          if (updates.visibility === 'public') {
            await this.addToPublicFeed(trips[index]);
          } else if (updates.visibility === 'private') {
            await this.removeFromPublicFeed(tripId);
          }
        }
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      const trips = await this.getTrips();
      const filteredTrips = trips.filter(trip => trip.id !== tripId);
      await this.saveTrips(filteredTrips);
      
      // Remove from public feed if it was public
      await this.removeFromPublicFeed(tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  // Place Management
  async savePlaces(places: Place[]): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.PLACES, JSON.stringify(places));
    } catch (error) {
      console.error('Error saving places:', error);
      throw error;
    }
  }

  async getPlaces(): Promise<Place[]> {
    try {
      const placesJson = await AsyncStorage.getItem(StorageService.KEYS.PLACES);
      if (!placesJson) {
        return [];
      }
      
      const places: Place[] = JSON.parse(placesJson);
      const seenIds = new Set<string>();
      let hasChanges = false;
      
      // Fix duplicate or invalid IDs
      const fixedPlaces = places.map(place => {
        // Check if ID is duplicate or old format (simple timestamp without random suffix)
        const isOldFormat = /^\d+$/.test(place.id); // Only digits, no random suffix
        const isDuplicate = seenIds.has(place.id);
        
        if (isDuplicate || isOldFormat) {
          // Generate new unique ID
          const timestamp = Date.now().toString();
          const random = Math.random().toString(36).substr(2, 9);
          const newId = `place_${timestamp}_${random}`;
          
          hasChanges = true;
          seenIds.add(newId);
          
          return { ...place, id: newId };
        }
        
        seenIds.add(place.id);
        return place;
      });
      
      // Save corrected data back to storage if changes were made
      if (hasChanges) {
        await this.savePlaces(fixedPlaces);
      }
      
      return fixedPlaces;
    } catch (error) {
      console.error('Error loading places:', error);
      return [];
    }
  }

  async addPlace(place: Place): Promise<void> {
    try {
      const places = await this.getPlaces();
      
      // Check if place with same ID already exists
      const existingPlace = places.find(p => p.id === place.id);
      if (existingPlace) {
        console.warn('Place with ID already exists:', place.id);
        return;
      }
      
      places.push(place);
      await this.savePlaces(places);
    } catch (error) {
      console.error('Error adding place:', error);
      throw error;
    }
  }

  async updatePlace(placeId: string, updates: Partial<Place>): Promise<void> {
    try {
      const places = await this.getPlaces();
      const index = places.findIndex(place => place.id === placeId);
      if (index !== -1) {
        places[index] = { ...places[index], ...updates };
        await this.savePlaces(places);
      }
    } catch (error) {
      console.error('Error updating place:', error);
      throw error;
    }
  }

  // Expense Management
  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
      throw error;
    }
  }

  async getExpenses(): Promise<Expense[]> {
    try {
      const expensesJson = await AsyncStorage.getItem(StorageService.KEYS.EXPENSES);
      if (!expensesJson) {
        return [];
      }
      
      const expenses: Expense[] = JSON.parse(expensesJson);
      const seenIds = new Set<string>();
      let hasChanges = false;
      
      // Fix duplicate or invalid IDs
      const fixedExpenses = expenses.map(expense => {
        // Check if ID is duplicate or old format (simple timestamp without random suffix)
        const isOldFormat = /^\d+$/.test(expense.id); // Only digits, no random suffix
        const isDuplicate = seenIds.has(expense.id);
        
        if (isDuplicate || isOldFormat) {
          // Generate new unique ID
          const timestamp = Date.now().toString();
          const random = Math.random().toString(36).substr(2, 9);
          const newId = `expense_${timestamp}_${random}`;
          
          hasChanges = true;
          seenIds.add(newId);
          
          return { ...expense, id: newId };
        }
        
        seenIds.add(expense.id);
        return expense;
      });
      
      // Save corrected data back to storage if changes were made
      if (hasChanges) {
        await this.saveExpenses(fixedExpenses);
      }
      
      return fixedExpenses;
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      
      // Check if expense with same ID already exists
      const existingExpense = expenses.find(e => e.id === expense.id);
      if (existingExpense) {
        console.warn('Expense with ID already exists:', expense.id);
        return;
      }
      
      expenses.push(expense);
      await this.saveExpenses(expenses);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  // Profile Management
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfile | null> {
    try {
      const profileJson = await AsyncStorage.getItem(StorageService.KEYS.PROFILE);
      if (!profileJson) return null;
      
      const profile = JSON.parse(profileJson);
      
      // Update last active timestamp
      if (profile.isActive) {
        profile.lastActiveAt = new Date().toISOString();
        await this.saveProfile(profile);
      }
      
      return profile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  // Data Sharing & Sync
  async exportAllData(): Promise<SharedData> {
    try {
      const [trips, places, expenses, profile] = await Promise.all([
        this.getTrips(),
        this.getPlaces(),
        this.getExpenses(),
        this.getProfile(),
      ]);

      return {
        trips,
        places,
        expenses,
        profile: profile || this.getDefaultProfile(),
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importSharedData(sharedData: SharedData): Promise<void> {
    try {
      // Merge data instead of overwriting
      const [existingTrips, existingPlaces, existingExpenses] = await Promise.all([
        this.getTrips(),
        this.getPlaces(),
        this.getExpenses(),
      ]);

      // Merge trips (avoid duplicates by ID)
      const mergedTrips = this.mergeArraysById(existingTrips, sharedData.trips);
      await this.saveTrips(mergedTrips);

      // Merge places
      const mergedPlaces = this.mergeArraysById(existingPlaces, sharedData.places);
      await this.savePlaces(mergedPlaces);

      // Merge expenses
      const mergedExpenses = this.mergeArraysById(existingExpenses, sharedData.expenses);
      await this.saveExpenses(mergedExpenses);

      // Update profile if newer
      const existingProfile = await this.getProfile();
      if (!existingProfile || new Date(sharedData.lastSync) > new Date(existingProfile.stats.toString())) {
        await this.saveProfile(sharedData.profile);
      }

      // Save shared data reference
      await AsyncStorage.setItem(StorageService.KEYS.SHARED_DATA, JSON.stringify(sharedData));
    } catch (error) {
      console.error('Error importing shared data:', error);
      throw error;
    }
  }

  async generateShareableLink(): Promise<string> {
    try {
      const data = await this.exportAllData();
      const encodedData = btoa(JSON.stringify(data));
      return `travelplan://share?data=${encodedData}`;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      throw error;
    }
  }

  async importFromShareableLink(link: string): Promise<void> {
    try {
      const url = new URL(link);
      const encodedData = url.searchParams.get('data');
      if (!encodedData) {
        throw new Error('Invalid share link');
      }

      const sharedData: SharedData = JSON.parse(atob(encodedData));
      await this.importSharedData(sharedData);
    } catch (error) {
      console.error('Error importing from shareable link:', error);
      throw error;
    }
  }

  // Utility Methods
  private mergeArraysById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
    const merged = [...existing];
    
    incoming.forEach(item => {
      const existingIndex = merged.findIndex(existing => existing.id === item.id);
      if (existingIndex !== -1) {
        // Update existing item
        merged[existingIndex] = item;
      } else {
        // Add new item
        merged.push(item);
      }
    });

    return merged;
  }

  private getDefaultProfile(): UserProfile {
    return {
      id: Date.now().toString(),
      name: 'TripSee User',
      email: 'user@example.com',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    };
  }

  // Trip Sharing & Visibility
  generateUniqueShareId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `trip_${timestamp}_${random}`;
  }

  async findTripByShareId(shareId: string): Promise<Trip | null> {
    try {
      const trips = await this.getTrips();
      return trips.find(trip => trip.shareId === shareId) || null;
    } catch (error) {
      console.error('Error finding trip by share ID:', error);
      return null;
    }
  }

  async getPublicTrips(): Promise<Trip[]> {
    try {
      const tripsJson = await AsyncStorage.getItem(StorageService.KEYS.PUBLIC_TRIPS);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error loading public trips:', error);
      return [];
    }
  }

  async addToPublicFeed(trip: Trip): Promise<void> {
    try {
      const publicTrips = await this.getPublicTrips();
      const existingIndex = publicTrips.findIndex(t => t.id === trip.id);
      
      if (existingIndex !== -1) {
        publicTrips[existingIndex] = trip;
      } else {
        publicTrips.push(trip);
      }
      
      await AsyncStorage.setItem(StorageService.KEYS.PUBLIC_TRIPS, JSON.stringify(publicTrips));
    } catch (error) {
      console.error('Error adding to public feed:', error);
      throw error;
    }
  }

  async removeFromPublicFeed(tripId: string): Promise<void> {
    try {
      const publicTrips = await this.getPublicTrips();
      const filteredTrips = publicTrips.filter(trip => trip.id !== tripId);
      await AsyncStorage.setItem(StorageService.KEYS.PUBLIC_TRIPS, JSON.stringify(filteredTrips));
    } catch (error) {
      console.error('Error removing from public feed:', error);
      throw error;
    }
  }

  // Trip Invitations
  async sendTripInvitation(tripId: string, email: string, role: 'editor' | 'viewer', invitedBy: string): Promise<TripInvitation> {
    try {
      const invitation: TripInvitation = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        invitedBy,
        invitedAt: new Date().toISOString(),
        status: 'pending',
        role,
      };

      // Add invitation to trip
      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      if (tripIndex !== -1) {
        trips[tripIndex].invitations.push(invitation);
        await this.saveTrips(trips);
      }

      // Store invitation separately for easy lookup
      const invitations = await this.getTripInvitations();
      invitations.push({ ...invitation, tripId });
      await AsyncStorage.setItem(StorageService.KEYS.TRIP_INVITATIONS, JSON.stringify(invitations));

      return invitation;
    } catch (error) {
      console.error('Error sending trip invitation:', error);
      throw error;
    }
  }

  async getTripInvitations(): Promise<(TripInvitation & { tripId: string })[]> {
    try {
      const invitationsJson = await AsyncStorage.getItem(StorageService.KEYS.TRIP_INVITATIONS);
      return invitationsJson ? JSON.parse(invitationsJson) : [];
    } catch (error) {
      console.error('Error loading trip invitations:', error);
      return [];
    }
  }

  async respondToInvitation(invitationId: string, response: 'accepted' | 'declined', userEmail: string): Promise<void> {
    try {
      const invitations = await this.getTripInvitations();
      const invitation = invitations.find(inv => inv.id === invitationId);
      
      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Update invitation status
      invitation.status = response;
      await AsyncStorage.setItem(StorageService.KEYS.TRIP_INVITATIONS, JSON.stringify(invitations));

      // If accepted, add user as collaborator
      if (response === 'accepted') {
        const trips = await this.getTrips();
        const tripIndex = trips.findIndex(trip => trip.id === invitation.tripId);
        
        if (tripIndex !== -1) {
          const collaborator: TripCollaborator = {
            id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: userEmail,
            name: userEmail.split('@')[0], // Use email prefix as name
            role: invitation.role,
            joinedAt: new Date().toISOString(),
          };

          trips[tripIndex].collaborators.push(collaborator);
          
          // Update invitation status in trip
          const tripInvIndex = trips[tripIndex].invitations.findIndex(inv => inv.id === invitationId);
          if (tripInvIndex !== -1) {
            trips[tripIndex].invitations[tripInvIndex].status = response;
          }

          await this.saveTrips(trips);
        }
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  }

  async getUserInvitations(userEmail: string): Promise<(TripInvitation & { tripId: string; tripTitle: string })[]> {
    try {
      const invitations = await this.getTripInvitations();
      const userInvitations = invitations.filter(inv => inv.email === userEmail && inv.status === 'pending');
      
      // Enrich with trip details
      const trips = await this.getTrips();
      return userInvitations.map(inv => {
        const trip = trips.find(t => t.id === inv.tripId);
        return {
          ...inv,
          tripTitle: trip?.title || 'Unknown Trip',
        };
      });
    } catch (error) {
      console.error('Error getting user invitations:', error);
      return [];
    }
  }

  // Trip Partner Management
  async addTripPartner(tripId: string, partner: Omit<TripPartner, 'id' | 'addedAt'>): Promise<TripPartner> {
    try {
      const newPartner: TripPartner = {
        ...partner,
        id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
      };

      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex !== -1) {
        if (!trips[tripIndex].partners) {
          trips[tripIndex].partners = [];
        }
        trips[tripIndex].partners.push(newPartner);
        await this.saveTrips(trips);
      }

      return newPartner;
    } catch (error) {
      console.error('Error adding trip partner:', error);
      throw error;
    }
  }

  async removeTripPartner(tripId: string, partnerId: string): Promise<void> {
    try {
      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex !== -1 && trips[tripIndex].partners) {
        trips[tripIndex].partners = trips[tripIndex].partners.filter(p => p.id !== partnerId);
        await this.saveTrips(trips);
      }
    } catch (error) {
      console.error('Error removing trip partner:', error);
      throw error;
    }
  }

  // Expense Settlement Management
  async getExpenseSettlements(): Promise<ExpenseSettlement[]> {
    try {
      const settlementsJson = await AsyncStorage.getItem(StorageService.KEYS.EXPENSE_SETTLEMENTS);
      return settlementsJson ? JSON.parse(settlementsJson) : [];
    } catch (error) {
      console.error('Error loading expense settlements:', error);
      return [];
    }
  }

  async saveExpenseSettlements(settlements: ExpenseSettlement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.EXPENSE_SETTLEMENTS, JSON.stringify(settlements));
    } catch (error) {
      console.error('Error saving expense settlements:', error);
      throw error;
    }
  }

  async addExpenseSettlement(settlement: Omit<ExpenseSettlement, 'id' | 'settledAt'>): Promise<ExpenseSettlement> {
    try {
      const newSettlement: ExpenseSettlement = {
        ...settlement,
        id: `settlement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        settledAt: new Date().toISOString(),
      };

      const settlements = await this.getExpenseSettlements();
      settlements.push(newSettlement);
      await this.saveExpenseSettlements(settlements);

      return newSettlement;
    } catch (error) {
      console.error('Error adding expense settlement:', error);
      throw error;
    }
  }

  async markExpenseAsSettled(expenseId: string): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const index = expenses.findIndex(expense => expense.id === expenseId);
      if (index !== -1) {
        expenses[index].settled = true;
        expenses[index].settledAt = new Date().toISOString();
        await this.saveExpenses(expenses);
      }
    } catch (error) {
      console.error('Error marking expense as settled:', error);
      throw error;
    }
  }

  // Fellow Traveller Management
  async addFellowTraveller(tripId: string, traveller: Omit<FellowTraveller, 'id' | 'addedAt'>): Promise<FellowTraveller> {
    try {
      const newTraveller: FellowTraveller = {
        ...traveller,
        id: `traveller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
      };

      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex !== -1) {
        if (!trips[tripIndex].fellowTravellers) {
          trips[tripIndex].fellowTravellers = [];
        }
        trips[tripIndex].fellowTravellers.push(newTraveller);
        await this.saveTrips(trips);
      }

      return newTraveller;
    } catch (error) {
      console.error('Error adding fellow traveller:', error);
      throw error;
    }
  }

  async removeFellowTraveller(tripId: string, travellerId: string): Promise<void> {
    try {
      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex !== -1 && trips[tripIndex].fellowTravellers) {
        trips[tripIndex].fellowTravellers = trips[tripIndex].fellowTravellers.filter(t => t.id !== travellerId);
        await this.saveTrips(trips);
      }
    } catch (error) {
      console.error('Error removing fellow traveller:', error);
      throw error;
    }
  }

  // User Session Management
  async createGuestSession(guestData: { fullName: string; email: string }): Promise<UserProfile> {
    try {
      const guestProfile: UserProfile = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: guestData.fullName,
        email: guestData.email,
        avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        userType: 'guest',
        isActive: true,
        preferences: {
          notifications: false, // Guests have limited notifications
          locationSharing: false,
          publicProfile: false, // Guests are private by default
        },
        stats: {
          tripsCompleted: 0,
          placesVisited: 0,
          totalExpenses: 0,
          friendsConnected: 0,
        },
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      
      await this.saveProfile(guestProfile);
      await this.setUserSession({ isLoggedIn: true, userType: 'guest', userId: guestProfile.id });
      
      return guestProfile;
    } catch (error) {
      console.error('Error creating guest session:', error);
      throw error;
    }
  }

  async createAuthenticatedSession(userData: { name: string; email: string; avatar?: string }): Promise<UserProfile> {
    try {
      // Check if there's existing guest data to merge
      const existingProfile = await this.getProfile();
      
      const authenticatedProfile: UserProfile = {
        id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        userType: 'authenticated',
        isActive: true,
        preferences: {
          notifications: true,
          locationSharing: false,
          publicProfile: true,
        },
        stats: existingProfile?.stats || { // Preserve guest stats if they exist
          tripsCompleted: 0,
          placesVisited: 0,
          totalExpenses: 0,
          friendsConnected: 0,
        },
        createdAt: existingProfile?.createdAt || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      
      await this.saveProfile(authenticatedProfile);
      await this.setUserSession({ isLoggedIn: true, userType: 'authenticated', userId: authenticatedProfile.id });
      
      return authenticatedProfile;
    } catch (error) {
      console.error('Error creating authenticated session:', error);
      throw error;
    }
  }

  async setUserSession(session: { isLoggedIn: boolean; userType: 'guest' | 'authenticated'; userId: string }): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.USER_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error setting user session:', error);
      throw error;
    }
  }

  async getUserSession(): Promise<{ isLoggedIn: boolean; userType: 'guest' | 'authenticated'; userId: string } | null> {
    try {
      const sessionJson = await AsyncStorage.getItem(StorageService.KEYS.USER_SESSION);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  async isUserLoggedIn(): Promise<boolean> {
    try {
      const session = await this.getUserSession();
      const profile = await this.getProfile();
      
      return !!(session?.isLoggedIn && profile?.isActive);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Mark profile as inactive instead of deleting
      const profile = await this.getProfile();
      if (profile) {
        profile.isActive = false;
        await this.saveProfile(profile);
      }
      
      // Clear session
      await AsyncStorage.removeItem(StorageService.KEYS.USER_SESSION);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        StorageService.KEYS.TRIPS,
        StorageService.KEYS.PLACES,
        StorageService.KEYS.EXPENSES,
        StorageService.KEYS.PROFILE,
        StorageService.KEYS.USER_SESSION,
        StorageService.KEYS.SHARED_DATA,
        StorageService.KEYS.PUBLIC_TRIPS,
        StorageService.KEYS.TRIP_INVITATIONS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export default new StorageService();