# Host Both Frontend & Backend Locally with Internet Access

## Option 1: ngrok (Recommended)

### Setup Steps:
1. **Start Frontend:**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

2. **Start Backend:**
   ```bash
   cd backend
   node server.js
   # Runs on http://localhost:5000
   ```

3. **Create ngrok Tunnels:**
   ```bash
   # Frontend tunnel
   ngrok http 3000
   # Get URL like: https://abc123.ngrok.io

   # Backend tunnel  
   ngrok http 5000
   # Get URL like: https://def456.ngrok.io
   ```

4. **Update Frontend API URLs:**
   - Change all `http://192.168.100.179:5000` to ngrok backend URL
   - Rebuild and restart frontend

5. **Access Your Website:**
   - Use ngrok frontend URL
   - Anyone with URL can access your site

## Option 2: Cloudflare Tunnel

### Install:
```bash
npm install -g cloudflared
```

### Setup:
```bash
# Frontend tunnel
cloudflared tunnel --url http://localhost:3000

# Backend tunnel
cloudflared tunnel --url http://localhost:5000
```

## Option 3: LocalTunnel

### Install:
```bash
npm install -g localtunnel
```

### Setup:
```bash
# Frontend tunnel
lt --port 3000

# Backend tunnel
lt --port 5000
```

## Benefits:

✅ **Full local control** of code
✅ **Internet access** for anyone
✅ **Real-time testing** with live changes
✅ **No deployment needed** for testing
✅ **Free options** available

## Recommended Setup:

1. **Use ngrok** (most reliable)
2. **Keep both servers running** locally
3. **Share frontend ngrok URL** with users
4. **Update API URLs** to backend ngrok URL

This gives you a fully functional website accessible over the internet while running everything locally!
