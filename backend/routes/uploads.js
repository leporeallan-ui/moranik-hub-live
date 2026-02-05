import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
const productsFile = path.join(__dirname, '../data/products.json');

// Ensure directories exist
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}
if (!existsSync(path.dirname(productsFile))) {
  mkdirSync(path.dirname(productsFile), { recursive: true });
}

// Initialize products.json if it doesn't exist
if (!existsSync(productsFile)) {
  writeFileSync(productsFile, JSON.stringify([], null, 2));
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productType = req.body.productType || 'other';
    const typeDir = path.join(uploadsDir, productType);
    if (!existsSync(typeDir)) {
      mkdirSync(typeDir, { recursive: true });
    }
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', // Music
      'application/pdf', 'text/plain', 'application/epub+zip', // Books/Novels
      'application/x-msdownload', 'application/x-msi', 'application/x-executable' // Software
    ];
    
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg|flac|pdf|txt|epub|exe|msi|zip|rar)$/i)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  }
});

// Helper function to read products
const readProducts = () => {
  try {
    const data = readFileSync(productsFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Helper function to write products
const writeProducts = (products) => {
  writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// Upload product (music, novel, or software)
router.post('/product', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { productType, title, description, price, author, category } = req.body;

    if (!productType || !title || !price) {
      return res.status(400).json({ error: 'Missing required fields: productType, title, price' });
    }

    const product = {
      id: uuidv4(),
      productType,
      title,
      description: description || '',
      price: parseFloat(price),
      author: author || 'Unknown',
      category: category || 'General',
      fileName: req.file.filename,
      fileOriginalName: req.file.originalname,
      fileSize: req.file.size,
      filePath: `/uploads/${productType}/${req.file.filename}`,
      uploadedAt: new Date().toISOString(),
      downloads: 0
    };

    const products = readProducts();
    products.push(product);
    writeProducts(products);

    res.status(201).json({
      message: 'Product uploaded successfully',
      product
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all products or filter by type
router.get('/products', (req, res) => {
  try {
    const { type } = req.query;
    let products = readProducts();

    if (type) {
      products = products.filter(p => p.productType === type);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/product/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/product/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { title, description, price, category } = req.body;
    const updated = { ...products[productIndex] };

    if (title) updated.title = title;
    if (description) updated.description = description;
    if (price) updated.price = parseFloat(price);
    if (category) updated.category = category;

    products[productIndex] = updated;
    writeProducts(products);

    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/product/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = products[productIndex];
    products.splice(productIndex, 1);
    writeProducts(products);

    res.json({ message: 'Product deleted successfully', product: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by type
router.get('/products/type/:type', (req, res) => {
  try {
    const products = readProducts();
    const filtered = products.filter(p => p.productType === req.params.type);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
