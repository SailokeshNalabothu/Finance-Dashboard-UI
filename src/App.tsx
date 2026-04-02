import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import { Layout } from './components/Layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Login } from './pages/Login'
import { Toaster } from 'sonner'

function App() {
  const { theme, isAuthenticated } = useStore()
  const [activePage, setActivePage] = useState<'dashboard' | 'transactions'>('dashboard');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <div className={theme}>
        <Login />
        <Toaster theme={theme === 'dark' ? 'dark' : 'light'} position="top-center" />
      </div>
    )
  }

  return (
    <div className={theme}>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {activePage === 'dashboard' ? <Dashboard /> : <Transactions />}
      </Layout>
      <Toaster theme={theme === 'dark' ? 'dark' : 'light'} position="top-right" />
    </div>
  )
}

export default App
