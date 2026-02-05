import React, { useState, useEffect } from 'react';
import './ProductBrowser.css';

interface Product {
  id: string;
  productType: 'music' | 'novel' | 'software';
  title: string;
  description: string;
  price: number;
  author: string;
  category: string;
  filePath: string;
  uploadedAt: string;
  fileSize: number;
}

export const ProductBrowser: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedType, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.100.179:5000/api/uploads/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'novel': return '📚';
      case 'software': return '💻';
      default: return '📦';
    }
  };

  return (
    <div className="product-browser-container">
      <div className="browser-header">
        <h1>Marketplace</h1>
        <p>Browse and discover amazing products</p>
      </div>

      <div className="browser-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products by title, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Products
          </button>
          <button
            className={`filter-btn ${selectedType === 'music' ? 'active' : ''}`}
            onClick={() => setSelectedType('music')}
          >
            🎵 Music
          </button>
          <button
            className={`filter-btn ${selectedType === 'novel' ? 'active' : ''}`}
            onClick={() => setSelectedType('novel')}
          >
            📚 Novels
          </button>
          <button
            className={`filter-btn ${selectedType === 'software' ? 'active' : ''}`}
            onClick={() => setSelectedType('software')}
          >
            💻 Software
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-icon">{getProductIcon(product.productType)}</div>
                <div className="product-type">{product.productType.toUpperCase()}</div>
              </div>

              <h3 className="product-title">{product.title}</h3>

              <p className="product-author">by {product.author}</p>

              <p className="product-description">{product.description || 'No description available'}</p>

              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className="size">{formatFileSize(product.fileSize)}</span>
              </div>

              <div className="product-footer">
                <div className="price">${product.price.toFixed(2)}</div>
                <div className="date">{formatDate(product.uploadedAt)}</div>
              </div>

              <button className="download-btn">
                Download Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBrowser;
