const fs = require('fs');
const path = require('path');
const https = require('https');

const videoIds = [
  'I11_0aB_IOM',
  'qeRZNvjSX8U',
  'jcZx3QuT16g',
  'ZSttExMBavg',
  'O88euzMxskQ',
  'zBJNLNok3Pc',
  'Yj6-Iyc3u3Q',
  'Zoqn6CyBIzU'
];

const destDir = path.resolve(__dirname, '../public/assets/images/youtube-thumbnails');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const id of videoIds) {
    const dest = path.join(destDir, `${id}.jpg`);
    const hqUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    try {
      await download(hqUrl, dest);
      const stat = fs.statSync(dest);
      console.log(`Downloaded ${id}.jpg (${stat.size} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${id}:`, e.message);
    }
  }
}

run();
