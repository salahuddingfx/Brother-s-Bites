import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/qr-codes');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const QR_CONFIGS = [
  {
    id: 'connect',
    name: "Brother's Bites — Connect & Social Hub",
    url: 'https://bbites.salahuddin.codes/connect',
    desc: 'Instant access to all social channels, reels & hotline',
  },
  {
    id: 'menu',
    name: "Brother's Bites — Digital Food Menu",
    url: 'https://bbites.salahuddin.codes/menu',
    desc: 'Scan to browse chicken momos, crunchy fuchka & teas',
  },
  {
    id: 'review',
    name: "Brother's Bites — Google Maps 5-Star Review",
    url: 'https://g.page/r/CZY9cCNvq2_GEAE/review',
    desc: 'Leave an instant 5-star rating on Google Maps',
  },
  {
    id: 'location',
    name: "Brother's Bites — Marine Drive GPS Map",
    url: 'https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5',
    desc: 'Live Google Maps GPS directions to stall',
  },
  {
    id: 'website',
    name: "Brother's Bites — Official Website",
    url: 'https://bbites.salahuddin.codes',
    desc: 'Explore complete restaurant experience and ordering',
  },
];

async function generateAllQRCodes() {
  console.log('🚀 Generating Print-Ready Vector SVGs & Ultra-High-Res PNG QR Codes...');

  for (const item of QR_CONFIGS) {
    // 1. Vector SVG (Dark Luxury Gold Theme)
    const svgDark = await QRCode.toString(item.url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#fbbf24', // Gold / Amber Yellow
        light: '#0a0a0c', // Dark Luxury Black
      },
    });
    fs.writeFileSync(path.join(outputDir, `${item.id}-qr-dark.svg`), svgDark);

    // 2. Vector SVG (Clean Print Black & White Theme for Vinyl/Paper Print)
    const svgPrint = await QRCode.toString(item.url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    fs.writeFileSync(path.join(outputDir, `${item.id}-qr-print.svg`), svgPrint);

    // 3. Ultra High-Res PNG (2000x2000px, 300+ DPI suitable for Large Banners & Acrylic Table Stands)
    await QRCode.toFile(path.join(outputDir, `${item.id}-qr-dark.png`), item.url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 2000,
      margin: 2,
      color: {
        dark: '#fbbf24',
        light: '#0a0a0c',
      },
    });

    await QRCode.toFile(path.join(outputDir, `${item.id}-qr-print.png`), item.url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 2000,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    console.log(`✅ Generated: ${item.id} (Dark SVG, Print SVG, Dark 2K PNG, Print 2K PNG)`);
  }

  // Generate an index manifest JSON
  const manifest = QR_CONFIGS.map((item) => ({
    ...item,
    files: {
      svgDark: `/qr-codes/${item.id}-qr-dark.svg`,
      svgPrint: `/qr-codes/${item.id}-qr-print.svg`,
      pngDark: `/qr-codes/${item.id}-qr-dark.png`,
      pngPrint: `/qr-codes/${item.id}-qr-print.png`,
    },
  }));

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`🎉 All QR codes successfully saved to: ${outputDir}`);
}

generateAllQRCodes().catch(console.error);
