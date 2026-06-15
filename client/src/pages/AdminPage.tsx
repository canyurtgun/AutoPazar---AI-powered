import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Car, TrendingUp, Check, X, Clock, Eye } from 'lucide-react';
import { adminAPI } from '../services/endpoints';
import { DashboardStats, Listing, formatPrice, formatNumber, timeAgo } from '../types';

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'users'>('dashboard');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data }) => setDashboard(data)).catch(console.error);
    adminAPI.getListings().then(({ data }) => setListings(data.listings)).catch(console.error);
    adminAPI.getUsers().then(({ data }) => setUsers(data.users)).catch(console.error);
  }, []);

  const updateListingStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateListingStatus(id, status);
      setListings(listings.map(l => l.id === id ? { ...l, status: status as any } : l));
    } catch (e) { console.error(e); }
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'listings' as const, label: 'İlanlar', icon: <Car className="w-4 h-4" /> },
    { id: 'users' as const, label: 'Kullanıcılar', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-28">
      <h1 className="text-2xl font-bold text-text-primary mb-6 font-display">Yönetim Paneli</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20 ring-1 ring-white/10' : 'bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:bg-white/[0.06] hover:border-white/[0.1]'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && dashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Toplam İlan', value: dashboard.stats.totalListings, icon: <Car className="w-5 h-5" />, color: 'text-primary-light', bg: 'from-primary/10 to-primary/5' },
              { label: 'Aktif İlan', value: dashboard.stats.activeListings, icon: <Check className="w-5 h-5" />, color: 'text-success', bg: 'from-success/10 to-success/5' },
              { label: 'Satıldı', value: dashboard.stats.soldListings, icon: <TrendingUp className="w-5 h-5" />, color: 'text-accent-light', bg: 'from-accent/10 to-accent/5' },
              { label: 'Beklemede', value: dashboard.stats.pendingListings, icon: <Clock className="w-5 h-5" />, color: 'text-warning', bg: 'from-warning/10 to-warning/5' },
              { label: 'Kullanıcılar', value: dashboard.stats.totalUsers, icon: <Users className="w-5 h-5" />, color: 'text-info', bg: 'from-info/10 to-info/5' },
              { label: 'Ort. Fiyat', value: formatPrice(dashboard.stats.averagePrice), icon: <BarChart3 className="w-5 h-5" />, color: 'text-secondary-light', bg: 'from-secondary/10 to-secondary/5', raw: true },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group">
                <div className={`p-2 rounded-lg bg-gradient-to-b ${stat.bg} w-fit mb-2.5 group-hover:scale-110 transition-transform ${stat.color}`}>{stat.icon}</div>
                <p className="text-xl font-bold text-text-primary font-display">{(stat as any).raw ? stat.value : formatNumber(stat.value as number)}</p>
                <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Top Brands */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
            <div className="p-5 rounded-[calc(1rem-1px)] bg-surface-card/80 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-text-primary mb-4 font-display">Popüler Markalar</h3>
              <div className="space-y-2">
                {dashboard.topBrands.map((brand, i) => (
                  <motion.div key={brand.brand} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300 group">
                    <span className="text-sm text-text-primary flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-[10px] font-bold text-primary-light">{i + 1}</span>
                      {brand.brand}
                    </span>
                    <span className="text-sm font-semibold text-primary-light">{brand.count} ilan</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings moderation */}
      {activeTab === 'listings' && (
        <div className="space-y-2.5">
          {listings.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{listing.title}</p>
                  <p className="text-xs text-text-muted">{(listing as any).user?.fullName || 'Bilinmiyor'} • {formatPrice(listing.price)} • {timeAgo(listing.createdAt)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  listing.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' :
                  listing.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                  listing.status === 'REJECTED' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-info/10 text-info border-info/20'
                }`}>{listing.status}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => updateListingStatus(listing.id, 'ACTIVE')} className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center hover:bg-success/20 hover:scale-105 transition-all duration-200" title="Onayla">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateListingStatus(listing.id, 'REJECTED')} className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 hover:scale-105 transition-all duration-200" title="Reddet">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="space-y-2.5">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/15 ring-1 ring-white/10">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
                  <p className="text-xs text-text-muted">{user.email} • {user._count?.listings || 0} ilan</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary-light border-primary/20' : 'bg-white/[0.03] text-text-muted border-white/[0.06]'}`}>
                  {user.role}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${user.isActive ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                  {user.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
