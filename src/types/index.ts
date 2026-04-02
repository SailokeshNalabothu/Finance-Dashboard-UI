export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description?: string;
}

export type Category = 
  | 'Housing'
  | 'Food'
  | 'Transportation'
  | 'Utilities'
  | 'Insurance'
  | 'Medical & Healthcare'
  | 'Saving, Investing, & Debt Payments'
  | 'Personal Spending'
  | 'Recreation & Entertainment'
  | 'Miscellaneous'
  | 'Salary'
  | 'Investment'
  | 'Bonus'
  | 'Other Income';

export type UserRole = 'Viewer' | 'Admin';
export type Theme = 'light' | 'dark';
