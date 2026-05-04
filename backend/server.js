require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize app
const app = express();

// Connect DB
connectDB();


// ✅ CORS FIX (IMPORTANT)
app.use(cors({
    origin: true,              // allows all origins (best for Vercel dynamic URLs)
    credentials: true
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);


// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ZOVA Hotel Booking API' });
});


// Error handler
app.use((err, req, res, next) => {
    console.error("ERROR:", err.message);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});