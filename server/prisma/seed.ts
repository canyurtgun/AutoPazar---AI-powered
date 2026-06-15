import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed verileri yükleniyor...');

  // Admin kullanıcı oluştur
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autopazar.com' },
    update: {},
    create: {
      email: 'admin@autopazar.com',
      passwordHash: adminPassword,
      fullName: 'Admin Kullanıcı',
      phone: '05551234567',
      role: 'ADMIN',
    },
  });

  // Normal kullanıcılar oluştur
  const userPassword = await bcrypt.hash('user123', 10);
  const users = [];
  const userData = [
    { email: 'ahmet@example.com', fullName: 'Ahmet Yılmaz', phone: '05321112233' },
    { email: 'ayse@example.com', fullName: 'Ayşe Kaya', phone: '05334445566' },
    { email: 'mehmet@example.com', fullName: 'Mehmet Demir', phone: '05367778899' },
    { email: 'fatma@example.com', fullName: 'Fatma Çelik', phone: '05449990011' },
    { email: 'ali@example.com', fullName: 'Ali Öztürk', phone: '05422223344' },
  ];

  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        passwordHash: userPassword,
        role: 'USER',
      },
    });
    users.push(user);
  }

  const allUsers = [admin, ...users];

  // İlan verileri
  const listings = [
    // BMW
    { title: '2021 BMW 3.20i M Sport — Hatasız, Boyasız', description: 'Garaj arabası, düzenli bakımlı. Tüm servis kayıtları mevcuttur. Hayalet gösterge, harman kardon ses sistemi, adaptif far paketi, geniş ekran navigasyon.', price: 2850000, brand: 'BMW', model: '320i', year: 2021, mileage: 35000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Siyah', engineSize: '2.0', horsePower: 170, city: 'İstanbul', district: 'Kadıköy', condition: 'USED' },
    { title: '2020 BMW 5.20i Comfort Plus', description: 'Tek sahibinden, tramersiz araç. Head-up display, 360 derece kamera, pnömatik süspansiyon. Yeni nesil kokpit.', price: 3200000, brand: 'BMW', model: '520i', year: 2020, mileage: 48000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '2.0', horsePower: 170, city: 'Ankara', district: 'Çankaya', condition: 'USED' },
    { title: '2022 BMW X3 xDrive20i — Full Paket', description: 'M Sport paket, panoramik cam tavan, elektrikli bagaj, kablosuz şarj, Apple CarPlay.', price: 3750000, brand: 'BMW', model: 'X3', year: 2022, mileage: 22000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Gri', engineSize: '2.0', horsePower: 184, city: 'İzmir', district: 'Karşıyaka', condition: 'USED' },
    { title: '2019 BMW 1.18i Joy Plus — Uygun Fiyat', description: 'Ekonomik kullanım, düşük yakıt tüketimi. Gençlere özel uygun fiyat.', price: 1450000, brand: 'BMW', model: '118i', year: 2019, mileage: 62000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Mavi', engineSize: '1.5', horsePower: 136, city: 'İstanbul', district: 'Beşiktaş', condition: 'USED' },

    // Mercedes-Benz
    { title: '2021 Mercedes C200d AMG — Burmester, Panoramik', description: 'AMG line paket, Burmester ses sistemi, panoramik cam tavan. Digital kokpit, MBUX multimedya.', price: 3100000, brand: 'Mercedes-Benz', model: 'C200d', year: 2021, mileage: 40000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Siyah', engineSize: '2.0', horsePower: 163, city: 'İstanbul', district: 'Sarıyer', condition: 'USED' },
    { title: '2023 Mercedes A180 Style — Sıfır Gibi', description: 'Sadece 8.000 km. Garanti kapsamında. MBUX, geri görüş kamerası, çarpışma önleme.', price: 2400000, brand: 'Mercedes-Benz', model: 'A180', year: 2023, mileage: 8000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Beyaz', engineSize: '1.3', horsePower: 136, city: 'Ankara', district: 'Yenimahalle', condition: 'USED' },
    { title: '2020 Mercedes GLC 250d 4Matic — Off-Road Paket', description: 'Off-road paket, çelik jant, tam deri döşeme, elektrikli ön koltuklar, navigasyon.', price: 3500000, brand: 'Mercedes-Benz', model: 'GLC250d', year: 2020, mileage: 55000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Gümüş', engineSize: '2.2', horsePower: 204, city: 'Bursa', district: 'Nilüfer', condition: 'USED' },

    // Volkswagen
    { title: '2022 Volkswagen Golf 1.5 TSI R-Line', description: 'R-Line donanım, dijital kokpit, LED farlar, adaptif hız sabitleyici. Sportif ve ekonomik.', price: 1850000, brand: 'Volkswagen', model: 'Golf', year: 2022, mileage: 28000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Kırmızı', engineSize: '1.5', horsePower: 150, city: 'İstanbul', district: 'Maltepe', condition: 'USED' },
    { title: '2021 Volkswagen Passat 1.5 TSI Elegance', description: 'Elegance donanım, tam dijital gösterge paneli, ergoActive koltuk, 3 bölgeli klima.', price: 2100000, brand: 'Volkswagen', model: 'Passat', year: 2021, mileage: 42000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Siyah', engineSize: '1.5', horsePower: 150, city: 'İzmir', district: 'Bornova', condition: 'USED' },
    { title: '2023 Volkswagen T-Roc 1.5 TSI Style', description: 'Style donanım, dijital kokpit, geri görüş kamerası, park sensörleri. Düşük kilometre.', price: 2000000, brand: 'Volkswagen', model: 'T-Roc', year: 2023, mileage: 12000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Turuncu', engineSize: '1.5', horsePower: 150, city: 'Antalya', district: 'Muratpaşa', condition: 'USED' },

    // Toyota
    { title: '2022 Toyota Corolla 1.8 Hybrid Dream', description: 'Hybrid teknoloji, düşük yakıt tüketimi. Toyota güvencesi ve garanti kapsamında.', price: 1650000, brand: 'Toyota', model: 'Corolla', year: 2022, mileage: 30000, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '1.8', horsePower: 122, city: 'Ankara', district: 'Etimesgut', condition: 'USED' },
    { title: '2021 Toyota C-HR 1.8 Hybrid Passion X-Pack', description: 'X-Pack donanım, JBL ses sistemi, kablosuz şarj, head-up display. Sportif tasarım.', price: 1900000, brand: 'Toyota', model: 'C-HR', year: 2021, mileage: 38000, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Gri', engineSize: '1.8', horsePower: 122, city: 'İstanbul', district: 'Ataşehir', condition: 'USED' },
    { title: '2020 Toyota RAV4 2.5 Hybrid — 4x4 AWD', description: 'AWD 4x4, kış modu, tam otonom sürüş desteği Level 2. Geniş iç hacim, 7 inç ekran.', price: 2300000, brand: 'Toyota', model: 'RAV4', year: 2020, mileage: 52000, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Yeşil', engineSize: '2.5', horsePower: 218, city: 'Trabzon', district: 'Ortahisar', condition: 'USED' },

    // Renault
    { title: '2023 Renault Clio 1.0 TCe Touch — Az Kullanılmış', description: 'Touch donanım, 7 inç multimedya, geri görüş kamerası. Ekonomik şehir aracı.', price: 850000, brand: 'Renault', model: 'Clio', year: 2023, mileage: 15000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Turuncu', engineSize: '1.0', horsePower: 90, city: 'İstanbul', district: 'Bağcılar', condition: 'USED' },
    { title: '2022 Renault Megane 1.3 TCe Icon — Sedan', description: 'Icon donanım, tam dijital gösterge, navigasyon, LED far paketi. Geniş bagaj.', price: 1200000, brand: 'Renault', model: 'Megane', year: 2022, mileage: 35000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Mavi', engineSize: '1.3', horsePower: 140, city: 'Konya', district: 'Selçuklu', condition: 'USED' },
    { title: '2021 Renault Kadjar 1.3 TCe Icon — SUV', description: 'Icon donanım, panoramik cam tavan, bose ses sistemi, 4x2 sürüş. Konforlu aile aracı.', price: 1400000, brand: 'Renault', model: 'Kadjar', year: 2021, mileage: 45000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Siyah', engineSize: '1.3', horsePower: 140, city: 'Gaziantep', condition: 'USED' },

    // Fiat
    { title: '2022 Fiat Egea 1.4 Fire Easy — Sıfır Tadında', description: 'Easy donanım, 7 inç ekran, Bluetooth, USB. Ekonomik ve pratik.', price: 720000, brand: 'Fiat', model: 'Egea', year: 2022, mileage: 20000, fuelType: 'BENZIN', transmission: 'MANUEL', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '1.4', horsePower: 95, city: 'İstanbul', district: 'Esenyurt', condition: 'USED' },
    { title: '2023 Fiat Egea Cross 1.4 Fire — Crossover', description: 'Cross donanım, yükseltilmiş süspansiyon, siyah plastik kaplamalı çamurluklar.', price: 920000, brand: 'Fiat', model: 'Egea Cross', year: 2023, mileage: 10000, fuelType: 'BENZIN', transmission: 'MANUEL', bodyType: 'HATCHBACK', color: 'Gri', engineSize: '1.4', horsePower: 95, city: 'Ankara', district: 'Mamak', condition: 'USED' },
    { title: '2021 Fiat 500 1.2 Lounge — Cabrio', description: 'Lounge donanım, açılır tavan, deri direksiyon, alaşım jantlar. Şık şehir aracı.', price: 780000, brand: 'Fiat', model: '500', year: 2021, mileage: 32000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'CABRIO', color: 'Krem', engineSize: '1.2', horsePower: 69, city: 'İzmir', district: 'Alsancak', condition: 'USED' },

    // Audi
    { title: '2021 Audi A3 Sportback 35 TFSI S-Line', description: 'S-Line donanım, sanal kokpit, MMI navigasyon, matrix LED farlar. Dinamik sürüş.', price: 2200000, brand: 'Audi', model: 'A3', year: 2021, mileage: 38000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Gri', engineSize: '1.5', horsePower: 150, city: 'İstanbul', district: 'Şişli', condition: 'USED' },
    { title: '2020 Audi A4 40 TFSI Advanced — Quattro', description: 'Advanced donanım, quattro 4x4, bang & olufsen ses, 360 kamera. Premium sedan.', price: 2600000, brand: 'Audi', model: 'A4', year: 2020, mileage: 50000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Lacivert', engineSize: '2.0', horsePower: 190, city: 'Ankara', district: 'Çankaya', condition: 'USED' },
    { title: '2022 Audi Q3 35 TFSI S-Line — SUV', description: 'S-Line donanım, panoramik tavan, sanal kokpit plus, adaptif sürüş asistanı.', price: 2800000, brand: 'Audi', model: 'Q3', year: 2022, mileage: 25000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Beyaz', engineSize: '1.5', horsePower: 150, city: 'İzmir', district: 'Konak', condition: 'USED' },

    // Honda
    { title: '2022 Honda Civic 1.5 VTEC Turbo Elegance', description: 'Elegance donanım, Honda SENSING güvenlik paketi, kablosuz Apple CarPlay.', price: 1750000, brand: 'Honda', model: 'Civic', year: 2022, mileage: 25000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Kırmızı', engineSize: '1.5', horsePower: 182, city: 'İstanbul', district: 'Üsküdar', condition: 'USED' },
    { title: '2021 Honda HR-V 1.5 i-VTEC Executive', description: 'Executive donanım, panoramik cam tavan, deri koltuk, navigasyon. Kompakt SUV.', price: 1500000, brand: 'Honda', model: 'HR-V', year: 2021, mileage: 40000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Siyah', engineSize: '1.5', horsePower: 130, city: 'Bursa', district: 'Osmangazi', condition: 'USED' },

    // Hyundai
    { title: '2023 Hyundai Tucson 1.6 CRDi Elite — Yeni Kasa', description: 'Yeni kasa, parametrik grill, Bose ses sistemi, kablosuz şarj. Modern tasarım.', price: 2100000, brand: 'Hyundai', model: 'Tucson', year: 2023, mileage: 18000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Beyaz', engineSize: '1.6', horsePower: 136, city: 'İstanbul', district: 'Beylikdüzü', condition: 'USED' },
    { title: '2022 Hyundai i20 1.4 MPI Elite — Tam Otomatik', description: 'Elite donanım, 10.25 inç ekran, dijital gösterge, Bluelink bağlantı. Ekonomik.', price: 900000, brand: 'Hyundai', model: 'i20', year: 2022, mileage: 22000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Yeşil', engineSize: '1.4', horsePower: 100, city: 'Adana', district: 'Seyhan', condition: 'USED' },
    { title: '2021 Hyundai Kona 1.6 CRDi Elite — 4x4', description: 'Elite donanım, 4x4 sürüş, head-up display, ventilasyonlu koltuklar. Arazi yeteneği.', price: 1350000, brand: 'Hyundai', model: 'Kona', year: 2021, mileage: 48000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Turuncu', engineSize: '1.6', horsePower: 136, city: 'Eskişehir', condition: 'USED' },

    // Peugeot
    { title: '2022 Peugeot 3008 1.5 BlueHDi Allure', description: 'Allure donanım, i-Cockpit, focal ses sistemi, gece görüş. Fütürist tasarım.', price: 1800000, brand: 'Peugeot', model: '3008', year: 2022, mileage: 30000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Mavi', engineSize: '1.5', horsePower: 130, city: 'İstanbul', district: 'Bakırköy', condition: 'USED' },
    { title: '2023 Peugeot 208 1.2 PureTech Active', description: 'Active donanım, i-Cockpit 3D, 7 inç ekran, Apple CarPlay. Şık tasarım.', price: 820000, brand: 'Peugeot', model: '208', year: 2023, mileage: 12000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Sarı', engineSize: '1.2', horsePower: 100, city: 'Antalya', district: 'Konyaaltı', condition: 'USED' },

    // Kia
    { title: '2022 Kia Sportage 1.6 CRDi Prestige — Yeni Kasa', description: 'Yeni nesil tasarım, panoramik kavisli ekran, Harman Kardon, ventilasyonlu koltuklar.', price: 2050000, brand: 'Kia', model: 'Sportage', year: 2022, mileage: 26000, fuelType: 'DIZEL', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Gri', engineSize: '1.6', horsePower: 136, city: 'İstanbul', district: 'Pendik', condition: 'USED' },
    { title: '2021 Kia Ceed 1.4 T-GDi Prestige — Station Wagon', description: 'Station wagon, geniş bagaj, prestige donanım, LED farlar, akıllı park asistanı.', price: 1100000, brand: 'Kia', model: 'Ceed SW', year: 2021, mileage: 42000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'STATION_WAGON', color: 'Beyaz', engineSize: '1.4', horsePower: 140, city: 'Samsun', condition: 'USED' },

    // Volvo
    { title: '2021 Volvo XC60 B4 Inscription — Mild Hybrid', description: 'Inscription donanım, Bowers & Wilkins ses, pilot assist, 360 kamera. İsveç kalitesi.', price: 3400000, brand: 'Volvo', model: 'XC60', year: 2021, mileage: 45000, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Siyah', engineSize: '2.0', horsePower: 197, city: 'İstanbul', district: 'Ataşehir', condition: 'USED' },

    // Skoda
    { title: '2022 Skoda Octavia 1.5 TSI Style — Pratik ve Ferah', description: 'Style donanım, geniş iç mekan, dijital kokpit, Canton ses sistemi. Aile aracı.', price: 1550000, brand: 'Skoda', model: 'Octavia', year: 2022, mileage: 32000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Gri', engineSize: '1.5', horsePower: 150, city: 'Ankara', district: 'Keçiören', condition: 'USED' },

    // Tesla
    { title: '2023 Tesla Model 3 Long Range — Tam Elektrik', description: 'Long Range, autopilot, 15 inç dokunmatik ekran, OTA güncelleme. Geleceğin aracı.', price: 2900000, brand: 'Tesla', model: 'Model 3', year: 2023, mileage: 15000, fuelType: 'ELEKTRIK', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Beyaz', engineSize: 'Elektrik', horsePower: 325, city: 'İstanbul', district: 'Levent', condition: 'USED' },

    // TOGG
    { title: '2024 TOGG T10X — Türkiye\'nin Otomobili', description: 'Yerli ve milli elektrikli SUV. Trugo ağı desteği, geniş iç mekan, hızlı şarj.', price: 1950000, brand: 'TOGG', model: 'T10X', year: 2024, mileage: 5000, fuelType: 'ELEKTRIK', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Gri', engineSize: 'Elektrik', horsePower: 200, city: 'İstanbul', district: 'Ümraniye', condition: 'USED' },

    // Ek BMW ilanları (AI tahmin için daha fazla veri)
    { title: '2020 BMW 3.20i Edition Sport Line', description: 'Sport Line donanım, kırmızı dikiş detayları, M direksiyon.', price: 2500000, brand: 'BMW', model: '320i', year: 2020, mileage: 52000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '2.0', horsePower: 170, city: 'İstanbul', district: 'Bakırköy', condition: 'USED' },
    { title: '2022 BMW 3.20i First Edition — Özel Seri', description: 'First Edition, özel iç döşeme, premium paket.', price: 3000000, brand: 'BMW', model: '320i', year: 2022, mileage: 20000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Gri', engineSize: '2.0', horsePower: 170, city: 'Ankara', district: 'Çankaya', condition: 'USED' },
    { title: '2019 BMW 3.20i Luxury Line — Bakımlı', description: 'Luxury Line, krom detaylar, dakota deri, konfor erişim.', price: 2200000, brand: 'BMW', model: '320i', year: 2019, mileage: 72000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Lacivert', engineSize: '2.0', horsePower: 170, city: 'İzmir', district: 'Bornova', condition: 'USED' },

    // Ek Mercedes ilanları
    { title: '2022 Mercedes C200 AMG Premium', description: 'Premium paket, Burmester, ambiyans aydınlatma, digital ışık.', price: 3350000, brand: 'Mercedes-Benz', model: 'C200', year: 2022, mileage: 28000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Siyah', engineSize: '1.5', horsePower: 204, city: 'İstanbul', district: 'Beşiktaş', condition: 'USED' },

    // Ek Volkswagen
    { title: '2021 Volkswagen Golf 1.0 TSI Impression', description: 'Impression donanım, dijital kokpit, park asistanı.', price: 1500000, brand: 'Volkswagen', model: 'Golf', year: 2021, mileage: 40000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'HATCHBACK', color: 'Beyaz', engineSize: '1.0', horsePower: 110, city: 'Bursa', district: 'Osmangazi', condition: 'USED' },

    // Ek Toyota
    { title: '2023 Toyota Corolla 1.8 Hybrid Flame', description: 'Flame donanım, bi-tone renk, JBL ses, kablosuz şarj.', price: 1800000, brand: 'Toyota', model: 'Corolla', year: 2023, mileage: 15000, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Kırmızı', engineSize: '1.8', horsePower: 140, city: 'İstanbul', district: 'Kadıköy', condition: 'USED' },
    { title: '2021 Toyota Corolla 1.6 Multidrive S Dream', description: 'Dream donanım, benzinli CVT, ekonomik sürüş.', price: 1400000, brand: 'Toyota', model: 'Corolla', year: 2021, mileage: 48000, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Gümüş', engineSize: '1.6', horsePower: 132, city: 'Ankara', district: 'Sincan', condition: 'USED' },

    // Ek Fiat
    { title: '2023 Fiat Egea 1.4 Fire Urban Plus', description: 'Urban Plus, şehir modu, City Brake Control.', price: 780000, brand: 'Fiat', model: 'Egea', year: 2023, mileage: 8000, fuelType: 'BENZIN', transmission: 'MANUEL', bodyType: 'SEDAN', color: 'Gri', engineSize: '1.4', horsePower: 95, city: 'Kayseri', condition: 'USED' },
    { title: '2020 Fiat Egea 1.3 MultiJet Easy — Dizel', description: 'Dizel ekonomi, düşük yakıt tüketimi, uzun yol aracı.', price: 620000, brand: 'Fiat', model: 'Egea', year: 2020, mileage: 85000, fuelType: 'DIZEL', transmission: 'MANUEL', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '1.3', horsePower: 95, city: 'Diyarbakır', condition: 'USED' },

    // Sıfır araçlar
    { title: '2024 Toyota Corolla 1.8 Hybrid Dream — Sıfır', description: 'Sıfır kilometre, bayiden teslim. Resmi garanti kapsamında.', price: 1950000, brand: 'Toyota', model: 'Corolla', year: 2024, mileage: 0, fuelType: 'HYBRID', transmission: 'OTOMATIK', bodyType: 'SEDAN', color: 'Beyaz', engineSize: '1.8', horsePower: 140, city: 'İstanbul', district: 'Kartal', condition: 'SIFIR' },
    { title: '2024 Hyundai Tucson 1.6 T-GDi Elite Plus — Sıfır', description: 'Sıfır araç, bayiden. 5 yıl garanti, yol yardım paketi dahil.', price: 2350000, brand: 'Hyundai', model: 'Tucson', year: 2024, mileage: 0, fuelType: 'BENZIN', transmission: 'OTOMATIK', bodyType: 'SUV', color: 'Beyaz', engineSize: '1.6', horsePower: 150, city: 'Ankara', district: 'Çankaya', condition: 'SIFIR' },
  ];

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const user = allUsers[i % allUsers.length];
    await prisma.listing.create({
      data: {
        ...l,
        images: "[]",
        userId: user.id,
        status: 'ACTIVE',
      },
    });
  }

  console.log(`✅ ${listings.length} ilan oluşturuldu`);
  console.log(`✅ ${allUsers.length} kullanıcı oluşturuldu`);
  console.log('🎉 Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
