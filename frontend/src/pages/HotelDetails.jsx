import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../services/hotelService';
import { checkAvailability } from '../services/roomService';
import { useAuth } from '../context/AuthContext';

const HotelDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    useEffect(() => {
        fetchHotelDetails();
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            const hotelResponse = await getHotelById(id);
            setHotel(hotelResponse.data);

            // Check room availability
            const availabilityResponse = await checkAvailability(id, checkIn, checkOut);
            setRooms(availabilityResponse.data);
        } catch (error) {
            console.error('Error fetching hotel details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookRoom = (room) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Calculate number of nights
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate - checkInDate;
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const totalPrice = room.pricePerNight * nights;

        navigate('/booking/confirm', {
            state: {
                hotel,
                room,
                checkIn,
                checkOut,
                nights,
                totalPrice
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading hotel details...</div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Hotel not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Hotel Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                {hotel.name}
                            </h1>
                            <p className="text-gray-600 mb-4">{hotel.address}</p>
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-500 text-xl">⭐</span>
                                <span className="ml-2 text-lg text-gray-700">{hotel.rating || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">{hotel.description}</p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Available Rooms */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Rooms</h2>

                    {rooms.filter(room => room.isAvailable).length === 0 ? (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                            No rooms available for the selected dates. Please try different dates.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {rooms.filter(room => room.isAvailable).map((room) => (
                                <div key={room._id} className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {room.roomType} Room
                                            </h3>
                                            <p className="text-gray-600">Room #{room.roomNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary-600">
                                                ₹{room.pricePerNight}
                                            </p>
                                            <p className="text-sm text-gray-600">per night</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Capacity:</span> {room.capacity} guests
                                        </p>
                                    </div>

                                    {room.amenities && room.amenities.length > 0 && (
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 mb-2">Room Amenities:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleBookRoom(room)}
                                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
