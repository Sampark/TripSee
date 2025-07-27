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
  Share,
} from 'react-native';
import { X, Copy, Mail, Users, Eye, CreditCard as Edit, Shield, Link } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripSharing } from '../hooks/useStorage';

interface TripSharingModalProps {
  visible: boolean;
  trip: any;
  onClose: () => void;
}

export default function TripSharingModal({ visible, trip, onClose }: TripSharingModalProps) {
  const { loading, sendInvitation } = useTripSharing();
  const [activeTab, setActiveTab] = useState<'share' | 'collaborators' | 'settings'>('share');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const insets = useSafeAreaInsets();

  const handleCopyShareId = async () => {
    if (trip.shareId) {
      // In a real app, you'd use Clipboard API
      Alert.alert(
        'Share ID Copied',
        `Trip ID: ${trip.shareId}\n\nShare this ID with others so they can join your trip.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleShareTrip = async () => {
    try {
      const shareMessage = trip.visibility === 'public' 
        ? `Check out my trip: ${trip.title} to ${trip.destination}!`
        : `Join my private trip: ${trip.title}\nTrip ID: ${trip.shareId}`;
        
      await Share.share({
        message: shareMessage,
        title: `${trip.title} - Travel Plan`,
      });
    } catch (error) {
      console.error('Error sharing trip:', error);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!inviteEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await sendInvitation(trip.id, inviteEmail.trim(), inviteRole);
      Alert.alert(
        'Invitation Sent',
        `An invitation has been sent to ${inviteEmail} with ${inviteRole} access.`
      );
      setInviteEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation. Please try again.');
    }
  };

  const renderShareTab = () => (
    <ScrollView style={styles.tabContent}>
      {trip.visibility === 'private' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Link size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Share Trip ID</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Share this unique ID with others to give them access to your private trip.
          </Text>
          
          <View style={styles.shareIdContainer}>
            <Text style={styles.shareId}>{trip.shareId}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyShareId}>
              <Copy size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Mail size={20} color="#10B981" />
          <Text style={styles.sectionTitle}>Invite by Email</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Send a direct invitation to specific people via email.
        </Text>

        <View style={styles.inviteForm}>
          <TextInput
            style={styles.emailInput}
            value={inviteEmail}
            onChangeText={setInviteEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.roleSelector}>
            <Text style={styles.roleLabel}>Access Level:</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  inviteRole === 'viewer' && styles.roleOptionActive
                ]}
                onPress={() => setInviteRole('viewer')}
              >
                <Eye size={16} color={inviteRole === 'viewer' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.roleOptionText,
                  inviteRole === 'viewer' && styles.roleOptionTextActive
                ]}>
                  Viewer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  inviteRole === 'editor' && styles.roleOptionActive
                ]}
                onPress={() => setInviteRole('editor')}
              >
                <Edit size={16} color={inviteRole === 'editor' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.roleOptionText,
                  inviteRole === 'editor' && styles.roleOptionTextActive
                ]}>
                  Editor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.inviteButton, loading && styles.inviteButtonDisabled]}
            onPress={handleSendInvitation}
            disabled={loading}
          >
            <Mail size={16} color="#FFFFFF" />
            <Text style={styles.inviteButtonText}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareTrip}>
          <Text style={styles.shareButtonText}>Share Trip</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCollaboratorsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color="#2563EB" />
          <Text style={styles.sectionTitle}>Collaborators ({trip.collaborators?.length || 0})</Text>
        </View>

        {trip.collaborators?.map((collaborator: any) => (
          <View key={collaborator.id} style={styles.collaboratorItem}>
            <View style={styles.collaboratorInfo}>
              <Text style={styles.collaboratorName}>{collaborator.name}</Text>
              <Text style={styles.collaboratorEmail}>{collaborator.email}</Text>
            </View>
            <View style={styles.collaboratorRole}>
              <Text style={[
                styles.roleTag,
                collaborator.role === 'owner' && styles.ownerTag,
                collaborator.role === 'editor' && styles.editorTag,
                collaborator.role === 'viewer' && styles.viewerTag,
              ]}>
                {collaborator.role}
              </Text>
            </View>
          </View>
        )) || []}

        {trip.invitations?.filter((inv: any) => inv.status === 'pending').map((invitation: any) => (
          <View key={invitation.id} style={styles.pendingInvitation}>
            <View style={styles.collaboratorInfo}>
              <Text style={styles.collaboratorName}>{invitation.email}</Text>
              <Text style={styles.pendingText}>Invitation pending</Text>
            </View>
            <View style={styles.collaboratorRole}>
              <Text style={styles.pendingTag}>Pending</Text>
            </View>
          </View>
        )) || []}
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Trip Visibility</Text>
          <Text style={styles.settingValue}>
            {trip.visibility === 'public' ? 'Public - Visible to everyone' : 'Private - Invite only'}
          </Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Share ID</Text>
          <Text style={styles.settingValue}>
            {trip.shareId || 'Not available for public trips'}
          </Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Created By</Text>
          <Text style={styles.settingValue}>{trip.createdBy}</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Trip</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tripInfo}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <Text style={styles.tripDestination}>{trip.destination}</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'share' && styles.tabActive]}
            onPress={() => setActiveTab('share')}
          >
            <Text style={[styles.tabText, activeTab === 'share' && styles.tabTextActive]}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'collaborators' && styles.tabActive]}
            onPress={() => setActiveTab('collaborators')}
          >
            <Text style={[styles.tabText, activeTab === 'collaborators' && styles.tabTextActive]}>
              People
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'share' && renderShareTab()}
        {activeTab === 'collaborators' && renderCollaboratorsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
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
  tripInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  shareIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  shareId: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#374151',
  },
  copyButton: {
    padding: 8,
  },
  inviteForm: {
    gap: 16,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  roleSelector: {
    gap: 8,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  roleOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
  inviteButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  inviteButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  shareButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  collaboratorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  collaboratorEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  collaboratorRole: {
    marginLeft: 12,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ownerTag: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  editorTag: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  viewerTag: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
  },
  pendingInvitation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    opacity: 0.7,
  },
  pendingText: {
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 2,
    fontStyle: 'italic',
  },
  pendingTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});