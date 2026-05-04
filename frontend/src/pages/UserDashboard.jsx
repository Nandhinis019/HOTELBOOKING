import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../services/bookingService';

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await getUserBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await cancelBooking(bookingId);
            fetchBookings(); // Refresh bookings
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading bookings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-xl text-gray-600 mb-4">You don't have any bookings yet.</p>
                        <a
                            href="/"
                            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                        >
                            Book a Room
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {booking.hotel?.name}
                                        </h3>
                                        <p className="text-gray-600">{booking.hotel?.address}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Booking ID</p>
                                        <p className="font-semibold">{booking.bookingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Room</p>
                                        <p className="font-semibold">
                                            {booking.room?.roomType} - Room #{booking.room?.roomNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Check-in</p>
                                        <p className="font-semibold">{new Date(booking.checkIn).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Check-out</p>
                                        <p className="font-semibold">{new Date(booking.checkOut).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Price</p>
                                        <p className="text-xl font-bold text-primary-600">₹{booking.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Booked On</p>
                                        <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
