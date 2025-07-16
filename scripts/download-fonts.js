const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'assets', 'fonts');
const cssFilePath = path.join(fontsDir, 'inter.css');
const googleFontsUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

// Function to download a file
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        // Parse the URL to pass options to https.get
        const urlObject = new URL(url);
        const options = {
            hostname: urlObject.hostname,
            path: urlObject.pathname + urlObject.search, // Add search query
            port: urlObject.port || 443,
            family: 4, // Force IPv4
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        };

        const file = fs.createWriteStream(dest);
        https.get(options, (response) => {
            // Check for redirect
            if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
                // The location header can be a relative or absolute URL
                const redirectUrl = new URL(response.headers.location, url).href;
                downloadFile(redirectUrl, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {}); // Delete the file async
            console.error('Download error:', err); // Log the full error
            reject(err);
        });
    });
}

async function downloadFonts() {
    console.log('📦 Starting font download process...');

    // Ensure fonts directory exists
    if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir, { recursive: true });
    }

    try {
        // 1. Download the CSS file from Google Fonts
        console.log(`Downloading CSS from ${googleFontsUrl}`);
        const tempCssPath = path.join(fontsDir, 'temp-inter.css');
        // Use a user-agent to mimic a browser, as Google Fonts might serve different content otherwise
        await downloadFile(googleFontsUrl, tempCssPath);
        console.log('✅ CSS file downloaded.');

        // 2. Read the CSS file to find font URLs
        let cssContent = fs.readFileSync(tempCssPath, 'utf8');
        fs.unlinkSync(tempCssPath); // Clean up temp file

        const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com\/s\/inter\/[^)]+\.woff2)\)/g;
        const fontUrls = [...cssContent.matchAll(fontUrlRegex)].map(match => match[1]);

        if (fontUrls.length === 0) {
            throw new Error('Could not find any font URLs in the downloaded CSS.');
        }

        console.log(`Found ${fontUrls.length} font files to download.`);

        // 3. Download each font file
        for (const fontUrl of fontUrls) {
            const filename = path.basename(fontUrl);
            const destPath = path.join(fontsDir, filename);
            
            // Make the URL in the CSS relative
            cssContent = cssContent.replace(fontUrl, `./${filename}`);

            console.log(`Downloading ${filename}...`);
            await downloadFile(fontUrl, destPath);
            console.log(`✅ Downloaded ${filename}`);
        }

        // 4. Save the modified CSS file
        fs.writeFileSync(cssFilePath, cssContent);
        console.log(`✅ Saved updated inter.css with local font paths.`);

        console.log('🎉 All fonts downloaded and CSS updated successfully!');

    } catch (error) {
        console.error('❌ Error during font download process:', error);
        process.exit(1);
    }
}

downloadFonts();
