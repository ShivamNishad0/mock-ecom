import React, { useState, useEffect } from 'react';
import './App.css';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Signup from './components/Signup';
import { api, checkConnectivity } from './services/api';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [view, setView] = useState('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // --- Authentication check ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        setView('products');
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setView('login');
      }
    } else {
      setView('login');
    }
  }, []);

  // --- Fetch cart if authenticated ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const cart = await api.getCart();
        setCartItems(Array.isArray(cart) ? cart : cart?.items || []);
      } catch {
        setCartItems([]);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setView('products');
  };

  const handleSignupSuccess = () => setView('login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCartItems([]);
    setView('login');
  };

  const refreshCart = async () => {
    try {
      const cart = await api.getCart();
      setCartItems(Array.isArray(cart) ? cart : cart?.items || []);
    } catch {
      setCartItems([]);
    }
  };

  const addToCart = async (product) => {
    try {
      await api.addToCart(product);
      refreshCart();
    } catch {
      console.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.removeFromCart(id);
      refreshCart();
    } catch {
      console.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (id, action) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      await api.updateQuantity(id, newQty);
      refreshCart();
    } catch {
      console.error('Failed to update quantity');
    }
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setView('products');
    alert('Checkout successful!');
  };

  // --- Styles ---
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #1e1e2f, #3a3a5c)',
    borderRadius: '0 0 15px 15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  };

  const navH1 = {
    color: 'white',
    fontSize: '28px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: 'auto',
    textShadow: '1.5px 0px 2px rgba(255, 255, 0,0.7)',
    transition: '0.3s',
  };

  const navButton = {
    backgroundColor: 'black',
    color: 'white',
    border: 'yellow 1.5px solid',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    height: '40px',
    margin: '0 5px',
    padding: '0 15px',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0px 2px 8px rgba(255, 255, 0, 0.7)', 
  };

  const navButtonHover = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
  };

  const buttonGroup = { display: 'flex', alignItems: 'center' };

  return (
    <div className="App">
      <header>
        <nav style={navStyle}>
          <h1 style={navH1} onClick={() => setView('products')}>
            E-Commerce Cart
          </h1>
          {isAuthenticated && (
            <div style={buttonGroup}>
              <span style={{ color: 'white', marginRight: '10px', fontWeight: 'bold' }}>
                Hello, {user?.name}
              </span>

              <button
                style={navButton}
                onMouseEnter={e => Object.assign(e.target.style, navButtonHover)}
                onMouseLeave={e => Object.assign(e.target.style, navButton)}
                onClick={() => setView('products')}
              >
                Products
              </button>

              <button
                style={navButton}
                onMouseEnter={e => Object.assign(e.target.style, navButtonHover)}
                onMouseLeave={e => Object.assign(e.target.style, navButton)}
                onClick={() => setView('cart')}
              >
                Cart ({cartItems.length})
              </button>

              <button
                style={navButton}
                onMouseEnter={e => Object.assign(e.target.style, navButtonHover)}
                onMouseLeave={e => Object.assign(e.target.style, navButton)}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main style={{ marginTop: "-10px" }}>
        {!isAuthenticated && view === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setView('signup')} />
        )}

        {!isAuthenticated && view === 'signup' && (
          <Signup onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setView('login')} />
        )}

        {isAuthenticated && view === 'products' && <ProductGrid addToCart={addToCart} />}
        {isAuthenticated && view === 'cart' && (
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            onProceedToCheckout={() => setView('checkout')}
          />
        )}
        {isAuthenticated && view === 'checkout' && (
          <Checkout cartItems={cartItems} onCheckoutSuccess={handleCheckoutSuccess} />
        )}

        {!isAuthenticated && !['login', 'signup'].includes(view) && (
          <p style={{ padding: '20px' }}>Please login or signup to view products.</p>
        )}
      </main>
    </div>
  );
}

export default App;
