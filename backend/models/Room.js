const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomNumber: {
        type: String,
        required: [true, 'Please provide room number']
    },
    roomType: {
        type: String,
        enum: ['Single', 'Double', 'Deluxe', 'Suite'],
        required: [true, 'Please provide room type']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Please provide price per night']
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide room capacity'],
        min: 1
    },
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure unique room numbers per hotel
roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
