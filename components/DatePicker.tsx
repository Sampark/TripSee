import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  initialDate?: string;
  minimumAge?: number;
}

export default function DatePicker({ 
  visible, 
  onClose, 
  onDateSelect, 
  initialDate,
  minimumAge = 13 
}: DatePickerProps) {
  const currentDate = new Date();
  const maxDate = new Date(currentDate.getFullYear() - minimumAge, currentDate.getMonth(), currentDate.getDate());
  
  const [selectedYear, setSelectedYear] = useState(maxDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(maxDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(maxDate.getDate());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 100 }, (_, i) => maxDate.getFullYear() - i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    const dateString = date.toISOString().split('T')[0];
    onDateSelect(dateString);
    onClose();
  };

  const renderYearPicker = () => (
    <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
      {years.map((year) => (
        <TouchableOpacity
          key={year}
          style={[styles.pickerItem, selectedYear === year && styles.pickerItemSelected]}
          onPress={() => setSelectedYear(year)}
        >
          <Text style={[styles.pickerText, selectedYear === year && styles.pickerTextSelected]}>
            {year}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderMonthPicker = () => (
    <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
      {months.map((month, index) => (
        <TouchableOpacity
          key={month}
          style={[styles.pickerItem, selectedMonth === index && styles.pickerItemSelected]}
          onPress={() => setSelectedMonth(index)}
        >
          <Text style={[styles.pickerText, selectedMonth === index && styles.pickerTextSelected]}>
            {month}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDayPicker = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.pickerItem, selectedDay === day && styles.pickerItemSelected]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.pickerText, selectedDay === day && styles.pickerTextSelected]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedDate}>
            <Text style={styles.selectedDateText}>
              {months[selectedMonth]} {selectedDay}, {selectedYear}
            </Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Month</Text>
              {renderMonthPicker()}
            </View>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Day</Text>
              {renderDayPicker()}
            </View>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Year</Text>
              {renderYearPicker()}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  confirmButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  selectedDate: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 200,
    paddingHorizontal: 20,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  pickerTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
});