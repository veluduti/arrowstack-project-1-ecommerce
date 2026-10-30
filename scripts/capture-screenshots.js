const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const PORT = 3009;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');
const TEMP_USER_DATA = path.join(os.tmpdir(), 'chrome_screenshot_profile_' + Date.now());

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Prefer Chrome, fallback to Edge
let BROWSER_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(BROWSER_PATH)) {
  BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
}

const captures = [
  { name: '01-homepage.png', url: `${BASE_URL}/`, width: 1440, height: 900 },
  { name: '02-products-listing.png', url: `${BASE_URL}/products`, width: 1440, height: 900 },
  { name: '03-product-details.png', url: `${BASE_URL}/products/prod-elec-01`, width: 1440, height: 900 },
  { name: '04-shopping-cart.png', url: `${BASE_URL}/cart`, width: 1440, height: 900 },
  { name: '05-checkout.png', url: `${BASE_URL}/checkout`, width: 1440, height: 900 },
  { name: '06-order-success.png', url: `${BASE_URL}/order-success`, width: 1440, height: 900 },
  { name: '07-mobile-homepage.png', url: `${BASE_URL}/`, width: 375, height: 812 },
  { name: '08-mobile-products-page.png', url: `${BASE_URL}/products`, width: 375, height: 812 },
  { name: '09-mobile-cart.png', url: `${BASE_URL}/cart`, width: 375, height: 812 },
  { name: '10-mobile-checkout.png', url: `${BASE_URL}/checkout`, width: 375, height: 812 },
];

function waitForServer(maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      http
        .get(BASE_URL, (res) => {
          if (res.statusCode === 200) {
            clearInterval(interval);
            resolve();
          }
        })
        .on('error', () => {
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Server did not start in time.'));
          }
        });
    }, 1000);
  });
}

async function run() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx.cmd', ['next', 'start', '-p', PORT.toString()], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'ignore',
  });

  try {
    await waitForServer();
    console.log(`Server online at ${BASE_URL}. Capturing screenshots...`);

    // Give server 1.5 seconds to settle
    await new Promise((r) => setTimeout(r, 1500));

    for (const item of captures) {
      const outputPath = path.join(SCREENSHOT_DIR, item.name);
      console.log(`Capturing: ${item.name} (${item.width}x${item.height}) from ${item.url}`);

      const flags = [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-background-networking',
        '--disable-sync',
        '--disable-extensions',
        '--disable-component-update',
        '--hide-scrollbars',
        `--user-data-dir="${TEMP_USER_DATA}"`,
        `--window-size=${item.width},${item.height}`,
        `--screenshot="${outputPath}"`,
        `"${item.url}"`,
      ].join(' ');

      try {
        execSync(`"${BROWSER_PATH}" ${flags}`, { stdio: 'ignore', timeout: 10000 });
        if (fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          console.log(`✓ Saved ${item.name} (${stats.size} bytes)`);
        }
      } catch (err) {
        console.warn(`Warning capturing ${item.name}:`, err.message);
      }
    }

    console.log('Finished capturing all screenshots!');
  } catch (err) {
    console.error('Error in capture process:', err);
  } finally {
    console.log('Shutting down server...');
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
    } catch {}
    try {
      if (fs.existsSync(TEMP_USER_DATA)) {
        fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
      }
    } catch {}
  }
}

run();
