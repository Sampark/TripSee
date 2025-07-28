import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  title: string;
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
}

export default function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
  title,
  initialDate,
  minDate,
  maxDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate);
      setSelectedDate(date);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    } else {
      const today = new Date();
      setSelectedDate(today);
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [initialDate, visible]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    
    return false;
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isDateDisabled(newDate)) return;
    
    setSelectedDate(newDate);
    const dateString = newDate.toISOString().split('T')[0];
    onDateSelect(dateString);
    onClose(); // Auto-close on iOS for better UX
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDate(date, selectedDate);
      const isDisabled = isDateDisabled(date);
      const isToday = isSameDate(date, new Date());

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            styles.dayButton,
            isSelected && styles.selectedDay,
            isDisabled && styles.disabledDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => handleDateSelect(day)}
          disabled={isDisabled}
          accessibilityLabel={`${day} ${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isDisabled && styles.disabledDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close calendar">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Month Navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth('prev')}
              accessibilityLabel="Previous month"
            >
              <ChevronLeft size={24} color="#6B7280" />
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth('next')}
              accessibilityLabel="Next month"
            >
              <ChevronRight size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={styles.weekdayHeader}>
            {weekdays.map((weekday) => (
              <View key={weekday} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{weekday}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {renderCalendar()}
          </View>

          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateLabel}>Selected Date:</Text>
            <Text style={styles.selectedDateText}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    borderRadius: 8,
    margin: 2,
  },
  selectedDay: {
    backgroundColor: '#2563EB',
  },
  disabledDay: {
    opacity: 0.3,
  },
  todayDay: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  dayText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledDayText: {
    color: '#9CA3AF',
  },
  todayDayText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  selectedDateContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
});