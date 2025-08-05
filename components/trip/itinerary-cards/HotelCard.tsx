import React from 'react';
import { Hotel } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface HotelCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function HotelCard({ item, currentDate, onEdit, onRemove }: HotelCardProps) {
  // Determine if this is a multi-day hotel stay
  const isMultiDay = item.isMultiDay && item.checkInDate && item.checkOutDate;
  const checkInDate = item.checkInDate;
  const checkOutDate = item.checkOutDate;
  
  // Determine tags based on current date
  let tags: string[] = [];
  let showTags = false;
  
  if (isMultiDay) {
    if (currentDate === checkInDate) {
      tags = ['CHECK-IN'];
      showTags = true;
    } else if (currentDate === checkOutDate) {
      tags = ['CHECK-OUT'];
      showTags = true;
    }
  }

  // Hotel-specific details
  const hotelDetails = [];
  if (item.hotelName) hotelDetails.push(item.hotelName);
  if (item.roomType) hotelDetails.push(item.roomType);
  if (item.checkInDate && item.checkOutDate) {
    hotelDetails.push(`${item.checkInDate} - ${item.checkOutDate}`);
  }
  
  const details = hotelDetails.length > 0 ? hotelDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Hotel size={16} color="#10B981" />}
      iconColor="#10B981"
      typeName="HOTEL"
      showTags={showTags}
      tags={tags}
    />
  );
} 