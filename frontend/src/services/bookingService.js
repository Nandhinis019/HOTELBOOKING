import API from './api';

export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getUserBookings = () => API.get('/bookings/user');
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getAllBookings = () => API.get('/bookings/admin/all');
export const getBookingStats = () => API.get('/bookings/admin/stats');
