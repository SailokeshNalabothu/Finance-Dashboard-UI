import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import { Wallet, LogIn } from 'lucide-react';

export function Login() {
  const { login } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card glass className="border border-white/40 dark:border-slate-800/80 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] backdrop-blur-3xl px-2 py-4">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
              <Wallet className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Welcome to FinDash
              </CardTitle>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Sign in to manage your financial portfolio safely.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="bg-white/60 dark:bg-slate-900/60 h-11"
                  defaultValue="demo@user.com"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="bg-white/60 dark:bg-slate-900/60 h-11"
                  defaultValue="password"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold group flex items-center justify-center gap-2">
                Sign In
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
