import React, { useState } from 'react';
import { api } from '../services/api';

const Checkout = ({ cartItems = [], onCheckoutSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePaymentChange = (e) => setPaymentData({ ...paymentData, [e.target.name]: e.target.value });

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrderResult(null);

    try {
      const res = await api.checkout(cartItems);
      setShowPayment(true);
      setOrderResult({ orderId: res.orderId || res.id || null, message: res.message || 'Order created successfully' });
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) throw new Error('Please fill card details');

      const paymentPayload = {
        orderId: orderResult?.orderId || null,
        amount: total,
        card: {
          number: paymentData.cardNumber.replace(/\s+/g, ''),
          expiry: paymentData.expiry,
          cvv: paymentData.cvv,
          name: paymentData.nameOnCard,
        },
      };

      const paymentRes = await api.processPayment(paymentPayload);

      setOrderResult(paymentRes);
      setShowPayment(false);
      setFormData({ name: '', email: '', address: '' });
      setPaymentData({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
      onCheckoutSuccess && onCheckoutSuccess(paymentRes);
    } catch (err) {
      setError(err.message || 'Payment failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '25px',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #f5f5f5, #eaeaff)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid yellow',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
    width: '100%',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(255, 255, 0, 0.7)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px', color: '#222', textAlign: 'center' }}>Checkout 🛒</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Your cart is empty.</p>
      ) : (
        <>
          {!showPayment && (
            <form onSubmit={handleCheckout}>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />

              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />

              <label>Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required style={{ ...inputStyle, height: '80px' }} />

              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Total: ₨. {total.toFixed(2)}/-</p>

              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

              <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'Processing order...' : 'Proceed to Payment'}
              </button>
            </form>
          )}

          {showPayment && (
            <form onSubmit={handlePayment}>
              <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Payment</h3>
              <p style={{ fontWeight: 'bold' }}>Paying: ₨. {total.toFixed(2)}/-</p>

              <label>Name on Card:</label>
              <input name="nameOnCard" value={paymentData.nameOnCard} onChange={handlePaymentChange} required style={inputStyle} />

              <label>Card Number:</label>
              <input
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="4242 4242 4242 4242"
                required
                style={inputStyle}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Expiry (MM/YY):</label>
                  <input name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} placeholder="12/34" required style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>CVV:</label>
                  <input name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} placeholder="123" required style={inputStyle} />
                </div>
              </div>

              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

              <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'Processing payment...' : 'Pay Now'}
              </button>
            </form>
          )}

          {orderResult && !showPayment && (
            <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', background: '#f7fff7', border: '1px solid #0a0' }}>
              <strong>{orderResult.message || 'Success'}</strong>
              {orderResult.orderId && <div>Order ID: {orderResult.orderId}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
