import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

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
      toast.success('Welcome back!')
      navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-earth-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-bold text-white">
            Geoli<span className="text-brand-400">crafts</span>
          </span>
          <p className="text-earth-400 mt-2 text-sm">Admin Portal</p>
        </div>

        <div className="bg-earth-900 rounded-2xl p-8 shadow-2xl border border-earth-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Sign In</h1>
              <p className="text-earth-400 text-xs">Authorised personnel only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@geolicrafts.com"
                  className="w-full bg-earth-800 border border-earth-700 text-white placeholder-earth-500 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-earth-800 border border-earth-700 text-white placeholder-earth-500 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
