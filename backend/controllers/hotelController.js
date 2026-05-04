const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc    Get all hotels or filter by city
// @route   GET /api/hotels?city=cityname
// @access  Public
exports.getHotels = async (req, res) => {
    try {
        const { city } = req.query;
        const query = { isActive: true };

        if (city) {
            query.city = city.toLowerCase();
        }

        const hotels = await Hotel.find(query);
        res.json(hotels);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get hotel by ID with rooms
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const rooms = await Room.find({ hotel: req.params.id, isActive: true });

        res.json({
            ...hotel.toObject(),
            rooms
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Soft delete
        hotel.isActive = false;
        await hotel.save();

        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all cities
// @route   GET /api/hotels/cities/all
// @access  Public
exports.getCities = async (req, res) => {
    try {
        const cities = await Hotel.distinct('city', { isActive: true });
        res.json(cities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
