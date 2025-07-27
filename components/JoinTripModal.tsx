import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { X, Search, Users } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrips } from '../hooks/useStorage';

interface JoinTripModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function JoinTripModal({ visible, onClose }: JoinTripModalProps) {
  const [shareId, setShareId] = useState('');
  const [loading, setLoading] = useState(false);
  const { findTripByShareId } = useTrips();
  const insets = useSafeAreaInsets();

  const handleJoinTrip = async () => {
    if (!shareId.trim()) {
      Alert.alert('Error', 'Please enter a trip ID');
      return;
    }

    try {
      setLoading(true);
      const trip = await findTripByShareId(shareId.trim());
      
      if (!trip) {
        Alert.alert('Trip Not Found', 'No trip found with this ID. Please check the ID and try again.');
        return;
      }

      Alert.alert(
        'Trip Found!',
        `Found "${trip.title}" to ${trip.destination}. This feature would normally add you as a collaborator.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Join Trip', 
            onPress: () => {
              Alert.alert('Success', 'You have joined the trip!');
              setShareId('');
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to find trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Trip</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Users size={48} color="#2563EB" />
          </View>

          <Text style={styles.title}>Join a Private Trip</Text>
          <Text style={styles.description}>
            Enter the trip ID shared by your travel partner to join their private trip and collaborate on the itinerary.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Trip ID</Text>
            <TextInput
              style={styles.textInput}
              value={shareId}
              onChangeText={setShareId}
              placeholder="Enter trip ID (e.g., trip_abc123_xyz789)"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.joinButton, loading && styles.joinButtonDisabled]}
            onPress={handleJoinTrip}
            disabled={loading}
          >
            <Search size={16} color="#FFFFFF" />
            <Text style={styles.joinButtonText}>
              {loading ? 'Searching...' : 'Find & Join Trip'}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpText}>
              • Ask your travel partner to share their trip ID{'\n'}
              • Trip IDs start with "trip_" followed by unique characters{'\n'}
              • Make sure you have the complete ID without spaces
            </Text>
          </View>
        </View>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  joinButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    marginBottom: 32,
  },
  joinButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpSection: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});