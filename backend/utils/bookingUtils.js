const Booking = require('../models/Booking');

// Check if there's a booking conflict for a room
exports.checkBookingConflict = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
    const query = {
        room: roomId,
        status: { $in: ['confirmed', 'completed'] },
        $or: [
            // New booking starts during an existing booking
            {
                checkIn: { $lte: checkIn },
                checkOut: { $gt: checkIn }
            },
            // New booking ends during an existing booking
            {
                checkIn: { $lt: checkOut },
                checkOut: { $gte: checkOut }
            },
            // New booking completely contains an existing booking
            {
                checkIn: { $gte: checkIn },
                checkOut: { $lte: checkOut }
            }
        ]
    };

    // Exclude current booking when updating
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(query);
    return conflictingBooking !== null;
};

// Calculate total price based on check-in and check-out dates
exports.calculateTotalPrice = (checkIn, checkOut, pricePerNight) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate number of nights
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return nights * pricePerNight;
};

// Validate booking dates
exports.validateBookingDates = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();

    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return { valid: false, message: 'Invalid date format' };
    }

    // Check if check-in is in the past
    if (checkInDate < now) {
        return { valid: false, message: 'Check-in date cannot be in the past' };
    }

    // Check if check-out is before check-in
    if (checkOutDate <= checkInDate) {
        return { valid: false, message: 'Check-out date must be after check-in date' };
    }

    return { valid: true };
};
