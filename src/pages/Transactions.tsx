import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Card, CardContent } from '../components/UI/Card';
import { Input, Select } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { TransactionForm } from '../components/Transactions/TransactionForm';
import { Search, Plus, ArrowUpDown, Trash2, Edit2, Download } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatCurrency } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Transactions() {
  const { transactions, role, deleteTransaction, currency } = useStore();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Sort State
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Derived Values
  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(tx => tx.type === filterType);
    }
    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(tx => tx.category === filterCategory);
    }
    // Filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.description?.toLowerCase().includes(lower) || 
        tx.category.toLowerCase().includes(lower)
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA = String(a[sortField]);
      const valB = String(b[sortField]);
      
      // Basic string comparison for dates works because of yyyy-MM-dd format
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filterType, filterCategory, searchTerm, sortField, sortOrder]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map((t: Transaction) => t.category))) as string[];
  }, [transactions]);

  const handleAdd = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions available to export.");
      return;
    }
    
    try {
      const headers = ['ID', 'Date', 'Amount', 'Category', 'Type', 'Description'];
      const csvContent = [
        headers.join(','),
        ...transactions.map(tx => 
          `${tx.id},${tx.date},${tx.amount},"${tx.category}",${tx.type},"${tx.description?.replace(/"/g, '""') || ''}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `FinDash_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV file downloaded successfully!");
    } catch {
      toast.error("Failed to export data.");
    }
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) {
      toast.error("No transactions available to export.");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text("FinDash - Financial Statement", 14, 15);
      doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 22);
      
      const tableColumn = ["ID", "Date", "Description", "Category", "Type", "Amount"];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableRows: any[] = [];
      
      transactions.forEach(tx => {
        const txData = [
          tx.id.substring(0, 8),
          tx.date,
          tx.description || '-',
          tx.category,
          tx.type,
          `${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount, currency)}`
        ];
        tableRows.push(txData);
      });
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [15, 23, 42] }
      });
      
      doc.save(`FinDash_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF Report generated successfully!");
    } catch {
      toast.error("Failed to generate PDF document.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track your financial statements.</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto shadow-md hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="w-full sm:w-auto shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>

          {role === 'Admin' && (
            <Button onClick={handleAdd} className="w-full sm:w-auto shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      <Card glass>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-1">
              <Input 
                icon={Search} 
                placeholder="Search description..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value as any)}
                className="w-32 bg-white dark:bg-slate-900"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              
              <Select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="w-40 bg-white dark:bg-slate-900"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">
                      Amount <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  {role === 'Admin' && <th className="px-5 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredAndSorted.length > 0 ? (
                    filteredAndSorted.map((tx) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={tx.id} 
                        className="border-b border-border last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">{tx.date}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{tx.description || '-'}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            {tx.category}
                          </span>
                        </td>
                        <td className={`px-5 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </td>
                        {role === 'Admin' && (
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(tx)} className="h-8 w-8 text-slate-500 hover:text-primary">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => {
                                deleteTransaction(tx.id);
                                toast.success("Transaction deleted securely.");
                              }} className="h-8 w-8 text-slate-500 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={role === 'Admin' ? 5 : 4} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                        No transactions found matching your criteria.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTx ? "Edit Transaction" : "Adding Transaction"}
      >
        <TransactionForm 
          initialData={editingTx} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
