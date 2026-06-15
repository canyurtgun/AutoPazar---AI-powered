import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Car, Menu, X, Plus, User, LogOut, Shield, Heart, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ilanlar?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2 bg-surface/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'py-3.5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.08 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10"
            >
              <Car className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-extrabold text-white tracking-tight hidden sm:block font-display">
              <span className="bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent group-hover:from-primary-light group-hover:to-white transition-all duration-500">Auto</span>
              <span className="text-primary-light">Pazar</span>
            </span>
          </Link>

          {/* Search Bar — Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative group">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-light transition-colors duration-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Araç, marka veya model ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300"
              />
            </div>
          </form>

          {/* Nav — Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/ilanlar"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              Keşfet
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/ilan-olustur"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  İlan Ver
                </Link>

                <div className="relative group ml-1">
                  <button className="flex items-center gap-2 p-1 pr-3 rounded-xl border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold shadow-inner ring-1 ring-white/10">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-white hidden lg:block">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </button>

                  <div className="absolute right-0 top-full mt-2.5 w-52 rounded-2xl glass-strong opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
                    <div className="p-1.5 space-y-0.5">
                      <Link to="/profil" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all">
                        <User className="w-3.5 h-3.5 text-primary-light" />
                        Profilim
                      </Link>
                      <Link to="/favoriler" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all">
                        <Heart className="w-3.5 h-3.5 text-secondary-light" />
                        Favorilerim
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all">
                          <Shield className="w-3.5 h-3.5 text-accent" />
                          Yönetim
                        </Link>
                      )}
                      <div className="h-px bg-white/[0.06] my-1 mx-2"></div>
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-danger hover:bg-danger/10 transition-all text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-1.5">
                <Link
                  to="/giris"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs shadow-lg shadow-white/10 hover:scale-[1.03] hover:shadow-white/15 transition-all duration-300 ring-1 ring-white/20"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] transition-all"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 glass-strong border-b border-white/[0.04]"
        >
          <div className="px-4 py-5 space-y-2.5">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ara..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/40 transition-all"
                />
              </div>
            </form>
            <Link to="/ilanlar" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-white/[0.06] transition-all">
              İlanları Keşfet
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/ilan-olustur" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/10 border border-primary/20">
                  + Yeni İlan Ver
                </Link>
                <Link to="/profil" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/[0.06]">
                  Profilim
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/[0.06]">
                    Yönetim Paneli
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="block w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-danger hover:bg-danger/5">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/giris" onClick={() => setMobileOpen(false)} className="block text-center px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] border border-white/[0.06]">
                  Giriş Yap
                </Link>
                <Link to="/kayit" onClick={() => setMobileOpen(false)} className="block text-center px-3 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-gray-100">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
