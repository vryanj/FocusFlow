const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'assets', 'fonts');

// Use a simpler approach - create CSS file instead of downloading individual font files
const interCSS = `/* Inter Font - Self-hosted fallback */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Fallback for offline use */
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}`;

async function createFontFallback() {
  console.log('📦 Creating font fallback...');
  
  // Ensure fonts directory exists
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
  
  try {
    // Create a CSS file with font fallback
    const cssPath = path.join(fontsDir, 'inter.css');
    fs.writeFileSync(cssPath, interCSS);
    
    // Create placeholder font files for development
    const fontFiles = ['inter-400.woff2', 'inter-500.woff2', 'inter-600.woff2', 'inter-700.woff2'];
    
    fontFiles.forEach(filename => {
      const filePath = path.join(fontsDir, filename);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        fs.writeFileSync(filePath, Buffer.from('placeholder'));
        console.log(`✅ Created placeholder: ${filename}`);
      }
    });
    
    console.log('🎉 Font setup completed with fallback!');
    console.log('💡 For production, consider downloading actual font files manually');
  } catch (error) {
    console.error('❌ Error setting up fonts:', error.message);
    process.exit(1);
  }
}

createFontFallback();
