import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../UI/Card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';

export function SummaryCards() {
  const { transactions, currency } = useStore();

  const { income, expenses, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount;
          acc.balance += tx.amount;
        } else {
          acc.expenses += tx.amount;
          acc.balance -= tx.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0, balance: 0 }
    );
  }, [transactions]);

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Income',
      amount: income,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      icon: TrendingDown,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} glass className="overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <div className={cn("p-2 rounded-lg", card.bg)}>
                  <Icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(card.amount, currency)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
