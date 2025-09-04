const QRCode = require('qrcode');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const url = 'https://qrfd.vercel.app/';
    
    // Add timestamp to make each QR code unique so it regenerates every 5 seconds
    const timestamp = Math.floor(Date.now() / 5000) * 5000;
    const uniqueUrl = `${url}?t=${timestamp}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(uniqueUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.status(200).json({ 
      qrCode: qrCodeDataUrl,
      url: url,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate QR code',
      message: error.message 
    });
  }
}
