import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const ProductGrid = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const LIMIT = 14;

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts(currentPage, LIMIT);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const h2Product = {
    marginTop: '0px',
    fontSize: '40px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'white',
    textAlign: 'left',
    marginLeft: '10px',
    textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
  };

  const buttonStyle = {
    backgroundColor: 'black',
    color: '#fff',
    border: '2px solid yellow',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 3px rgba(255, 255, 0, 0.7)',
  };

  const paginationBtn = {
    backgroundColor: '#ffdd00',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '0 5px',
    transition: 'all 0.3s',
  };

  if (loading) return <div style={{ color: 'white' }}>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="product-grid" style={{ textAlign: 'center', padding: '10px' }}>
      <h2 style={h2Product}>Products</h2>

      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              border: '1px solid #ccc',
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '320px',
              boxShadow: '5px 4px 15px rgba(255, 215, 0, 0.5)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
          >
            <div>
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              />
              <h3 style={{ color: '#333', fontSize: '16px', margin: '10px 0', minHeight: '40px' }}>
                {product.title}
              </h3>
              <p style={{ color: '#000', fontWeight: 'bold', fontSize: '16px' }}>₨ {product.price}</p>
            </div>

            <button
              onClick={() => addToCart(product)}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#222';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 2px 5px rgba(255, 255, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'black';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 10px rgba(255, 255, 0, 0.7)';
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={paginationBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ◀ Prev
        </button>
        <span style={{ color: 'white', margin: '0 10px' }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={paginationBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
