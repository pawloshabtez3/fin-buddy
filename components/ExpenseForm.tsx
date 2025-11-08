'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseInput, EXPENSE_CATEGORIES } from '@/lib/types';
import { toast } from '@/lib/toast';
import { parseError } from '@/lib/errors';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: ExpenseInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ExpenseForm({ expense, onSubmit, onCancel, isLoading = false }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseInput>({
    amount: expense?.amount || 0,
    category: expense?.category || EXPENSE_CATEGORIES[0],
    date: expense?.date || new Date().toISOString().split('T')[0],
    note: expense?.note || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when expense prop changes (for edit mode)
  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note || '',
      });
    }
  }, [expense]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseInput, string>> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    
    // Show validation errors as toast
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the form errors before submitting');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      
      // Show success message
      toast.success(expense ? 'Expense updated successfully' : 'Expense added successfully');
      
      // Reset form only if creating new expense (not editing)
      if (!expense) {
        setFormData({
          amount: 0,
          category: EXPENSE_CATEGORIES[0],
          date: new Date().toISOString().split('T')[0],
          note: '',
        });
      }
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      const { message } = parseError(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ExpenseInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount *
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0"
          value={formData.amount || ''}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        >
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting || isLoading}
          placeholder="Add a note about this expense..."
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
