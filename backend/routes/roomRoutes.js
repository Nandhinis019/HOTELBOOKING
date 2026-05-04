const express = require('express');
const router = express.Router();
const {
    checkAvailability,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomsByHotel
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.get('/hotel/:hotelId', getRoomsByHotel);
router.post('/', protect, admin, createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
