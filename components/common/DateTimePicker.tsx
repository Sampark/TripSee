import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Clock, Calendar as CalendarIcon } from 'lucide-react-native';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  mode: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  minimumTime?: string;
  maximumTime?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  placeholder,
  label,
  mode,
  minimumDate,
  maximumDate,
  minimumTime,
  maximumTime,
}: DateTimePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const hourScrollViewRef = React.useRef<ScrollView>(null);
  const minuteScrollViewRef = React.useRef<ScrollView>(null);

  // Initialize selectedTime with current value when time picker opens
  React.useEffect(() => {
    if (showTimePicker && value) {
      setSelectedTime(value);
    }
  }, [showTimePicker, value]);

  // Scroll to selected time after modal opens
  React.useEffect(() => {
    if (showTimePicker) {
      const timer = setTimeout(() => {
        scrollToSelectedTime();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showTimePicker, selectedTime]);

  const handleDateSelect = (date: string) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
    
    if (mode === 'date') {
      const formattedDate = newDate.toISOString().split('T')[0];
      onChange(formattedDate);
      setShowCalendar(false);
    } else if (mode === 'datetime') {
      setShowCalendar(false);
      setShowTimePicker(true);
    }
  };

  const validateTime = (time: string) => {
    if (minimumTime && time < minimumTime) {
      return false;
    }
    if (maximumTime && time > maximumTime) {
      return false;
    }
    return true;
  };

  const handleTimeSelect = (time: string) => {
    if (validateTime(time)) {
      setSelectedTime(time);
    }
  };

  const handleTimeConfirm = () => {
    if (selectedDate && mode === 'datetime') {
      const [hours, minutes] = selectedTime.split(':');
      const datetime = new Date(selectedDate);
      datetime.setHours(parseInt(hours), parseInt(minutes));
      onChange(datetime.toISOString());
    } else {
      onChange(selectedTime);
    }
    
    setShowTimePicker(false);
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    
    if (mode === 'date') {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (mode === 'time') {
      return value;
    } else if (mode === 'datetime') {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return value;
  };

  const scrollToSelectedTime = () => {
    const currentHour = parseInt(selectedTime.split(':')[0] || '0');
    const currentMinute = parseInt(selectedTime.split(':')[1] || '0');
    
    // Scroll to selected hour
    if (hourScrollViewRef.current) {
      hourScrollViewRef.current.scrollTo({
        y: currentHour * 42, // 40px height + 2px margin
        animated: true,
      });
    }
    
    // Scroll to selected minute
    if (minuteScrollViewRef.current) {
      minuteScrollViewRef.current.scrollTo({
        y: currentMinute * 42, // 40px height + 2px margin
        animated: true,
      });
    }
  };

  const renderTimePicker = () => {
    let hours = Array.from({ length: 24 }, (_, i) => i);
    let minutes = Array.from({ length: 60 }, (_, i) => i);
    
    // Filter hours and minutes based on time constraints
    if (minimumTime) {
      const [minHour, minMinute] = minimumTime.split(':').map(Number);
      hours = hours.filter(hour => hour >= minHour);
    }
    if (maximumTime) {
      const [maxHour, maxMinute] = maximumTime.split(':').map(Number);
      hours = hours.filter(hour => hour <= maxHour);
    }
    
    // Get current selected values - use selectedTime for highlighting in the modal
    const currentHour = selectedTime.split(':')[0] || '00';
    const currentMinute = selectedTime.split(':')[1] || '00';
    
    // Ensure proper formatting for comparison
    const formattedCurrentHour = currentHour.padStart(2, '0');
    const formattedCurrentMinute = currentMinute.padStart(2, '0');
    
    return (
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnTitle}>Hour</Text>
                <ScrollView 
                  ref={hourScrollViewRef}
                  style={styles.timeList} 
                  showsVerticalScrollIndicator={false}
                  onLayout={scrollToSelectedTime}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.timeOption,
                        formattedCurrentHour === hour.toString().padStart(2, '0') && styles.timeOptionSelected
                      ]}
                      onPress={() => {
                        const currentMinutes = selectedTime.split(':')[1] || '00';
                        handleTimeSelect(`${hour.toString().padStart(2, '0')}:${currentMinutes}`);
                      }}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        formattedCurrentHour === hour.toString().padStart(2, '0') && styles.timeOptionTextSelected
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnTitle}>Minute</Text>
                <ScrollView 
                  ref={minuteScrollViewRef}
                  style={styles.timeList} 
                  showsVerticalScrollIndicator={false}
                  onLayout={scrollToSelectedTime}
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.timeOption,
                        formattedCurrentMinute === minute.toString().padStart(2, '0') && styles.timeOptionSelected
                      ]}
                      onPress={() => {
                        const currentHours = selectedTime.split(':')[0] || '00';
                        handleTimeSelect(`${currentHours}:${minute.toString().padStart(2, '0')}`);
                      }}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        formattedCurrentMinute === minute.toString().padStart(2, '0') && styles.timeOptionTextSelected
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.saveButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          if (mode === 'time') {
            // Initialize selectedTime with current value when opening time picker
            if (value) {
              setSelectedTime(value);
            } else {
              setSelectedTime('00:00');
            }
            setShowTimePicker(true);
          } else {
            setShowCalendar(true);
          }
        }}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDisplayValue() : placeholder}
        </Text>
        {mode === 'time' ? (
          <Clock size={20} color="#6B7280" />
        ) : (
          <CalendarIcon size={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Calendar
              onDayPress={(day) => handleDateSelect(day.dateString)}
              markedDates={value ? { [value]: { selected: true, selectedColor: '#2563EB' } } : {}}
              minDate={minimumDate?.toISOString().split('T')[0]}
              maxDate={maximumDate?.toISOString().split('T')[0]}
              theme={{
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#2563EB',
                dayTextColor: '#2D3748',
                textDisabledColor: '#CBD5E0',
                arrowColor: '#2563EB',
                monthTextColor: '#2D3748',
                indicatorColor: '#2563EB',
              }}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      {renderTimePicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '300',
  },
  timePickerContainer: {
    flexDirection: 'row',
    padding: 16,
    minHeight: 300,
    maxHeight: 400,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  timeColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  timeList: {
    height: 250,
    width: '100%',
    flex: 1,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 1,
    alignItems: 'center',
    minHeight: 40,
  },
  timeOptionSelected: {
    backgroundColor: '#2563EB',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 