import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Search, Plus, MapPin, Star } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlaces } from '../hooks/useStorage';

interface PlaceSelectorProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
}

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  photos?: Array<{
    photo_reference: string;
  }>;
  types: string[];
}
export default function PlaceSelector({ visible, tripId, onClose }: PlaceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [googleResults, setGoogleResults] = useState<GooglePlace[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeSearchTab, setActiveSearchTab] = useState<'saved' | 'search'>('saved');
  const { places, addPlace, updatePlace } = usePlaces();
  const insets = useSafeAreaInsets();

  const categories = ['All', 'Landmark', 'Museum', 'Restaurant', 'Neighborhood', 'Park'];

  // Filter available places (not already added to this trip)
  const availablePlaces = places.filter(place => 
    !place.tripId || place.tripId !== tripId
  );

  const filteredPlaces = availablePlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Mock Google Places API search
  const searchGooglePlaces = async (query: string) => {
    if (!query.trim()) {
      setGoogleResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock Google Places API response
      const mockResults: GooglePlace[] = [
        {
          place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
          name: 'Eiffel Tower',
          formatted_address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          geometry: {
            location: { lat: 48.8584, lng: 2.2945 }
          },
          rating: 4.6,
          types: ['tourist_attraction', 'point_of_interest', 'establishment'],
        },
        {
          place_id: 'ChIJ51cu8IcbXWARiRtXIothAS4',
          name: 'Tokyo Skytree',
          formatted_address: '1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-8634, Japan',
          geometry: {
            location: { lat: 35.7101, lng: 139.8107 }
          },
          rating: 4.1,
          types: ['tourist_attraction', 'point_of_interest', 'establishment'],
        },
        {
          place_id: 'ChIJOwg_06VPwokRYv534QaPC8g',
          name: 'Central Park',
          formatted_address: 'New York, NY, USA',
          geometry: {
            location: { lat: 40.7829, lng: -73.9654 }
          },
          rating: 4.7,
          types: ['park', 'tourist_attraction', 'point_of_interest', 'establishment'],
        },
      ].filter(place => 
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.formatted_address.toLowerCase().includes(query.toLowerCase())
      );

      setGoogleResults(mockResults);
    } catch (error) {
      setSearchError('Failed to search places. Please check your internet connection and try again.');
      setGoogleResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search effect
  React.useEffect(() => {
    if (activeSearchTab === 'search') {
      const timeoutId = setTimeout(() => {
        searchGooglePlaces(searchQuery);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeSearchTab]);
  const handleAddToTrip = async (place: any) => {
    try {
      await updatePlace(place.id, { tripId });
      Alert.alert('Success', `${place.name} has been added to your trip!`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add place to trip. Please try again.');
    }
  };

  const handleAddGooglePlace = async (googlePlace: GooglePlace) => {
    try {
      const newPlace = {
        name: googlePlace.name,
        category: getCategoryFromTypes(googlePlace.types),
        rating: googlePlace.rating || 4.0,
        image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: `Discovered via Google Places: ${googlePlace.formatted_address}`,
        location: googlePlace.formatted_address,
        estimatedTime: '2-3 hours',
        price: 'Varies',
        saved: false,
        tripId: tripId,
      };

      await addPlace(newPlace);
      Alert.alert('Success', `${googlePlace.name} has been added to your trip!`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add place to trip. Please try again.');
    }
  };

  const getCategoryFromTypes = (types: string[]): string => {
    if (types.includes('museum')) return 'Museum';
    if (types.includes('restaurant') || types.includes('food')) return 'Restaurant';
    if (types.includes('park')) return 'Park';
    if (types.includes('tourist_attraction')) return 'Landmark';
    return 'Landmark';
  };

  const handleRetrySearch = () => {
    setSearchError(null);
    searchGooglePlaces(searchQuery);
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Places to Trip</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Tabs */}
        <View style={styles.searchTabs}>
          <TouchableOpacity
            style={[styles.searchTab, activeSearchTab === 'saved' && styles.searchTabActive]}
            onPress={() => setActiveSearchTab('saved')}
          >
            <Text style={[styles.searchTabText, activeSearchTab === 'saved' && styles.searchTabTextActive]}>
              Saved Places
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.searchTab, activeSearchTab === 'search' && styles.searchTabActive]}
            onPress={() => setActiveSearchTab('search')}
          >
            <Text style={[styles.searchTabText, activeSearchTab === 'search' && styles.searchTabTextActive]}>
              Search New
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={activeSearchTab === 'saved' ? "Search saved places..." : "Search for new places..."}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchLoading && (
              <ActivityIndicator size="small" color="#2563EB" />
            )}
          </View>
        </View>

        {activeSearchTab === 'saved' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Error State */}
          {searchError && (
            <View style={styles.errorState}>
              <MapPin size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Search Error</Text>
              <Text style={styles.errorDescription}>{searchError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetrySearch}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Saved Places Tab */}
          {activeSearchTab === 'saved' && !searchError && (
            <>
              {filteredPlaces.length === 0 ? (
                <View style={styles.emptyState}>
                  <MapPin size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>No Places Available</Text>
                  <Text style={styles.emptyDescription}>
                    {searchQuery 
                      ? 'No places match your search criteria.'
                      : 'All available places have been added to trips.'
                    }
                  </Text>
                </View>
              ) : (
                filteredPlaces.map((place) => (
                  <View key={place.id} style={styles.placeCard}>
                    <Image source={{ uri: place.image }} style={styles.placeImage} />
                    
                    <View style={styles.placeContent}>
                      <View style={styles.placeHeader}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        <View style={styles.ratingContainer}>
                          <Star size={16} color="#F59E0B" fill="#F59E0B" />
                          <Text style={styles.rating}>{place.rating}</Text>
                        </View>
                      </View>

                      <Text style={styles.placeCategory}>{place.category}</Text>
                      <Text style={styles.placeDescription} numberOfLines={2}>
                        {place.description}
                      </Text>

                      <View style={styles.placeDetails}>
                        <View style={styles.detailItem}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.detailText}>{place.location}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToTrip(place)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add to Trip</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {/* Google Search Results Tab */}
          {activeSearchTab === 'search' && !searchError && (
            <View style={styles.emptyState}>
              {searchLoading ? (
                <>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.loadingText}>Searching places...</Text>
                </>
              ) : googleResults.length === 0 && searchQuery ? (
                <>
                  <Search size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>No Results Found</Text>
                  <Text style={styles.emptyDescription}>
                    Try searching for landmarks, restaurants, or attractions.
                  </Text>
                </>
              ) : googleResults.length === 0 ? (
                <>
                  <Search size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Search for Places</Text>
                  <Text style={styles.emptyDescription}>
                    Start typing to find new places to add to your trip.
                  </Text>
                </>
              ) : (
                googleResults.map((place) => (
                  <View key={place.place_id} style={styles.placeCard}>
                    <View style={styles.googlePlaceImageContainer}>
                      <MapPin size={32} color="#2563EB" />
                    </View>
                    
                    <View style={styles.placeContent}>
                      <View style={styles.placeHeader}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        {place.rating && (
                          <View style={styles.ratingContainer}>
                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.rating}>{place.rating}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.placeCategory}>{getCategoryFromTypes(place.types)}</Text>
                      <Text style={styles.placeDescription} numberOfLines={2}>
                        {place.formatted_address}
                      </Text>

                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddGooglePlace(place)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add to Trip</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  searchTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  searchTabActive: {
    borderBottomColor: '#2563EB',
  },
  searchTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  searchTabTextActive: {
    color: '#2563EB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorTitle: {
    fontSize: 18,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
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
  },
  placeCard: {
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
  placeImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  googlePlaceImageContainer: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeContent: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 4,
  },
  placeCategory: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  placeDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});