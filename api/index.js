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
    // Forward request to Python QR generator
    const qrResponse = await fetch(`${req.headers.host ? 'https://' + req.headers.host : 'http://localhost:3000'}/api/qr`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!qrResponse.ok) {
      throw new Error('QR generation service unavailable');
    }

    const qrData = await qrResponse.json();
    res.status(200).json(qrData);
  } catch (error) {
    console.error('QR Code generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate QR code',
      message: error.message 
    });
  }
}
