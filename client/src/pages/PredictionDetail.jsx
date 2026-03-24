import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPredictions, placeBet } from '../utils/api';
import { sendTransaction } from '../utils/wallet';

const PredictionDetail = ({ walletAddress }) => {
    const { id } = useParams();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [betAmount, setBetAmount] = useState('');
    const [isBetting, setIsBetting] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const data = await getPredictions();
                const p = data.find(item => item.id === id);
                setPrediction(p);
            } catch (error) {
                console.error("Error fetching prediction:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [id]);

    const handleBet = async (choice) => {
        if (!walletAddress) {
            setErrorMsg("Please connect your wallet first.");
            return;
        }
        if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
            setErrorMsg("Please enter a valid amount to bet.");
            return;
        }

        setIsBetting(true);
        setErrorMsg(null);
        setTxHash(null);

        try {
            // Send transaction using wallet.js (Simulated receiver address for demo)
            const hash = await sendTransaction("0x0000000000000000000000000000000000000000", betAmount);
            setTxHash(hash);

            // Record bet in backend
            await placeBet({
                userAddress: walletAddress,
                predictionId: id,
                choice,
                amount: betAmount,
                txHash: hash
            });

            // Refetch data (in a real app you'd just update local state ideally)
            const data = await getPredictions();
            const p = data.find(item => item.id === id);
            setPrediction(p);

            alert(`Successfully placed a ${choice} bet!`);
            setBetAmount('');

        } catch (error) {
            console.error("Betting error:", error);
            setErrorMsg(error.message || "Failed to place bet. Make sure Shardeum network is added.");
        } finally {
            setIsBetting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading market...</div>;
    if (!prediction) return <div className="text-center py-10">Market not found.</div>;

    const isActive = prediction.status === 'active';

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {prediction.question}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Category: {prediction.category.toUpperCase()} | Ends: {new Date(prediction.endTime).toLocaleString()}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {prediction.status}
                    </span>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total Yes Pool</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prediction.totalYesAmount} SHM ({prediction.yesPercentage}%)</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total No Pool</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prediction.totalNoAmount} SHM ({prediction.noPercentage}%)</dd>
                        </div>
                        
                        {!isActive && prediction.result && (
                            <div className="sm:col-span-2 bg-yellow-50 p-4 rounded-md">
                                <dt className="text-sm font-medium text-yellow-800">Final Result</dt>
                                <dd className="mt-1 text-lg font-bold text-yellow-900">{prediction.result}</dd>
                            </div>
                        )}
                        
                        {isActive && (
                            <div className="sm:col-span-2 mt-4">
                                {errorMsg && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                                        <span className="block sm:inline">{errorMsg}</span>
                                    </div>
                                )}
                                
                                {txHash && (
                                    <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
                                        <span className="block sm:inline">Transaction successful! </span>
                                        <a href={`https://explorer-mezame.shardeum.org/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline font-bold">
                                            View on Explorer
                                        </a>
                                    </div>
                                )}

                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        placeholder="Amount in SHM"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 py-2 px-3 border"
                                        disabled={isBetting}
                                    />
                                    <span className="inline-flex items-center px-3 rounded-none border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        SHM
                                    </span>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleBet('YES')}
                                        disabled={isBetting}
                                        className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {isBetting ? 'Processing...' : 'Bet YES'}
                                    </button>
                                    <button
                                        onClick={() => handleBet('NO')}
                                        disabled={isBetting}
                                        className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                        {isBetting ? 'Processing...' : 'Bet NO'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500">
                Market ID: {prediction.id}
            </div>
        </div>
    );
};

export default PredictionDetail;
