import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { 
  X, 
  Trash2, 
  Shield, 
  Users, 
  Settings, 
  Globe, 
  Lock, 
  UserPlus, 
  UserMinus,
  Edit,
  Archive,
  Download,
  Share2,
  AlertTriangle,
  Crown
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AdminActionsModalProps {
  visible: boolean;
  onClose: () => void;
  trip: any;
  userRole: string;
  onAction: (action: string, data?: any) => void;
}

export default function AdminActionsModal({ 
  visible, 
  onClose, 
  trip, 
  userRole, 
  onAction 
}: AdminActionsModalProps) {
  
  const isAdmin = userRole === 'owner';
  
  const adminActions = [
    {
      id: 'delete',
      title: 'Delete Trip',
      subtitle: 'Permanently remove this trip and all its data',
      icon: <Trash2 size={24} color="#EF4444" />,
      color: '#EF4444',
      action: () => {
        Alert.alert(
          'Delete Trip',
          'Are you sure you want to delete this trip? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => onAction('delete')
            }
          ]
        );
      }
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      subtitle: 'Change trip visibility and access permissions',
      icon: <Shield size={24} color="#2563EB" />,
      color: '#2563EB',
      action: () => onAction('privacy')
    },
    {
      id: 'collaborators',
      title: 'Manage Collaborators',
      subtitle: 'Add, remove, or change collaborator roles',
      icon: <Users size={24} color="#10B981" />,
      color: '#10B981',
      action: () => onAction('collaborators')
    },
    {
      id: 'ownership',
      title: 'Transfer Ownership',
      subtitle: 'Transfer trip ownership to another user',
      icon: <Crown size={24} color="#F59E0B" />,
      color: '#F59E0B',
      action: () => {
        Alert.alert(
          'Transfer Ownership',
          'Are you sure you want to transfer ownership? You will lose admin privileges.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Transfer', 
              style: 'destructive',
              onPress: () => onAction('transfer-ownership')
            }
          ]
        );
      }
    },
    {
      id: 'archive',
      title: 'Archive Trip',
      subtitle: 'Move trip to archive (can be restored later)',
      icon: <Archive size={24} color="#6B7280" />,
      color: '#6B7280',
      action: () => onAction('archive')
    },
    {
      id: 'export',
      title: 'Export Data',
      subtitle: 'Download trip data as JSON or CSV',
      icon: <Download size={24} color="#8B5CF6" />,
      color: '#8B5CF6',
      action: () => onAction('export')
    },
    {
      id: 'share',
      title: 'Share Settings',
      subtitle: 'Configure sharing and collaboration settings',
      icon: <Share2 size={24} color="#06B6D4" />,
      color: '#06B6D4',
      action: () => onAction('share-settings')
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      subtitle: 'Configure advanced trip options and integrations',
      icon: <Settings size={24} color="#374151" />,
      color: '#374151',
      action: () => onAction('advanced-settings')
    }
  ];

  const renderActionItem = (action: any) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionItem}
      onPress={action.action}
      accessibilityLabel={action.title}
      accessibilityHint={action.subtitle}
    >
      <View style={styles.actionIcon}>
        {action.icon}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <View style={[styles.actionIndicator, { backgroundColor: action.color }]} />
    </TouchableOpacity>
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close admin panel">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Admin Actions</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Crown size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Trip Administration</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Manage trip settings, permissions, and data. Only visible to trip owners and admins.
            </Text>
          </View>

          <View style={styles.actionsList}>
            {adminActions.map(renderActionItem)}
          </View>

          <View style={styles.warningSection}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              These actions can significantly affect the trip and its collaborators. Use with caution.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
}); 