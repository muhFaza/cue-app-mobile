import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export const getNearbyBilliardHalls = async (latitude, longitude, radius = 5000) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=bar&keyword=billiards+pool+hall&key=${API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data.status === 'OK') {
      return response.data.results;
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,website,price_level,photos,geometry&key=${API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data.status === 'OK') {
      return response.data.result;
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};