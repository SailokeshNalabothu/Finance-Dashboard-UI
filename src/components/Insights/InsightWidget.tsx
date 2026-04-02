import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export function InsightWidget() {
  const transactions = useStore((state) => state.transactions);

  const insights = useMemo(() => {
    // 1. Highest Spending Category
    const categoryTotals = new Map<string, number>();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    expenses.forEach(tx => {
      categoryTotals.set(tx.category, (categoryTotals.get(tx.category) || 0) + tx.amount);
    });

    let highestCategory = '';
    let highestAmount = 0;
    categoryTotals.forEach((val, key) => {
      if (val > highestAmount) {
        highestAmount = val;
        highestCategory = key;
      }
    });

    // 2. Mock MoM (Calculate last 15 days vs previous 15 days for demo)
    const today = new Date();
    let recentExpenses = 0; // 0-15 days
    let pastExpenses = 0;   // 16-30 days

    expenses.forEach(tx => {
      const daysDiff = differenceInDays(today, parseISO(tx.date));
      if (daysDiff <= 15) recentExpenses += tx.amount;
      else if (daysDiff <= 30) pastExpenses += tx.amount;
    });

    let momChange = 0;
    if (pastExpenses > 0) {
      momChange = ((recentExpenses - pastExpenses) / pastExpenses) * 100;
    } else if (recentExpenses > 0 && pastExpenses === 0) {
      momChange = 100;
    }

    const messages = [];
    if (highestCategory) {
      messages.push({
        id: '1',
        title: 'Top Category',
        desc: `You've spent the most on ${highestCategory} ($${highestAmount.toLocaleString()}).`,
        type: 'info',
        icon: Lightbulb
      });
    }

    if (momChange > 10) {
      messages.push({
        id: '2',
        title: 'Spending is up',
        desc: `You've spent ${momChange.toFixed(0)}% more recently compared to the previous period.`,
        type: 'warning',
        icon: TrendingUp
      });
    } else if (momChange < -5) {
      messages.push({
        id: '2',
        title: 'Great Job!',
        desc: `You've reduced your spending by ${Math.abs(momChange).toFixed(0)}% recently. Keep it up!`,
        type: 'success',
        icon: TrendingDown
      });
    } else if (recentExpenses > 0) {
        messages.push({
        id: '2',
        title: 'Consistent Spending',
        desc: `Your spending is relatively stable compared to the previous period.`,
        type: 'info',
        icon: Lightbulb
      });
    }

    return messages;
  }, [transactions]);

  if (insights.length === 0) return null;

  return (
    <Card glass className="bg-primary/5 dark:bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          ✨ AI Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-white dark:bg-slate-900 border border-border">
                <div className={`p-2 rounded-full ${
                  item.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                  item.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
