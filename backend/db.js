require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
});

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Insert mock products if collection is empty
(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
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
      await Product.insertMany(mockProducts);
      console.log('Mock products inserted.');
    }
  } catch (err) {
    console.error('Error inserting mock products:', err);
  }
})();

module.exports = { User, Product, Cart };
