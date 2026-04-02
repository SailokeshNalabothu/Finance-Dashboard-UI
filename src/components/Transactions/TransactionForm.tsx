import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionType } from '../../types';
import { Input } from '../UI/Input';
import { Select } from '../UI/Input';
import { Button } from '../UI/Button';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onClose: () => void;
}

const CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Insurance',
  'Medical & Healthcare', 'Saving, Investing, & Debt Payments',
  'Personal Spending', 'Recreation & Entertainment', 'Miscellaneous',
  'Salary', 'Investment', 'Bonus', 'Other Income'
];

export function TransactionForm({ initialData, onClose }: TransactionFormProps) {
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setType(initialData.type);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tx: Transaction = {
      id: initialData ? initialData.id : crypto.randomUUID(),
      date,
      amount: parseFloat(amount),
      category,
      type,
      description
    };

    if (initialData) {
      updateTransaction(tx);
      toast.success("Transaction updated successfully.");
    } else {
      addTransaction(tx);
      toast.success("Transaction added successfully.");
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Type</label>
          <Select 
            value={type} 
            onChange={(e) => setType(e.target.value as TransactionType)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date</label>
          <Input 
            type="date" 
            required 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Amount ($)</label>
        <Input 
          type="number" 
          step="0.01" 
          min="0"
          required 
          placeholder="0.00"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Category</label>
        <Select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description (Optional)</label>
        <Input 
          type="text" 
          placeholder="e.g. Groceries at Walmart"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">{initialData ? 'Save Changes' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
}
