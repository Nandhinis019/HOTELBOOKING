const express = require('express');
const router = express.Router();
const {
    getHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getCities
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHotels);
router.get('/cities/all', getCities);
router.get('/:id', getHotelById);
router.post('/', protect, admin, createHotel);
router.put('/:id', protect, admin, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

module.exports = router;
