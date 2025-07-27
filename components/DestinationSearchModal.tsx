import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Search, MapPin, Globe } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Destination {
  id: string;
  name: string;
  address: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

interface DestinationSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onDestinationSelect: (destination: Destination) => void;
}

export default function DestinationSearchModal({
  visible,
  onClose,
  onDestinationSelect,
}: DestinationSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock destinations for demonstration (in real app, this would come from Google Places API)
  const mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'Paris',
      address: 'Paris, France',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
    },
    {
      id: '2',
      name: 'Tokyo',
      address: 'Tokyo, Japan',
      country: 'Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4',
    },
    {
      id: '3',
      name: 'New York City',
      address: 'New York, NY, USA',
      country: 'United States',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
    },
    {
      id: '4',
      name: 'London',
      address: 'London, UK',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    },
    {
      id: '5',
      name: 'Rome',
      address: 'Rome, Italy',
      country: 'Italy',
      coordinates: { lat: 41.9028, lng: 12.4964 },
      placeId: 'ChIJu46S-ZZhLxMROG5lkwZ3D7k',
    },
    {
      id: '6',
      name: 'Barcelona',
      address: 'Barcelona, Spain',
      country: 'Spain',
      coordinates: { lat: 41.3851, lng: 2.1734 },
      placeId: 'ChIJ5TCOcRaYpBIRCmZHTz37sEQ',
    },
    {
      id: '7',
      name: 'Sydney',
      address: 'Sydney NSW, Australia',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
      placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM',
    },
    {
      id: '8',
      name: 'Dubai',
      address: 'Dubai, United Arab Emirates',
      country: 'United Arab Emirates',
      coordinates: { lat: 25.2048, lng: 55.2708 },
      placeId: 'ChIJRcbZaklDXz4RYlEphFBu5r0',
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchDestinations(searchQuery);
    } else {
      setSearchResults([]);
      setError(null);
    }
  }, [searchQuery]);

  const searchDestinations = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real implementation, this would call Google Places API:
      // const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${API_KEY}`);
      // const data = await response.json();

      // Mock search functionality
      const filteredResults = mockDestinations.filter(destination =>
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.address.toLowerCase().includes(query.toLowerCase()) ||
        destination.country.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    } catch (err) {
      setError('Failed to search destinations. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSelect = (destination: Destination) => {
    onDestinationSelect(destination);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close destination search">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Destination</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for cities, countries, or places..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              accessibilityLabel="Destination search input"
              accessibilityHint="Type to search for travel destinations"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} accessibilityLabel="Clear search">
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Searching destinations...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Globe size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Search Error</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => searchDestinations(searchQuery)}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && searchQuery.length > 0 && searchResults.length === 0 && (
            <View style={styles.emptyContainer}>
              <MapPin size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No destinations found</Text>
              <Text style={styles.emptyText}>
                Try searching for a different city, country, or landmark.
              </Text>
            </View>
          )}

          {!loading && searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>
                {searchResults.length} destination{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              
              {searchResults.map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  style={styles.destinationItem}
                  onPress={() => handleDestinationSelect(destination)}
                  accessibilityLabel={`Select ${destination.name}, ${destination.country}`}
                  accessibilityRole="button"
                >
                  <View style={styles.destinationIcon}>
                    <MapPin size={24} color="#2563EB" />
                  </View>
                  
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName}>{destination.name}</Text>
                    <Text style={styles.destinationAddress}>{destination.address}</Text>
                    <Text style={styles.destinationCountry}>{destination.country}</Text>
                  </View>
                  
                  <View style={styles.coordinatesInfo}>
                    <Text style={styles.coordinatesText}>
                      {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {searchQuery.length === 0 && (
            <View style={styles.instructionsContainer}>
              <Search size={48} color="#D1D5DB" />
              <Text style={styles.instructionsTitle}>Search for Your Destination</Text>
              <Text style={styles.instructionsText}>
                Start typing to find cities, countries, or specific places for your trip.
              </Text>
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Search Tips:</Text>
                <Text style={styles.tipText}>• Try "Paris, France" or just "Paris"</Text>
                <Text style={styles.tipText}>• Search for landmarks like "Eiffel Tower"</Text>
                <Text style={styles.tipText}>• Use country names like "Japan" or "Italy"</Text>
              </View>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  destinationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  destinationCountry: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  coordinatesInfo: {
    alignItems: 'flex-end',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
});