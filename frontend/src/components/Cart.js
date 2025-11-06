import React from 'react';

const Cart = ({ cartItems = [], removeFromCart, updateQuantity, onProceedToCheckout }) => {
  const items = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];
  const total = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);

  // --- Styles ---
  const cartStyle = {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '30px',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #f0f0f5, #d9d9f0)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  };

  const gridContainer = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  };

  const listItemStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
    transition: 'transform 0.3s',
  };

  const listItemHover = {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.7)',
  };

  const itemHeader = { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: '#333' };
  const itemPrice = { color: '#555', marginBottom: '10px' };
  const quantityControls = { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' };
  const quantityButton = {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '3px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s',
  };

  const removeButtonStyle = {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px',
    alignSelf: 'flex-end',
    transition: '0.3s',
  };

  const removeButtonHover = {
    backgroundColor: '#c9302c',
    transform: 'scale(1.05)',
  };

  const totalSection = {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const totalText = { fontSize: '20px', fontWeight: 'bold', color: '#333' };

  const checkoutButton = {
    background: 'linear-gradient(90deg, #ffdd00, #ffd700)',
    color: '#000',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  const checkoutHover = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
  };

  return (
    <div style={cartStyle}>
      <h2 style={{ textAlign: 'left', color: '#222', marginBottom: '25px' }}>🛒 Shopping Cart</h2>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Your cart is empty.</p>
      ) : (
        <>
          <div style={gridContainer}>
            {items.map((item) => (
              <div
                key={item.id}
                style={listItemStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, listItemHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, listItemStyle)}
              >
                <div>
                  <div style={itemHeader}>{item.name || item.title}</div>
                  <div style={itemPrice}>₨ {Number(item.price).toFixed(2)} each</div>

                  <div style={quantityControls}>
                    <button onClick={() => updateQuantity(item.id, 'decrease')} style={quantityButton}>−</button>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'increase')} style={quantityButton}>+</button>
                  </div>

                  <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#000' }}>
                    Total: ₨ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  style={removeButtonStyle}
                  onClick={() => removeFromCart(item.id)}
                  onMouseEnter={(e) => Object.assign(e.target.style, removeButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, removeButtonStyle)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={totalSection}>
            <p style={totalText}>Cart Total: ₨ {total.toFixed(2)}/-</p>
            <button
              style={checkoutButton}
              onClick={() => onProceedToCheckout()}
              onMouseEnter={(e) => Object.assign(e.target.style, checkoutHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, checkoutButton)}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
