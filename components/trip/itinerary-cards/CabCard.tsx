import React from 'react';
import { Car } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface CabCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function CabCard({ item, currentDate, onEdit, onRemove }: CabCardProps) {
  // Determine if this is a multi-day cab journey
  const isMultiDay = item.isMultiDay && item.departureDate && item.arrivalDate;
  const departureDate = item.departureDate;
  const arrivalDate = item.arrivalDate;
  
  // Determine tags based on current date
  let tags: string[] = [];
  let showTags = false;
  
  if (isMultiDay) {
    if (currentDate === departureDate) {
      tags = ['DEPARTURE'];
      showTags = true;
    } else if (currentDate === arrivalDate) {
      tags = ['ARRIVAL'];
      showTags = true;
    }
  }

  // Cab-specific details
  const cabDetails = [];
  if (item.cabType) cabDetails.push(item.cabType);
  if (item.driverName) cabDetails.push(`Driver: ${item.driverName}`);
  if (item.departureStation && item.arrivalStation) {
    cabDetails.push(`${item.departureStation} → ${item.arrivalStation}`);
  }
  
  const details = cabDetails.length > 0 ? cabDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Car size={16} color="#F59E0B" />}
      iconColor="#F59E0B"
      typeName="CAB"
      showTags={showTags}
      tags={tags}
    />
  );
} 