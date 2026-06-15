import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Car } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 pt-28 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-float w-[400px] h-[400px] bg-primary/[0.06] -top-32 -right-32"></div>
      <div className="orb orb-float-alt w-[350px] h-[350px] bg-secondary/[0.05] -bottom-24 -left-24"></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
          <div className="glass-strong rounded-3xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display">Hoş Geldiniz</h1>
              <p className="text-sm text-text-muted mt-1.5">Hesabınıza giriş yapın</p>
            </div>

            {/* Demo hesap bilgisi */}
            <div className="mb-6 p-3.5 rounded-xl bg-info/[0.08] border border-info/15">
              <p className="text-xs text-info font-semibold mb-1.5">Demo Hesaplar:</p>
              <p className="text-xs text-text-muted">Admin: admin@autopazar.com / admin123</p>
              <p className="text-xs text-text-muted">User: ahmet@example.com / user123</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-danger/[0.08] border border-danger/15 text-sm text-danger"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">E-posta</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Şifre</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ring-1 ring-white/10"
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted mt-7">
              Hesabınız yok mu?{' '}
              <Link to="/kayit" className="text-primary-light hover:text-white font-semibold transition-colors">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
