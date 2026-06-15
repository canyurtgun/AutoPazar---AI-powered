import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, X, Search } from 'lucide-react';
import { listingsAPI } from '../services/endpoints';
import { Listing, ListingFilters, PaginationInfo, FUEL_TYPE_LABELS, TRANSMISSION_LABELS, BODY_TYPE_LABELS, FuelType, TransmissionType, BodyType } from '../types';
import ListingCard from '../components/listing/ListingCard';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filters from URL
  const filters: ListingFilters = {
    search: searchParams.get('search') || undefined,
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    yearMin: searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!) : undefined,
    yearMax: searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!) : undefined,
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
    fuelType: (searchParams.get('fuelType') as FuelType) || undefined,
    transmission: (searchParams.get('transmission') as TransmissionType) || undefined,
    bodyType: (searchParams.get('bodyType') as BodyType) || undefined,
    city: searchParams.get('city') || undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams.toString()]);

  useEffect(() => {
    listingsAPI.getBrands().then(({ data }) => setBrands(data)).catch(console.error);
    listingsAPI.getCities().then(({ data }) => setCities(data)).catch(console.error);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await listingsAPI.getAll(filters);
      setListings(data.listings);
      setPagination(data.pagination);
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page on filter change
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) => val && key !== 'page' && key !== 'sortBy' && key !== 'sortOrder'
  ).length;

  const selectClass = "w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300";
  const inputClass = selectClass;

  const SelectFilter = ({ label, name, options }: { label: string; name: string; options: Record<string, string> | string[] }) => (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-2">{label}</label>
      <select
        value={(filters as any)[name] || ''}
        onChange={(e) => updateFilter(name, e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">Tümü</option>
        {Array.isArray(options)
          ? options.map((opt) => <option key={opt} value={opt}>{opt}</option>)
          : Object.entries(options).map(([key, label]) => <option key={key} value={key}>{label}</option>)
        }
      </select>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-28">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">İlanlar</h1>
          {pagination && (
            <p className="text-sm text-text-muted mt-1">{pagination.total} ilan bulundu</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
              showFilters ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-primary/50 shadow-md shadow-primary/20 ring-1 ring-white/10' : 'bg-white/[0.03] border-white/[0.06] text-text-secondary hover:border-primary/30 hover:bg-white/[0.05]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtreler
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              const params = new URLSearchParams(searchParams);
              params.set('sortBy', sortBy);
              params.set('sortOrder', sortOrder);
              setSearchParams(params);
            }}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-secondary focus:outline-none focus:border-primary/40 transition-all"
          >
            <option value="createdAt-desc">En Yeni</option>
            <option value="createdAt-asc">En Eski</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="year-desc">Yıl: Yeniden Eskiye</option>
            <option value="mileage-asc">KM: Azdan Çoğa</option>
          </select>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
            <div className="p-5 rounded-[calc(1rem-1px)] glass-strong">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-text-primary font-display">Filtreler</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-danger hover:text-danger/80 flex items-center gap-1 transition-colors font-medium">
                    <X className="w-3 h-3" />
                    Temizle
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <SelectFilter label="Marka" name="brand" options={brands} />
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Model</label>
                  <input
                    type="text"
                    value={filters.model || ''}
                    onChange={(e) => updateFilter('model', e.target.value || undefined)}
                    placeholder="Ör: 320i, Corolla"
                    className={inputClass}
                  />
                </div>
                <SelectFilter label="Yakıt" name="fuelType" options={FUEL_TYPE_LABELS} />
                <SelectFilter label="Vites" name="transmission" options={TRANSMISSION_LABELS} />
                <SelectFilter label="Kasa" name="bodyType" options={BODY_TYPE_LABELS} />
                <SelectFilter label="Şehir" name="city" options={cities} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Min Fiyat</label>
                  <input type="number" value={filters.priceMin || ''} onChange={(e) => updateFilter('priceMin', e.target.value || undefined)} placeholder="₺" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Max Fiyat</label>
                  <input type="number" value={filters.priceMax || ''} onChange={(e) => updateFilter('priceMax', e.target.value || undefined)} placeholder="₺" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Min Yıl</label>
                  <input type="number" value={filters.yearMin || ''} onChange={(e) => updateFilter('yearMin', e.target.value || undefined)} placeholder="2015" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Max Yıl</label>
                  <input type="number" value={filters.yearMax || ''} onChange={(e) => updateFilter('yearMax', e.target.value || undefined)} placeholder="2024" className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
              <div className="h-48 shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
                <div className="h-6 shimmer rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <Search className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">İlan Bulunamadı</h3>
          <p className="text-text-muted mb-5">Filtrelerinizi değiştirerek tekrar deneyin.</p>
          <button onClick={clearFilters} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all ring-1 ring-white/10">
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => updateFilter('page', String(page))}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                    page === pagination.page
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20 ring-1 ring-white/10'
                      : 'bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:border-primary/30 hover:bg-white/[0.06]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
