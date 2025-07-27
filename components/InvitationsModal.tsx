import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Mail, Check, X as Decline, Calendar, MapPin } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripSharing } from '../hooks/useStorage';

interface InvitationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InvitationsModal({ visible, onClose }: InvitationsModalProps) {
  const { loading, respondToInvitation, getUserInvitations } = useTripSharing();
  const [invitations, setInvitations] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      loadInvitations();
    }
  }, [visible]);

  const loadInvitations = async () => {
    try {
      const userInvitations = await getUserInvitations();
      setInvitations(userInvitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  const handleResponse = async (invitationId: string, response: 'accepted' | 'declined', tripTitle: string) => {
    try {
      await respondToInvitation(invitationId, response);
      
      Alert.alert(
        response === 'accepted' ? 'Invitation Accepted' : 'Invitation Declined',
        response === 'accepted' 
          ? `You've joined "${tripTitle}" and can now view and collaborate on the trip.`
          : `You've declined the invitation to "${tripTitle}".`
      );
      
      // Refresh invitations
      await loadInvitations();
    } catch (error) {
      Alert.alert('Error', 'Failed to respond to invitation. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Invitations</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {invitations.length === 0 ? (
            <View style={styles.emptyState}>
              <Mail size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Invitations</Text>
              <Text style={styles.emptyDescription}>
                You don't have any pending trip invitations at the moment.
              </Text>
            </View>
          ) : (
            invitations.map((invitation) => (
              <View key={invitation.id} style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <View style={styles.invitationInfo}>
                    <Text style={styles.tripTitle}>{invitation.tripTitle}</Text>
                    <Text style={styles.invitedBy}>
                      Invited by {invitation.invitedBy}
                    </Text>
                  </View>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{invitation.role}</Text>
                  </View>
                </View>

                <View style={styles.invitationDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Invited {formatDate(invitation.invitedAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.invitationActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.declineButton]}
                    onPress={() => handleResponse(invitation.id, 'declined', invitation.tripTitle)}
                    disabled={loading}
                  >
                    <Decline size={16} color="#EF4444" />
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleResponse(invitation.id, 'accepted', invitation.tripTitle)}
                    disabled={loading}
                  >
                    <Check size={16} color="#FFFFFF" />
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  invitationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invitationInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  invitedBy: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  invitationDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  declineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  declineButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});