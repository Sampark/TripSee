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
import { X, MapPin, Clock, DollarSign, Calendar, Star } from 'lucide-react-native';

interface PlaceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (placeData: any) => void;
  dayNumber: number;
  existingItem?: any;
}

export default function PlaceModal({ visible, onClose, onSave, dayNumber, existingItem }: PlaceModalProps) {
  const [placeData, setPlaceData] = useState({
    name: '',
    address: '',
    visitTime: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    category: '',
    rating: '',
    openingHours: '',
    bestTimeToVisit: '',
    tips: '',
  });

  const handleSave = () => {
    if (!placeData.name || !placeData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newPlace = {
      id: placeData.id || Date.now().toString(),
      type: 'place' as const,
      name: placeData.name,
      time: placeData.visitTime || 'Flexible',
      location: placeData.address,
      details: placeData.details || `${placeData.category} - ${placeData.duration}`,
      duration: placeData.duration,
      cost: placeData.cost,
      status: placeData.status,
      // Additional place-specific data
      address: placeData.address,
      category: placeData.category,
      rating: placeData.rating,
      openingHours: placeData.openingHours,
      bestTimeToVisit: placeData.bestTimeToVisit,
      tips: placeData.tips,
    };

    onSave(newPlace);
    handleClose();
  };

  const handleClose = () => {
    setPlaceData({
      name: '',
      address: '',
      visitTime: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
      category: '',
      rating: '',
      openingHours: '',
      bestTimeToVisit: '',
      tips: '',
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
          <Text style={styles.title}>Add Place to Visit - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Place Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Place Name *</Text>
              <TextInput
                style={styles.input}
                value={placeData.name}
                onChangeText={(text) => setPlaceData({ ...placeData, name: text })}
                placeholder="e.g., Tanah Lot Temple"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={styles.input}
                value={placeData.address}
                onChangeText={(text) => setPlaceData({ ...placeData, address: text })}
                placeholder="e.g., Beraban, Kediri, Tabanan, Bali"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={placeData.category}
                onChangeText={(text) => setPlaceData({ ...placeData, category: text })}
                placeholder="e.g., Temple, Beach, Museum, Restaurant"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <TextInput
                style={styles.input}
                value={placeData.rating}
                onChangeText={(text) => setPlaceData({ ...placeData, rating: text })}
                placeholder="e.g., 4.5/5"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visit Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visit Time</Text>
              <TextInput
                style={styles.input}
                value={placeData.visitTime}
                onChangeText={(text) => setPlaceData({ ...placeData, visitTime: text })}
                placeholder="e.g., 10:00 AM"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={placeData.duration}
                onChangeText={(text) => setPlaceData({ ...placeData, duration: text })}
                placeholder="e.g., 2 hours"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Best Time to Visit</Text>
              <TextInput
                style={styles.input}
                value={placeData.bestTimeToVisit}
                onChangeText={(text) => setPlaceData({ ...placeData, bestTimeToVisit: text })}
                placeholder="e.g., Sunset (6:00 PM)"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practical Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Opening Hours</Text>
              <TextInput
                style={styles.input}
                value={placeData.openingHours}
                onChangeText={(text) => setPlaceData({ ...placeData, openingHours: text })}
                placeholder="e.g., 6:00 AM - 6:00 PM"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Entry Cost</Text>
              <TextInput
                style={styles.input}
                value={placeData.cost}
                onChangeText={(text) => setPlaceData({ ...placeData, cost: text })}
                placeholder="e.g., $5"
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
                      placeData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setPlaceData({ ...placeData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      placeData.status === status && styles.statusTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tips & Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={placeData.tips}
                onChangeText={(text) => setPlaceData({ ...placeData, tips: text })}
                placeholder="e.g., Dress modestly, bring water, best for sunset photos"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Details</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={placeData.details}
                onChangeText={(text) => setPlaceData({ ...placeData, details: text })}
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
            <Text style={styles.saveButtonText}>Add Place</Text>
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
    backgroundColor: '#6B7280',
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
    backgroundColor: '#6B7280',
    borderColor: '#6B7280',
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
    backgroundColor: '#6B7280',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 