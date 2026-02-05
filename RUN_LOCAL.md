# How to Run Your Website Locally

## 🖥 Frontend Server (Port 3000)

### Method 1: Terminal 1
```bash
cd c:\Users\Admin\Music\hub
npm run dev
```

### Method 2: PowerShell
```powershell
Set-Location "c:\Users\Admin\Music\hub"
npm run dev
```

### What You'll See:
```
VITE v6.4.1  ready in 302 ms
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.100.179:3000/
```

## 🔧 Backend Server (Port 5000)

### Method 1: Terminal 2
```bash
cd c:\Users\Admin\Music\hub\backend
node server.js
```

### Method 2: PowerShell
```powershell
Set-Location "c:\Users\Admin\Music\hub\backend"
node server.js
```

### What You'll See:
```
Server running on http://localhost:5000
Server accessible on network: http://192.168.100.179:5000
Frontend accessible at http://localhost:3000
MongoDB connection error: Error: querySrv ECONNREFUSED _mongodb._tcp.2022
⚠️ Continuing with file-based storage
```

## 🌐 Internet Access (Cloudflare Tunnel)

### Frontend URL:
From your Cloudflare tunnel output, look for:
```
https://your-tunnel-name.trycloudflare.com
```

## 📋 Complete Setup:

1. **Open Terminal 1** → Run frontend
2. **Open Terminal 2** → Run backend  
3. **Open Terminal 3** → Run Cloudflare tunnel
4. **Access via Cloudflare URL**

## 🎯 Access Your Website:

- **Local:** http://localhost:3000
- **Network:** http://192.168.100.179:3000
- **Internet:** [Cloudflare tunnel URL]

## 🔧 Commands Summary:

```bash
# Terminal 1 - Frontend
cd c:\Users\Admin\Music\hub
npm run dev

# Terminal 2 - Backend
cd c:\Users\Admin\Music\hub\backend
node server.js

# Terminal 3 - Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

Keep all three terminals running for full functionality!
