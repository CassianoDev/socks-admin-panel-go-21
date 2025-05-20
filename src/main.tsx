
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './components/auth/AuthContext'
import { Toaster } from './components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient()

// Carregar o tema do localStorage ou usar o padrão
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(savedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
