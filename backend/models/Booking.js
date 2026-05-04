const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true,
        default: function () {
            return 'ZOVA' + Date.now() + Math.floor(Math.random() * 1000);
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    checkIn: {
        type: Date,
        required: [true, 'Please provide check-in date and time']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please provide check-out date and time']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash'],
        default: 'credit_card'
    },
    transactionId: {
        type: String
    },
    cancelledAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
