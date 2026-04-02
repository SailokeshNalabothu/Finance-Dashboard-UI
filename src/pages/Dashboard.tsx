import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { BudgetProgress } from '../components/Dashboard/BudgetProgress';
import { BalanceHistory } from '../components/Charts/BalanceHistory';
import { CategoryDistribution } from '../components/Charts/CategoryDistribution';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { InsightWidget } from '../components/Insights/InsightWidget';
import { motion, type Variants } from 'framer-motion';

export function Dashboard() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVars}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's an overview of your finances.</p>
      </motion.div>

      <motion.div variants={itemVars}>
        <SummaryCards />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={itemVars} className="lg:col-span-4 min-h-[350px]">
          <Card glass className="h-full">
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BalanceHistory />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVars} className="lg:col-span-3 min-h-[350px]">
          <Card glass className="h-full">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CategoryDistribution />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVars}>
          <InsightWidget />
        </motion.div>
        
        <motion.div variants={itemVars}>
          <BudgetProgress />
        </motion.div>
      </div>
    </motion.div>
  );
}
