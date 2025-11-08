import { Expense, MonthlySummary, CategoryAggregate, DailySpending } from './types';

/**
 * Calculate monthly summary from expenses
 * Filters expenses for the current month and calculates the total
 */
export function calculateMonthlySummary(
  expenses: Expense[],
  month?: number,
  year?: number
): MonthlySummary {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  // Filter expenses for target month
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === targetMonth &&
      expenseDate.getFullYear() === targetYear
    );
  });

  // Calculate total
  const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get month name
  const monthDate = new Date(targetYear, targetMonth, 1);
  const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });

  return {
    total,
    month: monthName,
    year: targetYear,
  };
}

/**
 * Aggregate expenses by category
 * Returns array of category totals with percentages
 */
export function aggregateByCategory(
  expenses: Expense[],
  month?: number,
  year?: number
): CategoryAggregate[] {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  // Filter expenses for target month if month/year provided
  let filteredExpenses = expenses;
  if (month !== undefined || year !== undefined) {
    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === targetMonth &&
        expenseDate.getFullYear() === targetYear
      );
    });
  }

  // Aggregate by category
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total for percentages
  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Convert to array format with percentages
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      total: amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total); // Sort by total descending
}

/**
 * Generate daily spending totals for a date range
 * Defaults to last 30 days if no range provided
 */
export function generateDailySpending(
  expenses: Expense[],
  startDate?: Date,
  endDate?: Date
): DailySpending[] {
  const now = new Date();
  const end = endDate || now;
  const start = startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  // Filter expenses for date range
  const rangeExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  // Aggregate by date
  const dailyTotals = rangeExpenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create array with all dates in range (including days with no expenses)
  const data: DailySpending[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      total: dailyTotals[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

/**
 * Get formatted date string for display
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
  };
}
