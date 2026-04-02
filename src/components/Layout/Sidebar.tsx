import { LayoutDashboard, Wallet, Moon, Sun, Shield, ShieldAlert, X, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { Button } from '../UI/Button';
import { Select } from '../UI/Input';

interface SidebarProps {
  activePage: 'dashboard' | 'transactions';
  setActivePage: (page: 'dashboard' | 'transactions') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ activePage, setActivePage, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const { role, setRole, theme, toggleTheme, logout, currency, setCurrency, dateFilter, setDateFilter } = useStore();

  const toggleRole = () => setRole(role === 'Viewer' ? 'Admin' : 'Viewer');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
  ] as const;

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl px-4 py-8 transition-transform duration-300 lg:static lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex flex-col justify-center items-center">
              <span className="text-primary leading-none -mt-0.5">$</span>
            </div>
            FinDash
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="mt-auto space-y-4 pt-4 border-t border-border">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border">
            <p className="text-xs font-semibold text-slate-500 mb-3 px-1 uppercase tracking-wider">Account Role</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-1 text-sm font-medium">
                {role === 'Admin' ? <ShieldAlert className="h-4 w-4 text-emerald-500" /> : <Shield className="h-4 w-4 text-slate-400" />}
                {role}
              </div>
              <Button variant="outline" size="sm" onClick={toggleRole} className="h-7 text-xs px-2 shadow-none border-dashed hover:border-primary/50 transition-colors">
                Switch
              </Button>
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2 px-1 uppercase tracking-wider">Currency</p>
              <Select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as any)}
                className="h-8 text-xs bg-white dark:bg-slate-900 border-dashed"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-500 mb-2 px-1 uppercase tracking-wider">Date Timeline</p>
              <Select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="h-8 text-xs bg-white dark:bg-slate-900 border-dashed"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date</option>
              </Select>
            </div>
          </div>

          <Button  
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 relative overflow-hidden" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 relative overflow-hidden text-slate-500 hover:text-destructive dark:hover:bg-red-950/30" 
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
}
