import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

// Public pages
import Home from './pages/Home'
import Products from './pages/Products'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminBlog from './pages/admin/AdminBlog'
import AdminMessages from './pages/admin/AdminMessages'
import AdminImport from './pages/admin/AdminImport'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/blog" element={<Layout><Blog /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <AdminLayout><AdminProducts /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blog" element={
        <ProtectedRoute>
          <AdminLayout><AdminBlog /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/messages" element={
        <ProtectedRoute>
          <AdminLayout><AdminMessages /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/import" element={
        <ProtectedRoute>
          <AdminLayout><AdminImport /></AdminLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="pt-32 pb-16 text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-display text-6xl font-bold text-earth-200 mb-4">404</h1>
      <p className="text-earth-600 text-xl mb-8">Page not found</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '10px', fontSize: '14px' },
          success: { iconTheme: { primary: '#b86915', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  )
}
