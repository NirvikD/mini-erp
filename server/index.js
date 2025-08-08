// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import the cors package

const authRoutes = require('./routes/authRoutes');
const reqRoutes = require('./routes/reqRoutes');
const invRoutes = require('./routes/invRoutes');
const rfqRoutes = require('./routes/RFQRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors()); // Use cors middleware
// Alternatively, for production, you can configure it to only allow your frontend domain:
// app.use(cors({ origin: 'http://localhost:3000' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requisition', reqRoutes);
app.use('/api/inventory', invRoutes);
app.use('/api/rfq', rfqRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);