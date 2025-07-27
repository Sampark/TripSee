import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Search, Star, MapPin, Clock, Heart, Globe, Camera, Info, ExternalLink } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProfile, usePlaces } from '../../hooks/useStorage';

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  location: string;
  estimatedTime: string;
  price: string;
  country: string;
  highlights: string[];
  bestTimeToVisit: string;
  popularWith: string[];
}

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { profile, isLoggedIn } = useProfile();
  const { places: savedPlaces, updatePlace } = usePlaces();

  const categories = ['All', 'Landmark', 'Museum', 'Restaurant', 'Neighborhood', 'Park', 'Beach', 'Mountain'];

  // Enhanced places data for discovery
  const discoveryPlaces: Place[] = [
    {
      id: 'place_1',
      name: 'Eiffel Tower',
      category: 'Landmark',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Iconic iron lattice tower and symbol of Paris, offering breathtaking views of the city',
      location: 'Champ de Mars, Paris',
      estimatedTime: '2-3 hours',
      price: '₹2,200',
      country: 'France',
      highlights: ['Panoramic city views', 'Evening light show', 'Historic architecture'],
      bestTimeToVisit: 'Evening for light show',
      popularWith: ['Couples', 'Photographers', 'First-time visitors'],
    },
    {
      id: 'place_2',
      name: 'Louvre Museum',
      category: 'Museum',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'World\'s largest art museum featuring the Mona Lisa and countless masterpieces',
      location: 'Rue de Rivoli, Paris',
      estimatedTime: '3-4 hours',
      price: '₹1,400',
      country: 'France',
      highlights: ['Mona Lisa', 'Venus de Milo', 'Egyptian antiquities'],
      bestTimeToVisit: 'Weekday mornings',
      popularWith: ['Art lovers', 'History enthusiasts', 'Culture seekers'],
    },
    {
      id: 'place_3',
      name: 'Tokyo Skytree',
      category: 'Landmark',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Broadcasting and observation tower offering spectacular views of Tokyo',
      location: 'Sumida City, Tokyo',
      estimatedTime: '2-3 hours',
      price: '₹2,800',
      country: 'Japan',
      highlights: ['360° city views', 'Shopping complex', 'Traditional crafts'],
      bestTimeToVisit: 'Sunset for best views',
      popularWith: ['Families', 'Photographers', 'City explorers'],
    },
    {
      id: 'place_4',
      name: 'Senso-ji Temple',
      category: 'Landmark',
      rating: 4.4,
      image: 'https://images.pexels.com/photos/161251/senso-ji-temple-japan-kyoto-landmark-161251.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient Buddhist temple in Asakusa with traditional market street',
      location: 'Asakusa, Tokyo',
      estimatedTime: '1-2 hours',
      price: 'Free',
      country: 'Japan',
      highlights: ['Traditional architecture', 'Nakamise shopping street', 'Cultural ceremonies'],
      bestTimeToVisit: 'Early morning or evening',
      popularWith: ['Culture enthusiasts', 'Spiritual seekers', 'History buffs'],
    },
    {
      id: 'place_5',
      name: 'Central Park',
      category: 'Park',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Massive urban park in Manhattan perfect for recreation and relaxation',
      location: 'New York, NY',
      estimatedTime: '3-5 hours',
      price: 'Free',
      country: 'United States',
      highlights: ['Bethesda Fountain', 'Strawberry Fields', 'Boat rentals'],
      bestTimeToVisit: 'Spring and fall',
      popularWith: ['Families', 'Joggers', 'Nature lovers'],
    },
    {
      id: 'place_6',
      name: 'Statue of Liberty',
      category: 'Landmark',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Iconic symbol of freedom and democracy with ferry access and museum',
      location: 'Liberty Island, NY',
      estimatedTime: '3-4 hours',
      price: '₹1,800',
      country: 'United States',
      highlights: ['Crown access', 'Immigration museum', 'Harbor views'],
      bestTimeToVisit: 'Morning for shorter lines',
      popularWith: ['History enthusiasts', 'Tourists', 'Families'],
    },
    {
      id: 'place_7',
      name: 'Colosseum',
      category: 'Landmark',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient Roman amphitheater and one of the New Seven Wonders of the World',
      location: 'Rome, Italy',
      estimatedTime: '2-3 hours',
      price: '₹1,600',
      country: 'Italy',
      highlights: ['Underground chambers', 'Gladiator history', 'Roman architecture'],
      bestTimeToVisit: 'Early morning or late afternoon',
      popularWith: ['History buffs', 'Architecture lovers', 'Photographers'],
    },
    {
      id: 'place_8',
      name: 'Santorini Beaches',
      category: 'Beach',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Stunning volcanic beaches with unique black and red sand formations',
      location: 'Santorini, Greece',
      estimatedTime: 'Full day',
      price: 'Free',
      country: 'Greece',
      highlights: ['Unique volcanic sand', 'Crystal clear waters', 'Sunset views'],
      bestTimeToVisit: 'Late spring to early fall',
      popularWith: ['Beach lovers', 'Couples', 'Photographers'],
    },
  ];

  // Filter places based on search query and category
  useEffect(() => {
    const filterPlaces = async () => {
      setSearchLoading(true);

      try {
        let filtered = [...discoveryPlaces];

        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(place =>
            place.name.toLowerCase().includes(query) ||
            place.description.toLowerCase().includes(query) ||
            place.location.toLowerCase().includes(query) ||
            place.country.toLowerCase().includes(query) ||
            place.highlights.some(highlight => highlight.toLowerCase().includes(query))
          );
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
          filtered = filtered.filter(place => place.category === selectedCategory);
        }

        // Sort by rating (highest first)
        filtered.sort((a, b) => b.rating - a.rating);

        setFilteredPlaces(filtered);
      } catch (error) {
        console.error('Error filtering places:', error);
        setFilteredPlaces([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounced search (300ms delay)
    const timeoutId = setTimeout(filterPlaces, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const handleSavePlace = (placeId: string) => {
    const place = discoveryPlaces.find(p => p.id === placeId);
    const existingSavedPlace = savedPlaces.find(p => p.id === placeId);
    
    if (existingSavedPlace) {
      // Update existing saved place
      updatePlace(placeId, { saved: !existingSavedPlace.saved });
      Alert.alert(
        existingSavedPlace.saved ? 'Removed from Saved' : 'Saved for Later',
        existingSavedPlace.saved 
          ? `${place?.name} has been removed from your saved places.`
          : `${place?.name} has been saved to your favorites!`
      );
    } else if (place) {
      // Add new place to saved places
      const newSavedPlace: Place = {
        id: place.id,
        name: place.name,
        category: place.category,
        rating: place.rating,
        image: place.image,
        description: place.description,
        location: place.location,
        estimatedTime: place.estimatedTime,
        price: place.price,
        saved: true,
      };
      
      updatePlace(place.id, newSavedPlace);
      Alert.alert('Saved for Later', `${place.name} has been saved to your favorites!`);
    }
  };

  const handleLearnMore = (place: Place) => {
    Alert.alert(
      place.name,
      `${place.description}\n\nBest time to visit: ${place.bestTimeToVisit}\n\nPopular with: ${place.popularWith.join(', ')}`,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Get Directions', 
          onPress: () => Alert.alert('Directions', 'Opening maps application...') 
        }
      ]
    );
  };

  const handleCreateTrip = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Sign In Required',
        'Create an account or sign in to start planning your trips and save your favorite places.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
    } else {
      router.push('/(tabs)/index');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Globe size={28} color="#111827" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Discover Places</Text>
          </View>
        </View>
        
        {/* Create Trip CTA for users without trips */}
        <TouchableOpacity
          style={styles.createTripButton}
          onPress={handleCreateTrip}
        >
          <Text style={styles.createTripText}>Plan Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by country, city, or attraction..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchLoading && (
            <ActivityIndicator size="small" color="#2563EB" />
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
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
      </View>

      {/* Places Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Results Header */}
        {searchQuery && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredPlaces.length} place{filteredPlaces.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
          </View>
        )}

        {filteredPlaces.length === 0 && !searchLoading ? (
          <View style={styles.emptyState}>
            <Globe size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No Places Found' : 'Start Exploring'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? `No places match your search for "${searchQuery}". Try searching for a different location or attraction.`
                : 'Use the search bar above to discover amazing places around the world. Search by country, city, or specific attractions.'
              }
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredPlaces.map((place) => {
            const savedPlace = savedPlaces.find(p => p.id === place.id);
            const isSaved = savedPlace?.saved || false;

            return (
              <View key={place.id} style={styles.placeCard}>
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                
                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSavePlace(place.id)}
                >
                  <Heart
                    size={20}
                    color={isSaved ? "#EF4444" : "#FFFFFF"}
                    fill={isSaved ? "#EF4444" : "transparent"}
                  />
                </TouchableOpacity>

                <View style={styles.placeContent}>
                  <View style={styles.placeHeader}>
                    <View style={styles.placeTitleContainer}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <View style={styles.locationContainer}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.placeLocation}>{place.country}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.rating}>{place.rating}</Text>
                    </View>
                  </View>

                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{place.category}</Text>
                  </View>

                  <Text style={styles.placeDescription} numberOfLines={2}>
                    {place.description}
                  </Text>

                  {/* Highlights */}
                  <View style={styles.highlightsContainer}>
                    <Text style={styles.highlightsTitle}>Highlights:</Text>
                    <View style={styles.highlightsList}>
                      {place.highlights.slice(0, 2).map((highlight, index) => (
                        <View key={index} style={styles.highlightItem}>
                          <Text style={styles.highlightText}>• {highlight}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.placeDetails}>
                    <View style={styles.detailItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{place.estimatedTime}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.priceText}>{place.price}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.placeActions}>
                    <TouchableOpacity
                      style={styles.learnMoreButton}
                      onPress={() => handleLearnMore(place)}
                    >
                      <Info size={16} color="#2563EB" />
                      <Text style={styles.learnMoreText}>Learn More</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.directionsButton}
                      onPress={() => Alert.alert('Directions', 'Opening maps application...')}
                    >
                      <ExternalLink size={16} color="#10B981" />
                      <Text style={styles.directionsText}>Directions</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Popular With Tags */}
                  <View style={styles.popularWithContainer}>
                    <Text style={styles.popularWithTitle}>Popular with:</Text>
                    <View style={styles.popularWithTags}>
                      {place.popularWith.map((tag, index) => (
                        <View key={index} style={styles.popularTag}>
                          <Text style={styles.popularTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Bottom CTA for Trip Planning */}
        {filteredPlaces.length > 0 && (
          <View style={styles.bottomCTA}>
            <View style={styles.ctaContent}>
              <Camera size={32} color="#2563EB" />
              <Text style={styles.ctaTitle}>Ready to Plan Your Trip?</Text>
              <Text style={styles.ctaDescription}>
                Create a trip to organize these amazing places into your perfect itinerary
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={handleCreateTrip}
              >
                <Text style={styles.ctaButtonText}>
                  {isLoggedIn ? 'Create New Trip' : 'Sign In to Plan Trip'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
  headerContent: {
    flex: 1,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  createTripButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createTripText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
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
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  clearSearchButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  placeContent: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  placeDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  highlightsContainer: {
    marginBottom: 16,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  highlightsList: {
    gap: 2,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  placeActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  learnMoreButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  learnMoreText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  directionsText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  popularWithContainer: {
    marginTop: 8,
  },
  popularWithTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  popularWithTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  popularTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularTagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomCTA: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});