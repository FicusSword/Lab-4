import { useState, useEffect } from 'react';
//import './AdminPanel.css';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  engine: string;
}

interface Schedule {
  id: number;
  animeTitle: string;
  dayOfWeek: string;
  time: string;
  episode: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AdminPanel() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'products' | 'schedule'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    title: '',
    description: '',
    image: '',
    engine: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageFromUrl, setIsImageFromUrl] = useState<boolean>(false);

  // Schedule state
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState<Schedule>({
    id: 0,
    animeTitle: '',
    dayOfWeek: 'Monday',
    time: '12:00',
    episode: ''
  });
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchSchedules();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedule');
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError('Invalid username or password');
        setToken('');
        return;
      }
      const data = await response.json();
      setToken(data.token);
      setIsLoggedIn(true);
      setError('');
    } catch {
      setError('Server error. Is the backend running?');
    }
  };

  // ---- Products ----

  const handleProductChange = (field: keyof Product, value: string) => {
    if (editingProduct) {
      setEditingProduct(prev => ({ ...prev!, [field]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      if (editingProduct) {
        setEditingProduct(prev => ({ ...prev!, image: imageUrl }));
      } else {
        setNewProduct(prev => ({ ...prev, image: imageUrl }));
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setImagePreview(imageUrl);
    if (editingProduct) {
      setEditingProduct(prev => ({ ...prev!, image: imageUrl }));
    } else {
      setNewProduct(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const addProduct = async () => {
    if (newProduct.title && newProduct.description && newProduct.image) {
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(newProduct),
        });
        if (!response.ok) throw new Error('Failed to add product');
        fetchProducts();
        setNewProduct({ id: 0, title: '', description: '', image: '', engine: '' });
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
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(editingProduct),
        });
        if (!response.ok) throw new Error('Failed to update product');
        fetchProducts();
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
  };

  // ---- Schedule ----

  const handleScheduleChange = (field: keyof Schedule, value: string) => {
    if (editingSchedule) {
      setEditingSchedule(prev => ({ ...prev!, [field]: value }));
    } else {
      setNewSchedule(prev => ({ ...prev, [field]: value }));
    }
  };

  const addSchedule = async () => {
    if (newSchedule.animeTitle && newSchedule.dayOfWeek && newSchedule.time) {
      try {
        const response = await fetch('/api/schedule', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(newSchedule),
        });
        if (!response.ok) throw new Error('Failed to add schedule');
        fetchSchedules();
        setNewSchedule({ id: 0, animeTitle: '', dayOfWeek: 'Monday', time: '12:00', episode: '' });
      } catch (error) {
        console.error('Error adding schedule:', error);
      }
    } else {
      alert("Please fill in anime title, day and time");
    }
  };

  const updateSchedule = async () => {
    if (editingSchedule) {
      try {
        const response = await fetch(`/api/schedule/${editingSchedule.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(editingSchedule),
        });
        if (!response.ok) throw new Error('Failed to update schedule');
        fetchSchedules();
        setEditingSchedule(null);
      } catch (error) {
        console.error('Error updating schedule:', error);
      }
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      const response = await fetch(`/api/schedule/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!response.ok) throw new Error('Failed to delete schedule');
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  // Группировка по дням
  const scheduleByDay = DAYS.reduce<Record<string, Schedule[]>>((acc, day) => {
    acc[day] = schedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {});

  if (isLoggedIn) {
    const current = editingSchedule ?? newSchedule;

    return (
      <div className="admin-panel container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Admin Panel</h1>
          <div>
            <span className="me-3">Welcome, <strong>{username}</strong></span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { setIsLoggedIn(false); setToken(''); setUsername(''); setPassword(''); }}>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
          </li>
        </ul>

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <>
            <div className="product-form mb-5">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
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
                  placeholder="Anime name"
                  value={editingProduct ? editingProduct.engine : newProduct.engine}
                  onChange={(e) => handleProductChange('engine', e.target.value)}
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
                  <input type="file" className="form-control" onChange={handleImageChange} />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: '150px', height: '150px' }} />}
                </div>
              )}

              <button onClick={editingProduct ? updateProduct : addProduct} className="btn btn-primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button className="btn btn-secondary ms-2" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              )}
            </div>

            <div className="product-list">
              <h2>Product List</h2>
              {products.map(product => (
                <div key={product.id} className="product-item mb-3">
                  <div className="admin-product-card">
                    <img src={product.image} alt={product.title} />
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                      <div className="product-details-inline">
                        <span><strong>Anime name:</strong> {product.engine}</span>
                      </div>
                    </div>
                    <button onClick={() => handleEditProduct(product)} className="btn btn-warning">Edit</button>
                    <button onClick={() => deleteProduct(product.id)} className="btn btn-danger delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== SCHEDULE TAB ===== */}
        {activeTab === 'schedule' && (
          <>
            <div className="schedule-form mb-5">
              <h2>{editingSchedule ? 'Edit Schedule Entry' : 'Add Schedule Entry'}</h2>
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Anime title"
                    value={current.animeTitle}
                    onChange={(e) => handleScheduleChange('animeTitle', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={current.dayOfWeek}
                    onChange={(e) => handleScheduleChange('dayOfWeek', e.target.value)}
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="time"
                    className="form-control"
                    value={current.time}
                    onChange={(e) => handleScheduleChange('time', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Episode (e.g. Ep. 12)"
                    value={current.episode}
                    onChange={(e) => handleScheduleChange('episode', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-3">
                <button onClick={editingSchedule ? updateSchedule : addSchedule} className="btn btn-primary">
                  {editingSchedule ? 'Update Entry' : 'Add Entry'}
                </button>
                {editingSchedule && (
                  <button className="btn btn-secondary ms-2" onClick={() => setEditingSchedule(null)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="schedule-grid">
              {DAYS.map(day => (
                <div key={day} className="schedule-day mb-4">
                  <h5 className="schedule-day-header">{day}</h5>
                  {scheduleByDay[day].length === 0 ? (
                    <p className="text-muted ms-2">No entries</p>
                  ) : (
                    scheduleByDay[day].map(s => (
                      <div key={s.id} className="schedule-entry d-flex align-items-center gap-3 mb-2 p-2 rounded">
                        <span className="schedule-time fw-bold">{s.time}</span>
                        <span className="flex-grow-1">{s.animeTitle}{s.episode ? ` — ${s.episode}` : ''}</span>
                        <button className="btn btn-sm btn-warning" onClick={() => setEditingSchedule(s)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteSchedule(s.id)}>Delete</button>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </>
        )}
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
