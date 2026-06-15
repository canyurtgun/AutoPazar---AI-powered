import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { listingsAPI, aiAPI } from '../services/endpoints';
import { AIPrediction, formatPrice, FUEL_TYPE_LABELS, TRANSMISSION_LABELS, BODY_TYPE_LABELS } from '../types';
import AIPredictionPanel from '../components/ai/AIPredictionPanel';

const STEPS = ['Araç Bilgileri', 'Teknik Detaylar', 'Açıklama & Fiyat', 'Önizleme'];

const BRANDS = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Renault', 'Fiat', 'Audi', 'Honda', 'Hyundai', 'Peugeot', 'Kia', 'Volvo', 'Skoda', 'Tesla', 'TOGG', 'Opel', 'Ford', 'Nissan', 'Mazda', 'Seat'];
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Trabzon', 'Samsun', 'Eskişehir', 'Kayseri', 'Diyarbakır'];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', price: 0,
    brand: '', model: '', year: 2023, mileage: 0,
    fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN',
    color: '', engineSize: '', horsePower: 0,
    city: 'İstanbul', district: '', condition: 'USED',
  });

  const updateForm = (field: string, value: any) => setForm({ ...form, [field]: value });

  const fetchPrediction = async () => {
    if (!form.brand || !form.model) return;
    setAiLoading(true);
    try {
      const { data } = await aiAPI.predict({
        brand: form.brand, model: form.model, year: form.year,
        mileage: form.mileage, fuelType: form.fuelType,
        transmission: form.transmission, bodyType: form.bodyType,
        city: form.city, condition: form.condition,
        userPrice: form.price > 0 ? form.price : undefined,
      });
      setPrediction(data);
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage),
        price: Number(form.price),
        horsePower: form.horsePower ? Number(form.horsePower) : undefined,
        images: [],
      };
      await listingsAPI.create(payload as any);
      navigate('/profil');
    } catch (error: any) {
      alert(error.response?.data?.error || 'İlan oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.brand && form.model && form.year && form.city;
    if (step === 1) return form.fuelType && form.transmission && form.bodyType;
    if (step === 2) return form.title && form.description && form.price > 0;
    return true;
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-300";

  const InputField = ({ label, name, type = 'text', placeholder = '', ...props }: any) => (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-2">{label}</label>
      <input type={type} value={(form as any)[name]} onChange={(e) => updateForm(name, type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder} className={inputClass} {...props} />
    </div>
  );

  const SelectField = ({ label, name, options }: { label: string; name: string; options: Record<string, string> | string[] }) => (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-2">{label}</label>
      <select value={(form as any)[name]} onChange={(e) => updateForm(name, e.target.value)} className={inputClass}>
        <option value="">Seçiniz</option>
        {Array.isArray(options)
          ? options.map(o => <option key={o} value={o}>{o}</option>)
          : Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)
        }
      </select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-28">
      <h1 className="text-2xl font-bold text-text-primary mb-8 font-display">Yeni İlan Oluştur</h1>

      {/* Premium Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center gap-2.5 ${i <= step ? 'text-primary-light' : 'text-text-muted'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                i < step ? 'bg-gradient-to-br from-primary to-primary-dark border-primary/50 text-white shadow-md shadow-primary/20' :
                i === step ? 'border-primary/60 text-primary-light bg-primary/10' :
                'border-white/[0.08] text-text-muted bg-white/[0.02]'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-700 ${i < step ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-white/[0.06]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
              <div className="p-6 rounded-[calc(1rem-1px)] bg-surface-card/80 backdrop-blur-sm">
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-5 font-display">Araç Bilgileri</h2>
                    <SelectField label="Marka *" name="brand" options={BRANDS} />
                    <InputField label="Model *" name="model" placeholder="Ör: 320i, Corolla, Golf" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Yıl *" name="year" type="number" />
                      <InputField label="Kilometre *" name="mileage" type="number" placeholder="0" />
                    </div>
                    <SelectField label="Şehir *" name="city" options={CITIES} />
                    <InputField label="İlçe" name="district" placeholder="Ör: Kadıköy" />
                    <SelectField label="Durum" name="condition" options={{ SIFIR: 'Sıfır', USED: 'İkinci El' }} />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-5 font-display">Teknik Detaylar</h2>
                    <SelectField label="Yakıt Tipi *" name="fuelType" options={FUEL_TYPE_LABELS} />
                    <SelectField label="Vites *" name="transmission" options={TRANSMISSION_LABELS} />
                    <SelectField label="Kasa Tipi *" name="bodyType" options={BODY_TYPE_LABELS} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Renk" name="color" placeholder="Ör: Siyah" />
                      <InputField label="Motor Hacmi" name="engineSize" placeholder="Ör: 2.0" />
                    </div>
                    <InputField label="Beygir Gücü" name="horsePower" type="number" placeholder="Ör: 170" />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-5 font-display">Açıklama & Fiyat</h2>
                    <InputField label="İlan Başlığı *" name="title" placeholder="Ör: 2021 BMW 320i M Sport — Hatasız, Boyasız" />
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-2">Açıklama *</label>
                      <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={5} placeholder="Aracınız hakkında detaylı bilgi yazın..." className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-2">Fiyat (₺) *</label>
                      <input type="number" value={form.price || ''} onChange={(e) => updateForm('price', Number(e.target.value))} placeholder="0" className={inputClass} />
                    </div>
                    <button type="button" onClick={fetchPrediction} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/15 hover:shadow-[0_0_16px_rgba(16,185,129,0.08)] transition-all duration-300">
                      <Sparkles className="w-4 h-4" />
                      AI Fiyat Önerisi Al
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-5 font-display">Önizleme</h2>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <h3 className="font-semibold text-text-primary">{form.title}</h3>
                        <p className="text-2xl font-black text-primary-light mt-2 font-display">{formatPrice(form.price)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {[
                          ['Marka', form.brand], ['Model', form.model], ['Yıl', form.year],
                          ['KM', form.mileage.toLocaleString()], ['Yakıt', FUEL_TYPE_LABELS[form.fuelType as keyof typeof FUEL_TYPE_LABELS]],
                          ['Vites', TRANSMISSION_LABELS[form.transmission as keyof typeof TRANSMISSION_LABELS]],
                          ['Kasa', BODY_TYPE_LABELS[form.bodyType as keyof typeof BODY_TYPE_LABELS]], ['Şehir', form.city],
                        ].map(([l, v]) => (
                          <div key={l as string} className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                            <span className="text-text-muted">{l}:</span>
                            <span className="font-medium text-text-primary">{v}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-text-secondary p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">{form.description}</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/[0.04]">
                  {step > 0 ? (
                    <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all">
                      <ChevronLeft className="w-4 h-4" /> Geri
                    </button>
                  ) : <div />}

                  {step < STEPS.length - 1 ? (
                    <button onClick={() => { setStep(step + 1); if (step === 1) fetchPrediction(); }} disabled={!canProceed()} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none ring-1 ring-white/10">
                      İleri <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none ring-1 ring-white/10">
                      {loading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar — AI Prediction */}
        <div className="lg:col-span-1">
          {(prediction || aiLoading) && (
            <div className="sticky top-24">
              <AIPredictionPanel prediction={prediction!} isLoading={aiLoading} />
            </div>
          )}
          {!prediction && !aiLoading && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-sm text-text-muted">Araç bilgilerini girdikten sonra AI fiyat önerisi burada görünecek.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
