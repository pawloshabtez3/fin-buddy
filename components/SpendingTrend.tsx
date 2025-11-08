'use client';

import { Expense } from '@/lib/types';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SpendingTrendProps {
  expenses: Expense[];
  currency?: string;
}

export function SpendingTrend({ expenses, currency = 'USD' }: SpendingTrendProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Filter expenses for last 30 days
    const recentExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= thirtyDaysAgo && expenseDate <= now;
    });

    // Aggregate by date
    const dailyTotals = recentExpenses.reduce((acc, expense) => {
      const date = expense.date;
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Create array with all dates in range (including days with no expenses)
    const data = [];
    const currentDate = new Date(thirtyDaysAgo);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        total: dailyTotals[dateStr] || 0,
        displayDate: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }, [expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  // Check if there's any spending data
  const hasData = chartData.some((day) => day.total > 0);

  // Show empty state when no data
  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend (Last 30 Days)</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <p className="text-gray-600 font-medium">No expenses in the last 30 days</p>
          <p className="text-sm text-gray-500 mt-1">Add expenses to see your spending trend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Amount']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
