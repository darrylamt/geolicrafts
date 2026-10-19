import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import ScrollToTop from './components/ui/ScrollToTop'

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

const admin = page => (
  <ProtectedRoute>
    <AdminLayout>{page}</AdminLayout>
  </ProtectedRoute>
)

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
      <Route path="/admin" element={admin(<AdminDashboard />)} />
      <Route path="/admin/products" element={admin(<AdminProducts />)} />
      <Route path="/admin/blog" element={admin(<AdminBlog />)} />
      <Route path="/admin/messages" element={admin(<AdminMessages />)} />
      <Route path="/admin/import" element={admin(<AdminImport />)} />

      {/* Fallback */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5 pt-24">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="text-6xl md:text-8xl text-stone-900 mb-4">Lost the thread.</h1>
      <p className="text-stone-500 text-lg mb-10 max-w-md">
        The page you're looking for has moved or never existed.
      </p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AppRoutes />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '999px',
            fontSize: '14px',
            background: '#1c1917',
            color: '#fafaf9',
            padding: '10px 18px',
          },
          success: { iconTheme: { primary: '#cd7d58', secondary: '#1c1917' } },
        }}
      />
    </AuthProvider>
  )
}
