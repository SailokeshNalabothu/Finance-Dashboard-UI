import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency } from '../store/useStore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterTransactions(transactions: any[], dateFilter: string): any[] {
  if (dateFilter === 'all') return transactions;
  
  const now = new Date();
  let cutoffDate = new Date();

  if (dateFilter === '7d') cutoffDate.setDate(now.getDate() - 7);
  else if (dateFilter === '30d') cutoffDate.setDate(now.getDate() - 30);
  else if (dateFilter === 'ytd') cutoffDate = new Date(now.getFullYear(), 0, 1);

  const cutoffStr = cutoffDate.toISOString().split('T')[0];
  return transactions.filter((tx) => tx.date >= cutoffStr);
}
