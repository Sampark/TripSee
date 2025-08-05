import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Clock, MapPin, Edit, Trash2, DollarSign } from 'lucide-react-native';

export interface ItineraryItemProps {
  item: {
    id: string;
    type: 'flight' | 'train' | 'cab' | 'hotel' | 'base' | 'place' | 'others';
    name: string;
    time: string;
    location: string;
    details?: string;
    duration?: string;
    cost?: string;
    status?: 'confirmed' | 'pending' | 'cancelled';
    // Multi-day support
    startDate?: string;
    endDate?: string;
    isMultiDay?: boolean;
    // Additional fields for specific types
    departureDate?: string;
    arrivalDate?: string;
    checkInDate?: string;
    checkOutDate?: string;
    // Train-specific fields
    trainNumber?: string;
    departureStation?: string;
    arrivalStation?: string;
    class?: string;
    seatNumber?: string;
    // Flight-specific fields
    flightNumber?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    airline?: string;
    // Hotel-specific fields
    hotelName?: string;
    roomType?: string;
    // Cab-specific fields
    cabType?: string;
    driverName?: string;
    // Place-specific fields
    category?: string;
    estimatedTime?: string;
    price?: string;
    image?: string;
    rating?: number;
    description?: string;
    // Base location-specific fields
    accommodationType?: string;
    checkInTime?: string;
    checkOutTime?: string;
    amenities?: string;
    contactPerson?: string;
    phoneNumber?: string;
  };
  onEdit?: () => void;
  onRemove?: () => void;
  showTags?: boolean;
  tags?: string[];
}

interface BaseItineraryCardProps extends ItineraryItemProps {
  icon: React.ReactNode;
  iconColor: string;
  typeName: string;
}

export default function BaseItineraryCard({ 
  item, 
  onEdit, 
  onRemove, 
  icon, 
  iconColor, 
  typeName,
  showTags = false,
  tags = []
}: BaseItineraryCardProps) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTypeContainer}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.itemType}>{item.time}</Text>
          </View>
          
          <View style={styles.itemTypeContainer}>
            {icon}
            <Text style={[styles.itemType, { color: iconColor }]}>
              {typeName}
            </Text>
          </View>
          
          <View style={[styles.itemTypeContainer, { backgroundColor: item.status === 'confirmed' ? '#DCFCE7' : '#FEF3C7' }]}>
            <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#166534' : '#92400E' }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.itemName}>{item.name}</Text>

        {/* Tags for multi-day items */}
        {showTags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        {item.location && (
          <View style={styles.itemDetail}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.itemLocation}>{item.location}</Text>
          </View>
        )}

        {item.details && (
          <Text style={styles.itemDetails}>{item.details}</Text>
        )}
        
        {(item.cost || item.duration) && (
          <View style={styles.itemMetaRow}>
            {item.cost && (
              <View style={styles.itemDetail}>
                <DollarSign size={14} color="#059669" />
                <Text style={styles.itemCost}>{item.cost}</Text>
              </View>
            )}
            
            {item.duration && (
              <View style={styles.itemDetail}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.itemDuration}>{item.duration}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Edit size={16} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemContent: {
    flex: 1,
    paddingRight: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  itemType: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 24,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  itemDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  itemCost: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '700',
  },
  itemDetails: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'column',
    gap: 12,
    marginLeft: 16,
  },
  editButton: {
    padding: 5,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 