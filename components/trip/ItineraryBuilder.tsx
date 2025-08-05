import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  Home,
  Navigation,
  Edit,
  X,
  DollarSign
} from 'lucide-react-native';

// Import the card components
import FlightCard from './itinerary-cards/FlightCard';
import HotelCard from './itinerary-cards/HotelCard';
import TrainCard from './itinerary-cards/TrainCard';
import CabCard from './itinerary-cards/CabCard';
import PlaceCard from './itinerary-cards/PlaceCard';
import BaseCard from './itinerary-cards/BaseCard';
import OthersCard from './itinerary-cards/OthersCard';

// Import the modal components
import FlightModal from './itinerary-modals/FlightModal';
import HotelModal from './itinerary-modals/HotelModal';
import TrainModal from './itinerary-modals/TrainModal';
import CabModal from './itinerary-modals/CabModal';
import BaseLocationModal from './itinerary-modals/BaseLocationModal';
import PlaceModal from './itinerary-modals/PlaceModal';
import OthersModal from './itinerary-modals/OthersModal';

// Import storage service
import StorageService, { TravelItem as StorageTravelItem, DayPlan as StorageDayPlan, Itinerary } from '@/services/StorageService';

interface TravelItem {
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
}

interface DayPlan {
  date: string;
  items: TravelItem[];
}

// New interface for date-based itinerary
interface DateBasedItinerary {
  tripId: string;
  items: TravelItem[];
  createdAt: string;
  updatedAt: string;
}

interface ItineraryBuilderProps {
  trip: {
    id: string;
    startDate: string;
    endDate: string;
    destination: string;
  };
}

export default function ItineraryBuilder({ trip }: ItineraryBuilderProps) {
  console.log('ItineraryBuilder mounted with trip:', trip);
  const [selectedDay, setSelectedDay] = useState(0);
  const [allItems, setAllItems] = useState<TravelItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states for each item type
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showCabModal, setShowCabModal] = useState(false);
  const [showBaseLocationModal, setShowBaseLocationModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showOthersModal, setShowOthersModal] = useState(false);

  // Edit state
  const [editingItem, setEditingItem] = useState<TravelItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);

  // Load saved itinerary data on mount
  useEffect(() => {
    const loadItineraryData = async () => {
      try {
        console.log('Loading itinerary data for trip:', trip);
        setIsLoading(true);
        const savedItinerary = await StorageService.getItinerary(trip.id);
        console.log('Saved itinerary:', savedItinerary);
        
        if (savedItinerary) {
          // Convert storage format to flat items array
          const allItems: TravelItem[] = [];
          savedItinerary.dayPlans.forEach(dayPlan => {
            allItems.push(...(dayPlan.items as TravelItem[]));
          });
          setAllItems(allItems);
        } else {
          // Initialize with empty items array
          setAllItems([]);
        }
      } catch (error) {
        console.error('Error loading itinerary data:', error);
        Alert.alert('Error', 'Failed to load itinerary data');
      } finally {
        setIsLoading(false);
      }
    };

    loadItineraryData();
  }, [trip.id]);

  // Save itinerary data whenever allItems changes
  useEffect(() => {
    const saveItineraryData = async () => {
      if (!isLoading) {
        try {
          // Convert flat items array back to day-based format for storage
          const days = generateDays();
          const dayPlans: DayPlan[] = days.map(day => ({
            date: day,
            items: getItemsForDayByDate(day),
          }));
          
          const itinerary: Itinerary = {
            tripId: trip.id,
            dayPlans: dayPlans as StorageDayPlan[],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await StorageService.saveItinerary(itinerary);
        } catch (error) {
          console.error('Error saving itinerary data:', error);
        }
      }
    };

    saveItineraryData();
  }, [allItems, trip.id, isLoading]);

  // Generate days between start and end date
  const generateDays = () => {
    console.log('Generating days for trip:', trip);
    const days: string[] = [];
    
    if (!trip.startDate || !trip.endDate) {
      console.warn('Trip missing startDate or endDate:', trip);
      return days;
    }
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split('T')[0]);
    }
    
    console.log('Generated days:', days);
    return days;
  };

  const days = generateDays();
  
  // Get items for a specific date
  const getItemsForDayByDate = (date: string): TravelItem[] => {
    return allItems.filter(item => {
      // For items with specific dates (flights, trains, hotels)
      if (item.departureDate && item.arrivalDate) {
        const departureDate = new Date(item.departureDate);
        const arrivalDate = new Date(item.arrivalDate);
        const currentDate = new Date(date);
        
        // Check if current date falls within the item's date range
        return currentDate >= departureDate && currentDate <= arrivalDate;
      }
      
      // For items with check-in/check-out dates (hotels)
      if (item.checkInDate && item.checkOutDate) {
        const checkInDate = new Date(item.checkInDate);
        const checkOutDate = new Date(item.checkOutDate);
        const currentDate = new Date(date);
        
        return currentDate >= checkInDate && currentDate <= checkOutDate;
      }
      
      // For multi-day items with start/end dates
      if (item.isMultiDay && item.startDate && item.endDate) {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const currentDate = new Date(date);
        
        return currentDate >= startDate && currentDate <= endDate;
      }
      
      // For single-day items, check if they have a specific date
      if (item.startDate) {
        return item.startDate === date;
      }
      
      // Default: item belongs to the day it was added (fallback)
      return false;
    });
  };
  
  // If no days generated (missing dates), show error state
  if (days.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Trip dates not set</Text>
          <Text style={styles.loadingText}>Please set start and end dates for this trip to view the itinerary.</Text>
        </View>
      </View>
    );
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={16} color="#3B82F6" />;
      case 'train': return <Train size={16} color="#8B5CF6" />;
      case 'cab': return <Car size={16} color="#F59E0B" />;
      case 'hotel': return <Hotel size={16} color="#10B981" />;
      case 'base': return <Home size={16} color="#EF4444" />;
      case 'place': return <MapPin size={16} color="#6B7280" />;
      case 'others': return <Navigation size={16} color="#059669" />;
      default: return <Navigation size={16} color="#6B7280" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'flight': return '#3B82F6';
      case 'train': return '#8B5CF6';
      case 'cab': return '#F59E0B';
      case 'hotel': return '#10B981';
      case 'base': return '#EF4444';
      case 'place': return '#6B7280';
      case 'others': return '#059669';
      default: return '#6B7280';
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case 'flight': return 'Flight';
      case 'train': return 'Train';
      case 'cab': return 'Cab';
      case 'hotel': return 'Hotel';
      case 'base': return 'Base Location';
      case 'place': return 'Place to Visit';
      case 'others': return 'Other Activity';
      default: return 'Item';
    }
  };

  const renderItemCard = (item: TravelItem, currentDate: string) => {
    const handleEdit = () => {
      // Find the item in the allItems array
      const itemIndex = allItems.findIndex(i => i.id === item.id);
      
      if (itemIndex !== -1) {
        setEditingItem(item);
        setEditingItemIndex(itemIndex);
        
        // Open the appropriate modal based on item type
        switch (item.type) {
          case 'flight':
            setShowFlightModal(true);
            break;
          case 'hotel':
            setShowHotelModal(true);
            break;
          case 'train':
            setShowTrainModal(true);
            break;
          case 'cab':
            setShowCabModal(true);
            break;
          case 'base':
            setShowBaseLocationModal(true);
            break;
          case 'place':
            setShowPlaceModal(true);
            break;
          case 'others':
            setShowOthersModal(true);
            break;
        }
      }
    };

    const handleRemove = () => {
      Alert.alert(
        'Delete Item',
        `Are you sure you want to delete "${item.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              removeItemFromDay(item.id);
            },
          },
        ]
      );
    };

    switch (item.type) {
      case 'flight':
        return (
          <FlightCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'hotel':
        return (
          <HotelCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'train':
        return (
          <TrainCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'cab':
        return (
          <CabCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'place':
        return (
          <PlaceCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'base':
        return (
          <BaseCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      case 'others':
        return (
          <OthersCard
            item={item}
            currentDate={currentDate}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        );
      default:
        // Fallback to base card for unknown types
        return (
          <View style={styles.itemCard}>
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTypeContainer}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.itemType}>{item.time}</Text>
                </View>
                <View style={styles.itemTypeContainer}>
                  {getItemIcon(item.type)}
                  <Text style={[styles.itemType, { color: getItemColor(item.type) }]}>
                    {getItemTypeName(item.type)}
                  </Text>
                </View>
                <View style={[styles.itemTypeContainer, { backgroundColor: item.status === 'confirmed' ? '#DCFCE7' : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#166534' : '#92400E' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.itemName}>{item.name}</Text>
              
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
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemove}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  const addItemToDay = (dayIndex: number, type: string) => {
    // Show the appropriate modal based on type
    switch (type) {
      case 'flight':
        setShowAddModal(false);
        setShowFlightModal(true);
        break;
      case 'hotel':
        setShowAddModal(false);
        setShowHotelModal(true);
        break;
      case 'train':
        setShowAddModal(false);
        setShowTrainModal(true);
        break;
      case 'cab':
        setShowAddModal(false);
        setShowCabModal(true);
        break;
      case 'base':
        setShowAddModal(false);
        setShowBaseLocationModal(true);
        break;
      case 'place':
        setShowAddModal(false);
        setShowPlaceModal(true);
        break;
      case 'others':
        setShowAddModal(false);
        setShowOthersModal(true);
        break;
      default:
        // Fallback to old method for any other types
        const newItem: TravelItem = {
          id: Date.now().toString(),
          type: type as any,
          name: `Sample ${getItemTypeName(type)}`,
          time: '09:00 AM',
          location: 'Sample Location',
          details: 'Sample details',
          duration: '2 hours',
          cost: '$50',
          status: 'confirmed',
        };
        
        // This function is now handled by the modal components
        // The actual item addition is done in handleSaveItem
        setShowAddModal(false);
    }
  };

  const handleSaveItem = (itemData: any) => {
    console.log('handleSaveItem called with:', itemData);
    console.log('selectedDay:', selectedDay);
    console.log('current allItems:', allItems);
    console.log('editingItem:', editingItem);
    console.log('editingItemIndex:', editingItemIndex);
    
    // Check if this is a multi-day item
    let isMultiDay = false;
    let startDate = '';
    let endDate = '';
    
    if (itemData.departureDate && itemData.arrivalDate && itemData.departureDate !== itemData.arrivalDate) {
      // Flight or Train with different departure and arrival dates
      isMultiDay = true;
      startDate = itemData.departureDate;
      endDate = itemData.arrivalDate;
    } else if (itemData.checkInDate && itemData.checkOutDate && itemData.checkInDate !== itemData.checkOutDate) {
      // Hotel with different check-in and check-out dates
      isMultiDay = true;
      startDate = itemData.checkInDate;
      endDate = itemData.checkOutDate;
    }
    
    // Add multi-day flags to the item
    const itemWithMultiDay = {
      ...itemData,
      isMultiDay,
      startDate,
      endDate,
    };
    
    if (editingItem && editingItemIndex !== -1) {
      // Update existing item
      console.log('Updating existing item at index:', editingItemIndex);
      const updatedItems = [...allItems];
      updatedItems[editingItemIndex] = itemWithMultiDay;
      setAllItems(updatedItems);
    } else {
      // Add new item
      console.log('Adding new item');
      setAllItems([...allItems, itemWithMultiDay]);
    }
    
    // Reset editing state
    setEditingItem(null);
    setEditingItemIndex(-1);
    
    console.log('Updated allItems:', allItems);
  };

  const removeItemFromDay = (itemId: string) => {
    const updatedItems = allItems.filter(item => item.id !== itemId);
    setAllItems(updatedItems);
  };

  // Sort items by time
  const sortItemsByTime = (items: TravelItem[]): TravelItem[] => {
    return items.sort((a, b) => {
      // Convert time strings to comparable values
      const timeA = a.time.toLowerCase();
      const timeB = b.time.toLowerCase();
      
      // Handle AM/PM format
      const getTimeValue = (timeStr: string) => {
        const time = timeStr.replace(/\s*(am|pm)/i, '').trim();
        const isPM = timeStr.toLowerCase().includes('pm');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (isPM && hours !== 12) hour24 += 12;
        if (!isPM && hours === 12) hour24 = 0;
        return hour24 * 60 + minutes;
      };
      
      return getTimeValue(timeA) - getTimeValue(timeB);
    });
  };

  // Function to get items for a specific day, including multi-day items
  const getItemsForDay = (dayIndex: number): TravelItem[] => {
    const currentDate = days[dayIndex];
    if (!currentDate) return [];

    return getItemsForDayByDate(currentDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderAddItemModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add to Day {selectedDay + 1}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.itemTypeGrid}>
            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'flight')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#EFF6FF' }]}>
                <Plane size={24} color="#3B82F6" />
              </View>
              <Text style={styles.itemTypeName}>Flight</Text>
              <Text style={styles.itemTypeDesc}>Add flight details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'train')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#F3F4F6' }]}>
                <Train size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.itemTypeName}>Train</Text>
              <Text style={styles.itemTypeDesc}>Add train journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'cab')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#FFFBEB' }]}>
                <Car size={24} color="#F59E0B" />
              </View>
              <Text style={styles.itemTypeName}>Cab</Text>
              <Text style={styles.itemTypeDesc}>Add cab booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'hotel')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#ECFDF5' }]}>
                <Hotel size={24} color="#10B981" />
              </View>
              <Text style={styles.itemTypeName}>Hotel</Text>
              <Text style={styles.itemTypeDesc}>Add hotel details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'base')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#FEF2F2' }]}>
                <Home size={24} color="#EF4444" />
              </View>
              <Text style={styles.itemTypeName}>Base Location</Text>
              <Text style={styles.itemTypeDesc}>Set base location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'place')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#F9FAFB' }]}>
                <MapPin size={24} color="#6B7280" />
              </View>
              <Text style={styles.itemTypeName}>Place to Visit</Text>
              <Text style={styles.itemTypeDesc}>Add tourist spot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTypeCard}
              onPress={() => addItemToDay(selectedDay, 'others')}
            >
              <View style={[styles.itemTypeIcon, { backgroundColor: '#F0FDF4' }]}>
                <Navigation size={24} color="#059669" />
              </View>
              <Text style={styles.itemTypeName}>Other Activity</Text>
              <Text style={styles.itemTypeDesc}>Add any other activity</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading itinerary...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Day Selector - Fixed height */}
      <View style={styles.daySelectorContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
          contentContainerStyle={styles.daySelectorContent}
        >
          {days.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === index && styles.dayButtonTextActive
              ]}>
                Day {index + 1}
              </Text>
              <Text style={[
                styles.dayButtonDate,
                selectedDay === index && styles.dayButtonDateActive
              ]}>
                {formatDate(day)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Day Content - Takes remaining space */}
      <View style={styles.dayContent}>
        <View style={styles.dayHeader}>
          <View style={styles.dayHeaderLeft}>
            <Calendar size={20} color="#2563EB" />
            <Text style={styles.dayTitle}>
              Day {selectedDay + 1} - {formatDate(days[selectedDay])}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addItemHeaderButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={16} color="#2563EB" />
            <Text style={styles.addItemHeaderText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {getItemsForDay(selectedDay).length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              {allItems.length === 0 ? (
                <Calendar size={64} color="#D1D5DB" />
              ) : (
                <Clock size={64} color="#D1D5DB" />
              )}
            </View>
            <Text style={styles.emptyStateTitle}>
              {allItems.length === 0 
                ? 'Start Planning Your Trip' 
                : `No Items for Day ${selectedDay + 1}`
              }
            </Text>
            <Text style={styles.emptyStateDescription}>
              {allItems.length === 0
                ? 'Create your perfect itinerary by adding flights, hotels, activities, and more to plan every detail of your journey.'
                : `Start building your perfect Day ${selectedDay + 1} by adding flights, hotels, activities, and more.`
              }
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyStateButtonText}>
                {allItems.length === 0 
                  ? 'Add Your First Item' 
                  : 'Add Item to This Day'
                }
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sortItemsByTime(getItemsForDay(selectedDay))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderItemCard(item, days[selectedDay])}
            style={styles.itemsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Individual modals for each item type */}
      <FlightModal
        visible={showFlightModal}
        onClose={() => {
          setShowFlightModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        defaultDate={days[selectedDay]}
        existingItem={editingItem}
      />
      
      <HotelModal
        visible={showHotelModal}
        onClose={() => {
          setShowHotelModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        defaultDate={days[selectedDay]}
        existingItem={editingItem}
      />
      
      <TrainModal
        visible={showTrainModal}
        onClose={() => {
          setShowTrainModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        defaultDate={days[selectedDay]}
        existingItem={editingItem}
      />
      
      <CabModal
        visible={showCabModal}
        onClose={() => {
          setShowCabModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        defaultDate={days[selectedDay]}
        existingItem={editingItem}
      />
      
      <BaseLocationModal
        visible={showBaseLocationModal}
        onClose={() => {
          setShowBaseLocationModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        existingItem={editingItem}
      />
      
      <PlaceModal
        visible={showPlaceModal}
        onClose={() => {
          setShowPlaceModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        existingItem={editingItem}
      />
      
      <OthersModal
        visible={showOthersModal}
        onClose={() => {
          setShowOthersModal(false);
          setEditingItem(null);
          setEditingItemIndex(-1);
        }}
        onSave={handleSaveItem}
        dayNumber={selectedDay + 1}
        existingItem={editingItem}
      />
      
      {/* Keep the old modal for fallback */}
      {renderAddItemModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  daySelectorContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 90, // Fixed height for day selector
  },
  daySelector: {
    flex: 1,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dayButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  dayButtonActive: {
    backgroundColor: '#2563EB',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  dayButtonDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dayButtonDateActive: {
    color: '#E5E7EB',
  },
  dayContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addItemHeaderText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  itemsList: {
    flex: 1,
  },
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

  itemTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
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
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addItemText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  itemTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTypeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemTypeDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});