import React, { useEffect, useState } from 'react';
import { getPredictions } from '../utils/api';
import PredictionCard from '../components/PredictionCard';

const Home = ({ walletAddress }) => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPredictions = async () => {
        try {
            const data = await getPredictions();
            setPredictions(data);
        } catch (error) {
            console.error("Error fetching predictions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, []);

    if (loading) return <div className="text-center py-10">Loading markets...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">Active Markets</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Predict outcomes on finance, weather, and sports.
                </p>
            </div>
            
            {predictions.length === 0 ? (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No active markets found. Check back later!
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {predictions.map(prediction => (
                        <PredictionCard 
                            key={prediction.id} 
                            prediction={prediction} 
                            walletAddress={walletAddress}
                            onBetPlaced={fetchPredictions}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
