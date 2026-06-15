import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, Car } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.email, form.password, form.fullName, form.phone || undefined);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 pt-28 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-float w-[400px] h-[400px] bg-secondary/[0.06] -top-32 -left-32"></div>
      <div className="orb orb-float-alt w-[350px] h-[350px] bg-primary/[0.05] -bottom-24 -right-24"></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
          <div className="glass-strong rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20 ring-1 ring-white/10">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display">Hesap Oluştur</h1>
              <p className="text-sm text-text-muted mt-1.5">Hemen ücretsiz kayıt olun</p>
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
                <label className="block text-xs font-medium text-text-muted mb-2">Ad Soyad</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Adınız Soyadınız" required className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">E-posta</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" required className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Telefon (Opsiyonel)</label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XX XX" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Şifre</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="En az 6 karakter" required minLength={6} className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none ring-1 ring-white/10">
                {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted mt-7">
              Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="text-primary-light hover:text-white font-semibold transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
