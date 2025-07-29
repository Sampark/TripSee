import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Map, Globe, Star, Users, X, } from 'lucide-react-native';
// Type definition for Region
interface RegionType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Map components - will be null on web
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

// Only try to import on native platforms
if (Platform.OS !== 'web') {
  // Use a different approach to avoid web bundling
  const loadMapsSafely = () => {
    try {
      // This will only execute on native platforms
      const MapsModule = require('react-native-maps');
      MapView = MapsModule.default;
      Marker = MapsModule.Marker;
      Callout = MapsModule.Callout;
    } catch (error) {
      console.log('react-native-maps not available, using fallback map');
    }
  };
  
  // Execute immediately for native platforms
  loadMapsSafely();
}

interface TripMapViewProps {
  trip: any;
  places: any[];
}

// Country coordinates and regions
const COUNTRY_REGIONS = {
  'bali': {
    name: 'Bali, Indonesia',
    description: 'Island of the Gods',
    region: {
      latitude: -8.3405,
      longitude: 115.0920,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    },
    defaultPins: [
      { name: 'Ubud', coordinate: { latitude: -8.5069, longitude: 115.2625 }, type: 'Cultural', rating: 4.8 },
      { name: 'Kuta', coordinate: { latitude: -8.7266, longitude: 115.1772 }, type: 'Beach', rating: 4.5 },
      { name: 'Seminyak', coordinate: { latitude: -8.6833, longitude: 115.1667 }, type: 'Luxury', rating: 4.7 },
      { name: 'Nusa Penida', coordinate: { latitude: -8.7278, longitude: 115.5444 }, type: 'Adventure', rating: 4.9 },
    ]
  },
  'thailand': {
    name: 'Thailand',
    description: 'Land of Smiles',
    region: {
      latitude: 13.7563,
      longitude: 100.5018,
      latitudeDelta: 5.0,
      longitudeDelta: 5.0,
    },
    defaultPins: [
      { name: 'Bangkok', coordinate: { latitude: 13.7563, longitude: 100.5018 }, type: 'City', rating: 4.6 },
      { name: 'Phuket', coordinate: { latitude: 7.8804, longitude: 98.3923 }, type: 'Beach', rating: 4.7 },
      { name: 'Chiang Mai', coordinate: { latitude: 18.7883, longitude: 98.9853 }, type: 'Cultural', rating: 4.8 },
      { name: 'Koh Samui', coordinate: { latitude: 9.5120, longitude: 100.0136 }, type: 'Island', rating: 4.6 },
    ]
  },
  'japan': {
    name: 'Japan',
    description: 'Land of Rising Sun',
    region: {
      latitude: 35.6762,
      longitude: 139.6503,
      latitudeDelta: 8.0,
      longitudeDelta: 8.0,
    },
    defaultPins: [
      { name: 'Tokyo', coordinate: { latitude: 35.6762, longitude: 139.6503 }, type: 'City', rating: 4.8 },
      { name: 'Osaka', coordinate: { latitude: 34.6937, longitude: 135.5023 }, type: 'City', rating: 4.7 },
      { name: 'Kyoto', coordinate: { latitude: 35.0116, longitude: 135.7681 }, type: 'Cultural', rating: 4.9 },
      { name: 'Hiroshima', coordinate: { latitude: 34.3853, longitude: 132.4553 }, type: 'Historical', rating: 4.6 },
    ]
  },
  'singapore': {
    name: 'Singapore',
    description: 'Lion City',
    region: {
      latitude: 1.3521,
      longitude: 103.8198,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    },
    defaultPins: [
      { name: 'Marina Bay Sands', coordinate: { latitude: 1.2838, longitude: 103.8591 }, type: 'Luxury', rating: 4.7 },
      { name: 'Gardens by the Bay', coordinate: { latitude: 1.2816, longitude: 103.8636 }, type: 'Nature', rating: 4.8 },
      { name: 'Sentosa Island', coordinate: { latitude: 1.2494, longitude: 103.8303 }, type: 'Entertainment', rating: 4.6 },
      { name: 'Chinatown', coordinate: { latitude: 1.2838, longitude: 103.8444 }, type: 'Cultural', rating: 4.5 },
    ]
  },
  'vietnam': {
    name: 'Vietnam',
    description: 'Pearl of the East',
    region: {
      latitude: 21.0285,
      longitude: 105.8542,
      latitudeDelta: 8.0,
      longitudeDelta: 8.0,
    },
    defaultPins: [
      { name: 'Hanoi', coordinate: { latitude: 21.0285, longitude: 105.8542 }, type: 'Cultural', rating: 4.7 },
      { name: 'Ho Chi Minh City', coordinate: { latitude: 10.8231, longitude: 106.6297 }, type: 'City', rating: 4.6 },
      { name: 'Halong Bay', coordinate: { latitude: 20.9101, longitude: 107.1839 }, type: 'Nature', rating: 4.9 },
      { name: 'Hoi An', coordinate: { latitude: 15.8801, longitude: 108.3383 }, type: 'Cultural', rating: 4.8 },
    ]
  },
};

export default function TripMapView({ trip, places }: TripMapViewProps) {
  const insets = useSafeAreaInsets();
  const [mapRegion, setMapRegion] = useState<RegionType | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showTripPlaces, setShowTripPlaces] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);
  const [fullMapRegion, setFullMapRegion] = useState<RegionType | null>(null);

  // Determine country based on trip destination
  const getCountryFromTrip = () => {
    const destination = trip?.destination?.toLowerCase() || '';
    if (destination.includes('bali')) return 'bali';
    if (destination.includes('thailand') || destination.includes('bangkok') || destination.includes('phuket')) return 'thailand';
    if (destination.includes('japan') || destination.includes('tokyo') || destination.includes('kyoto')) return 'japan';
    if (destination.includes('singapore')) return 'singapore';
    if (destination.includes('vietnam') || destination.includes('hanoi') || destination.includes('ho chi minh')) return 'vietnam';
    return 'bali'; // default
  };

  const countryKey = getCountryFromTrip();
  const countryData = COUNTRY_REGIONS[countryKey as keyof typeof COUNTRY_REGIONS] || COUNTRY_REGIONS.bali;
  const hasTripPlaces = places && places.length > 0;

  // Calculate region based on pins
  const calculateRegionFromPins = (pins: any[]): RegionType => {
    if (pins.length === 0) {
      return countryData.region;
    }

    const latitudes = pins.map(pin => pin.coordinate.latitude);
    const longitudes = pins.map(pin => pin.coordinate.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = Math.max((maxLat - minLat) * 1.5, 0.1);
    const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.1);

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  // Prepare all markers (both trip and popular places)
  const prepareAllMarkers = () => {
    const tripMarkers = hasTripPlaces ? places.map((place, index) => ({
      id: `trip-${place.id || index}`,
      name: place.name || `Place ${index + 1}`,
      coordinate: place.coordinate || { latitude: 0, longitude: 0 },
      type: place.type || 'Destination',
      rating: place.rating || 4.5,
      isTripPlace: true,
      color: '#EF4444'
    })) : [];

    const popularMarkers = countryData.defaultPins.map(pin => ({
      id: `default-${pin.name}`,
      name: pin.name,
      coordinate: pin.coordinate,
      type: pin.type,
      rating: pin.rating,
      isTripPlace: false,
      color: '#3B82F6'
    }));

    return [...tripMarkers, ...popularMarkers];
  };

  const allMarkers = prepareAllMarkers();

  // Set initial region
  useEffect(() => {
    const region = calculateRegionFromPins(allMarkers);
    setMapRegion(region);
    setFullMapRegion(region);
  }, [places]);

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
  };

  const handleCalloutPress = (marker: any) => {
    Alert.alert(
      marker.name,
      `Type: ${marker.type}\nRating: ${marker.rating}⭐\n${marker.isTripPlace ? 'Trip Destination' : 'Popular Destination'}`,
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'Get Directions', 
          onPress: () => {
            Alert.alert('Navigation', `Opening directions to ${marker.name}`);
          }
        }
      ]
    );
  };

  const openFullMap = () => {
    setShowFullMap(true);
  };

  const closeFullMap = () => {
    setShowFullMap(false);
  };

  const renderMapHeader = () => (
    <View style={styles.mapHeader}>
      <View style={styles.headerContent}>
        <Globe size={24} color="#2563EB" />
        <View style={styles.headerText}>
          <Text style={styles.mapTitle}>{countryData.name}</Text>
        </View>
      </View>
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.mapSubtitle}>{countryData.description}</Text>
        </View>
        <View style={styles.statItem}>
          <MapPin size={16} color="#EF4444" />
          <Text style={styles.statText}>{hasTripPlaces ? places.length : 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Users size={16} color="#8B5CF6" />
          <Text style={styles.statText}>{countryData.defaultPins.length}</Text>
        </View>
      </View>
    </View>
  );

  const renderCompactMap = () => {
    // Web fallback
    if (Platform.OS === 'web' || !MapView) {
      return (
        <TouchableOpacity style={styles.compactMapContainer} onPress={openFullMap}>
          <View style={styles.webMapFallback}>
            <Map size={48} color="#6B7280" />
            <Text style={styles.webMapText}>Interactive Map</Text>
            <Text style={styles.webMapSubtext}>Tap to view full map</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.compactMapContainer} onPress={openFullMap}>
        {mapRegion && (
          <MapView
            style={styles.compactMap}
            region={mapRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            showsTraffic={false}
            showsBuildings={false}
          >
            {allMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                pinColor={marker.isTripPlace ? '#EF4444' : '#3B82F6'}
              />
            ))}
          </MapView>
        )}
      </TouchableOpacity>
    );
  };

  const renderFullMapModal = () => {
    // Web fallback for full map
    if (Platform.OS === 'web' || !MapView) {
      return (
        <Modal
          visible={showFullMap}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.fullMapContainer, { paddingTop: insets.top }]}>
            <View style={styles.fullMapHeader}>
              <TouchableOpacity onPress={closeFullMap} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.fullMapTitle}>{countryData.name}</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.webFullMapFallback}>
              <Map size={64} color="#6B7280" />
              <Text style={styles.webFullMapText}>Interactive Map</Text>
              <Text style={styles.webFullMapSubtext}>
                Full map view is available on mobile devices
              </Text>
              <View style={styles.webMapLegend}>
                <Text style={styles.legendTitle}>Map Legend</Text>
                <View style={styles.legendItems}>
                  {hasTripPlaces && (
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.legendText}>Trip Destinations</Text>
                    </View>
                  )}
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                    <Text style={styles.legendText}>Popular Destinations</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <Modal
        visible={showFullMap}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.fullMapContainer, { paddingTop: insets.top }]}>
          <View style={styles.fullMapHeader}>
            <TouchableOpacity onPress={closeFullMap} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.fullMapTitle}>{countryData.name}</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {fullMapRegion && (
            <MapView
              style={styles.fullMap}
              region={fullMapRegion}
              onRegionChangeComplete={setFullMapRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              showsScale={true}
              showsTraffic={false}
              showsBuildings={true}
              scrollEnabled={true}
              zoomEnabled={true}
              rotateEnabled={true}
              pitchEnabled={true}
            >
              {allMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  title={marker.name}
                  description={marker.type}
                  onPress={() => handleMarkerPress(marker)}
                  pinColor={marker.isTripPlace ? '#EF4444' : '#3B82F6'}
                >
                  <Callout onPress={() => handleCalloutPress(marker)}>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{marker.name}</Text>
                      <Text style={styles.calloutType}>{marker.type}</Text>
                      <View style={styles.calloutRating}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.calloutRatingText}>{marker.rating}</Text>
                      </View>
                      {marker.isTripPlace && (
                        <View style={styles.tripBadge}>
                          <Text style={styles.tripBadgeText}>Trip Destination</Text>
                        </View>
                      )}
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          )}

          <View style={styles.mapLegend}>
            <Text style={styles.legendTitle}>Map Legend</Text>
            <View style={styles.legendItems}>
              {hasTripPlaces && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Trip Destinations</Text>
                </View>
              )}
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.legendText}>Popular Destinations</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={[styles.actionButton, showTripPlaces && styles.actionButtonActive]}
        onPress={() => setShowTripPlaces(true)}
      >
        <MapPin size={16} color={showTripPlaces ? '#FFFFFF' : '#6B7280'} />
        <Text style={[styles.actionText, showTripPlaces && styles.actionTextActive]}>Trip Places</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, !showTripPlaces && styles.actionButtonActive]}
        onPress={() => setShowTripPlaces(false)}
      >
        <Globe size={16} color={!showTripPlaces ? '#FFFFFF' : '#6B7280'} />
        <Text style={[styles.actionText, !showTripPlaces && styles.actionTextActive]}>Popular</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlacesList = () => {
    const displayMarkers = showTripPlaces && hasTripPlaces 
      ? allMarkers.filter(marker => marker.isTripPlace)
      : allMarkers.filter(marker => !marker.isTripPlace);

    return (
      <ScrollView style={styles.placesList} showsVerticalScrollIndicator={false}>
        {displayMarkers.map((marker) => (
          <TouchableOpacity
            key={marker.id}
            style={[styles.placeCard, marker.isTripPlace && styles.tripPlaceCard]}
            onPress={() => handleCalloutPress(marker)}
          >
            <View style={styles.placeHeader}>
              <MapPin size={16} color={marker.isTripPlace ? '#EF4444' : '#6B7280'} />
              <Text style={[styles.placeName, marker.isTripPlace && styles.tripPlaceName]}>{marker.name}</Text>
              {marker.isTripPlace && <View style={styles.tripBadge}><Text style={styles.tripBadgeText}>TRIP</Text></View>}
            </View>
            <View style={styles.placeDetails}>
              <View style={styles.placeInfo}>
                <Text style={styles.placeType}>{marker.type}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{marker.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderMapHeader()}
      {renderCompactMap()}
      {renderQuickActions()}
      {renderPlacesList()}
      {renderFullMapModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  compactMapContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  compactMap: {
    flex: 1,
  },
  fullMapContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  fullMapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  fullMap: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  calloutType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  calloutRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  tripBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tripBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  actionButtonActive: {
    backgroundColor: '#2563EB',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  actionTextActive: {
    color: '#FFFFFF',
  },
  placesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tripPlaceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  tripPlaceName: {
    color: '#EF4444',
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeType: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  webMapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  webFullMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  webFullMapText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  webFullMapSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  webMapLegend: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});