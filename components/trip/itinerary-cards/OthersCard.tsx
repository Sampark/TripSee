import React from 'react';
import { Navigation } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface OthersCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function OthersCard({ item, currentDate, onEdit, onRemove }: OthersCardProps) {
  // Determine if this is a multi-day activity
  const isMultiDay = item.isMultiDay && item.startDate && item.endDate;
  
  // Determine tags based on current date
  let tags: string[] = [];
  let showTags = false;
  
  if (isMultiDay) {
    if (currentDate === item.startDate) {
      tags = ['START'];
      showTags = true;
    } else if (currentDate === item.endDate) {
      tags = ['END'];
      showTags = true;
    } else {
      tags = ['ONGOING'];
      showTags = true;
    }
  }

  // Activity-specific details
  const activityDetails = [];
  if (item.category) activityDetails.push(item.category);
  if (item.estimatedTime) activityDetails.push(`Duration: ${item.estimatedTime}`);
  if (item.price) activityDetails.push(`Cost: ${item.price}`);
  
  const details = activityDetails.length > 0 ? activityDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Navigation size={16} color="#059669" />}
      iconColor="#059669"
      typeName="ACTIVITY"
      showTags={showTags}
      tags={tags}
    />
  );
} 