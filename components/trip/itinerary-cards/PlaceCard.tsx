import React from 'react';
import { MapPin } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface PlaceCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function PlaceCard({ item, currentDate, onEdit, onRemove }: PlaceCardProps) {
  // Place-specific details
  const placeDetails = [];
  if (item.category) placeDetails.push(item.category);
  if (item.estimatedTime) placeDetails.push(item.estimatedTime);
  if (item.rating) placeDetails.push(`⭐ ${item.rating}`);
  if (item.price) placeDetails.push(item.price);
  
  const details = placeDetails.length > 0 ? placeDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<MapPin size={16} color="#6B7280" />}
      iconColor="#6B7280"
      typeName="PLACE"
      showTags={false}
      tags={[]}
    />
  );
} 