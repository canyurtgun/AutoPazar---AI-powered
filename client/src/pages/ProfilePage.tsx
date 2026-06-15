import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, Car, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { listingsAPI, authAPI } from '../services/endpoints';
import { Listing, formatPrice, timeAgo } from '../types';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites'>('listings');

  useEffect(() => {
    listingsAPI.getMyListings()
      .then(({ data }) => setMyListings(data.listings))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await authAPI.updateProfile(form);
      setUser(data as any);
      setEditing(false);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-28">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30">
          <div className="p-6 rounded-[calc(1rem-1px)] bg-surface-card/90 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/15 ring-1 ring-white/10">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  {editing ? (
                    <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="text-xl font-bold bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all" />
                  ) : (
                    <h1 className="text-xl font-bold text-text-primary font-display">{user?.fullName}</h1>
                  )}
                  <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1"><Mail className="w-3 h-3" />{user?.email}</p>
                  {editing ? (
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="mt-1.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-primary/40 transition-all" />
                  ) : user?.phone && (
                    <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3" />{user.phone}</p>
                  )}
                </div>
              </div>
              {editing ? (
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all ring-1 ring-white/10"><Save className="w-4 h-4" />Kaydet</button>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-text-secondary hover:border-primary/30 hover:text-white hover:bg-white/[0.06] transition-all"><Edit2 className="w-4 h-4" />Düzenle</button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mt-6 mb-6">
        <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'listings' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20 ring-1 ring-white/10' : 'bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:bg-white/[0.06] hover:border-white/[0.1]'}`}>
          <Car className="w-4 h-4" />İlanlarım
        </button>
        <button onClick={() => setActiveTab('favorites')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'favorites' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20 ring-1 ring-white/10' : 'bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:bg-white/[0.06] hover:border-white/[0.1]'}`}>
          <Heart className="w-4 h-4" />Favorilerim
        </button>
      </div>

      {/* Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          {myListings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Car className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-muted mb-5">Henüz ilanınız yok</p>
              <Link to="/ilan-olustur" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all ring-1 ring-white/10">İlan Ver</Link>
            </div>
          ) : (
            myListings.map((listing, i) => (
              <motion.div key={listing.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/ilan/${listing.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-surface-card to-surface-light flex items-center justify-center text-2xl shrink-0 border border-white/[0.04]">🚗</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary-light transition-colors">{listing.title}</p>
                    <p className="text-xs text-text-muted">{listing.brand} {listing.model} • {listing.year} • {timeAgo(listing.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-light">{formatPrice(listing.price)}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-lg font-medium ${listing.status === 'ACTIVE' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                      {listing.status === 'ACTIVE' ? 'Aktif' : listing.status === 'SOLD' ? 'Satıldı' : listing.status}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
