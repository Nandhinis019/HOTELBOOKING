import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotel, room, checkIn, checkOut, totalPrice, nights } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

    if (!hotel || !room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No booking data found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Show payment processing animation
            setShowPaymentSuccess(true);

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate transaction ID
            const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 10000);

            const bookingData = {
                hotel: hotel._id,
                room: room._id,
                checkIn,
                checkOut,
                totalPrice,
                paymentMethod,
                transactionId,
                paymentStatus: 'completed'
            };

            const response = await createBooking(bookingData);

            // Wait a bit to show success message
            await new Promise(resolve => setTimeout(resolve, 1500));

            navigate('/booking-success', {
                state: {
                    booking: response.data,
                    transactionId
                }
            });
        } catch (err) {
            setShowPaymentSuccess(false);
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    // Payment Success Overlay
    if (showPaymentSuccess) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center z-50 animate-fadeIn">
                <div className="text-center text-white px-8">
                    <div className="animate-bounce mb-8">
                        <div className="text-9xl">✓</div>
                    </div>
                    <h1 className="text-6xl font-bold mb-4 animate-pulse">
                        Payment Successful!
                    </h1>
                    <p className="text-2xl mb-8">Processing your booking...</p>
                    <div className="flex justify-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Confirm Your Booking</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Booking Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Hotel</p>
                                <p className="font-semibold text-lg">{hotel.name}</p>
                                <p className="text-sm text-gray-600">{hotel.city}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Room Type</p>
                                <p className="font-semibold">{room.roomType}</p>
                                <p className="text-sm text-gray-600">Room #{room.roomNumber}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Check-in</p>
                                    <p className="font-semibold">{new Date(checkIn).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">{new Date(checkIn).toLocaleTimeString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Check-out</p>
                                    <p className="font-semibold">{new Date(checkOut).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">{new Date(checkOut).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">₹{room.pricePerNight} × {nights} night(s)</span>
                                    <span className="font-semibold">₹{room.pricePerNight * nights}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-primary-600">
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleConfirmBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="net_banking">Net Banking</option>
                                </select>
                            </div>

                            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                placeholder="123"
                                                maxLength="3"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            )}

                            {paymentMethod === 'net_banking' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        You will be redirected to your bank's website to complete the payment.
                                    </p>
                                </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> This is a demo payment system. No actual charges will be made.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                                >
                                    {loading ? 'Processing...' : `Pay ₹${totalPrice}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
