const BRAND_IMAGE_MAP: Record<string, string> = {
  'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop',
  'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop',
  'Volkswagen': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop',
  'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=600&auto=format&fit=crop',
  'Renault': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
  'Fiat': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=600&auto=format&fit=crop',
  'Audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=600&auto=format&fit=crop',
  'Honda': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop',
  'Hyundai': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600&auto=format&fit=crop',
  'Peugeot': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
  'Kia': 'https://images.unsplash.com/photo-1617469767053-d3b503a53c65?q=80&w=600&auto=format&fit=crop',
  'Volvo': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop',
  'Tesla': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
  'TOGG': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop',
  'Opel': 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=600&auto=format&fit=crop',
  'Ford': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=600&auto=format&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop';

export function getVehicleImageByBrand(brand: string): string {
  if (!brand) return DEFAULT_IMAGE;
  const match = Object.keys(BRAND_IMAGE_MAP).find(
    (b) => b.toLowerCase() === brand.toLowerCase()
  );
  return match ? BRAND_IMAGE_MAP[match] : DEFAULT_IMAGE;
}
