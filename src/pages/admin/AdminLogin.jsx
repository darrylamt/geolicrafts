import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '../../components/ui/Logo'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error(error.message || 'Invalid credentials')
    } else {
      toast.success('Welcome back')
      navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-stone-50">
      <div className="flex flex-col px-5 sm:px-10 py-8">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="btn-ghost btn-sm -mr-3">
            <ArrowLeft size={14} /> Site
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-16">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-5xl text-stone-900 leading-none">Welcome back.</h1>
            <p className="text-stone-500 mt-3 mb-10">Sign in to manage products, stories and messages.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@geolicrafts.com"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 icon-btn"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full !mt-8">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="text-xs text-stone-400 mt-8 text-center">Authorised personnel only.</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block p-4">
        <div className="relative h-full rounded-[2rem] overflow-hidden bg-stone-200">
          <img src="/pics/process.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
          <p className="absolute bottom-10 left-10 right-10 font-display text-4xl text-white leading-tight">
            “The wood speaks — our duty is simply to translate its language for the world.”
          </p>
        </div>
      </div>
    </div>
  )
}
