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

    const isExpired = new Date() > new Date(prediction.endTime);
    const isActive = prediction.status === 'active' && !isExpired;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg shadow-indigo-100/20 dark:shadow-none sm:rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden transition-colors">
                <div className="px-5 py-6 sm:px-8 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100">
                            {prediction.question}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Category: <span className="text-indigo-600 dark:text-indigo-400">{prediction.category.toUpperCase()}</span> | Ends: {new Date(prediction.endTime).toLocaleString()}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${isActive ? 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 ring-fuchsia-500/20 dark:ring-fuchsia-400/20' : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 ring-gray-500/20 dark:ring-gray-400/20'}`}>
                        {prediction.status === 'active' && isExpired ? 'resolving...' : prediction.status}
                    </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700/50 px-5 py-6 sm:px-8">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                            <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Yes Pool</dt>
                            <dd className="mt-1 text-lg font-bold text-indigo-600 dark:text-indigo-400">{prediction.totalYesAmount} SHM <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({prediction.yesPercentage}%)</span></dd>
                        </div>
                        <div className="sm:col-span-1 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 p-4 rounded-xl border border-fuchsia-100/50 dark:border-fuchsia-800/30">
                            <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total No Pool</dt>
                            <dd className="mt-1 text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">{prediction.totalNoAmount} SHM <span className="text-sm font-medium text-gray-500 dark:text-gray-400">({prediction.noPercentage}%)</span></dd>
                        </div>
                        
                        {!isActive && prediction.result && (
                            <div className="sm:col-span-2 bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800/30 text-center">
                                <dt className="text-sm font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">Final Result</dt>
                                <dd className="mt-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">{prediction.result}</dd>
                            </div>
                        )}
                        
                        {isActive && (
                            <div className="sm:col-span-2 mt-2">
                                {errorMsg && (
                                    <div className="mb-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl relative font-medium text-sm" role="alert">
                                        <span className="block sm:inline">{errorMsg}</span>
                                    </div>
                                )}
                                
                                {txHash && (
                                    <div className="mb-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl relative font-medium text-sm">
                                        <span className="block sm:inline">Transaction successful! </span>
                                        <a href={`https://explorer-mezame.shardeum.org/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                            View on Explorer
                                        </a>
                                    </div>
                                )}

                                <div className="mt-1 flex rounded-lg shadow-sm">
                                    <input
                                        type="number"
                                        placeholder="Amount in SHM"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        className="flex-1 block w-full rounded-none rounded-l-lg sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 py-3 px-4 border focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        disabled={isBetting}
                                    />
                                    <span className="inline-flex items-center px-4 rounded-none rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600/50 text-gray-500 dark:text-gray-300 sm:text-sm font-bold">
                                        SHM
                                    </span>
                                </div>
                                
                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleBet('YES')}
                                        disabled={isBetting}
                                        className="w-full inline-flex justify-center items-center px-4 py-3.5 border border-transparent text-sm font-bold rounded-xl shadow-sm shadow-indigo-500/20 text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                    >
                                        {isBetting ? 'Processing...' : 'Bet YES'}
                                    </button>
                                    <button
                                        onClick={() => handleBet('NO')}
                                        disabled={isBetting}
                                        className="w-full inline-flex justify-center items-center px-4 py-3.5 border border-transparent text-sm font-bold rounded-xl shadow-sm shadow-fuchsia-500/20 text-white bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                    >
                                        {isBetting ? 'Processing...' : 'Bet NO'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 font-mono">
                Market ID: {prediction.id}
            </div>
        </div>
    );
};

export default PredictionDetail;
