import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities } from '../services/hotelService';

const Home = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await getCities();
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (selectedCity && checkIn && checkOut) {
            navigate(`/hotels?city=${selectedCity}&checkIn=${checkIn}&checkOut=${checkOut}`);
        }
    };

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 relative">
            {/* Background Image with 90% Visibility */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070)',
                    opacity: 0.9
                }}
            />

            {/* Subtle dark overlay for text readability */}
            <div className="absolute inset-0 bg-black opacity-20" />

            <div className="relative container mx-auto px-4 py-20">
                <div className="text-center text-white mb-12">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-2xl">Welcome to ZOVA</h1>
                    <p className="text-xl text-white drop-shadow-lg">
                        Find and book your perfect hotel room
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select City
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent capitalize"
                                >
                                    <option value="">Choose a city</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city} className="capitalize">
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-in Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    min={today}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-out Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    min={checkIn || today}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg"
                        >
                            Search Hotels
                        </button>
                    </form>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
                    <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-lg">
                        <div className="text-4xl mb-4">🏨</div>
                        <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                        <p className="text-white/90">Choose from 50+ hotels across 5 cities</p>
                    </div>
                    <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-lg">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                        <p className="text-white/90">Guaranteed lowest rates</p>
                    </div>
                    <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-lg">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                        <p className="text-white/90">Safe and encrypted transactions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
