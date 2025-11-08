'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/lib/types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ExpenseList({ expenses, onEdit, onDelete, isLoading = false }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticExpenses, setOptimisticExpenses] = useState<Expense[]>(expenses);

  // Update optimistic state when expenses prop changes
  useEffect(() => {
    setOptimisticExpenses(expenses);
  }, [expenses]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(id);
    
    // Optimistic update: remove from UI immediately
    const previousExpenses = [...optimisticExpenses];
    setOptimisticExpenses(prev => prev.filter(exp => exp.id !== id));

    try {
      await onDelete(id);
    } catch (error) {
      // Revert on error
      console.error('Error deleting expense:', error);
      setOptimisticExpenses(previousExpenses);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Show empty state when no expenses
  if (optimisticExpenses.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first expense.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading && optimisticExpenses.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading expenses...</p>
        </div>
      ) : (
        optimisticExpenses.map((expense) => (
          <div
            key={expense.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
              deletingId === expense.id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatAmount(expense.amount)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(expense.date)}
                </p>
                {expense.note && (
                  <p className="text-sm text-gray-700 mt-2">{expense.note}</p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(expense)}
                  disabled={deletingId === expense.id}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit expense"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete expense"
                >
                  {deletingId === expense.id ? (
                    <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
