const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./cart.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Products table (mock data)
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    )
  `);

  // Cart table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Insert mock products if not exists
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (row.count === 0) {
      const mockProducts = [
    { name: 'Laptop', price: 999.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Laptop' },
    { name: 'Smartphone', price: 699.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Smartphone' },
    { name: 'Headphones', price: 199.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Headphones' },
    { name: 'Tablet', price: 499.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Tablet' },
    { name: 'Smartwatch', price: 299.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Smartwatch' },
    { name: 'Keyboard', price: 79.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Keyboard' },
    { name: 'Mouse', price: 29.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Mouse' },
    { name: 'Monitor', price: 249.99, image: 'https://placehold.co/200x180/4F46E5/ffffff?text=Monitor' },
    { name: 'Gaming Chair', price: 349.50, image: 'https://placehold.co/200x180/10B981/ffffff?text=Gaming+Chair' },
    { name: 'External SSD', price: 129.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=External+SSD' },
    { name: 'Web Camera 4K', price: 89.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Web+Camera' },
    { name: 'Laser Printer', price: 159.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Printer' },
    { name: 'Wi-Fi Router 6', price: 189.95, image: 'https://placehold.co/200x180/10B981/ffffff?text=Router' },
    { name: 'E-Reader', price: 130.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=E-Reader' },
    { name: 'Mini Drone', price: 210.50, image: 'https://placehold.co/200x180/10B981/ffffff?text=Mini+Drone' },
    { name: 'Portable Projector', price: 399.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Projector' },
    { name: 'Adjustable Desk Lamp', price: 55.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Desk+Lamp' },
    { name: 'Wireless Charging Pad', price: 35.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Wireless+Charger' },
    { name: 'Fitness Tracker Band', price: 79.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Fitness+Tracker' },
    { name: 'Graphics Card RTX', price: 599.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Graphics+Card' },
    { name: 'VR Headset Pro', price: 799.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=VR+Headset' },
    { name: 'Bluetooth Speaker', price: 95.50, image: 'https://placehold.co/200x180/10B981/ffffff?text=Bluetooth+Speaker' },
    { name: 'Drawing Tablet', price: 115.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Drawing+Tablet' },
    { name: 'Portable Fan USB', price: 25.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Portable+Fan' },
    { name: 'Smart Security Camera', price: 65.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Security+Camera' },
    { name: 'Smart TV 55 Inch', price: 899.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Smart+TV' },
    { name: 'USB Condenser', price: 45.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Microphone' },
    { name: 'Smart Coffee Maker', price: 149.99, image: 'https://placehold.co/200x180/10B981/ffffff?text=Coffee+Maker' },
    { name: 'Robot Vacuum Cleaner', price: 275.50, image: 'https://placehold.co/200x180/10B981/ffffff?text=Robot+Vacuum' },
    { name: 'Action Camera 5K', price: 320.00, image: 'https://placehold.co/200x180/10B981/ffffff?text=Action+Camera' },
    { name: 'Noise Earbuds', price: 119.99, image: 'https://placehold.co/200x180/EF4444/ffffff?text=Earbuds' },
    { name: 'Mechanical Keyboard', price: 109.95, image: 'https://placehold.co/200x180/EF4444/ffffff?text=Mech+Keyboard' }
];

// Note: To use this array in a project, you would typically export it:
// export default mockProducts;

      const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
      mockProducts.forEach(product => {
        stmt.run(product.name, product.price, product.image);
      });
      stmt.finalize();
      console.log('Mock products inserted.');
    }
  });
});

module.exports = db;
