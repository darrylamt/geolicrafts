import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/ui/ScrollToTop'
import Seo from './components/ui/Seo'
import { useI18n } from './i18n'

// Public pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductPage from './pages/ProductPage'
import Quote from './pages/Quote'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Contact from './pages/Contact'

// Loaded on demand so visitors never download admin code
const Catalogue = lazy(() => import('./pages/Catalogue'))
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminImport = lazy(() => import('./pages/admin/AdminImport'))

function Spinner() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
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
    <Suspense fallback={<Spinner />}>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/products/:slug" element={<Layout><ProductPage /></Layout>} />
      <Route path="/quote" element={<Layout><Quote /></Layout>} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/blog" element={<Layout><Blog /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={admin(<AdminDashboard />)} />
      <Route path="/admin/products" element={admin(<AdminProducts />)} />
      <Route path="/admin/categories" element={admin(<AdminCategories />)} />
      <Route path="/admin/testimonials" element={admin(<AdminTestimonials />)} />
      <Route path="/admin/blog" element={admin(<AdminBlog />)} />
      <Route path="/admin/messages" element={admin(<AdminMessages />)} />
      <Route path="/admin/import" element={admin(<AdminImport />)} />

      {/* Fallback */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
    </Suspense>
  )
}

function NotFound() {
  const { t } = useI18n()
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5 pt-24">
      <Seo title={t('notFound.title')} />
      <p className="eyebrow mb-4">{t('notFound.eyebrow')}</p>
      <h1 className="text-6xl md:text-8xl text-stone-900 mb-4">{t('notFound.title')}</h1>
      <p className="text-stone-500 text-lg mb-10 max-w-md">{t('notFound.text')}</p>
      <Link to="/" className="btn-primary">{t('notFound.cta')}</Link>
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
