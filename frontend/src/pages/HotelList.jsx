import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHotels } from '../services/hotelService';

const HotelList = () => {
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    useEffect(() => {
        fetchHotels();
    }, [city]);

    const fetchHotels = async () => {
        try {
            const response = await getHotels(city);
            setHotels(response.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHotel = (hotelId) => {
        navigate(`/hotel/${hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading hotels...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
                    Hotels in {city}
                </h1>
                <p className="text-gray-600 mb-8">
                    Check-in: {new Date(checkIn).toLocaleString()} | Check-out: {new Date(checkOut).toLocaleString()}
                </p>

                {hotels.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No hotels found in this city.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                                onClick={() => handleViewHotel(hotel._id)}
                            >
                                {/* Hotel Image */}
                                <div className="h-48 overflow-hidden">
                                    {hotel.images && hotel.images.length > 0 ? (
                                        <img
                                            src={hotel.images[0]}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                                        />
                                    ) : (
                                        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                                            <span className="text-white text-6xl">🏨</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {hotel.name}
                                    </h3>
                                    <p className="text-gray-600 mb-2 text-sm">{hotel.address}</p>
                                    <p className="text-gray-700 mb-3 text-sm line-clamp-2">{hotel.description}</p>

                                    <div className="flex items-center mb-4">
                                        <span className="text-yellow-500">⭐</span>
                                        <span className="ml-1 text-gray-700 font-semibold">{hotel.rating || 'N/A'}</span>
                                    </div>

                                    {hotel.amenities && hotel.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                            {hotel.amenities.length > 3 && (
                                                <span className="text-gray-500 text-sm">+{hotel.amenities.length - 3} more</span>
                                            )}
                                        </div>
                                    )}

                                    <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                                        View Rooms
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelList;
