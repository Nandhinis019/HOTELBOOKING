import API from './api';

export const getHotels = (city) => API.get(`/hotels${city ? `?city=${city}` : ''}`);
export const getHotelById = (id) => API.get(`/hotels/${id}`);
export const getCities = () => API.get('/hotels/cities/all');
export const createHotel = (hotelData) => API.post('/hotels', hotelData);
export const updateHotel = (id, hotelData) => API.put(`/hotels/${id}`, hotelData);
export const deleteHotel = (id) => API.delete(`/hotels/${id}`);
