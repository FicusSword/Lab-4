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

  const addProduct = () => {
    if (newProduct.title && newProduct.description && newProduct.image) {
      const newId = products.length + 1;
      const updatedProducts = [...products, { ...newProduct, id: newId }];
      setProducts(updatedProducts);
      setNewProduct({ id: 0, title: '', description: '', image: '' });
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
      <div className="admin-panel">
        <h1 className="mb-4">Admin Panel</h1>
        <p>Welcome, <strong>{username}</strong>!</p>
        <p>Your access token is: <code>{token}</code></p>

        <div className="product-form mb-5">
          <h2>Add New Product</h2>
          <input type="text" placeholder="Title" value={newProduct.title} onChange={(e) => handleProductChange('title', e.target.value)} className="form-control mb-2" />
          <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => handleProductChange('description', e.target.value)} className="form-control mb-2" />
          <input type="text" placeholder="Image URL" value={newProduct.image} onChange={(e) => handleProductChange('image', e.target.value)} className="form-control mb-2" />
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
    <div className="login-form">
      <h1>Login to Admin Panel</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2" />
      <button onClick={handleLogin} className="btn btn-success">Login</button>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
