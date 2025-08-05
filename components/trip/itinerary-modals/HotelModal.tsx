import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Hotel, Clock, MapPin, DollarSign, Calendar, Star } from 'lucide-react-native';
import DateTimePicker from '@/components/common/DateTimePicker';

interface HotelModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hotelData: any) => void;
  dayNumber: number;
  defaultDate?: string;
  existingItem?: any;
}

export default function HotelModal({ visible, onClose, onSave, dayNumber, defaultDate, existingItem }: HotelModalProps) {
  const [hotelData, setHotelData] = useState({
    id: '',
    name: '',
    checkInDate: '',
    checkInTime: '',
    checkOutDate: '',
    checkOutTime: '',
    address: '',
    roomType: '',
    duration: '',
    cost: '',
    priceType: 'per_night' as 'total' | 'per_night',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    rating: '',
  });

  const calculateDuration = () => {
    if (hotelData.checkInDate && hotelData.checkOutDate) {
      const checkInDate = new Date(hotelData.checkInDate);
      const checkOutDate = new Date(hotelData.checkOutDate);
      
      const diffInMs = checkOutDate.getTime() - checkInDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays > 0) {
        const duration = diffInDays === 1 ? '1 night' : `${diffInDays} nights`;
        setHotelData({ ...hotelData, duration });
      } else if (diffInDays === 0) {
        setHotelData({ ...hotelData, duration: 'Same day' });
      }
    }
  };

  // Calculate duration whenever check-in or check-out dates change
  React.useEffect(() => {
    calculateDuration();
  }, [hotelData.checkInDate, hotelData.checkOutDate]);

  // Set default date when modal opens or populate with existing data when editing
  React.useEffect(() => {
    if (visible) {
      if (existingItem) {
        // Populate form with existing item data
        setHotelData({
          id: existingItem.id,
          name: existingItem.name || '',
          checkInDate: existingItem.checkInDate || '',
          checkInTime: existingItem.time || '',
          checkOutDate: existingItem.checkOutDate || '',
          checkOutTime: existingItem.checkOutTime || '',
          address: existingItem.location || '',
          roomType: existingItem.roomType || '',
          duration: existingItem.duration || '',
          cost: existingItem.cost || '',
          priceType: existingItem.priceType || 'per_night',
          status: existingItem.status || 'confirmed',
          details: existingItem.details || '',
          rating: existingItem.rating || '',
        });
      } else if (defaultDate && !hotelData.checkInDate && !hotelData.checkOutDate) {
        // Set default date for new items
        setHotelData(prev => ({
          ...prev,
          id: Date.now().toString(),
          checkInDate: defaultDate,
          checkOutDate: defaultDate
        }));
      }
    }
  }, [visible, defaultDate, existingItem]);

  // Calculate minimum check-out date based on check-in date
  const getMinimumCheckOutDate = () => {
    if (!hotelData.checkInDate) return undefined;
    return new Date(hotelData.checkInDate);
  };

  // Calculate minimum check-out time based on check-in date and time
  const getMinimumCheckOutTime = () => {
    if (!hotelData.checkInDate || !hotelData.checkInTime || !hotelData.checkOutDate) return undefined;
    
    // Only apply time constraints if check-in and check-out dates are the same
    if (hotelData.checkInDate !== hotelData.checkOutDate) return undefined;
    
    const checkInDate = new Date(hotelData.checkInDate);
    const [checkInHours, checkInMinutes] = hotelData.checkInTime.split(':').map(Number);
    checkInDate.setHours(checkInHours, checkInMinutes);
    
    // Add 1 minute to check-in time to ensure check-out is after check-in
    checkInDate.setMinutes(checkInDate.getMinutes() + 1);
    
    return checkInDate.toTimeString().slice(0, 5);
  };

  // Calculate maximum check-in date based on check-out date
  const getMaximumCheckInDate = () => {
    if (!hotelData.checkOutDate) return undefined;
    return new Date(hotelData.checkOutDate);
  };

  // Calculate maximum check-in time based on check-out date and time
  const getMaximumCheckInTime = () => {
    if (!hotelData.checkOutDate || !hotelData.checkOutTime || !hotelData.checkInDate) return undefined;
    
    // Only apply time constraints if check-in and check-out dates are the same
    if (hotelData.checkInDate !== hotelData.checkOutDate) return undefined;
    
    const checkOutDate = new Date(hotelData.checkOutDate);
    const [checkOutHours, checkOutMinutes] = hotelData.checkOutTime.split(':').map(Number);
    checkOutDate.setHours(checkOutHours, checkOutMinutes);
    
    // Subtract 1 minute from check-out time to ensure check-in is before check-out
    checkOutDate.setMinutes(checkOutDate.getMinutes() - 1);
    
    return checkOutDate.toTimeString().slice(0, 5);
  };

  const validateDates = () => {
    if (hotelData.checkInDate && hotelData.checkOutDate) {
      const checkInDate = new Date(hotelData.checkInDate);
      const checkOutDate = new Date(hotelData.checkOutDate);
      
      // Ensure check-in date is smaller (earlier) than check-out date
      if (checkInDate > checkOutDate) {
        Alert.alert('Error', 'Check-in date must be earlier than check-out date');
        return false;
      }
      
      // If same date, check times
      if (checkInDate.getTime() === checkOutDate.getTime() && hotelData.checkInTime && hotelData.checkOutTime) {
        const checkInTime = new Date(`2000-01-01T${hotelData.checkInTime}`);
        const checkOutTime = new Date(`2000-01-01T${hotelData.checkOutTime}`);
        
        if (checkOutTime <= checkInTime) {
          Alert.alert('Error', 'Check-out time must be after check-in time for same-day stays');
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    console.log('HotelModal handleSave called');
    console.log('hotelData:', hotelData);
    
    if (!hotelData.name || !hotelData.checkInDate || !hotelData.checkInTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateDates()) {
      console.log('Date validation failed');
      return;
    }

    const newHotel = {
      id: hotelData.id || Date.now().toString(),
      type: 'hotel' as const,
      name: hotelData.name,
      time: hotelData.checkInTime,
      location: hotelData.address,
      details: hotelData.details || `${hotelData.roomType} - ${hotelData.duration}`,
      duration: hotelData.duration,
      cost: hotelData.cost,
      status: hotelData.status,
      // Additional hotel-specific data
      roomType: hotelData.roomType,
      checkInDate: hotelData.checkInDate,
      checkOutDate: hotelData.checkOutDate,
      checkOutTime: hotelData.checkOutTime,
      rating: hotelData.rating,
      priceType: hotelData.priceType,
    };

    console.log('Calling onSave with:', newHotel);
    onSave(newHotel);
    handleClose();
  };

  const handleClose = () => {
    setHotelData({
      id: '',
      name: '',
      checkInDate: '',
      checkInTime: '',
      checkOutDate: '',
      checkOutTime: '',
      address: '',
      roomType: '',
      duration: '',
      cost: '',
      priceType: 'per_night',
      status: 'confirmed',
      details: '',
      rating: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>{existingItem ? 'Edit' : 'Add'} Hotel - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hotel Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hotel Name *</Text>
              <TextInput
                style={styles.input}
                value={hotelData.name}
                onChangeText={(text) => setHotelData({ ...hotelData, name: text })}
                placeholder="e.g., Bali Resort & Spa"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Type</Text>
              <TextInput
                style={styles.input}
                value={hotelData.roomType}
                onChangeText={(text) => setHotelData({ ...hotelData, roomType: text })}
                placeholder="e.g., Ocean View Room"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <TextInput
                style={styles.input}
                value={hotelData.rating}
                onChangeText={(text) => setHotelData({ ...hotelData, rating: text })}
                placeholder="e.g., 4.5 stars"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-in</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={hotelData.checkInDate}
                  onChange={(value) => setHotelData({ ...hotelData, checkInDate: value })}
                  placeholder="Check-in date"
                  label="Date *"
                  mode="date"
                  maximumDate={getMaximumCheckInDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={hotelData.checkInTime}
                  onChange={(value) => setHotelData({ ...hotelData, checkInTime: value })}
                  placeholder="Check-in time"
                  label="Time *"
                  mode="time"
                  maximumTime={getMaximumCheckInTime()}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-out</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={hotelData.checkOutDate}
                  onChange={(value) => setHotelData({ ...hotelData, checkOutDate: value })}
                  placeholder="Check-out date"
                  label="Date"
                  mode="date"
                  minimumDate={getMinimumCheckOutDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={hotelData.checkOutTime}
                  onChange={(value) => setHotelData({ ...hotelData, checkOutTime: value })}
                  placeholder="Check-out time"
                  label="Time"
                  mode="time"
                  minimumTime={getMinimumCheckOutTime()}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (Auto-calculated)</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={hotelData.duration}
                editable={false}
                placeholder="Will be calculated automatically"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={hotelData.address}
                onChangeText={(text) => setHotelData({ ...hotelData, address: text })}
                placeholder="e.g., Kuta Beach, Bali"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Cost</Text>
                <TextInput
                  style={styles.input}
                  value={hotelData.cost}
                  onChangeText={(text) => setHotelData({ ...hotelData, cost: text })}
                  placeholder="e.g., $200"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Price Type</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    // Show dropdown options
                    Alert.alert(
                      'Select Price Type',
                      '',
                      [
                        {
                          text: 'Total',
                          onPress: () => setHotelData({ ...hotelData, priceType: 'total' })
                        },
                        {
                          text: 'Per Night',
                          onPress: () => setHotelData({ ...hotelData, priceType: 'per_night' })
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {hotelData.priceType === 'total' ? 'Total' : 'Per Night'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {(['confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      hotelData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setHotelData({ ...hotelData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      hotelData.status === status && styles.statusTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={hotelData.details}
                onChangeText={(text) => setHotelData({ ...hotelData, details: text })}
                placeholder="Any additional details..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add Hotel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSaveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  headerSaveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 