import React from 'react';
import { Home } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface BaseCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function BaseCard({ item, currentDate, onEdit, onRemove }: BaseCardProps) {
  // Determine if this is a multi-day base location
  const isMultiDay = item.isMultiDay && item.startDate && item.endDate;
  
  // Determine tags based on current date
  let tags: string[] = [];
  let showTags = false;
  
  if (isMultiDay) {
    if (currentDate === item.startDate) {
      tags = ['CHECK-IN'];
      showTags = true;
    } else if (currentDate === item.endDate) {
      tags = ['CHECK-OUT'];
      showTags = true;
    } else {
      tags = ['STAYING'];
      showTags = true;
    }
  }

  // Base location-specific details
  const baseDetails = [];
  if (item.accommodationType) baseDetails.push(item.accommodationType);
  if (item.checkInTime && item.checkOutTime) {
    baseDetails.push(`${item.checkInTime} - ${item.checkOutTime}`);
  }
  if (item.amenities) baseDetails.push(`Amenities: ${item.amenities}`);
  if (item.contactPerson) baseDetails.push(`Contact: ${item.contactPerson}`);
  
  const details = baseDetails.length > 0 ? baseDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Home size={16} color="#EF4444" />}
      iconColor="#EF4444"
      typeName="BASE LOCATION"
      showTags={showTags}
      tags={tags}
    />
  );
} 