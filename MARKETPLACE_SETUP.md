# Full-Stack Marketplace Setup Guide

## Architecture Overview

This is a full-stack marketplace application with:
- **Frontend**: React + TypeScript + Vite (Port 3000)
- **Backend**: Node.js + Express (Port 5000)
- **File Storage**: Local filesystem
- **Database**: JSON files (easily migratable to MongoDB/PostgreSQL)

## Directory Structure

```
hub/
├── backend/                    # Express server
│   ├── server.js              # Main server file
│   ├── routes/
│   │   └── uploads.js         # Upload API routes
│   ├── uploads/               # Stores uploaded files
│   │   ├── music/
│   │   ├── novel/
│   │   └── software/
│   ├── data/
│   │   └── products.json      # Products database
│   └── package.json
├── components/
│   ├── ProductUpload.tsx      # Upload form
│   ├── ProductUpload.css
│   ├── ProductBrowser.tsx     # Marketplace view
│   └── ProductBrowser.css
├── App.tsx                     # Updated with new routes
└── ... (other existing files)
```

## Installation & Setup

### 1. Frontend Setup (Already Running)
Frontend is running on http://localhost:3000

### 2. Backend Installation

```bash
cd backend
npm install
npm start
```

Backend will run on http://localhost:5000

## Features

### Upload Portal
- Upload music files (MP3, WAV, OGG, FLAC)
- Upload novels/books (PDF, TXT, EPUB)
- Upload software (EXE, MSI, ZIP)
- Set price, title, description, author, category
- File size limit: 500MB

### Marketplace
- Browse all products
- Filter by product type (Music, Novel, Software)
- Search by title, author, or description
- View product details
- Download products (button integrated for payment system)

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploads/product` | Upload a new product |
| GET | `/api/uploads/products` | Get all products |
| GET | `/api/uploads/product/:id` | Get product by ID |
| PUT | `/api/uploads/product/:id` | Update product |
| DELETE | `/api/uploads/product/:id` | Delete product |
| GET | `/api/uploads/products/type/:type` | Get products by type |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Backend health status |

## File Upload

### Request Example

```bash
curl -X POST http://localhost:5000/api/uploads/product \
  -F "file=@music.mp3" \
  -F "productType=music" \
  -F "title=My Song" \
  -F "description=A beautiful song" \
  -F "price=9.99" \
  -F "author=Artist Name" \
  -F "category=Pop"
```

### Response Example

```json
{
  "message": "Product uploaded successfully",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "productType": "music",
    "title": "My Song",
    "description": "A beautiful song",
    "price": 9.99,
    "author": "Artist Name",
    "category": "Pop",
    "fileName": "550e8400-e29b-41d4-a716-446655440000.mp3",
    "filePath": "/uploads/music/550e8400-e29b-41d4-a716-446655440000.mp3",
    "uploadedAt": "2025-02-04T12:30:00Z",
    "downloads": 0
  }
}
```

## Frontend Navigation

Add these buttons to your Layout to navigate to new pages:

- **Upload Product** → `handleNavigate('UPLOAD')`
- **Marketplace** → `handleNavigate('MARKETPLACE')`

## Environment Variables

### Backend (.env)
```
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (already has .env.local)
```
VITE_API_URL=http://localhost:5000
```

## Next Steps

1. Start the backend server
2. Add navigation buttons to Layout component
3. Implement payment processing for downloads
4. Add user authentication
5. Migrate to proper database (MongoDB/PostgreSQL)
6. Deploy to production

## Troubleshooting

### Backend fails to start
- Check if port 5000 is available
- Run `npm install` in backend folder
- Check Node.js version (v16+ required)

### CORS errors
- Ensure backend is running on http://localhost:5000
- Check CORS configuration in server.js

### File upload fails
- Check file type is supported
- Check file size < 500MB
- Check uploads directory has write permissions

## Production Deployment

For production:
1. Use MongoDB/PostgreSQL for persistence
2. Use AWS S3 or similar for file storage
3. Add authentication/authorization
4. Implement payment gateway (Stripe/PayPal)
5. Add rate limiting and security headers
6. Use environment variables for secrets
