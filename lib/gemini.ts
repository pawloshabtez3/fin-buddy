import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from './types';
import { handleGeminiError } from './errors';

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. AI insights will not be available.');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generate spending insights using Google Gemini AI
 * @param expenses - Array of expense records to analyze
 * @returns AI-generated insights text
 */
export async function getSpendingInsights(expenses: Expense[]): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    if (!expenses || expenses.length === 0) {
      throw new Error('No expense data provided for analysis');
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Format expense data for the prompt
    const expensesSummary = formatExpensesForPrompt(expenses);

    // Create the prompt
    const prompt = `You are a personal finance assistant analyzing spending habits. Based on the following expense data, provide:

1. A brief summary of spending habits (2-3 sentences)
2. Two specific, actionable saving recommendations
3. One motivational message to encourage better financial habits

Expense Data:
${expensesSummary}

Please format your response in a clear, friendly, and encouraging tone. Keep it concise and actionable.`;

    // Generate content with timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - AI service took too long to respond')), 30000)
      )
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error generating spending insights:', error);
    
    // Convert to AppError for consistent error handling
    const appError = handleGeminiError(error);
    throw appError;
  }
}

/**
 * Format expenses into a readable summary for the AI prompt
 */
function formatExpensesForPrompt(expenses: Expense[]): string {
  // Calculate total spending
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => `  - ${category}: $${amount.toFixed(2)}`)
    .join('\n');

  // Get date range
  const dates = expenses.map(e => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates[0]?.toLocaleDateString() || 'N/A';
  const endDate = dates[dates.length - 1]?.toLocaleDateString() || 'N/A';

  return `
Total Expenses: $${total.toFixed(2)}
Number of Transactions: ${expenses.length}
Date Range: ${startDate} to ${endDate}

Spending by Category:
${sortedCategories}
`.trim();
}
