import { useState, useEffect } from 'react';
import './AdminPanel.css';

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
  engine: string;
  horsepower: string;
  torque: string;
}

const users: UserDictionary = {
  "admin": {
    "username": "admin",
    "password": "123",
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
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    title: '',
    description: '',
    image: '',
    engine: '',
    horsepower: '',
    torque: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageFromUrl, setIsImageFromUrl] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://localhost:7039/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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
    if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev!,
        [field]: value
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      if (editingProduct) {
        setEditingProduct(prev => ({
          ...prev!,
          image: imageUrl
        }));
      } else {
        setNewProduct(prev => ({
          ...prev,
          image: imageUrl
        }));
      }
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setImagePreview(imageUrl);
    if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev!,
        image: imageUrl
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        image: imageUrl
      }));
    }
  };

  const addProduct = async () => {
    if (newProduct.title && newProduct.description && newProduct.image) {
      try {
        const response = await fetch('https://localhost:7039/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error('Failed to add product');
        }

        fetchProducts();

        setNewProduct({
          id: 0, title: '', description: '', image: '', engine: '', horsepower: '', torque: ''
        });
        setImagePreview(null);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const updateProduct = async () => {
    if (editingProduct) {
      try {
        const response = await fetch(`https://localhost:7039/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        fetchProducts();
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };


  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7039/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
  };

  if (isLoggedIn) {
    return (
      <div className="admin-panel container mt-4">
        <h1 className="mb-4">Admin Panel</h1>
        <p>Welcome, <strong>{username}</strong>!</p>
        <p>Your access token is: <code>{token}</code></p>

        <div className="product-form mb-5">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={editingProduct ? editingProduct.title : newProduct.title}
              onChange={(e) => handleProductChange('title', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              rows={4}
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => handleProductChange('description', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Engine"
              value={editingProduct ? editingProduct.engine : newProduct.engine}
              onChange={(e) => handleProductChange('engine', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Horsepower"
              value={editingProduct ? editingProduct.horsepower : newProduct.horsepower}
              onChange={(e) => handleProductChange('horsepower', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Torque"
              value={editingProduct ? editingProduct.torque : newProduct.torque}
              onChange={(e) => handleProductChange('torque', e.target.value)}
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
                value={editingProduct ? editingProduct.image : newProduct.image}
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
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: '150px', height: '150px' }} />}
            </div>
          )}

          <button onClick={editingProduct ? updateProduct : addProduct} className="btn btn-primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>

        <div className="product-list">
          <h2>Product List</h2>
          {products.map(product => (
            <div key={product.id} className="product-item mb-3">
              <div className="product-card">
                <img src={product.image} alt={product.title} />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="product-details-inline">
                    <span><strong>Engine:</strong> {product.engine}</span>
                    <span><strong>Horsepower:</strong> {product.horsepower}</span>
                    <span><strong>Torque:</strong> {product.torque}</span>
                  </div>
                </div>
                <button onClick={() => handleEdit(product)} className="btn btn-warning">Edit</button>
                <button onClick={() => deleteProduct(product.id)} className="btn btn-danger delete-btn">Delete</button>
              </div>
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
      <button onClick={handleLogin} className="btn btn-primary">Login</button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
