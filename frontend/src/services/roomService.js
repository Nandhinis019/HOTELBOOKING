import API from './api';

export const checkAvailability = (hotelId, checkIn, checkOut) =>
    API.get(`/rooms/availability?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`);

export const getRoomsByHotel = (hotelId) => API.get(`/rooms/hotel/${hotelId}`);
export const createRoom = (roomData) => API.post('/rooms', roomData);
export const updateRoom = (id, roomData) => API.put(`/rooms/${id}`, roomData);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);
