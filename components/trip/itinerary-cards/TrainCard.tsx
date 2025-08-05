import React from 'react';
import { Train } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface TrainCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function TrainCard({ item, currentDate, onEdit, onRemove }: TrainCardProps) {
  // Determine if this is a multi-day train journey
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

  // Train-specific details
  const trainDetails = [];
  if (item.trainNumber) trainDetails.push(`Train ${item.trainNumber}`);
  if (item.class) trainDetails.push(item.class);
  if (item.departureStation && item.arrivalStation) {
    trainDetails.push(`${item.departureStation} → ${item.arrivalStation}`);
  }
  if (item.seatNumber) trainDetails.push(`Seat ${item.seatNumber}`);
  
  const details = trainDetails.length > 0 ? trainDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Train size={16} color="#8B5CF6" />}
      iconColor="#8B5CF6"
      typeName="TRAIN"
      showTags={showTags}
      tags={tags}
    />
  );
} 