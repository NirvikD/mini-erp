// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');

// Import all routes based on your project structure
const authRoutes = require('./routes/authRoutes');
const reqRoutes = require('./routes/reqRoutes');
const invRoutes = require('./routes/invRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const poRoutes = require('./routes/poRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

// Import the error handling middleware
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// For production, you can configure it to only allow your frontend domain:
// app.use(cors({ origin: 'http://localhost:3000' }));

// Mount all of the routes
app.use('/api/auth', authRoutes);
app.use('/api/requisition', reqRoutes);
app.use('/api/inventory', invRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/po', poRoutes);
app.use('/api/vendor', vendorRoutes);

// Error handling middleware - this must be the last middleware
app.use(errorHandler);

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
