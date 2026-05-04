import { useState, useEffect } from 'react';
import { getAllBookings, getBookingStats } from '../services/bookingService';
import { getHotels, createHotel } from '../services/hotelService';
import { createRoom } from '../services/roomService';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hotel form state
    const [hotelForm, setHotelForm] = useState({
        name: '',
        description: '',
        city: '',
        address: '',
        amenities: '',
        rating: 0,
    });

    // Room form state
    const [roomForm, setRoomForm] = useState({
        hotel: '',
        roomNumber: '',
        roomType: 'Single',
        pricePerNight: '',
        capacity: 1,
        amenities: '',
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'stats') {
                const response = await getBookingStats();
                setStats(response.data);
            } else if (activeTab === 'bookings') {
                const response = await getAllBookings();
                setBookings(response.data);
            } else if (activeTab === 'hotels' || activeTab === 'rooms') {
                const response = await getHotels();
                setHotels(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHotel = async (e) => {
        e.preventDefault();
        try {
            const amenitiesArray = hotelForm.amenities.split(',').map(a => a.trim()).filter(a => a);
            await createHotel({
                ...hotelForm,
                amenities: amenitiesArray,
                rating: parseFloat(hotelForm.rating),
            });
            alert('Hotel created successfully!');
            setHotelForm({ name: '', description: '', city: '', address: '', amenities: '', rating: 0 });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create hotel');
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const amenitiesArray = roomForm.amenities.split(',').map(a => a.trim()).filter(a => a);
            await createRoom({
                ...roomForm,
                amenities: amenitiesArray,
                pricePerNight: parseFloat(roomForm.pricePerNight),
                capacity: parseInt(roomForm.capacity),
            });
            alert('Room created successfully!');
            setRoomForm({ hotel: '', roomNumber: '', roomType: 'Single', pricePerNight: '', capacity: 1, amenities: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create room');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b">
                    {['stats', 'bookings', 'hotels', 'rooms'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold capitalize ${activeTab === tab
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Stats Tab */}
                {activeTab === 'stats' && stats && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-gray-600 mb-2">Total Bookings</p>
                            <p className="text-3xl font-bold text-primary-600">{stats.totalBookings}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-gray-600 mb-2">Confirmed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-gray-600 mb-2">Cancelled</p>
                            <p className="text-3xl font-bold text-red-600">{stats.cancelledBookings}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-gray-600 mb-2">Total Revenue</p>
                            <p className="text-3xl font-bold text-primary-600">₹{stats.totalRevenue}</p>
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.bookingId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.user?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.hotel?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(booking.checkIn).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{booking.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">Create New Hotel</h2>
                            <form onSubmit={handleCreateHotel} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Hotel Name"
                                    value={hotelForm.name}
                                    onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={hotelForm.description}
                                    onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows="3"
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={hotelForm.city}
                                    onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={hotelForm.address}
                                    onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Amenities (comma-separated)"
                                    value={hotelForm.amenities}
                                    onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Rating (0-5)"
                                    value={hotelForm.rating}
                                    onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                                    Create Hotel
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Existing Hotels</h2>
                            <div className="space-y-4">
                                {hotels.map((hotel) => (
                                    <div key={hotel._id} className="bg-white rounded-lg shadow p-4">
                                        <h3 className="font-bold">{hotel.name}</h3>
                                        <p className="text-sm text-gray-600 capitalize">{hotel.city}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rooms Tab */}
                {activeTab === 'rooms' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Room</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4 max-w-2xl">
                            <select
                                value={roomForm.hotel}
                                onChange={(e) => setRoomForm({ ...roomForm, hotel: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="">Select Hotel</option>
                                {hotels.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Room Number"
                                value={roomForm.roomNumber}
                                onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <select
                                value={roomForm.roomType}
                                onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Price Per Night"
                                value={roomForm.pricePerNight}
                                onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                placeholder="Capacity"
                                value={roomForm.capacity}
                                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                required
                                min="1"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Amenities (comma-separated)"
                                value={roomForm.amenities}
                                onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                                Create Room
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
