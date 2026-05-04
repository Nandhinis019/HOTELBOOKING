const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    getBookingStats
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/admin/all', protect, admin, getAllBookings);
router.get('/admin/stats', protect, admin, getBookingStats);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
