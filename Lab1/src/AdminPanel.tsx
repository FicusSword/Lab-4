import { useState, useEffect } from 'react';
import './AdminPanel.css';  // Assuming you have a CSS file for additional styles

interface User {
  username: string;
  password: string;
  token: string;
}

interface UserDictionary {
  [key: string]: User;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

const users: UserDictionary = {
  "admin": {
    "username": "admin",
    "password": "admin123",
    "token": "adminTokenXYZ"
  }
};

export function AdminPanel() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({ id: 0, title: '', description: '', image: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageFromUrl, setIsImageFromUrl] = useState<boolean>(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleLogin = () => {
    const user = users[username];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setToken(user.token);
      setError('');
    } else {
      setError('Invalid username or password');
      setToken('');
    }
  };

  const handleProductChange = (field: keyof Product, value: string) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewProduct(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.value);
    setNewProduct(prev => ({ ...prev, image: e.target.value }));
  };

  const addProduct = () => {
    if (newProduct.title && newProduct.description && newProduct.image) {
      const newId = products.length + 1;
      const updatedProducts = [...products, { ...newProduct, id: newId }];
      setProducts(updatedProducts);
      setNewProduct({ id: 0, title: '', description: '', image: '' });
      setImagePreview(null);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  if (isLoggedIn) {
    return (
      <div className="admin-panel container mt-4">
        <h1 className="mb-4">Admin Panel</h1>
        <p>Welcome, <strong>{username}</strong>!</p>
        <p>Your access token is: <code>{token}</code></p>

        <div className="product-form mb-5">
          <h2>Add New Product</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={newProduct.title}
              onChange={(e) => handleProductChange('title', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => handleProductChange('description', e.target.value)}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                checked={!isImageFromUrl}
                onChange={() => setIsImageFromUrl(false)}
              />
              Upload Image from File
            </label>
            <label className="form-check-label ms-3">
              <input
                type="radio"
                className="form-check-input"
                checked={isImageFromUrl}
                onChange={() => setIsImageFromUrl(true)}
              />
              Use Image URL
            </label>
          </div>

          {isImageFromUrl ? (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={handleImageUrlChange}
              />
            </div>
          ) : (
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: '100px', height: '100px' }} />}
            </div>
          )}

          <button onClick={addProduct} className="btn btn-primary">Add Product</button>
        </div>

        <div className="product-list">
          <h2>Product List</h2>
          {products.map(product => (
            <div key={product.id} className="product-item mb-3">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img src={product.image} alt={product.title} style={{ width: '100px', height: '100px' }} className="mr-3" />
              <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Delete</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="login-form container mt-4">
      <h1>Login to Admin Panel</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} className="btn btn-success">Login</button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
