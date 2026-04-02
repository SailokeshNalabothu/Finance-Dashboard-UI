import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';

export function BalanceHistory() {
  const { transactions, currency } = useStore();

  const chartData = useMemo(() => {
    // Group transactions by date
    const dailyMap = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(tx => {
      const dateKey = tx.date; // already YYYY-MM-DD
      const existing = dailyMap.get(dateKey) || { income: 0, expense: 0 };
      if (tx.type === 'income') {
        existing.income += tx.amount;
      } else {
        existing.expense += tx.amount;
      }
      dailyMap.set(dateKey, existing);
    });

    const sortedDates = Array.from(dailyMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    return sortedDates.map(dateStr => ({
      date: format(parseISO(dateStr), 'MMM dd'),
      income: dailyMap.get(dateStr)?.income || 0,
      expense: dailyMap.get(dateStr)?.expense || 0,
    }));
  }, [transactions]);

  if (!chartData.length) {
    return <div className="h-full flex items-center justify-center text-slate-400 text-sm">No transaction history</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
        <XAxis 
          dataKey="date" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value, currency).replace(/\.00$/, '')}
        />
        <Tooltip 
          formatter={(value: any) => formatCurrency(Number(value), currency)}
          contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Line 
          type="monotone" 
          name="Income"
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={{ r: 4, strokeWidth: 2 }} 
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          name="Expense"
          dataKey="expense" 
          stroke="#f87171" 
          strokeWidth={3} 
          dot={{ r: 4, strokeWidth: 2 }} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
