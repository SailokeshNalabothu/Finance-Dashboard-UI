import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-md" 
            onClick={onClose}
          />
          
          {/* Modal Dialog */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.35 }}
            className="relative z-50 w-full max-w-md overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-6 text-left shadow-2xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/90 mx-4"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                {title}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 text-slate-800 dark:text-slate-200">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
