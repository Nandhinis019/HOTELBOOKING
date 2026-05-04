const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide hotel name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide hotel description']
    },
    city: {
        type: String,
        required: [true, 'Please provide city'],
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: [true, 'Please provide address']
    },
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
