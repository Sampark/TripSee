import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react-native';

interface Place {
  id: string;
  name: string;
  estimatedTime: string;
  location: string;
}

interface DayPlan {
  date: string;
  places: Place[];
}

interface ItineraryBuilderProps {
  trip: {
    startDate: string;
    endDate: string;
  };
}

export default function ItineraryBuilder({ trip }: ItineraryBuilderProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);

  // Generate days between start and end date
  const generateDays = () => {
    const days: string[] = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return days;
  };

  const days = generateDays();

  const addPlaceToDay = (dayIndex: number) => {
    Alert.alert(
      'Add Place',
      'This would open a place selector from your saved places',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Sample Place', onPress: () => {
          const newPlace: Place = {
            id: Date.now().toString(),
            name: 'Sample Place',
            estimatedTime: '2 hours',
            location: 'Sample Location',
          };
          
          const updatedPlans = [...dayPlans];
          if (!updatedPlans[dayIndex]) {
            updatedPlans[dayIndex] = { date: days[dayIndex], places: [] };
          }
          updatedPlans[dayIndex].places.push(newPlace);
          setDayPlans(updatedPlans);
        }}
      ]
    );
  };

  const removePlaceFromDay = (dayIndex: number, placeIndex: number) => {
    const updatedPlans = [...dayPlans];
    updatedPlans[dayIndex].places.splice(placeIndex, 1);
    setDayPlans(updatedPlans);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      {/* Day Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayButtonText,
              selectedDay === index && styles.dayButtonTextActive
            ]}>
              Day {index + 1}
            </Text>
            <Text style={[
              styles.dayButtonDate,
              selectedDay === index && styles.dayButtonDateActive
            ]}>
              {formatDate(day)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Day Content */}
      <View style={styles.dayContent}>
        <View style={styles.dayHeader}>
          <Calendar size={20} color="#2563EB" />
          <Text style={styles.dayTitle}>
            Day {selectedDay + 1} - {formatDate(days[selectedDay])}
          </Text>
        </View>

        <ScrollView style={styles.placesList} showsVerticalScrollIndicator={false}>
          {dayPlans[selectedDay]?.places.map((place, index) => (
            <View key={place.id} style={styles.placeItem}>
              <View style={styles.placeTime}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.timeText}>
                  {new Date(9 + index * 2, 0, 0).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </Text>
              </View>
              
              <View style={styles.placeContent}>
                <Text style={styles.placeName}>{place.name}</Text>
                <View style={styles.placeDetail}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.placeLocation}>{place.location}</Text>
                </View>
                <View style={styles.placeDetail}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.placeDuration}>{place.estimatedTime}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePlaceFromDay(selectedDay, index)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )) || []}

          <TouchableOpacity
            style={styles.addPlaceButton}
            onPress={() => addPlaceToDay(selectedDay)}
          >
            <Plus size={20} color="#2563EB" />
            <Text style={styles.addPlaceText}>Add Place to Day</Text>
          </TouchableOpacity>
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
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayButtonTextActive: {
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
  dayContent: {
    flex: 1,
    padding: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  placesList: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  placeTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  placeContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  placeDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  addPlaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addPlaceText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 8,
  },
});