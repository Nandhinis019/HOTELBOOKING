const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { checkBookingConflict } = require('../utils/bookingUtils');

// @desc    Get room availability
// @route   GET /api/rooms/availability?hotelId=xxx&checkIn=xxx&checkOut=xxx
// @access  Public
exports.checkAvailability = async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut } = req.query;

        if (!hotelId || !checkIn || !checkOut) {
            return res.status(400).json({ message: 'Please provide hotelId, checkIn, and checkOut' });
        }

        // Get all rooms for the hotel
        const rooms = await Room.find({ hotel: hotelId, isActive: true }).populate('hotel');

        // Check availability for each room
        const availabilityPromises = rooms.map(async (room) => {
            const hasConflict = await checkBookingConflict(room._id, checkIn, checkOut);
            return {
                ...room.toObject(),
                isAvailable: !hasConflict
            };
        });

        const roomsWithAvailability = await Promise.all(availabilityPromises);

        res.json(roomsWithAvailability);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/Admin
exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Soft delete
        room.isActive = false;
        await room.save();

        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get rooms by hotel
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
exports.getRoomsByHotel = async (req, res) => {
    try {
        const rooms = await Room.find({
            hotel: req.params.hotelId,
            isActive: true
        }).populate('hotel');

        res.json(rooms);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
