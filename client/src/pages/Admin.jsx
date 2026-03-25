import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPrediction, resolvePrediction, getPredictions } from '../utils/api';

const Admin = () => {
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('finance');
    const [predictionType, setPredictionType] = useState('yes_no');
    const [threshold, setThreshold] = useState('');
    const [endTime, setEndTime] = useState('');
    const [resolveId, setResolveId] = useState('');
    const [manualResult, setManualResult] = useState('YES');
    const [activeMarkets, setActiveMarkets] = useState([]);
    
    const navigate = useNavigate();

    // Fetch active markets for the dropdown
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const data = await getPredictions();
                setActiveMarkets(data.filter(m => m.status === 'active'));
            } catch (error) {
                console.error("Failed to fetch markets for admin:", error);
            }
        };
        fetchMarkets();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createPrediction({ question, category, predictionType, threshold, endTime });
            alert('Prediction created successfully!');
            navigate('/'); // instantly go to homepage to see it
        } catch (error) {
            console.error(error);
            alert('Failed to create prediction. Make sure backend is running.');
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!resolveId) {
            alert('Please select a market to resolve.');
            return;
        }
        try {
            await resolvePrediction(resolveId, manualResult);
            alert('Market resolved successfully!');
            navigate('/'); // go to homepage to see result
        } catch (error) {
            console.error(error);
            alert('Failed to resolve prediction');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg shadow-indigo-100/20 dark:shadow-none border border-white/50 dark:border-gray-700/50 px-5 py-6 sm:rounded-2xl sm:p-8 transition-colors">
                <div className="md:grid md:grid-cols-3 md:gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-gray-200 dark:border-gray-700 pb-5 md:pb-0">
                        <h3 className="text-xl font-bold leading-6 text-gray-900 dark:text-gray-100">Create Market</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Create a new prediction market. Once created, you will be redirected to the home page.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleCreate}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Question (E.g. Will ETH hit $4000?)</label>
                                    <input type="text" required value={question} onChange={e => setQuestion(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                                        <option value="finance">Finance (Crypto Price)</option>
                                        <option value="weather">Weather</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Prediction Type</label>
                                    <select value={predictionType} onChange={e => setPredictionType(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                                        <option value="yes_no">Yes / No (Users vote YES or NO)</option>
                                        <option value="number">Number (Users predict a target value)</option>
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Threshold / Target Number</label>
                                    <input type="number" step="any" required value={threshold} onChange={e => setThreshold(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="e.g. 4000" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">End Time</label>
                                    <input type="datetime-local" required value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 border border-transparent rounded-lg shadow-sm py-2.5 px-5 inline-flex justify-center text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02]">
                                    ✨ Create Market
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg shadow-indigo-100/20 dark:shadow-none border border-white/50 dark:border-gray-700/50 px-5 py-6 sm:rounded-2xl sm:p-8 transition-colors">
                <div className="md:grid md:grid-cols-3 md:gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-gray-200 dark:border-gray-700 pb-5 md:pb-0">
                        <h3 className="text-xl font-bold leading-6 text-gray-900 dark:text-gray-100">Resolve Oracle</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            "Resolving an Oracle" means closing the market and deciding if the answer was YES or NO based on real-world data at the end time.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleResolve}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Select Market to Resolve</label>
                                    <select required value={resolveId} onChange={e => setResolveId(e.target.value)} className="mt-1.5 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                                        <option value="" disabled>-- Select an Active Market --</option>
                                        {activeMarkets.map(m => (
                                            <option key={m.id} value={m.id}>{m.question}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {activeMarkets.find(m => m.id === resolveId)?.category === 'sports' && (
                                    <div className="col-span-6 sm:col-span-4 mt-2">
                                        <label className="block text-sm font-bold text-purple-600 dark:text-purple-400">Manual Result (Sports Only Override)</label>
                                        <select value={manualResult} onChange={e => setManualResult(e.target.value)} className="mt-1.5 block w-full bg-purple-50 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg shadow-sm py-2.5 px-3 text-purple-900 dark:text-purple-100 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors">
                                            <option value="YES">YES (It Happened)</option>
                                            <option value="NO">NO (It Did Not Happen)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-gradient-to-r from-rose-500 to-rose-600 border border-transparent rounded-lg shadow-sm py-2.5 px-5 inline-flex justify-center text-sm font-bold text-white hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] text-center items-center">
                                    🔥 Simulate Oracle &amp; Close Market
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
