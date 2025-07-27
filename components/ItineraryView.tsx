import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Calendar, Clock, MapPin, Plus, Trash2, CreditCard as Edit } from 'lucide-react-native';

interface ItineraryViewProps {
  trip: any;
  places: any[];
  canEdit: boolean;
}

interface DayPlan {
  date: string;
  dayNumber: number;
  places: any[];
}

export default function ItineraryView({ trip, places, canEdit }: ItineraryViewProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  // Generate days for the trip
  const generateDayPlans = (): DayPlan[] => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const days: DayPlan[] = [];
    
    let currentDate = new Date(startDate);
    let dayNumber = 1;
    
    while (currentDate <= endDate) {
      const dayPlaces = places.filter((_, index) => index % Math.ceil(places.length / dayNumber) === dayNumber - 1);
      
      days.push({
        date: currentDate.toISOString().split('T')[0],
        dayNumber,
        places: dayPlaces.slice(0, Math.ceil(places.length / Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)),
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }
    
    return days;
  };

  const dayPlans = generateDayPlans();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (index: number) => {
    const baseHour = 9; // Start at 9 AM
    const hour = baseHour + (index * 2); // 2 hours between activities
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAddPlace = (dayIndex: number) => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to modify this itinerary.');
      return;
    }
    
    Alert.alert('Add Place', `Add a place to Day ${dayIndex + 1}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => Alert.alert('Success', 'Place would be added to the itinerary.') }
    ]);
  };

  const handleRemovePlace = (dayIndex: number, placeIndex: number) => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to modify this itinerary.');
      return;
    }
    
    Alert.alert('Remove Place', 'Remove this place from the itinerary?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => Alert.alert('Removed', 'Place removed from itinerary.') }
    ]);
  };

  const handleEditPlace = (place: any) => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to modify this itinerary.');
      return;
    }
    
    Alert.alert('Edit Place', `Edit details for ${place.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => Alert.alert('Edit', 'Place editing would open here.') }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Day Selector */}
      <View style={styles.daySelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorContent}
        >
          {dayPlans.map((day, index) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[
                styles.dayButtonNumber,
                selectedDay === index && styles.dayButtonNumberActive
              ]}>
                {day.dayNumber}
              </Text>
              <Text style={[
                styles.dayButtonDate,
                selectedDay === index && styles.dayButtonDateActive
              ]}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
              <Text style={[
                styles.dayButtonPlaces,
                selectedDay === index && styles.dayButtonPlacesActive
              ]}>
                {day.places.length} places
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Day Content */}
      <View style={styles.dayContent}>
        <View style={styles.dayHeader}>
          <Calendar size={24} color="#2563EB" />
          <View style={styles.dayHeaderText}>
            <Text style={styles.dayTitle}>
              Day {dayPlans[selectedDay]?.dayNumber}
            </Text>
            <Text style={styles.dayDate}>
              {formatDate(dayPlans[selectedDay]?.date || '')}
            </Text>
          </View>
          {canEdit && (
            <TouchableOpacity 
              style={styles.addDayPlaceButton}
              onPress={() => handleAddPlace(selectedDay)}
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
          {dayPlans[selectedDay]?.places.length === 0 ? (
            <View style={styles.emptyDay}>
              <MapPin size={48} color="#D1D5DB" />
              <Text style={styles.emptyDayTitle}>No Places Planned</Text>
              <Text style={styles.emptyDayDescription}>
                {canEdit 
                  ? 'Add places to create your daily itinerary.'
                  : 'This day doesn\'t have any places planned yet.'
                }
              </Text>
              {canEdit && (
                <TouchableOpacity 
                  style={styles.addFirstPlaceButton}
                  onPress={() => handleAddPlace(selectedDay)}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.addFirstPlaceText}>Add First Place</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            dayPlans[selectedDay]?.places.map((place, index) => (
              <View key={place.id} style={styles.timelineItem}>
                <View style={styles.timelineTime}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.timeText}>{formatTime(index)}</Text>
                </View>
                
                <View style={styles.timelineLine}>
                  <View style={styles.timelineDot} />
                  {index < (dayPlans[selectedDay]?.places.length || 0) - 1 && (
                    <View style={styles.timelineConnector} />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <View style={styles.placeCard}>
                    <Image source={{ uri: place.image }} style={styles.placeImage} />
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeCategory}>{place.category}</Text>
                      <View style={styles.placeDetail}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.placeLocation}>{place.location}</Text>
                      </View>
                      <View style={styles.placeDetail}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.placeDuration}>{place.estimatedTime}</Text>
                      </View>
                    </View>
                    
                    {canEdit && (
                      <View style={styles.placeActions}>
                        <TouchableOpacity 
                          style={styles.editPlaceButton}
                          onPress={() => handleEditPlace(place)}
                        >
                          <Edit size={16} color="#2563EB" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.removePlaceButton}
                          onPress={() => handleRemovePlace(selectedDay, index)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
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
  daySelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
  },
  dayButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  dayButtonActive: {
    backgroundColor: '#2563EB',
  },
  dayButtonNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  dayButtonNumberActive: {
    color: '#FFFFFF',
  },
  dayButtonDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dayButtonDateActive: {
    color: '#E5E7EB',
  },
  dayButtonPlaces: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dayButtonPlacesActive: {
    color: '#E5E7EB',
  },
  dayContent: {
    flex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  dayDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  addDayPlaceButton: {
    padding: 8,
  },
  timeline: {
    flex: 1,
    padding: 20,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDayDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addFirstPlaceButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFirstPlaceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineTime: {
    alignItems: 'center',
    width: 80,
    paddingTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  timelineLine: {
    alignItems: 'center',
    width: 20,
    paddingTop: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeInfo: {
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
    marginBottom: 6,
  },
  placeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  placeDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  placeActions: {
    flexDirection: 'column',
    gap: 8,
  },
  editPlaceButton: {
    padding: 6,
  },
  removePlaceButton: {
    padding: 6,
  },
});