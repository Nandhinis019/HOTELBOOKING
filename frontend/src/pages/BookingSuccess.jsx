import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, transactionId } = location.state || {};

    // Auto-redirect to dashboard after 5 seconds
    useEffect(() => {
        if (booking) {
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [booking, navigate]);

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">No booking information found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-green-600 mb-4">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Your booking and payment have been successfully processed
                    </p>

                    <div className="bg-primary-50 rounded-lg p-6 mb-8">
                        <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                        <p className="text-2xl font-bold text-primary-600">{booking.bookingId}</p>
                    </div>

                    {transactionId && (
                        <div className="bg-green-50 rounded-lg p-6 mb-8">
                            <p className="text-sm text-gray-600 mb-2">Transaction ID</p>
                            <p className="text-lg font-mono text-green-600">{transactionId}</p>
                            <p className="text-xs text-gray-500 mt-2">Payment Status: Completed ✓</p>
                        </div>
                    )}

                    <div className="text-left space-y-4 mb-8">
                        <div>
                            <p className="text-sm text-gray-600">Hotel</p>
                            <p className="text-lg font-semibold">{booking.hotel.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Room</p>
                            <p className="text-lg font-semibold">
                                {booking.room.roomType} - Room #{booking.room.roomNumber}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Check-in</p>
                                <p className="font-semibold">{new Date(booking.checkIn).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Check-out</p>
                                <p className="font-semibold">{new Date(booking.checkOut).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600">Total Amount Paid</p>
                            <p className="text-2xl font-bold text-primary-600">₹{booking.totalPrice}</p>
                            <p className="text-xs text-gray-500 mt-1">Payment Method: {booking.paymentMethod?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-800">
                            <strong>📧 Confirmation Email Sent!</strong><br />
                            A booking confirmation has been sent to your registered email address.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            🔄 Redirecting to My Bookings in 5 seconds...
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                        >
                            View My Bookings Now
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                            Book Another Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
