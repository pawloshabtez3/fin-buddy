'use client';

import { Expense } from '@/lib/types';
import { useMemo } from 'react';

interface MonthlySummaryProps {
  expenses: Expense[];
}

export function MonthlySummary({ expenses }: MonthlySummaryProps) {
  const { total, month, year } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses for current month
    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // Calculate total
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Get month name
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });

    return {
      total,
      month: monthName,
      year: currentYear,
    };
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Spending</p>
          <p className="text-xs text-gray-500 mt-1">
            {month} {year}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}
