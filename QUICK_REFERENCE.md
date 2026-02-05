# 🎯 Quick Reference - Moranik Hub Marketplace

## ⚡ Running Servers

### Terminal 1 (Frontend - Already Running)
```bash
Location: c:\Users\Admin\Music\hub
Command: npm run dev
Status: ✅ Running on http://localhost:3000
```

### Terminal 2 (Backend)
```bash
Location: c:\Users\Admin\Music\hub\backend
Command: node server.js
Status: ✅ Running on http://localhost:5000
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main website |
| Backend | http://localhost:5000 | API endpoints |
| Upload Portal | http://localhost:3000 → "📤 Upload Product" | Sell products |
| Marketplace | http://localhost:3000 → "📦 Marketplace" | Buy products |

---

## 📤 How to Upload

1. Open http://localhost:3000
2. Click "📤 Upload Product" (in navigation)
3. Fill the form:
   - **Type**: Music / Novel / Software
   - **Title**: Your product name
   - **Author**: Your name
   - **Price**: $ amount
   - **File**: Select your file
4. Click "Upload Product"
5. Done! Product is live in marketplace

### Supported Files
- **Music**: MP3, WAV, OGG, FLAC
- **Books**: PDF, TXT, EPUB
- **Software**: EXE, MSI, ZIP, RAR
- **Max Size**: 500MB

---

## 🛍️ How to Browse

1. Open http://localhost:3000
2. Click "📦 Marketplace"
3. Filter by type or search
4. Click "Download Now" on product

---

## 📂 Project Structure

```
hub/
├── frontend (React + TypeScript)
│   ├── components/
│   │   ├── ProductUpload.tsx      ← Upload form
│   │   ├── ProductUpload.css
│   │   ├── ProductBrowser.tsx     ← Marketplace
│   │   ├── ProductBrowser.css
│   │   └── Layout.tsx             ← Navigation updated
│   ├── App.tsx                     ← Routes added
│   ├── index.tsx
│   └── package.json
│
└── backend/ (Node.js + Express)
    ├── server.js                   ← Main server
    ├── routes/
    │   └── uploads.js              ← API endpoints
    ├── uploads/                    ← Uploaded files
    │   ├── music/
    │   ├── novel/
    │   └── software/
    ├── data/
    │   └── products.json           ← Products database
    └── package.json
```

---

## 🔌 Key API Endpoints

### Upload Product
```
POST http://localhost:5000/api/uploads/product
(multipart/form-data)

Fields:
- file: Binary
- productType: music|novel|software
- title: string
- description: string
- price: number
- author: string
- category: string
```

### Get All Products
```
GET http://localhost:5000/api/uploads/products
```

### Get Products by Type
```
GET http://localhost:5000/api/uploads/products/type/music
GET http://localhost:5000/api/uploads/products/type/novel
GET http://localhost:5000/api/uploads/products/type/software
```

### Health Check
```
GET http://localhost:5000/api/health
```

---

## 🛠️ Troubleshooting

### Port already in use?
```powershell
# Find what's using the port
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Backend won't start?
```bash
cd backend
npm install
node server.js
```

### CORS errors?
- Make sure backend is on port 5000
- Check both servers are running
- Try refreshing the browser

### Uploads not working?
- Check file type is supported
- File size < 500MB
- Check backend/uploads/ directory exists
- Check network tab for error details

---

## 📊 Sample API Requests

### Upload via cURL
```bash
curl -X POST http://localhost:5000/api/uploads/product \
  -F "file=@song.mp3" \
  -F "productType=music" \
  -F "title=My Song" \
  -F "price=5.99" \
  -F "author=Artist" \
  -F "category=Pop" \
  -F "description=A great song"
```

### Get Products via Browser
```
http://localhost:5000/api/uploads/products
http://localhost:5000/api/uploads/products/type/music
```

---

## 🚀 Next Steps

### Phase 1: Testing
- [ ] Upload a music file
- [ ] Upload a novel/book
- [ ] Upload software
- [ ] Browse marketplace
- [ ] Test search/filter

### Phase 2: Features
- [ ] Add payment gateway (Stripe)
- [ ] Add user authentication
- [ ] Add seller profiles
- [ ] Add product reviews
- [ ] Add user accounts

### Phase 3: Deployment
- [ ] Move to cloud server
- [ ] Use real database (MongoDB)
- [ ] Use cloud storage (S3)
- [ ] Add analytics
- [ ] Set up monitoring

---

## 📝 Navigation Menu

New buttons added to main navigation:

| Button | Action | Link |
|--------|--------|------|
| 📦 Marketplace | Browse products | Filters by type, search |
| 📤 Upload Product | Sell your content | Upload form |
| Login | User authentication | (Not implemented) |

---

## 💾 Data Storage

**Products Database**: `backend/data/products.json`

Sample entry:
```json
{
  "id": "unique-uuid",
  "productType": "music",
  "title": "Song Title",
  "author": "Artist Name",
  "description": "Description here",
  "price": 9.99,
  "category": "Pop",
  "fileName": "filename.mp3",
  "filePath": "/uploads/music/filename.mp3",
  "uploadedAt": "2025-02-04T00:00:00Z",
  "downloads": 0
}
```

---

## 🎨 UI Features

### Upload Form
- Product type selector
- Title, author, description fields
- Price input
- Category dropdown
- File picker
- Success/error messages

### Marketplace
- Product grid layout
- Filter buttons (All, Music, Novels, Software)
- Search bar
- Product cards with:
  - Icon, title, author
  - Description, price
  - Category badge, file size
  - Download button

---

## ⚙️ Settings

### Server Configuration
**Frontend Port**: 3000 (in vite.config.ts)
**Backend Port**: 5000 (in backend/server.js)
**File Size Limit**: 500MB (in backend/routes/uploads.js)
**CORS Origins**: localhost:3000 (in backend/server.js)

---

## 🔐 Security Notes

Current security:
- ✅ File type validation
- ✅ File size limits
- ✅ CORS protection
- ✅ UUID for file naming

Missing (add for production):
- 🔒 User authentication
- 🔒 Authorization
- 🔒 HTTPS
- 🔒 Rate limiting
- 🔒 Payment verification

---

## 📞 Quick Links

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Upload Form**: [http://localhost:3000](http://localhost:3000) → "📤 Upload Product"
- **Marketplace**: [http://localhost:3000](http://localhost:3000) → "📦 Marketplace"

---

## ✨ Ready to Use!

Your marketplace is fully functional and ready for testing. Start with:

1. **Upload** a test music file
2. **Check** if it appears in the marketplace
3. **Search** for products
4. **Filter** by type
5. **Test** the UI/UX

Enjoy! 🎉
