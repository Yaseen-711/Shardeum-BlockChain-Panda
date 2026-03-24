import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPrediction, resolvePrediction, getPredictions } from '../utils/api';

const Admin = () => {
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('finance');
    const [threshold, setThreshold] = useState('');
    const [endTime, setEndTime] = useState('');
    const [resolveId, setResolveId] = useState('');
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
            await createPrediction({ question, category, threshold, endTime });
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
            await resolvePrediction(resolveId);
            alert('Market resolved successfully!');
            navigate('/'); // go to homepage to see result
        } catch (error) {
            console.error(error);
            alert('Failed to resolve prediction');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Create Market</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Create a new prediction market. Once created, you will be redirected to the home page.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleCreate}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Question (E.g. Will ETH hit $4000?)</label>
                                    <input type="text" required value={question} onChange={e => setQuestion(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        <option value="finance">Finance (Crypto Price)</option>
                                        <option value="weather">Weather</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Threshold / Target Number</label>
                                    <input type="number" step="any" required value={threshold} onChange={e => setThreshold(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. 4000" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input type="datetime-local" required value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Create Market
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Resolve Oracle</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            "Resolving an Oracle" means closing the market and deciding if the answer was YES or NO based on real-world data at the end time.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleResolve}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Select Market to Resolve</label>
                                    <select required value={resolveId} onChange={e => setResolveId(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        <option value="" disabled>-- Select an Active Market --</option>
                                        {activeMarkets.map(m => (
                                            <option key={m.id} value={m.id}>{m.question}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-center items-center">
                                    Simulate Oracle & Close Market
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
