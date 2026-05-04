const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { checkBookingConflict, calculateTotalPrice, validateBookingDates } = require('../utils/bookingUtils');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { hotel, room, checkIn, checkOut, totalPrice, paymentMethod, transactionId, paymentStatus } = req.body;

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not found. Please login again.' });
        }

        // Validate dates
        const dateValidation = validateBookingDates(checkIn, checkOut);
        if (!dateValidation.valid) {
            return res.status(400).json({ message: dateValidation.message });
        }

        // Check for booking conflicts
        const hasConflict = await checkBookingConflict(room, checkIn, checkOut);
        if (hasConflict) {
            return res.status(409).json({ message: 'Room is not available for selected dates' });
        }

        // Get room details for price calculation
        const roomDetails = await Room.findById(room);
        if (!roomDetails) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Calculate total price if not provided
        const finalTotalPrice = totalPrice || calculateTotalPrice(checkIn, checkOut, roomDetails.pricePerNight);

        // Create booking with payment information
        const booking = await Booking.create({
            user: req.user._id,
            hotel,
            room,
            checkIn,
            checkOut,
            totalPrice: finalTotalPrice,
            paymentMethod: paymentMethod || 'credit_card',
            transactionId: transactionId || '',
            paymentStatus: paymentStatus || 'pending'
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('hotel')
            .populate('room')
            .populate('user', '-password');

        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('hotel')
            .populate('room')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('hotel')
            .populate('room')
            .populate('user', '-password');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Check if check-in date has passed
        if (new Date(booking.checkIn) < new Date()) {
            return res.status(400).json({ message: 'Cannot cancel booking after check-in date' });
        }

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('hotel')
            .populate('room')
            .populate('user', '-password')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });

        // Calculate total revenue
        const revenueData = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            totalBookings,
            confirmedBookings,
            cancelledBookings,
            completedBookings,
            totalRevenue
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
