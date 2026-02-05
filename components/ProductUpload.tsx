import React, { useState } from 'react';
import './ProductUpload.css';

interface UploadFormData {
  productType: 'music' | 'novel' | 'software';
  title: string;
  description: string;
  price: string;
  author: string;
  category: string;
}

export const ProductUpload: React.FC = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    productType: 'music',
    title: '',
    description: '',
    price: '',
    author: '',
    category: 'General'
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!file) {
        throw new Error('Please select a file to upload');
      }

      if (!formData.title || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('productType', formData.productType);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('price', formData.price);
      uploadFormData.append('author', formData.author);
      uploadFormData.append('category', formData.category);

      const response = await fetch('http://localhost:5000/api/uploads/product', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setMessageType('success');
      setMessage(`${formData.productType.charAt(0).toUpperCase() + formData.productType.slice(1)} uploaded successfully!`);
      
      // Reset form
      setFormData({
        productType: 'music',
        title: '',
        description: '',
        price: '',
        author: '',
        category: 'General'
      });
      setFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-upload-container">
      <div className="upload-card">
        <h2>Upload {formData.productType.charAt(0).toUpperCase() + formData.productType.slice(1)}</h2>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="productType">Product Type *</label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleFormChange}
              required
            >
              <option value="music">Music</option>
              <option value="novel">Novel/Book</option>
              <option value="software">Software</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter product title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author/Creator</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleFormChange}
              placeholder="Your name or artist name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Describe your product..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="General">General</option>
                <option value="Popular">Popular</option>
                <option value="New">New</option>
                <option value="Featured">Featured</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="file">Choose File *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
              />
              <span className="file-name">
                {file ? file.name : 'No file selected'}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
