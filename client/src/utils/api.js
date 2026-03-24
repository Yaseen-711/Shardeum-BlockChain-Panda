import axios from 'axios';

// Fallback to localhost:5000 if env variable is missing
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPredictions = async () => {
    // Calling /markets to align with user expectation
    const response = await api.get('/markets');
    return response.data;
};

export const createPrediction = async (data) => {
    const response = await api.post('/markets', data);
    return response.data;
};

export const placeBet = async (data) => {
    const response = await api.post('/bets', data);
    return response.data;
};

export const resolvePrediction = async (predictionId) => {
    const response = await api.post('/resolve', { predictionId });
    return response.data;
};

export default api;
