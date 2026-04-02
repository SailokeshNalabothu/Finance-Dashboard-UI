import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];

export function CategoryDistribution() {
  const { transactions, currency } = useStore();

  const chartData = useMemo(() => {
    const expenseOnly = transactions.filter(t => t.type === 'expense');
    const categoryMap = new Map<string, number>();

    expenseOnly.forEach(tx => {
      categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
    });

    const data = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    return data.sort((a, b) => b.value - a.value); // highest first
  }, [transactions]);

  if (!chartData.length) {
    return <div className="h-full flex items-center justify-center text-slate-400 text-sm">No expenses to visualize</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => formatCurrency(Number(value), currency)}
          contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
