# Mehmet Ali Güney - 24010501109
# 🚗 AutoPazar — AI Destekli Araç Alım-Satım Platformu

AutoPazar, kullanıcıların araç ilanı oluşturabileceği, güncel piyasa istatistiklerini takip edebileceği ve **Yapay Zeka Destekli Fiyat Tahmin Motoru** sayesinde araçlarının gerçek piyasa değerini analiz edebilecekleri modern, güvenli ve premium tasarımlı bir web uygulamasıdır.

---

## 📖 İçindekiler
1. [Özellikler](#-özellikler)
2. [Teknoloji Yığını](#-teknoloji-yığını)
3. [Sistem Mimarisi](#-sistem-mimarisi)
4. [Proje Hiyerarşisi](#-proje-hiyerarşisi)
5. [🤖 Yapay Zeka Destekli Fiyat Tahmin Motoru Analizi](#-yapay-zeka-destekli-fiyat-tahmin-motoru-analizi)
6. [🛠 Kurulum ve Yapılandırma Kılavuzu](#-kurulum-ve-yapılandırma-kılavuzu)
7. [🔑 API Referansı ve Detaylı İstek/Yanıt Protokolleri](#-api-referansı-ve-detaylı-istekyanıt-protokolleri)
8. [🛡 Güvenlik, Kimlik Doğrulama ve Validasyon](#-güvenlik-kimlik-doğrulama-ve-validasyon)
9. [👤 Demo Giriş Bilgileri](#-demo-giriş-bilgileri)
10. [📄 Lisans](#-lisans)

---

## 🌟 Özellikler

* **Premium Tasarım (Dark Mode & Glassmorphism):** Obsidian yüzeyler, mesh gradient arka planlar, Outfit font yapısı ve Framer Motion ile tasarlanmış yumuşak geçiş efektleri ile göz yormayan modern arayüz.
* **Yapay Zeka Fiyat Analizi:** Girilen aracın özelliklerine (marka, model, yıl, kilometre, yakıt türü, vites tipi) göre piyasa değerini hesaplayan, güven skoru çıkaran ve piyasa koridorunu (Min/Max fiyatlar) belirleyen tahmin mekanizması.
* **Detaylı Filtreleme ve Arama:** Marka, model, yıl, fiyat aralığı, kilometre aralığı, şehir ve araç kondisyonuna göre dinamik indekslenmiş arama motoru.
* **Favoriler ve İlan Yönetimi:** Kullanıcıların beğendikleri ilanları favorilerine ekleyebilmesi, kendi ilanlarını yönetebilmesi (oluşturma, güncelleme, silme).
* **Admin Denetim Paneli:** Sistemdeki tüm kullanıcıları, ilan durumlarını (`ACTIVE`, `PENDING` vb.) ve aktif veritabanı istatistiklerini yönetmeye olanak sağlayan gelişmiş yönetim modülü.
* **Express 5 ve Prisma Gücü:** Express 5.x asenkron hata yakalama yetenekleri, SQLite (geliştirme) / PostgreSQL uyumlu güçlü Prisma 6.x veri erişim katmanı.

---

## 🛠 Teknoloji Yığını

### İstemci (Frontend)
* **Framework:** React 19 (En son React mimarisi)
* **Derleyici & Sunucu:** Vite 8.x
* **Stil Yönetimi:** Tailwind CSS v4 (Yepyeni CSS tabanlı yapılandırma)
* **Durum Yönetimi:** Zustand 5.x (Hafif ve hızlı global state)
* **Animasyon Modülü:** Framer Motion 12.x
* **İkon Kütüphanesi:** Lucide React
* **Router:** React Router v7

### Sunucu (Backend)
* **Çalışma Ortamı:** Node.js 20+
* **Framework:** Express 5 (Native Promise desteği ve asenkron middleware entegrasyonu)
* **Geliştirme Aracı:** `tsx` (TypeScript Execute watch mode)
* **Dil:** TypeScript 5.7+

### Veritabanı ve ORM
* **ORM:** Prisma 6.x
* **Veritabanı:** SQLite (`dev.db` - Sıfır bağımlılıklı yerel geliştirme için varsayılan) / PostgreSQL 16 (Üretim ortamı için Docker yapılandırması hazır)

### Güvenlik ve Validasyon
* **Kimlik Doğrulama:** JWT (JSON Web Token)
* **Şifreleme:** `bcryptjs` (Tuzlanmış şifre hashleme)
* **Şema Doğrulama:** Zod (Güvenli girdi doğrulama kütüphanesi)

---

## 📂 Proje Hiyerarşisi

Proje, istemci (`client`) ve sunucu (`server`) olmak üzere monorepo benzeri iki ana modülden oluşmaktadır.

```
mehmetodev/
├── client/                     # Ön Yüz (Frontend) Uygulaması
│   ├── src/
│   │   ├── assets/             # Görsel ve statik kaynaklar
│   │   ├── components/         # Yeniden kullanılabilir UI Bileşenleri
│   │   │   ├── ai/             # AI Fiyat Tahmini ve Analiz Kartları
│   │   │   ├── layout/         # Header, Footer, Ortak Şablonlar
│   │   │   └── listing/        # İlan listeleme kartları ve grid'leri
│   │   ├── pages/              # Sayfa Seviyesindeki Bileşenler
│   │   │   ├── AdminPage.tsx   # Admin dashboard paneli
│   │   │   ├── HomePage.tsx    # Arama motoru, istatistikler ve vitrin
│   │   │   ├── ListingsPage.tsx# Gelişmiş filtreleme ve ilan listeleme
│   │   │   ├── ProfilePage.tsx # Profil düzenleme ve kullanıcı ilanları
│   │   │   └── ...
│   │   ├── services/           # Axios API istemcileri ve uç noktalar
│   │   ├── store/              # Zustand Auth & UI Store tanımları
│   │   ├── types/              # Arayüz veri modelleri (TypeScript)
│   │   └── utils/              # Fiyat, para birimi formatlayıcıları
│   ├── vite-env.d.ts           # Vite istemci tipleri ve CSS import deklarasyonları
│   ├── vite.config.ts          # Vite & Tailwind CSS v4 eklenti ayarları
│   └── tsconfig.json           # Frontend TypeScript derleme ayarları
│
├── server/                     # Arka Yüz (Backend) Uygulaması
│   ├── prisma/
│   │   ├── schema.prisma       # Veritabanı şeması ve ilişkileri
│   │   ├── seed.ts             # Geliştirme ortamı için 40+ gerçekçi araç verisi
│   │   └── dev.db              # SQLite Yerel Veritabanı (Geliştirme)
│   ├── src/
│   │   ├── config/             # Çevre değişkenleri ve ayarlar
│   │   ├── controllers/        # Express Route Handler'ları
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── listing.controller.ts
│   │   ├── middlewares/        # Güvenlik, Rol ve Yetkilendirme katmanları
│   │   ├── routes/             # API Rota tanımları
│   │   ├── services/           # İş mantığı ve veri tabanı sorgu servisleri
│   │   ├── types/              # Express Request genişletmeleri ve DTO'lar
│   │   └── app.ts              # Express Sunucu kurulumu ve konfigürasyonu
│   └── tsconfig.json           # Backend TypeScript derleme ayarları
│
├── docker-compose.yml          # PostgreSQL ve pgAdmin servis tanımları
├── package.json                # Kök dizin scriptleri (Concurrently çalıştırma)
└── README.md                   # Proje dökümantasyonu
```

---

## 🤖 Yapay Zeka Destekli Fiyat Tahmin Motoru Analizi

AutoPazar'ın kalbinde yer alan fiyat tahmin algoritması, veritabanında yer alan mevcut araç ilanlarını ve geçmiş verilerini kullanarak istatistiksel bir değerlendirme gerçekleştirir.

### 1. Benzerlik Matrisi (Similarity Score)
Girdi olarak verilen aracın özellikleri ile sistemdeki diğer ilanlar arasında ağırlıklı bir puanlama yapılır:
* **Marka Uyumu:** %30 ağırlık
* **Model Uyumu:** %25 ağırlık
* **Yıl Farkı:** %20 ağırlık (`yıl farkı arttıkça puan düşer`)
* **Kilometre Farkı:** %15 ağırlık (`kilometre farkı arttıkça puan düşer`)
* **Yakıt Türü:** %5 ağırlık
* **Vites Tipi:** %5 ağırlık

Puanlama sonucunda **%70 ve üzerinde benzerlik gösteren** tüm araçlar analiz kümesine dahil edilir.

### 2. İstatistiki Hesaplamalar
* **Piyasa Değeri Belirleme:** Benzerlik oranlarına göre ağırlıklandırılmış ortalama alınarak aracın "Ortalama Piyasa Fiyatı" ve "Medyan Fiyatı" belirlenir.
* **Fiyat Koridoru:** Standart Sapma ($\sigma$) hesaplanarak aracın değer aralığı (Minimum ve Maksimum limitleri) belirlenir:
  $$\text{Fiyat Koridoru} = \text{Ortalama Piyasa Fiyatı} \pm (1.96 \times \sigma)$$
  *(Bu koridor piyasadaki araçların %95'ini kapsar).*

### 3. Güven Seviyesi ve Analiz Koşulları
* **Yüksek Güvenilirlik:** Benzer kriterlerde veritabanında 15'ten fazla araç varsa.
* **Orta Güvenilirlik:** 5 ila 15 arasında benzer araç varsa.
* **Düşük Güvenilirlik:** 5'ten az benzer araç varsa.

### 4. Piyasa Eğilimi (Trend Analysis)
Son 30 gün içinde eklenen ilan fiyatları ile önceki 30 gündeki ilan fiyatları karşılaştırılarak ilgili kategori için fiyatların **YUKARI**, **AŞAĞI** veya **DENGELİ** seyrettiği oransal olarak hesaplanır.

---

## 🛠 Kurulum ve Yapılandırma Kılavuzu

Proje varsayılan olarak **SQLite** veritabanı ile çalışacak şekilde yapılandırılmıştır. Böylece Docker veya yerel PostgreSQL kurmanıza gerek kalmadan doğrudan projeyi çalıştırabilirsiniz.

### Çevre Değişkenleri (.env) Yapılandırması

İlk olarak `server` dizininde `.env` dosyasını oluşturun:

**SQLite için (Önerilen/Varsayılan):**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="autopazar-guvenli-anahtar-12345"
JWT_EXPIRES_IN="7d"
PORT=3001
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

**PostgreSQL kullanmak isterseniz (Opsiyonel):**
1. `server/prisma/schema.prisma` dosyasını açıp `provider = "sqlite"` kısmını `provider = "postgresql"` olarak güncelleyin.
2. `.env` dosyanızı şu şekilde ayarlayın:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autopazar"
   ```
3. Docker container'larını başlatın:
   ```bash
   docker-compose up -d
   ```

---

### Adım Adım Kurulum

#### 1. Bağımlılıkları Yükleme
Projenin kök dizininde (root) terminali açın ve tüm bağımlılıkları indirin:
```bash
npm install
```
*(Bu işlem root düzeyindeki `concurrently` paketini ve hem `client` hem de `server` alt klasörlerindeki bağımlılıkları otomatik olarak kuracaktır).*

#### 2. Veritabanı Şemasını Oluşturma ve Seed Yükleme
Sunucu dizinine gidip Prisma şemasını veritabanına uygulayın ve test verilerini (40'tan fazla araç ve admin/kullanıcı hesapları) yükleyin:
```bash
cd server

# Prisma client kütüphanesini üret
npx prisma generate

# Veritabanını oluştur ve şemaları eşitle
npx prisma migrate dev --name init

# Başlangıç test verilerini (seed) yükle
npx prisma db seed
```

#### 3. Projeyi Geliştirme (Development) Modunda Çalıştırma
Projeyi tek bir komutla hem backend hem de frontend ayağa kalkacak şekilde kök dizinden başlatabilirsiniz:
```bash
# Kök dizine dönün
cd ..

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama başarıyla başlatıldığında tarayıcınızdan şu adreslere erişebilirsiniz:
* **Ön Yüz (React):** `http://localhost:5173`
* **Arka Yüz (Express API):** `http://localhost:3001`

---

## 🔑 API Referansı ve Detaylı İstek/Yanıt Protokolleri

Tüm API istekleri JSON formatında veri kabul eder ve JSON formatında yanıt döner. Yetkilendirme gerektiren uç noktalarda `Authorization: Bearer <TOKEN>` başlığı gönderilmelidir.

### 1. Kimlik Doğrulama (Auth)

#### `POST /api/auth/register` — Yeni Kullanıcı Kaydı
* **İstek Gövdesi (Payload):**
  ```json
  {
    "email": "ornek@mail.com",
    "password": "sifre123password",
    "fullName": "John Doe",
    "phone": "05554443322"
  }
  ```
* **Başarılı Yanıt (201 Created):**
  ```json
  {
    "user": {
      "id": "cmqeays8k002...",
      "email": "ornek@mail.com",
      "fullName": "John Doe",
      "role": "USER",
      "createdAt": "2026-06-15T21:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

#### `POST /api/auth/login` — Kullanıcı Girişi
* **İstek Gövdesi (Payload):**
  ```json
  {
    "email": "ahmet@example.com",
    "password": "user123"
  }
  ```
* **Başarılı Yanıt (200 OK):**
  *(Register yanıtı ile aynı yapıda token ve kullanıcı bilgisi döner).*

---

### 2. İlan İşlemleri (Listings)

#### `GET /api/listings` — İlanları Listeleme & Filtreleme
* **Sorgu Parametreleri (Query Parameters):**
  * `search`: Metinsel arama (başlık, açıklama, marka, model içinde arar)
  * `brand`: Marka adı (örn: `BMW`)
  * `model`: Model adı (örn: `320i`)
  * `priceMin` / `priceMax`: Fiyat aralığı filtreleme
  * `yearMin` / `yearMax`: Model yılı filtreleme
  * `mileageMin` / `mileageMax`: Kilometre aralığı
  * `city`: Bulunduğu şehir
  * `fuelType`: `BENZIN`, `DIZEL`, `LPG`, `ELEKTRIK`, `HYBRID`
  * `transmission`: `MANUEL`, `OTOMATIK`, `YARI_OTOMATIK`
  * `page`: Sayfa no (varsayılan `1`)
  * `limit`: Sayfa başına ilan (varsayılan `12`)
* **Başarılı Yanıt (200 OK):**
  ```json
  {
    "listings": [
      {
        "id": "listing_id_123",
        "title": "2021 BMW 3.20i M Sport",
        "price": 2850000,
        "brand": "BMW",
        "model": "320i",
        "year": 2021,
        "city": "İstanbul",
        "images": "[\"resim1.jpg\"]",
        "user": {
          "id": "user_id_999",
          "fullName": "Ahmet Yılmaz",
          "avatarUrl": null
        },
        "_count": {
          "favorites": 12
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 46,
      "totalPages": 4
    }
  }
  ```

#### `POST /api/listings` — Yeni İlan Oluşturma 🔒
* **Gereksinim:** Giriş yapmış kullanıcı token'ı.
* **İstek Gövdesi (Payload):**
  ```json
  {
    "title": "Sahibinden Temiz Golf 7.5",
    "description": "Hatasız boyasız garaj arabasıdır...",
    "price": 1250000,
    "brand": "Volkswagen",
    "model": "Golf",
    "year": 2018,
    "mileage": 85000,
    "fuelType": "BENZIN",
    "transmission": "OTOMATIK",
    "bodyType": "HATCHBACK",
    "city": "Ankara",
    "condition": "USED"
  }
  ```

---

### 3. Yapay Zeka Servisleri (AI Services)

#### `POST /api/ai/predict` — Fiyat Tahmini Hesaplama
* **İstek Gövdesi (Payload):**
  ```json
  {
    "brand": "BMW",
    "model": "320i",
    "year": 2021,
    "mileage": 35000,
    "fuelType": "BENZIN",
    "transmission": "OTOMATIK",
    "bodyType": "SEDAN",
    "city": "İstanbul"
  }
  ```
* **Başarılı Yanıt (200 OK):**
  ```json
  {
    "prediction": {
      "averagePrice": 2850000,
      "medianPrice": 2850000,
      "minPrice": 2650000,
      "maxPrice": 3050000,
      "confidenceScore": 0.95,
      "confidenceLevel": "Yüksek",
      "standardDeviation": 102000,
      "sampleCount": 18,
      "trend": {
        "direction": "UP",
        "changePercent": 4.2,
        "period": "Son 30 gün"
      }
    },
    "comparisons": [
      {
        "id": "cmp_id_12",
        "title": "2021 BMW 3.20i M Sport — Hatasız",
        "price": 2850000,
        "year": 2021,
        "mileage": 35000,
        "similarityScore": 1
      }
    ]
  }
  ```

---

## 🛡 Güvenlik, Kimlik Doğrulama ve Validasyon

Projede veri güvenliği ve yetkilendirme katmanları en üst standartlarda kurgulanmıştır:

1. **Güvenlik Başlıkları (Helmet):** Express uygulaması HTTP başlıkları üzerinden gelebilecek yaygın zafiyetlere (XSS, Clickjacking vb.) karşı [Helmet](https://helmetjs.github.io/) ile korunmaktadır.
2. **CORS Yapılandırması:** Sunucu yalnızca belirtilen istemci URL adresine (`http://localhost:5173`) veri paylaşımı yapacak şekilde yapılandırılmıştır.
3. **Zod ile Şema Validasyonu:** Tüm API giriş kanalları (gövde parametreleri) Zod şemaları ile kontrol edilir. Yanlış türde veri, eksik alan veya geçersiz e-posta adresleri sunucu katmanında anında `400 Bad Request` kodu ile geri çevrilir.
4. **JWT Korumalı Rotalar:** İlan oluşturma, düzenleme, silme, profil işlemleri ve favoriye ekleme gibi işlemler `authMiddleware` kontrolünden geçer. Token geçerli değilse `401 Unauthorized` hatası verilir.
5. **Rol Tabanlı Yetkilendirme (RBAC):** Admin rotaları (`/api/admin/*`) hem JWT doğrulaması hem de kullanıcının `role === 'ADMIN'` olup olmadığını kontrol eden `adminMiddleware` süzgecinden geçirilir. Yetkisiz erişimler `403 Forbidden` ile engellenir.

---

## 👤 Demo Giriş Bilgileri

Sistemi hemen test edebilmeniz için hazır seed hesapları tanımlanmıştır:

| Rol | E-Posta | Şifre | Açıklama |
|-----|---------|-------|----------|
| **Admin** | `admin@autopazar.com` | `admin123` | Tüm ilanları onaylama/reddetme, kullanıcı durumlarını yönetme yetkisine sahiptir. |
| **Kullanıcı** | `ahmet@example.com` | `user123` | Standart ilan verme, düzenleme ve favoriye ekleme işlemlerini yapabilir. |

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Serbestçe kopyalayabilir, dağıtabilir ve kendi projelerinizde kaynak göstererek kullanabilirsiniz.
