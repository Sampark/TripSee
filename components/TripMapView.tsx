import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MapPin, Calendar } from 'lucide-react-native';

interface TripMapViewProps {
  trip: any;
  places: any[];
}

export default function TripMapView({ trip, places }: TripMapViewProps) {
  const { width } = Dimensions.get('window');
  
  // Generate day colors for places
  const getDayColor = (dayIndex: number) => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[dayIndex % colors.length];
  };

  // Calculate trip duration and assign places to days
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const placesWithDays = places.map((place, index) => ({
    ...place,
    dayIndex: index % tripDays,
    color: getDayColor(index % tripDays),
  }));

  // Mock map coordinates (in a real app, you'd use actual coordinates)
  const mapPlaces = placesWithDays.map((place, index) => ({
    ...place,
    x: 50 + (index * 60) % (width - 100),
    y: 100 + (index * 40) % 200,
  }));

  const formatDate = (dateString: string, dayOffset: number) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Map Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Trip Days</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.legendItems}>
            {Array.from({ length: tripDays }, (_, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: getDayColor(index) }]} />
                <Text style={styles.legendText}>
                  Day {index + 1} - {formatDate(trip.startDate, index)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Mock Map View */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          <Text style={styles.mapTitle}>{trip.destination}</Text>
          <Text style={styles.mapSubtitle}>Interactive Map View</Text>
          
          {/* Place Markers */}
          {mapPlaces.map((place) => (
            <View
              key={place.id}
              style={[
                styles.placeMarker,
                {
                  left: place.x,
                  top: place.y,
                  backgroundColor: place.color,
                }
              ]}
            >
              <MapPin size={16} color="#FFFFFF" />
              <View style={styles.placeTooltip}>
                <Text style={styles.placeTooltipText}>{place.name}</Text>
                <Text style={styles.placeTooltipDay}>Day {place.dayIndex + 1}</Text>
              </View>
            </View>
          ))}
          
          {/* Connection Lines */}
          {mapPlaces.map((place, index) => {
            if (index === mapPlaces.length - 1) return null;
            const nextPlace = mapPlaces[index + 1];
            
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.connectionLine,
                  {
                    left: place.x + 16,
                    top: place.y + 16,
                    width: Math.sqrt(
                      Math.pow(nextPlace.x - place.x, 2) + 
                      Math.pow(nextPlace.y - place.y, 2)
                    ),
                    transform: [{
                      rotate: `${Math.atan2(
                        nextPlace.y - place.y,
                        nextPlace.x - place.x
                      ) * 180 / Math.PI}deg`
                    }]
                  }
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Places List */}
      <View style={styles.placesList}>
        <Text style={styles.placesTitle}>Places on Map ({places.length})</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {placesWithDays.map((place) => (
            <View key={place.id} style={styles.placeListItem}>
              <View style={[styles.dayIndicator, { backgroundColor: place.color }]}>
                <Text style={styles.dayNumber}>{place.dayIndex + 1}</Text>
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeListName}>{place.name}</Text>
                <Text style={styles.placeListLocation}>{place.location}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  legend: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  placeMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placeTooltip: {
    position: 'absolute',
    top: -50,
    left: -40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  placeTooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  placeTooltipDay: {
    color: '#D1D5DB',
    fontSize: 10,
  },
  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  placesList: {
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  placesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  placeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  placeInfo: {
    flex: 1,
  },
  placeListName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  placeListLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});