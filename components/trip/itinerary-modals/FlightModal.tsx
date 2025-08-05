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
import { X, Plane, Clock, MapPin, DollarSign, Calendar } from 'lucide-react-native';
import DateTimePicker from '@/components/common/DateTimePicker';

interface FlightModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (flightData: any) => void;
  dayNumber: number;
  defaultDate?: string;
  existingItem?: any;
}

export default function FlightModal({ visible, onClose, onSave, dayNumber, defaultDate, existingItem }: FlightModalProps) {
  const [flightData, setFlightData] = useState({
    id: '',
    name: '',
    flightNumber: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    departureAirport: '',
    arrivalAirport: '',
    airline: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
  });

  const calculateDuration = () => {
    if (flightData.departureDate && flightData.departureTime && flightData.arrivalDate && flightData.arrivalTime) {
      const departureDateTime = new Date(`${flightData.departureDate}T${flightData.departureTime}`);
      const arrivalDateTime = new Date(`${flightData.arrivalDate}T${flightData.arrivalTime}`);
      
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
        setFlightData({ ...flightData, duration: duration.trim() });
      }
    }
  };

  // Calculate duration whenever dates or times change
  React.useEffect(() => {
    calculateDuration();
  }, [flightData.departureDate, flightData.departureTime, flightData.arrivalDate, flightData.arrivalTime]);

  // Set default date when modal opens or populate with existing data when editing
  React.useEffect(() => {
    if (visible) {
      if (existingItem) {
        // Populate form with existing item data
        setFlightData({
          id: existingItem.id,
          name: existingItem.name || '',
          flightNumber: existingItem.flightNumber || '',
          departureDate: existingItem.departureDate || '',
          departureTime: existingItem.time || '',
          arrivalDate: existingItem.arrivalDate || '',
          arrivalTime: existingItem.arrivalTime || '',
          departureAirport: existingItem.departureAirport || '',
          arrivalAirport: existingItem.arrivalAirport || '',
          airline: existingItem.airline || '',
          duration: existingItem.duration || '',
          cost: existingItem.cost || '',
          status: existingItem.status || 'confirmed',
          details: existingItem.details || '',
        });
      } else if (defaultDate && !flightData.departureDate && !flightData.arrivalDate) {
        // Set default date for new items
        setFlightData(prev => ({
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
    if (!flightData.departureDate) return undefined;
    return new Date(flightData.departureDate);
  };

  // Calculate minimum arrival time based on departure date and time
  const getMinimumArrivalTime = () => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate) return undefined;
    
    // Only apply time constraints if departure and arrival dates are the same
    if (flightData.departureDate !== flightData.arrivalDate) return undefined;
    
    const departureDate = new Date(flightData.departureDate);
    const [departureHours, departureMinutes] = flightData.departureTime.split(':').map(Number);
    departureDate.setHours(departureHours, departureMinutes);
    
    // Add 1 minute to departure time to ensure arrival is after departure
    departureDate.setMinutes(departureDate.getMinutes() + 1);
    
    return departureDate.toTimeString().slice(0, 5);
  };

  // Calculate maximum departure date based on arrival date
  const getMaximumDepartureDate = () => {
    if (!flightData.arrivalDate) return undefined;
    return new Date(flightData.arrivalDate);
  };

  // Calculate maximum departure time based on arrival date and time
  const getMaximumDepartureTime = () => {
    if (!flightData.arrivalDate || !flightData.arrivalTime || !flightData.departureDate) return undefined;
    
    // Only apply time constraints if departure and arrival dates are the same
    if (flightData.departureDate !== flightData.arrivalDate) return undefined;
    
    const arrivalDate = new Date(flightData.arrivalDate);
    const [arrivalHours, arrivalMinutes] = flightData.arrivalTime.split(':').map(Number);
    arrivalDate.setHours(arrivalHours, arrivalMinutes);
    
    // Subtract 1 minute from arrival time to ensure departure is before arrival
    arrivalDate.setMinutes(arrivalDate.getMinutes() - 1);
    
    return arrivalDate.toTimeString().slice(0, 5);
  };

  const validateDates = () => {
    if (flightData.departureDate && flightData.arrivalDate) {
      const departureDate = new Date(flightData.departureDate);
      const arrivalDate = new Date(flightData.arrivalDate);
      
      // Ensure departure date is smaller (earlier) than arrival date
      if (departureDate > arrivalDate) {
        Alert.alert('Error', 'Departure date must be earlier than arrival date');
        return false;
      }
      
      // If same date, check times
      if (departureDate.getTime() === arrivalDate.getTime() && flightData.departureTime && flightData.arrivalTime) {
        const departureTime = new Date(`2000-01-01T${flightData.departureTime}`);
        const arrivalTime = new Date(`2000-01-01T${flightData.arrivalTime}`);
        
        if (arrivalTime <= departureTime) {
          Alert.alert('Error', 'Arrival time must be after departure time for same-day flights');
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!flightData.name || !flightData.flightNumber || !flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateDates()) {
      return;
    }

    const newFlight = {
      id: flightData.id || Date.now().toString(),
      type: 'flight' as const,
      name: flightData.name,
      time: flightData.departureTime,
      location: `${flightData.departureAirport} → ${flightData.arrivalAirport}`,
      details: flightData.details || `${flightData.airline} ${flightData.flightNumber}`,
      duration: flightData.duration,
      cost: flightData.cost,
      status: flightData.status,
      // Additional flight-specific data
      flightNumber: flightData.flightNumber,
      departureAirport: flightData.departureAirport,
      arrivalAirport: flightData.arrivalAirport,
      airline: flightData.airline,
      departureDate: flightData.departureDate,
      arrivalDate: flightData.arrivalDate,
      arrivalTime: flightData.arrivalTime,
    };

    onSave(newFlight);
    handleClose();
  };

  const handleClose = () => {
    setFlightData({
      id: '',
      name: '',
      flightNumber: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      departureAirport: '',
      arrivalAirport: '',
      airline: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
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
          <Text style={styles.title}>{existingItem ? 'Edit' : 'Add'} Flight - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flight Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Flight Name *</Text>
              <TextInput
                style={styles.input}
                value={flightData.name}
                onChangeText={(text) => setFlightData({ ...flightData, name: text })}
                placeholder="e.g., Flight to Bali"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Flight Number *</Text>
              <TextInput
                style={styles.input}
                value={flightData.flightNumber}
                onChangeText={(text) => setFlightData({ ...flightData, flightNumber: text })}
                placeholder="e.g., BA123"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Airline</Text>
              <TextInput
                style={styles.input}
                value={flightData.airline}
                onChangeText={(text) => setFlightData({ ...flightData, airline: text })}
                placeholder="e.g., British Airways"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Departure</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginBottom: 0}]}>
                <DateTimePicker
                  value={flightData.departureDate}
                  onChange={(value) => setFlightData({ ...flightData, departureDate: value })}
                  placeholder="Departure date"
                  label="Date *"
                  mode="date"
                  maximumDate={getMaximumDepartureDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8, marginBottom: 0 }]}>
                <DateTimePicker
                  value={flightData.departureTime}
                  onChange={(value) => setFlightData({ ...flightData, departureTime: value })}
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
              <View style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}>
                <DateTimePicker
                  value={flightData.arrivalDate}
                  onChange={(value) => setFlightData({ ...flightData, arrivalDate: value })}
                  placeholder="Arrival date"
                  label="Date *"
                  mode="date"
                  minimumDate={getMinimumArrivalDate()}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8, marginBottom: 0 }]}>
                <DateTimePicker
                  value={flightData.arrivalTime}
                  onChange={(value) => setFlightData({ ...flightData, arrivalTime: value })}
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
                value={flightData.duration}
                editable={false}
                placeholder="Will be calculated automatically"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Airports</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Departure Airport</Text>
              <TextInput
                style={styles.input}
                value={flightData.departureAirport}
                onChangeText={(text) => setFlightData({ ...flightData, departureAirport: text })}
                placeholder="e.g., LHR"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Arrival Airport</Text>
              <TextInput
                style={styles.input}
                value={flightData.arrivalAirport}
                onChangeText={(text) => setFlightData({ ...flightData, arrivalAirport: text })}
                placeholder="e.g., DPS"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                value={flightData.cost}
                onChangeText={(text) => setFlightData({ ...flightData, cost: text })}
                placeholder="e.g., $450"
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
                      flightData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setFlightData({ ...flightData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      flightData.status === status && styles.statusTextActive
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
                value={flightData.details}
                onChangeText={(text) => setFlightData({ ...flightData, details: text })}
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
            <Text style={styles.saveButtonText}>Add Flight</Text>
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
    backgroundColor: '#2563EB',
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
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
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
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 