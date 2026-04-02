import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, UserRole, Theme } from '../types';
import { getMockTransactions } from '../data/mockData';

export type Currency = 'USD' | 'EUR' | 'INR';
export type DateFilter = 'all' | '7d' | '30d' | 'ytd';

interface AppState {
  transactions: Transaction[];
  role: UserRole;
  theme: Theme;
  isAuthenticated: boolean;
  currency: Currency;
  dateFilter: DateFilter;
  
  // Actions
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  setCurrency: (currency: Currency) => void;
  setDateFilter: (filter: DateFilter) => void;
  login: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: getMockTransactions(),
      role: 'Viewer',
      theme: 'dark',
      isAuthenticated: false,
      currency: 'USD',
      dateFilter: 'all',

      addTransaction: (tx) => 
        set((state) => ({ transactions: [tx, ...state.transactions] })),
        
      updateTransaction: (updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === updatedTx.id ? updatedTx : tx
          )
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id)
        })),

      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        
      setCurrency: (currency) => set({ currency }),
      setDateFilter: (dateFilter) => set({ dateFilter }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
