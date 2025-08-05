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
import { X, Home, Clock, MapPin, DollarSign, Calendar } from 'lucide-react-native';

interface BaseLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (baseLocationData: any) => void;
  dayNumber: number;
  existingItem?: any;
}

export default function BaseLocationModal({ visible, onClose, onSave, dayNumber, existingItem }: BaseLocationModalProps) {
  const [baseLocationData, setBaseLocationData] = useState({
    name: '',
    address: '',
    checkInTime: '',
    checkOutTime: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    accommodationType: '',
    amenities: '',
    contactPerson: '',
    phoneNumber: '',
  });

  const handleSave = () => {
    if (!baseLocationData.name || !baseLocationData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newBaseLocation = {
      id: baseLocationData.id || Date.now().toString(),
      type: 'base' as const,
      name: baseLocationData.name,
      time: baseLocationData.checkInTime || 'All Day',
      location: baseLocationData.address,
      details: baseLocationData.details || `${baseLocationData.accommodationType} - ${baseLocationData.duration}`,
      duration: baseLocationData.duration,
      cost: baseLocationData.cost,
      status: baseLocationData.status,
      // Additional base location-specific data
      address: baseLocationData.address,
      accommodationType: baseLocationData.accommodationType,
      checkInTime: baseLocationData.checkInTime,
      checkOutTime: baseLocationData.checkOutTime,
      amenities: baseLocationData.amenities,
      contactPerson: baseLocationData.contactPerson,
      phoneNumber: baseLocationData.phoneNumber,
    };

    onSave(newBaseLocation);
    handleClose();
  };

  const handleClose = () => {
    setBaseLocationData({
      name: '',
      address: '',
      checkInTime: '',
      checkOutTime: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
      accommodationType: '',
      amenities: '',
      contactPerson: '',
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
          <Text style={styles.title}>Add Base Location - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Name *</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.name}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, name: text })}
                placeholder="e.g., Beach House Villa"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.address}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, address: text })}
                placeholder="e.g., 123 Beach Road, Kuta, Bali"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Accommodation Type</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.accommodationType}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, accommodationType: text })}
                placeholder="e.g., Villa, Apartment, Guesthouse"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timing</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Check-in Time</Text>
                <TextInput
                  style={styles.input}
                  value={baseLocationData.checkInTime}
                  onChangeText={(text) => setBaseLocationData({ ...baseLocationData, checkInTime: text })}
                  placeholder="02:00 PM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Check-out Time</Text>
                <TextInput
                  style={styles.input}
                  value={baseLocationData.checkOutTime}
                  onChangeText={(text) => setBaseLocationData({ ...baseLocationData, checkOutTime: text })}
                  placeholder="11:00 AM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.duration}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, duration: text })}
                placeholder="e.g., 3 nights"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.contactPerson}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, contactPerson: text })}
                placeholder="e.g., Maria (Host)"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.phoneNumber}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, phoneNumber: text })}
                placeholder="e.g., +62 812 3456 7890"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amenities</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.amenities}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, amenities: text })}
                placeholder="e.g., WiFi, Pool, Kitchen, Parking"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                value={baseLocationData.cost}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, cost: text })}
                placeholder="e.g., $150/night"
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
                      baseLocationData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setBaseLocationData({ ...baseLocationData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      baseLocationData.status === status && styles.statusTextActive
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
                value={baseLocationData.details}
                onChangeText={(text) => setBaseLocationData({ ...baseLocationData, details: text })}
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
            <Text style={styles.saveButtonText}>Add Base Location</Text>
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
    backgroundColor: '#EF4444',
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
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
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
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 