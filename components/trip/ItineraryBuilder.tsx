import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  Home,
  Navigation,
  Edit,
  X
} from 'lucide-react-native';

interface TravelItem {
  id: string;
  type: 'flight' | 'train' | 'cab' | 'hotel' | 'base' | 'place';
  name: string;
  time: string;
  location: string;
  details?: string;
  duration?: string;
  cost?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

interface DayPlan {
  date: string;
  items: TravelItem[];
}

interface ItineraryBuilderProps {
  trip: {
    startDate: string;
    endDate: string;
    destination: string;
  };
}

export default function ItineraryBuilder({ trip }: ItineraryBuilderProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<string>('');

  // Initialize with sample data for demonstration
  useEffect(() => {
    if (dayPlans.length === 0) {
      const samplePlans: DayPlan[] = [];
      const days = generateDays();
      
      days.forEach((day, dayIndex) => {
        const items: TravelItem[] = [];
        
        // Add sample items for first day
        if (dayIndex === 0) {
          items.push({
            id: '1',
            type: 'flight',
            name: 'Flight to Bali',
            time: '08:00 AM',
            location: 'Airport',
            details: 'Flight BA123 - Economy Class',
            duration: '4 hours',
            cost: '$450',
            status: 'confirmed',
          });
          
          items.push({
            id: '2',
            type: 'hotel',
            name: 'Bali Resort & Spa',
            time: '02:00 PM',
            location: 'Kuta Beach',
            details: 'Check-in, Ocean View Room',
            duration: '3 nights',
            cost: '$200/night',
            status: 'confirmed',
          });
          
          items.push({
            id: '3',
            type: 'place',
            name: 'Ubud Palace',
            time: '04:00 PM',
            location: 'Ubud, Bali',
            details: 'Cultural visit, Traditional dance',
            duration: '2 hours',
            cost: '$15',
            status: 'confirmed',
          });
        }
        
        // Add sample items for second day
        if (dayIndex === 1) {
          items.push({
            id: '4',
            type: 'base',
            name: 'Hotel Base',
            time: '08:00 AM',
            location: 'Bali Resort & Spa',
            details: 'Starting point for the day',
            duration: 'All day',
            cost: 'Included',
            status: 'confirmed',
          });
          
          items.push({
            id: '5',
            type: 'cab',
            name: 'Airport Transfer',
            time: '09:00 AM',
            location: 'Hotel to Airport',
            details: 'Private car service',
            duration: '45 minutes',
            cost: '$25',
            status: 'confirmed',
          });
          
          items.push({
            id: '6',
            type: 'place',
            name: 'Tanah Lot Temple',
            time: '10:00 AM',
            location: 'Tanah Lot, Bali',
            details: 'Sunset temple visit',
            duration: '3 hours',
            cost: '$20',
            status: 'confirmed',
          });
        }
        
        samplePlans.push({
          date: day,
          items,
        });
      });
      
      setDayPlans(samplePlans);
    }
  }, []);

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

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={16} color="#3B82F6" />;
      case 'train': return <Train size={16} color="#8B5CF6" />;
      case 'cab': return <Car size={16} color="#F59E0B" />;
      case 'hotel': return <Hotel size={16} color="#10B981" />;
      case 'base': return <Home size={16} color="#EF4444" />;
      case 'place': return <MapPin size={16} color="#6B7280" />;
      default: return <Navigation size={16} color="#6B7280" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'flight': return '#3B82F6';
      case 'train': return '#8B5CF6';
      case 'cab': return '#F59E0B';
      case 'hotel': return '#10B981';
      case 'base': return '#EF4444';
      case 'place': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case 'flight': return 'Flight';
      case 'train': return 'Train';
      case 'cab': return 'Cab';
      case 'hotel': return 'Hotel';
      case 'base': return 'Base Location';
      case 'place': return 'Place to Visit';
      default: return 'Item';
    }
  };

  const addItemToDay = (dayIndex: number, type: string) => {
    const newItem: TravelItem = {
      id: Date.now().toString(),
      type: type as any,
      name: `Sample ${getItemTypeName(type)}`,
      time: '09:00 AM',
      location: 'Sample Location',
      details: 'Sample details',
      duration: '2 hours',
      cost: '$50',
      status: 'confirmed',
    };
    
    const updatedPlans = [...dayPlans];
    if (!updatedPlans[dayIndex]) {
      updatedPlans[dayIndex] = { date: days[dayIndex], items: [] };
    }
    updatedPlans[dayIndex].items.push(newItem);
    setDayPlans(updatedPlans);
    setShowAddModal(false);
  };

  const removeItemFromDay = (dayIndex: number, itemIndex: number) => {
    const updatedPlans = [...dayPlans];
    updatedPlans[dayIndex].items.splice(itemIndex, 1);
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

  const renderAddItemModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add to Day {selectedDay + 1}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.itemTypeGrid}>
            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'flight')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#EFF6FF' }]}>
                <Plane size={24} color="#3B82F6" />
              </View>
              <Text style={styles.itemTypeName}>Flight</Text>
              <Text style={styles.itemTypeDesc}>Add flight details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'train')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#F3F4F6' }]}>
                <Train size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.itemTypeName}>Train</Text>
              <Text style={styles.itemTypeDesc}>Add train journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'cab')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#FFFBEB' }]}>
                <Car size={24} color="#F59E0B" />
              </View>
              <Text style={styles.itemTypeName}>Cab</Text>
              <Text style={styles.itemTypeDesc}>Add cab booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'hotel')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#ECFDF5' }]}>
                <Hotel size={24} color="#10B981" />
              </View>
              <Text style={styles.itemTypeName}>Hotel</Text>
              <Text style={styles.itemTypeDesc}>Add hotel details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'base')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#FEF2F2' }]}>
                <Home size={24} color="#EF4444" />
              </View>
              <Text style={styles.itemTypeName}>Base Location</Text>
              <Text style={styles.itemTypeDesc}>Set base location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'place')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#F9FAFB' }]}>
                <MapPin size={24} color="#6B7280" />
              </View>
              <Text style={styles.itemTypeName}>Place to Visit</Text>
              <Text style={styles.itemTypeDesc}>Add tourist spot</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Day Selector - Fixed height */}
      <View style={styles.daySelectorContainer}>
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
      </View>

      {/* Day Content - Takes remaining space */}
      <View style={styles.dayContent}>
        <View style={styles.dayHeader}>
          <Calendar size={20} color="#2563EB" />
          <Text style={styles.dayTitle}>
            Day {selectedDay + 1} - {formatDate(days[selectedDay])}
          </Text>
        </View>

        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
          {dayPlans[selectedDay]?.items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTime}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTypeContainer}>
                    {getItemIcon(item.type)}
                    <Text style={[styles.itemType, { color: getItemColor(item.type) }]}>
                      {getItemTypeName(item.type)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.status === 'confirmed' ? '#DCFCE7' : '#FEF3C7' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#166534' : '#92400E' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.itemName}>{item.name}</Text>
                
                <View style={styles.itemDetail}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.itemLocation}>{item.location}</Text>
                </View>
                
                {item.duration && (
                  <View style={styles.itemDetail}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.itemDuration}>{item.duration}</Text>
                  </View>
                )}
                
                {item.cost && (
                  <View style={styles.itemDetail}>
                    <Text style={styles.itemCost}>{item.cost}</Text>
                  </View>
                )}
                
                {item.details && (
                  <Text style={styles.itemDetails}>{item.details}</Text>
                )}
              </View>
              
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.editButton}>
                  <Edit size={16} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItemFromDay(selectedDay, index)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )) || []}

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#2563EB" />
            <Text style={styles.addItemText}>Add Item to Day</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {renderAddItemModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  daySelectorContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 90, // Fixed height for day selector
  },
  daySelector: {
    flex: 1,
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
    backgroundColor: '#F9FAFB',
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
  itemsList: {
    flex: 1,
  },
  itemCard: {
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
  itemTime: {
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemType: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  itemDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  itemCost: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'column',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  removeButton: {
    padding: 8,
  },
  addItemButton: {
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
  addItemText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  itemTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTypeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemTypeDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});