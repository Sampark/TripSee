import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (_date: string) => void;
  title: string;
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
}

interface MarkedDate {
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
  today?: boolean;
  textColor?: string;
  fontWeight?: string;
}

interface MarkedDates {
  [date: string]: MarkedDate;
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
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [initialDate, visible]);

  const handleDateSelect = (day: DateData) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    onDateSelect(dateString);
    onClose(); // Auto-close on iOS for better UX
  };

  const getMarkedDates = (): MarkedDates => {
    const marked: MarkedDates = {};
    
    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#2563EB',
        selectedTextColor: '#FFFFFF',
      };
    }

    // Mark today if it's not the selected date
    const today = new Date().toISOString().split('T')[0];
    if (today !== selectedDate) {
      marked[today] = {
        today: true,
        textColor: '#2563EB',
        fontWeight: '500',
      };
    }

    return marked;
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
          <Calendar
            current={selectedDate}
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            minDate={minDate}
            maxDate={maxDate}
            theme={{
              backgroundColor: '#FFFFFF',
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: '#111827',
              selectedDayBackgroundColor: '#2563EB',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#2563EB',
              dayTextColor: '#111827',
              textDisabledColor: '#9CA3AF',
              dotColor: '#2563EB',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#6B7280',
              monthTextColor: '#111827',
              indicatorColor: '#2563EB',
              textDayFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
              textMonthFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
              textDayHeaderFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
            enableSwipeMonths={true}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={0} // Sunday
            hideDayNames={false}
            showWeekNumbers={false}
            disableArrowLeft={false}
            disableArrowRight={false}
            disableAllTouchEventsForDisabledDays={true}
            renderHeader={(date) => {
              return (
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarHeaderText}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
              );
            }}
          />

          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateLabel}>Selected Date:</Text>
            <Text style={styles.selectedDateText}>
              {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'No date selected'}
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
  calendar: {
    marginBottom: 20,
  },
  calendarHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  calendarHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
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
});