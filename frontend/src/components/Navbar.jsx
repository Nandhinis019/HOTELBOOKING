import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold">
                        ZOVA
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hover:text-primary-200 transition">
                            Home
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="hover:text-primary-200 transition">
                                    My Bookings
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="hover:text-primary-200 transition">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm">Welcome, {user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:text-primary-200 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
