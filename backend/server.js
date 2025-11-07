const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

// Import routes
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const { router: authRoutes } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'https://mock-ecom-front.onrender.com'
}));
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Mock E-commerce API is running');
});

// server.js (or routes file)
app.post('/api/process-payment', (req, res) => {
  const { orderId, amount, card } = req.body;

  if (!card || !card.number || !card.cvv || !card.expiry) {
    return res.status(400).json({ error: 'Invalid payment data' });
  }

  // Mock validation: accept common test card 4242424242424242
  const normalized = (card.number || '').replace(/\s+/g, '');
  const acceptedTestCards = ['4242424242424242', '4000000000000002']; 

  if (!acceptedTestCards.includes(normalized)) {
    return res.status(402).json({ error: 'Payment declined (mock)' });
  }

  // simple expiry check (MM/YY)
  const [mm, yy] = (card.expiry || '').split('/');
  if (!mm || !yy || Number(mm) < 1 || Number(mm) > 12) {
    return res.status(400).json({ error: 'Invalid expiry date' });
  }

  // pretend we processed payment successfully
  const paymentResult = {
    success: true,
    message: 'Payment processed (mock)',
    paymentId: `pay_${Date.now()}`,
    orderId: orderId || null,
    amount,
  };

  console.log('Mock payment successful:', { orderId, amount, card: { last4: normalized.slice(-4) } });

  return res.status(200).json(paymentResult);
});

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
