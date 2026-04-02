import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { formatCurrency, filterTransactions } from '../../lib/utils';
import { motion } from 'framer-motion';

export function BudgetProgress() {
  const { transactions: allTx, currency, dateFilter } = useStore();
  const transactions = useMemo(() => filterTransactions(allTx, dateFilter), [allTx, dateFilter]);
  
  const budget = 5000; // Static generic budget
  
  const expenses = useMemo(() => {
    return transactions.reduce((acc, tx) => (tx.type === 'expense' ? acc + tx.amount : acc), 0);
  }, [transactions]);
  
  const percentage = Math.min((expenses / budget) * 100, 100);
  const isOverBudget = expenses > budget;

  return (
    <Card glass className="relative overflow-hidden w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-end">
          <span>Monthly Budget</span>
          <span className="text-sm font-medium text-slate-500">
            {formatCurrency(budget, currency)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline mb-1">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(expenses, currency)}
          </div>
          <p className={`text-sm font-semibold uppercase tracking-widest ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
            {percentage.toFixed(0)}% Used
          </p>
        </div>
        
        {/* Progress Bar Body */}
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, type: 'spring', bounce: 0.1 }}
            className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
          />
        </div>
        
        {isOverBudget ? (
          <p className="text-xs text-red-500 font-medium">You have exceeded your monthly budgeted expenses.</p>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You have <span className="font-semibold">{formatCurrency(budget - expenses, currency)}</span> remaining for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
