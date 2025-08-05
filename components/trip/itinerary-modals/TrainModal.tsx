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
import { X, Train, Clock, MapPin, DollarSign, Calendar } from 'lucide-react-native';
import DateTimePicker from '@/components/common/DateTimePicker';

interface TrainModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (trainData: any) => void;
  dayNumber: number;
  defaultDate?: string;
  existingItem?: any;
}

export default function TrainModal({ visible, onClose, onSave, dayNumber, defaultDate, existingItem }: TrainModalProps) {
  const [trainData, setTrainData] = useState({
    id: '',
    name: '',
    trainNumber: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    departureStation: '',
    arrivalStation: '',
    class: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    seatNumber: '',
  });

  const calculateDuration = () => {
    if (trainData.departureDate && trainData.departureTime && trainData.arrivalDate && trainData.arrivalTime) {
      const departureDateTime = new Date(`${trainData.departureDate}T${trainData.departureTime}`);
      const arrivalDateTime = new Date(`${trainData.arrivalDate}T${trainData.arrivalTime}`);
      
      const diffInMs = arrivalDateTime.getTime() - departureDateTime.getTime();
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
        setTrainData({ ...trainData, duration: duration.trim() });
      }
    }
  };

  // Calculate duration whenever dates or times change
  React.useEffect(() => {
    calculateDuration();
  }, [trainData.departureDate, trainData.departureTime, trainData.arrivalDate, trainData.arrivalTime]);

  // Set default date when modal opens or populate with existing data when editing
  React.useEffect(() => {
    if (visible) {
      if (existingItem) {
        // Populate form with existing item data
        setTrainData({
          id: existingItem.id,
          name: existingItem.name || '',
          trainNumber: existingItem.trainNumber || '',
          departureDate: existingItem.departureDate || '',
          departureTime: existingItem.time || '',
          arrivalDate: existingItem.arrivalDate || '',
          arrivalTime: existingItem.arrivalTime || '',
          departureStation: existingItem.departureStation || '',
          arrivalStation: existingItem.arrivalStation || '',
          class: existingItem.class || '',
          duration: existingItem.duration || '',
          cost: existingItem.cost || '',
          status: existingItem.status || 'confirmed',
          details: existingItem.details || '',
          seatNumber: existingItem.seatNumber || '',
        });
      } else if (defaultDate && !trainData.departureDate && !trainData.arrivalDate) {
        // Set default date for new items
        setTrainData(prev => ({
          ...prev,
          id: Date.now().toString(),
          departureDate: defaultDate,
          arrivalDate: defaultDate
        }));
      }
    }
  }, [visible, defaultDate, existingItem]);

  // Calculate minimum arrival date based on departure date
  const getMinimumArrivalDate = () => {
    if (!trainData.departureDate) return undefined;
    return new Date(trainData.departureDate);
  };

  // Calculate minimum arrival time based on departure date and time
  const getMinimumArrivalTime = () => {
    if (!trainData.departureDate || !trainData.departureTime || !trainData.arrivalDate) return undefined;
    
    // Only apply time constraints if departure and arrival dates are the same
    if (trainData.departureDate !== trainData.arrivalDate) return undefined;
    
    const departureDate = new Date(trainData.departureDate);
    const [departureHours, departureMinutes] = trainData.departureTime.split(':').map(Number);
    departureDate.setHours(departureHours, departureMinutes);
    
    // Add 1 minute to departure time to ensure arrival is after departure
    departureDate.setMinutes(departureDate.getMinutes() + 1);
    
    return departureDate.toTimeString().slice(0, 5);
  };

  // Calculate maximum departure date based on arrival date
  const getMaximumDepartureDate = () => {
    if (!trainData.arrivalDate) return undefined;
    return new Date(trainData.arrivalDate);
  };

  // Calculate maximum departure time based on arrival date and time
  const getMaximumDepartureTime = () => {
    if (!trainData.arrivalDate || !trainData.arrivalTime || !trainData.departureDate) return undefined;
    
    // Only apply time constraints if departure and arrival dates are the same
    if (trainData.departureDate !== trainData.arrivalDate) return undefined;
    
    const arrivalDate = new Date(trainData.arrivalDate);
    const [arrivalHours, arrivalMinutes] = trainData.arrivalTime.split(':').map(Number);
    arrivalDate.setHours(arrivalHours, arrivalMinutes);
    
    // Subtract 1 minute from arrival time to ensure departure is before arrival
    arrivalDate.setMinutes(arrivalDate.getMinutes() - 1);
    
    return arrivalDate.toTimeString().slice(0, 5);
  };

  const validateDates = () => {
    if (trainData.departureDate && trainData.arrivalDate) {
      const departureDate = new Date(trainData.departureDate);
      const arrivalDate = new Date(trainData.arrivalDate);
      
      // Ensure departure date is smaller (earlier) than arrival date
      if (departureDate > arrivalDate) {
        Alert.alert('Error', 'Departure date must be earlier than arrival date');
        return false;
      }
      
      // If same date, check times
      if (departureDate.getTime() === arrivalDate.getTime() && trainData.departureTime && trainData.arrivalTime) {
        const departureTime = new Date(`2000-01-01T${trainData.departureTime}`);
        const arrivalTime = new Date(`2000-01-01T${trainData.arrivalTime}`);
        
        if (arrivalTime <= departureTime) {
          Alert.alert('Error', 'Arrival time must be after departure time for same-day journeys');
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!trainData.name || !trainData.trainNumber || !trainData.departureDate || !trainData.departureTime || !trainData.arrivalDate || !trainData.arrivalTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateDates()) {
      return;
    }

    const newTrain = {
      id: trainData.id || Date.now().toString(),
      type: 'train' as const,
      name: trainData.name,
      time: trainData.departureTime,
      location: `${trainData.departureStation} → ${trainData.arrivalStation}`,
      details: trainData.details || `${trainData.class} - ${trainData.trainNumber}`,
      duration: trainData.duration,
      cost: trainData.cost,
      status: trainData.status,
      // Additional train-specific data
      trainNumber: trainData.trainNumber,
      departureStation: trainData.departureStation,
      arrivalStation: trainData.arrivalStation,
      class: trainData.class,
      departureDate: trainData.departureDate,
      arrivalDate: trainData.arrivalDate,
      arrivalTime: trainData.arrivalTime,
      seatNumber: trainData.seatNumber,
    };

    onSave(newTrain);
    handleClose();
  };

  const handleClose = () => {
    setTrainData({
      id: '',
      name: '',
      trainNumber: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      departureStation: '',
      arrivalStation: '',
      class: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
      seatNumber: '',
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
          <Text style={styles.title}>{existingItem ? 'Edit' : 'Add'} Train - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Train Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Journey Name *</Text>
              <TextInput
                style={styles.input}
                value={trainData.name}
                onChangeText={(text) => setTrainData({ ...trainData, name: text })}
                placeholder="e.g., Train to Paris"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Train Number *</Text>
              <TextInput
                style={styles.input}
                value={trainData.trainNumber}
                onChangeText={(text) => setTrainData({ ...trainData, trainNumber: text })}
                placeholder="e.g., TGV 1234"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Class</Text>
              <TextInput
                style={styles.input}
                value={trainData.class}
                onChangeText={(text) => setTrainData({ ...trainData, class: text })}
                placeholder="e.g., First Class"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Departure</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={trainData.departureDate}
                  onChange={(value) => setTrainData({ ...trainData, departureDate: value })}
                  placeholder="Departure date"
                  label="Date *"
                  mode="date"
                  maximumDate={getMaximumDepartureDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={trainData.departureTime}
                  onChange={(value) => setTrainData({ ...trainData, departureTime: value })}
                  placeholder="Departure time"
                  label="Time *"
                  mode="time"
                  maximumTime={getMaximumDepartureTime()}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arrival</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <DateTimePicker
                  value={trainData.arrivalDate}
                  onChange={(value) => setTrainData({ ...trainData, arrivalDate: value })}
                  placeholder="Arrival date"
                  label="Date *"
                  mode="date"
                  minimumDate={getMinimumArrivalDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <DateTimePicker
                  value={trainData.arrivalTime}
                  onChange={(value) => setTrainData({ ...trainData, arrivalTime: value })}
                  placeholder="Arrival time"
                  label="Time *"
                  mode="time"
                  minimumTime={getMinimumArrivalTime()}
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
                value={trainData.duration}
                editable={false}
                placeholder="Will be calculated automatically"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stations</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Departure Station</Text>
              <TextInput
                style={styles.input}
                value={trainData.departureStation}
                onChangeText={(text) => setTrainData({ ...trainData, departureStation: text })}
                placeholder="e.g., London Euston"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Arrival Station</Text>
              <TextInput
                style={styles.input}
                value={trainData.arrivalStation}
                onChangeText={(text) => setTrainData({ ...trainData, arrivalStation: text })}
                placeholder="e.g., Paris Gare du Nord"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seat Number</Text>
              <TextInput
                style={styles.input}
                value={trainData.seatNumber}
                onChangeText={(text) => setTrainData({ ...trainData, seatNumber: text })}
                placeholder="e.g., 12A"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                value={trainData.cost}
                onChangeText={(text) => setTrainData({ ...trainData, cost: text })}
                placeholder="e.g., €120"
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
                      trainData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setTrainData({ ...trainData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      trainData.status === status && styles.statusTextActive
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
                value={trainData.details}
                onChangeText={(text) => setTrainData({ ...trainData, details: text })}
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
            <Text style={styles.saveButtonText}>Add Train</Text>
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
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 