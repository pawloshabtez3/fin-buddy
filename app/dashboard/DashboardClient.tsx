'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { MonthlySummary } from '@/components/MonthlySummary';
import { ExpenseChart } from '@/components/ExpenseChart';
import { SpendingTrend } from '@/components/SpendingTrend';
import { AIInsights } from '@/components/AIInsights';
import { Expense, ExpenseInput } from '@/lib/types';

interface DashboardClientProps {
  initialExpenses: Expense[];
  currency: string;
}

export function DashboardClient({ initialExpenses, currency }: DashboardClientProps) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/expenses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const result = await response.json();
      setExpenses(result.data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create or update expense
  const handleSubmit = async (data: ExpenseInput) => {
    try {
      setError(null);

      if (editingExpense) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update expense');
        }

        const result = await response.json();
        
        // Update expense in list
        setExpenses(prev =>
          prev.map(exp => (exp.id === editingExpense.id ? result.data : exp))
        );
        
        setEditingExpense(null);
        setShowForm(false);
      } else {
        // Create new expense
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create expense');
        }

        const result = await response.json();
        
        // Add new expense to list (at the beginning since sorted by date desc)
        setExpenses(prev => [result.data, ...prev]);
      }

      // Refresh the list to ensure consistency
      await fetchExpenses();
    } catch (err) {
      console.error('Error submitting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to save expense');
      throw err; // Re-throw to let form handle it
    }
  };

  // Delete expense
  const handleDelete = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete expense');
      }

      // Remove expense from list
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      throw err; // Re-throw to let list handle it
    }
  };

  // Edit expense
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Summary and Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MonthlySummary expenses={expenses} currency={currency} />
        <div className="md:col-span-2">
          <AIInsights expenses={expenses} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpenseChart expenses={expenses} currency={currency} />
        <SpendingTrend expenses={expenses} currency={currency} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
              </h2>
              {!showForm && !editingExpense && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Show Form
                </button>
              )}
            </div>
            
            {(showForm || editingExpense) && (
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleSubmit}
                onCancel={editingExpense ? handleCancel : undefined}
                isLoading={isLoading}
              />
            )}
            
            {!showForm && !editingExpense && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <svg
                  className="mx-auto h-12 w-12 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm font-medium">Click to add expense</span>
              </button>
            )}
          </div>
        </div>

        {/* Expense List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Expenses
            </h2>
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              currency={currency}
            />
          </div>
        </div>
      </div>
    </>
  );
}
