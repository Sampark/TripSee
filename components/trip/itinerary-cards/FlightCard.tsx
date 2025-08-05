import React from 'react';
import { Plane } from 'lucide-react-native';
import BaseItineraryCard, { ItineraryItemProps } from './BaseItineraryCard';

interface FlightCardProps extends ItineraryItemProps {
  currentDate: string;
}

export default function FlightCard({ item, currentDate, onEdit, onRemove }: FlightCardProps) {
  // Determine if this is a multi-day flight
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

  // Flight-specific details
  const flightDetails = [];
  if (item.flightNumber) flightDetails.push(`Flight ${item.flightNumber}`);
  if (item.airline) flightDetails.push(item.airline);
  if (item.departureAirport && item.arrivalAirport) {
    flightDetails.push(`${item.departureAirport} → ${item.arrivalAirport}`);
  }
  
  const details = flightDetails.length > 0 ? flightDetails.join(' • ') : item.details;

  return (
    <BaseItineraryCard
      item={{
        ...item,
        details: details
      }}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={<Plane size={16} color="#3B82F6" />}
      iconColor="#3B82F6"
      typeName="FLIGHT"
      showTags={showTags}
      tags={tags}
    />
  );
} 