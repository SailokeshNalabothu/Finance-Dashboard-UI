import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useStore } from '../../store/useStore';
import { Download, Moon, Sun, LayoutDashboard, Wallet, LogOut, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  setActivePage: (page: 'dashboard' | 'transactions') => void;
}

export function CommandPalette({ setActivePage }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const { toggleTheme, theme, logout, transactions, setDateFilter } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    setInputValue('');
    action();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return toast.error("No transactions available");
    const headers = ['ID', 'Date', 'Amount', 'Category', 'Type', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => `${tx.id},${tx.date},${tx.amount},"${tx.category}",${tx.type},"${tx.description || ''}"`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FinDash_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success("CSV Downloaded gracefully via Cmd+K");
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog 
          open={open} 
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
              <Command.Input 
                value={inputValue}
                onValueChange={setInputValue}
                autoFocus 
                placeholder="Type a command or search..." 
                className="w-full h-14 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
              <Command.Empty className="py-6 text-center text-sm text-slate-500">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Command.Item 
                  onSelect={() => runCommand(() => setActivePage('dashboard'))}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-500" /> Go to Dashboard
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => setActivePage('transactions'))}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                >
                  <Wallet className="h-4 w-4 text-blue-500" /> Go to Transactions
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Actions" className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4">
                <Command.Item 
                  onSelect={() => runCommand(toggleTheme)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-400" />}
                  Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(handleExportCSV)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                >
                  <Download className="h-4 w-4 text-emerald-600" /> Export CSV Data
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => { setDateFilter('30d'); toast.success("Filtered to Last 30 Days"); })}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                >
                  <CheckSquare className="h-4 w-4 text-purple-500" /> Filter Last 30 Days
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => { logout(); toast.info("Logged Out."); })}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 mt-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Command.Item>
              </Command.Group>
            </Command.List>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-center gap-4">
              <span><kbd className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded mr-1 font-sans">↑</kbd> <kbd className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded mr-1 font-sans">↓</kbd> to navigate</span>
              <span><kbd className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded mr-1 font-sans">Enter</kbd> to execute</span>
              <span><kbd className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded mr-1 font-sans">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
