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
import { X, Car, Clock, MapPin, DollarSign, Calendar } from 'lucide-react-native';
import DateTimePicker from '@/components/common/DateTimePicker';

interface CabModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (cabData: any) => void;
  dayNumber: number;
  defaultDate?: string;
  existingItem?: any;
}

export default function CabModal({ visible, onClose, onSave, dayNumber, defaultDate, existingItem }: CabModalProps) {
  const [cabData, setCabData] = useState({
    id: '',
    name: '',
    pickupDate: '',
    pickupTime: '',
    dropDate: '',
    dropTime: '',
    pickupLocation: '',
    dropLocation: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    cabType: '',
    driverName: '',
    phoneNumber: '',
  });

  // Calculate minimum drop-off date based on pickup date
  const getMinimumDropDate = () => {
    if (!cabData.pickupDate) return undefined;
    return new Date(cabData.pickupDate);
  };

  // Calculate minimum drop-off time based on pickup date and time
  const getMinimumDropTime = () => {
    if (!cabData.pickupDate || !cabData.pickupTime || !cabData.dropDate) return undefined;
    
    // Only apply time constraints if pickup and drop-off dates are the same
    if (cabData.pickupDate !== cabData.dropDate) return undefined;
    
    const pickupDate = new Date(cabData.pickupDate);
    const [pickupHours, pickupMinutes] = cabData.pickupTime.split(':').map(Number);
    pickupDate.setHours(pickupHours, pickupMinutes);
    
    // Add 1 minute to pickup time to ensure drop-off is after pickup
    pickupDate.setMinutes(pickupDate.getMinutes() + 1);
    
    return pickupDate.toTimeString().slice(0, 5);
  };

  // Calculate maximum pickup date based on drop-off date
  const getMaximumPickupDate = () => {
    if (!cabData.dropDate) return undefined;
    return new Date(cabData.dropDate);
  };

  // Calculate maximum pickup time based on drop-off date and time
  const getMaximumPickupTime = () => {
    if (!cabData.dropDate || !cabData.dropTime || !cabData.pickupDate) return undefined;
    
    // Only apply time constraints if pickup and drop-off dates are the same
    if (cabData.pickupDate !== cabData.dropDate) return undefined;
    
    const dropDate = new Date(cabData.dropDate);
    const [dropHours, dropMinutes] = cabData.dropTime.split(':').map(Number);
    dropDate.setHours(dropHours, dropMinutes);
    
    // Subtract 1 minute from drop-off time to ensure pickup is before drop-off
    dropDate.setMinutes(dropDate.getMinutes() - 1);
    
    return dropDate.toTimeString().slice(0, 5);
  };

  const calculateDuration = () => {
    if (cabData.pickupDate && cabData.pickupTime && cabData.dropDate && cabData.dropTime) {
      const pickupDateTime = new Date(`${cabData.pickupDate}T${cabData.pickupTime}`);
      const dropDateTime = new Date(`${cabData.dropDate}T${cabData.dropTime}`);
      
      const diffInMs = dropDateTime.getTime() - pickupDateTime.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let duration = '';
      if (diffInHours > 0) {
        duration += `${diffInHours} Hour${diffInHours > 1 ? 's' : ''}`;
      }
      if (diffInMinutes > 0) {
        if (duration) duration += ' ';
        duration += `${diffInMinutes} Minute${diffInMinutes > 1 ? 's' : ''}`;
      }
      
      if (duration.trim()) {
        setCabData({ ...cabData, duration: duration.trim() });
      }
    }
  };

  // Calculate duration whenever dates or times change
  React.useEffect(() => {
    calculateDuration();
  }, [cabData.pickupDate, cabData.pickupTime, cabData.dropDate, cabData.dropTime]);

  const validateDates = () => {
    if (cabData.pickupDate && cabData.dropDate) {
      const pickupDate = new Date(cabData.pickupDate);
      const dropDate = new Date(cabData.dropDate);
      
      // Ensure pickup date is smaller (earlier) than drop-off date
      if (pickupDate > dropDate) {
        Alert.alert('Error', 'Pickup date must be earlier than drop-off date');
        return false;
      }
      
      // If same date, check times
      if (pickupDate.getTime() === dropDate.getTime() && cabData.pickupTime && cabData.dropTime) {
        const pickupTime = new Date(`2000-01-01T${cabData.pickupTime}`);
        const dropTime = new Date(`2000-01-01T${cabData.dropTime}`);
        
        if (dropTime <= pickupTime) {
          Alert.alert('Error', 'Drop-off time must be after pickup time for same-day rides');
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!cabData.name || !cabData.pickupDate || !cabData.pickupTime || !cabData.pickupLocation || !cabData.dropLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateDates()) {
      return;
    }

    const newCab = {
      id: cabData.id || Date.now().toString(),
      type: 'cab' as const,
      name: cabData.name,
      time: cabData.pickupTime,
      location: `${cabData.pickupLocation} → ${cabData.dropLocation}`,
      details: cabData.details || `${cabData.cabType} - ${cabData.driverName}`,
      duration: cabData.duration,
      cost: cabData.cost,
      status: cabData.status,
      // Additional cab-specific data
      pickupDate: cabData.pickupDate,
      dropDate: cabData.dropDate,
      dropTime: cabData.dropTime,
      pickupLocation: cabData.pickupLocation,
      dropLocation: cabData.dropLocation,
      cabType: cabData.cabType,
      driverName: cabData.driverName,
      phoneNumber: cabData.phoneNumber,
    };

    onSave(newCab);
    handleClose();
  };

  // Set default date when modal opens or populate with existing data when editing
  React.useEffect(() => {
    if (visible) {
      if (existingItem) {
        // Populate form with existing item data
        setCabData({
          id: existingItem.id,
          name: existingItem.name || '',
          pickupDate: existingItem.departureDate || '',
          pickupTime: existingItem.time || '',
          dropDate: existingItem.arrivalDate || '',
          dropTime: existingItem.arrivalTime || '',
          pickupLocation: existingItem.departureStation || '',
          dropLocation: existingItem.arrivalStation || '',
          duration: existingItem.duration || '',
          cost: existingItem.cost || '',
          status: existingItem.status || 'confirmed',
          details: existingItem.details || '',
          cabType: existingItem.cabType || '',
          driverName: existingItem.driverName || '',
          phoneNumber: existingItem.phoneNumber || '',
        });
      } else if (defaultDate && !cabData.pickupDate && !cabData.dropDate) {
        // Set default date for new items
        setCabData(prev => ({
          ...prev,
          id: Date.now().toString(),
          pickupDate: defaultDate,
          dropDate: defaultDate
        }));
      }
    }
  }, [visible, defaultDate, existingItem]);

  const handleClose = () => {
    setCabData({
      id: '',
      name: '',
      pickupDate: '',
      pickupTime: '',
      dropDate: '',
      dropTime: '',
      pickupLocation: '',
      dropLocation: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
      cabType: '',
      driverName: '',
      phoneNumber: '',
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
          <Text style={styles.title}>{existingItem ? 'Edit' : 'Add'} Cab - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cab Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Journey Name *</Text>
              <TextInput
                style={styles.input}
                value={cabData.name}
                onChangeText={(text) => setCabData({ ...cabData, name: text })}
                placeholder="e.g., Airport Transfer"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cab Type</Text>
              <TextInput
                style={styles.input}
                value={cabData.cabType}
                onChangeText={(text) => setCabData({ ...cabData, cabType: text })}
                placeholder="e.g., Sedan, SUV, Luxury"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={cabData.pickupDate}
                  onChange={(value) => setCabData({ ...cabData, pickupDate: value })}
                  placeholder="Pickup date"
                  label="Date *"
                  mode="date"
                  maximumDate={getMaximumPickupDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={cabData.pickupTime}
                  onChange={(value) => setCabData({ ...cabData, pickupTime: value })}
                  placeholder="Pickup time"
                  label="Time *"
                  mode="time"
                  maximumTime={getMaximumPickupTime()}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drop-off</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={cabData.dropDate}
                  onChange={(value) => setCabData({ ...cabData, dropDate: value })}
                  placeholder="Drop-off date"
                  label="Date"
                  mode="date"
                  minimumDate={getMinimumDropDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={cabData.dropTime}
                  onChange={(value) => setCabData({ ...cabData, dropTime: value })}
                  placeholder="Drop-off time"
                  label="Time"
                  mode="time"
                  minimumTime={getMinimumDropTime()}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location *</Text>
              <TextInput
                style={styles.input}
                value={cabData.pickupLocation}
                onChangeText={(text) => setCabData({ ...cabData, pickupLocation: text })}
                placeholder="e.g., Hotel Lobby"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Drop Location *</Text>
              <TextInput
                style={styles.input}
                value={cabData.dropLocation}
                onChangeText={(text) => setCabData({ ...cabData, dropLocation: text })}
                placeholder="e.g., Airport Terminal 1"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={cabData.duration}
                onChangeText={(text) => setCabData({ ...cabData, duration: text })}
                placeholder="e.g., 45 minutes"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Driver Name</Text>
              <TextInput
                style={styles.input}
                value={cabData.driverName}
                onChangeText={(text) => setCabData({ ...cabData, driverName: text })}
                placeholder="e.g., John Smith"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={cabData.phoneNumber}
                onChangeText={(text) => setCabData({ ...cabData, phoneNumber: text })}
                placeholder="e.g., +1 234 567 8900"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                value={cabData.cost}
                onChangeText={(text) => setCabData({ ...cabData, cost: text })}
                placeholder="e.g., $25"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {(['confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      cabData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setCabData({ ...cabData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      cabData.status === status && styles.statusTextActive
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
                value={cabData.details}
                onChangeText={(text) => setCabData({ ...cabData, details: text })}
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
            <Text style={styles.saveButtonText}>Add Cab</Text>
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
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
    backgroundColor: '#F59E0B',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 