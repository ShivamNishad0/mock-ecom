// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = 'https://mock-ecom-back.onrender.com/api';

export const api = {
  //  Fetch all products
  getProducts: async (page = 1, limit = 14) => {
    const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  //  Get all cart items
  getCart: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    return response.json();
  },

  //  Add item to cart
  addToCart: async (product) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        qty: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add to cart: ${errorText}`);
    }

    return response.json();
  },

  // Remove item from cart
  removeFromCart: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove from cart: ${errorText}`);
    }
    return response.json();
  },

  // Update quantity of cart item
  updateQuantity: async (id, qty) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ qty }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update quantity: ${errorText}`);
    }
    return response.json();
  },

  // Checkout
  checkout: async (cartItems) => {
    const payload = {
      cartItems: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
      })),
    };

    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Checkout failed: ${errorText}`);
    }

    return response.json();
  },

  // Process Payment (mock)
  processPayment: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/process-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      // try to parse JSON error if present
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || json.error || text || 'Payment failed');
      } catch {
        throw new Error(text || 'Payment failed');
      }
    }

    // parse JSON on success
    return JSON.parse(text);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }
    return response.json();
  },

  // Signup
  signup: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Signup failed: ${errorText}`);
    }
    return response.json();
  },

  // Get Profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile: ${errorText}`);
    }
    return response.json();
  },
};
