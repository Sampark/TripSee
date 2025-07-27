import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Plus, DollarSign, TrendingUp, ChartPie as PieChart, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../../hooks/useStorage';

interface CategoryBudget {
  category: string;
  spent: number;
  budget: number;
  color: string;
}

export default function ExpensesScreen() {
  const { expenses, loading, addExpense } = useExpenses();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
  });

  // Initialize with sample data if no expenses exist
  React.useEffect(() => {
    const initializeSampleData = async () => {
      if (!loading && expenses.length === 0) {
        const sampleExpenses = [
          {
            id: 'exp1',
            title: 'Hotel Booking',
            amount: 37500,
            category: 'Accommodation',
            date: '2024-06-15',
            trip: 'European Adventure',
          },
          {
            id: 'exp2',
            title: 'Flight Tickets',
            amount: 56700,
            category: 'Transport',
            date: '2024-06-10',
            trip: 'European Adventure',
          },
          {
            id: 'exp3',
            title: 'Dinner at Café de Flore',
            amount: 7100,
            category: 'Food',
            date: '2024-06-16',
            trip: 'European Adventure',
          },
          {
            id: 'exp4',
            title: 'Louvre Museum Tickets',
            amount: 4300,
            category: 'Activities',
            date: '2024-06-17',
            trip: 'European Adventure',
          },
        ];

        for (const expense of sampleExpenses) {
          await addExpense(expense);
        }
      }
    };

    initializeSampleData();
  }, [loading, expenses.length]);

  const categories = ['Accommodation', 'Transport', 'Food', 'Activities', 'Shopping', 'Other'];
  
  const categoryBudgets: CategoryBudget[] = [
    { category: 'Accommodation', spent: 37500, budget: 66700, color: '#EF4444' },
    { category: 'Transport', spent: 56700, budget: 83300, color: '#3B82F6' },
    { category: 'Food', spent: 23800, budget: 33300, color: '#10B981' },
    { category: 'Activities', spent: 12700, budget: 25000, color: '#F59E0B' },
    { category: 'Shopping', spent: 0, budget: 16700, color: '#8B5CF6' },
  ];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = categoryBudgets.reduce((sum, cat) => sum + cat.budget, 0);

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addExpense({
        title: newExpense.title,
        amount: parseFloat(newExpense.amount) || 0,
        category: newExpense.category,
        date: newExpense.date,
        trip: 'European Adventure',
      });

      setNewExpense({ title: '', amount: '', category: 'Food', date: '' });
      setShowAddModal(false);
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <DollarSign size={28} color="#111827" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Expenses</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <DollarSign size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(totalSpent)}</Text>
            <Text style={styles.summaryLabel}>Total Spent</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#10B981' }]}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(totalBudget - totalSpent)}</Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Budget Overview</Text>
          </View>

          {categoryBudgets.map((item) => (
            <View key={item.category} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategory}>{item.category}</Text>
                <Text style={styles.budgetAmount}>
                  {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${getProgressPercentage(item.spent, item.budget)}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
          </View>

          {expenses.slice().reverse().map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseMain}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
                <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <TouchableOpacity onPress={handleAddExpense}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.title}
                onChangeText={(text) => setNewExpense({ ...newExpense, title: text })}
                placeholder="What did you spend on?"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newExpense.category === category && styles.categoryOptionActive
                      ]}
                      onPress={() => setNewExpense({ ...newExpense, category })}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          newExpense.category === category && styles.categoryOptionTextActive
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.date}
                onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIcon: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  expenseMain: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryOptionActive: {
    backgroundColor: '#2563EB',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  tripSelector: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tripOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  tripOptionActive: {
    backgroundColor: '#2563EB',
  },
  tripOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tripOptionTextActive: {
    color: '#FFFFFF',
  },
});