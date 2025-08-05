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
import { X } from 'lucide-react-native';

interface OthersModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (othersData: any) => void;
  dayNumber: number;
  existingItem?: any;
}

export default function OthersModal({ visible, onClose, onSave, dayNumber, existingItem }: OthersModalProps) {
  const [othersData, setOthersData] = useState({
    id: '',
    name: '',
    category: '',
    time: '',
    location: '',
    duration: '',
    cost: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
    details: '',
    priority: '',
    contactInfo: '',
    notes: '',
  });

  const handleSave = () => {
    if (!othersData.name) {
      Alert.alert('Error', 'Please fill in the activity name');
      return;
    }

    const newOthers = {
      id: othersData.id || Date.now().toString(),
      type: 'others' as const,
      name: othersData.name,
      time: othersData.time || 'Flexible',
      location: othersData.location,
      details: othersData.details || `${othersData.category} - ${othersData.duration}`,
      duration: othersData.duration,
      cost: othersData.cost,
      status: othersData.status,
      // Additional others-specific data
      category: othersData.category,
      priority: othersData.priority,
      contactInfo: othersData.contactInfo,
      notes: othersData.notes,
    };

    onSave(newOthers);
    handleClose();
  };

  const handleClose = () => {
    setOthersData({
      id: '',
      name: '',
      category: '',
      time: '',
      location: '',
      duration: '',
      cost: '',
      status: 'confirmed',
      details: '',
      priority: '',
      contactInfo: '',
      notes: '',
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
          <Text style={styles.title}>Add Other Activity - Day {dayNumber}</Text>
          <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
            <Text style={styles.headerSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Name *</Text>
              <TextInput
                style={styles.input}
                value={othersData.name}
                onChangeText={(text) => setOthersData({ ...othersData, name: text })}
                placeholder="e.g., Spa Treatment, Cooking Class"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={othersData.category}
                onChangeText={(text) => setOthersData({ ...othersData, category: text })}
                placeholder="e.g., Wellness, Entertainment, Shopping"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <TextInput
                style={styles.input}
                value={othersData.priority}
                onChangeText={(text) => setOthersData({ ...othersData, priority: text })}
                placeholder="e.g., High, Medium, Low"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule & Location</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={othersData.time}
                onChangeText={(text) => setOthersData({ ...othersData, time: text })}
                placeholder="e.g., 10:00 AM"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={othersData.duration}
                onChangeText={(text) => setOthersData({ ...othersData, duration: text })}
                placeholder="e.g., 2 hours"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={othersData.location}
                onChangeText={(text) => setOthersData({ ...othersData, location: text })}
                placeholder="e.g., Spa Center, Shopping Mall"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Info</Text>
              <TextInput
                style={styles.input}
                value={othersData.contactInfo}
                onChangeText={(text) => setOthersData({ ...othersData, contactInfo: text })}
                placeholder="e.g., Phone number, email, or contact person"
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
                value={othersData.cost}
                onChangeText={(text) => setOthersData({ ...othersData, cost: text })}
                placeholder="e.g., $50"
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
                      othersData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setOthersData({ ...othersData, status })}
                  >
                    <Text style={[
                      styles.statusText,
                      othersData.status === status && styles.statusTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={othersData.details}
                onChangeText={(text) => setOthersData({ ...othersData, details: text })}
                placeholder="Describe the activity..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={othersData.notes}
                onChangeText={(text) => setOthersData({ ...othersData, notes: text })}
                placeholder="Any additional notes or reminders..."
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
            <Text style={styles.saveButtonText}>Add Activity</Text>
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
    backgroundColor: '#059669',
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
    backgroundColor: '#059669',
    borderColor: '#059669',
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
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 