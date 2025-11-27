const express = require('express');
const app = express();
const PORT = 4000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Devpost proxy endpoint
app.get('/api/proxy/devpost', async (req, res) => {
  try {
    console.log('🌐 Proxying request to Devpost API...');
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://devpost.com/api/hackathons?challenge_type=all&status=upcoming', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; DevProxy/1.0)'
      }
    });
    
    console.log('📊 Devpost response status:', response.status);
    console.log('📄 Content-Type:', response.headers.get('content-type'));
    
    const data = await response.text();
    console.log('📝 Response preview:', data.substring(0, 200));
    
    res.status(response.status);
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy failed', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Devpost proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api/proxy/devpost`);
});

module.exports = app;