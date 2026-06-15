import { Link } from 'react-router-dom';
import { Car, ExternalLink, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="relative bg-surface-light/30 backdrop-blur-sm">
        {/* Subtle background orb */}
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/[0.03] rounded-full filter blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/15 ring-1 ring-white/10">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight font-display">
                  Auto<span className="text-primary-light">Pazar</span>
                </span>
              </Link>
              <p className="text-sm text-text-muted leading-relaxed">
                Türkiye'nin AI destekli araç alım-satım platformu. Güvenle alın, güvenle satın.
              </p>
            </div>

            {/* Hızlı Bağlantılar */}
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-5 uppercase tracking-wider">Hızlı Bağlantılar</h4>
              <ul className="space-y-3">
                {[
                  { to: '/ilanlar', label: 'Tüm İlanlar' },
                  { to: '/ilan-olustur', label: 'İlan Ver' },
                  { to: '/ilanlar?bodyType=SUV', label: 'SUV Araçlar' },
                  { to: '/ilanlar?fuelType=ELEKTRIK', label: 'Elektrikli Araçlar' },
                ].map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group/link flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-light transition-colors duration-200"
                    >
                      <span className="w-0 group-hover/link:w-3 transition-all duration-200 overflow-hidden">
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Markalar */}
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-5 uppercase tracking-wider">Popüler Markalar</h4>
              <ul className="space-y-3">
                {[
                  { brand: 'BMW' },
                  { brand: 'Mercedes-Benz' },
                  { brand: 'Volkswagen' },
                  { brand: 'Toyota' },
                ].map(item => (
                  <li key={item.brand}>
                    <Link
                      to={`/ilanlar?brand=${item.brand}`}
                      className="group/link flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-light transition-colors duration-200"
                    >
                      <span className="w-0 group-hover/link:w-3 transition-all duration-200 overflow-hidden">
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                      {item.brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-5 uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  info@autopazar.com
                </li>
              </ul>
              <div className="flex gap-2.5 mt-5">
                <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_16px_rgba(59,130,246,0.1)] transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_16px_rgba(59,130,246,0.1)] transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-muted">
              © 2024 AutoPazar. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              AI destekli fiyat tahminleri bilgilendirme amaçlıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
