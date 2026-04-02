import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

// TS bindings for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { addTransaction } = useStore();

  useEffect(() => {
    // We bind transcript to process only on end, but save states here to decouple.
  }, []);

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("AI Voice recognition is natively blocked or unsupported by this browser instance.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    let finalTranscript = '';
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      finalTranscript = event.results[0][0].transcript; // Capture best match
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscript || transcript) {
        processCommand(finalTranscript || transcript);
      }
      setTimeout(() => setTranscript(''), 2000);
    };

    recognition.start();
  };

  const processCommand = (command: string) => {
    const text = command.toLowerCase();
    
    const isIncome = text.includes('income') || text.includes('earned') || text.includes('salary');
    const type = isIncome ? 'income' : 'expense';
    
    const amountMatch = text.match(/\d+(\.\d+)?/);
    if (!amountMatch) {
      toast.error("NLP Engine failed to parse numerical amount. Format required: 'Add expense of 50 for food'");
      return;
    }
    const amount = parseFloat(amountMatch[0]);

    const categories = ['housing', 'food', 'transportation', 'utilities', 'insurance', 'salary', 'recreation', 'personal', 'medical'];
    let category = 'Miscellaneous';
    for (const c of categories) {
      if (text.includes(c)) {
        category = c.charAt(0).toUpperCase() + c.slice(1);
        break;
      }
    }

    addTransaction({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      amount,
      category,
      type,
      description: 'Voice Parsed: ' + command
    });
    
    toast.success(`Voice Matrix Processed: Injected ${type} constraint of $${amount}.`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-16 right-0 mb-2 w-72 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl"
          >
            <p className="text-slate-500 font-medium text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI Listening Module
            </p>
            <p className="text-slate-900 dark:text-white font-medium text-sm mt-2 min-h-[40px]">
              {transcript ? `"${transcript}"` : "Initializing acoustic engine..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={handleListen}
        className={`relative flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/50' 
            : 'bg-primary hover:bg-primary/90 shadow-primary/30'
        }`}
      >
        {isListening ? (
           <Mic className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
