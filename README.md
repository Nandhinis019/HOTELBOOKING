# ZOVA - Hotel Room Booking System

A full-stack MERN application for hotel room booking with real-time availability checking, secure authentication, and admin management.

## Features

### User Features
- ✅ User registration and login with JWT authentication
- ✅ Search hotels by city
- ✅ View hotel details and available rooms
- ✅ Real-time room availability checking
- ✅ Book hotel rooms with date/time selection
- ✅ View booking history
- ✅ Cancel bookings
- ✅ Responsive design

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Create and manage hotels
- ✅ Create and manage rooms
- ✅ View all bookings
- ✅ Revenue analytics

## Tech Stack

**Frontend:**
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Compass installed and running locally
- npm or yarn package manager

## Installation & Setup

### 1. Clone or Navigate to Project
```bash
cd "c:\Users\pravi\OneDrive\Desktop\MERN ZOVA"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Make sure MongoDB is running on localhost:27017
# Open MongoDB Compass and connect to mongodb://localhost:27017

# Seed the database with sample data
node seedData.js

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Login Credentials

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@zova.com`
- Password: `admin123`

**User Account:**
- Email: `user@zova.com`
- Password: `user123`

## Usage Guide

### For Users:

1. **Register/Login**: Create an account or login with existing credentials
2. **Search Hotels**: Select a city and choose check-in/check-out dates
3. **Browse Hotels**: View available hotels in the selected city
4. **View Details**: Click on a hotel to see room details and availability
5. **Book Room**: Select an available room and confirm booking
6. **Manage Bookings**: View your bookings in the dashboard and cancel if needed

### For Admins:

1. **Login**: Use admin credentials
2. **View Stats**: See booking statistics and revenue on the dashboard
3. **Manage Hotels**: Create new hotels with details and amenities
4. **Manage Rooms**: Add rooms to hotels with pricing and capacity
5. **View Bookings**: Monitor all bookings across the platform

## Project Structure

```
MERN ZOVA/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Hotel.js           # Hotel schema
│   │   ├── Room.js            # Room schema
│   │   └── Booking.js         # Booking schema
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── hotelController.js # Hotel management
│   │   ├── roomController.js  # Room management
│   │   └── bookingController.js # Booking logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hotelRoutes.js
│   │   ├── roomRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── utils/
│   │   └── bookingUtils.js    # Booking conflict logic
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   └── seedData.js            # Database seeding script
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── HotelList.jsx
    │   │   ├── HotelDetails.jsx
    │   │   ├── BookingConfirmation.jsx
    │   │   ├── BookingSuccess.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── hotelService.js
    │   │   ├── roomService.js
    │   │   └── bookingService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Hotels
- `GET /api/hotels?city=<city>` - Get hotels by city
- `GET /api/hotels/cities/all` - Get all cities
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (Admin)
- `PUT /api/hotels/:id` - Update hotel (Admin)
- `DELETE /api/hotels/:id` - Delete hotel (Admin)

### Rooms
- `GET /api/rooms/availability?hotelId=xxx&checkIn=xxx&checkOut=xxx` - Check availability
- `GET /api/rooms/hotel/:hotelId` - Get rooms by hotel
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/user` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking details (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `GET /api/bookings/admin/stats` - Get statistics (Admin)

## Key Features Implementation

### Booking Conflict Prevention
The system uses date-time overlap logic to prevent double bookings:
- Checks if new booking overlaps with existing confirmed bookings
- Validates check-in and check-out dates
- Ensures check-in is not in the past

### Real-time Availability
- Queries database for existing bookings in the selected date range
- Filters out unavailable rooms
- Shows only available rooms to users

### Secure Authentication
- Passwords hashed with bcrypt
- JWT tokens for session management
- Protected routes for authenticated users
- Role-based access control for admin features

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running on `localhost:27017`
- Open MongoDB Compass and verify connection
- Check the `.env` file has correct `MONGODB_URI`

**Port Already in Use:**
- Backend: Change `PORT` in `.env` file
- Frontend: Change port in `vite.config.js`

**CORS Errors:**
- Ensure backend is running on port 5000
- Check Vite proxy configuration in `vite.config.js`

## Future Enhancements

- Payment gateway integration
- Email notifications
- Image upload for hotels and rooms
- Reviews and ratings system
- Advanced search filters
- Multi-language support

## License

This project is open source and available for educational purposes.
