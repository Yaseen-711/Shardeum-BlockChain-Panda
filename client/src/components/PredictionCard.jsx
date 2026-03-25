import { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeBet } from '../utils/api';
import { sendTransaction } from '../utils/wallet';

const PredictionCard = ({ prediction, walletAddress, onBetPlaced }) => {
    const [betAmount, setBetAmount] = useState('');
    const [predictedValue, setPredictedValue] = useState('');
    const [isBetting, setIsBetting] = useState(false);
    const isExpired = new Date() > new Date(prediction.endTime);
    const isActive = prediction.status === 'active' && !isExpired;
    const isNumberType = prediction.predictionType === 'number';

    const handleQuickBet = async (choice) => {
        if (!walletAddress) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
            alert("Please enter a valid bet amount.");
            return;
        }
        // For number-type predictions, require a predicted value
        if (isNumberType && (!predictedValue || isNaN(predictedValue))) {
            alert("Please enter a valid predicted number.");
            return;
        }
        
        setIsBetting(true);
        try {
            const hash = await sendTransaction("0x0000000000000000000000000000000000000000", betAmount);
            await placeBet({
                userAddress: walletAddress,
                predictionId: prediction.id,
                choice: isNumberType ? predictedValue : choice,
                amount: betAmount,
                txHash: hash
            });
            alert(isNumberType ? `Prediction of ${predictedValue} placed successfully!` : `Placed ${choice} bet successfully!`);
            setBetAmount('');
            setPredictedValue('');
            if (onBetPlaced) onBetPlaced(); // Refresh data
        } catch (error) {
            alert(error.message || "Bet failed");
        } finally {
            setIsBetting(false);
        }
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-lg shadow-indigo-100/20 dark:shadow-none rounded-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group">
            <div className="px-5 py-6 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 capitalize ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-400/20">
                        {prediction.category}
                    </span>
                    <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${isNumberType ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 ring-purple-500/20 dark:ring-purple-400/20' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 ring-purple-500/20 dark:ring-purple-400/20'}`}>
                            {isNumberType ? '🔢 Number' : '✋ Yes/No'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${isActive ? 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 ring-fuchsia-500/20 dark:ring-fuchsia-400/20' : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 ring-gray-500/20 dark:ring-gray-400/20'}`}>
                            {prediction.status === 'active' && isExpired ? 'resolving...' : prediction.status}
                        </span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {prediction.question}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Ends: <span className="text-gray-700 dark:text-gray-300">{new Date(prediction.endTime).toLocaleString()}</span>
                    </p>
                </div>

                {/* Pool Stats - only show for yes_no type */}
                {!isNumberType && (
                    <div className="mt-5">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold inline-block text-indigo-600 dark:text-indigo-400">
                                        YES Pool: {prediction.totalYesAmount} SHM
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold inline-block text-fuchsia-600 dark:text-fuchsia-400">
                                        NO Pool: {prediction.totalNoAmount} SHM
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30">
                                <div style={{ width: `${prediction.yesPercentage || 50}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-500/80 transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Number type pool info */}
                {isNumberType && (
                    <div className="mt-5 bg-purple-50 dark:bg-purple-900/20 p-3.5 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                            Target threshold: <span className="font-bold text-purple-900 dark:text-purple-100">{prediction.threshold}</span>
                        </p>
                        <p className="text-xs text-purple-500 dark:text-purple-400/80 mt-1.5">
                            Enter your predicted value and bet amount below.
                        </p>
                    </div>
                )}

                {isActive ? (
                    <div className="mt-5 border-t border-gray-100 dark:border-gray-700/50 pt-5">
                        <input
                            type="number"
                            placeholder="Amount in SHM"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 border mb-3 transition-colors"
                            disabled={isBetting}
                        />
                        
                        {isNumberType ? (
                            /* Number prediction input */
                            <div>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Your predicted value (e.g. 95000)"
                                    value={predictedValue}
                                    onChange={(e) => setPredictedValue(e.target.value)}
                                    className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 py-2.5 px-3 border mb-3 transition-colors"
                                    disabled={isBetting}
                                />
                                <button
                                    onClick={() => handleQuickBet(predictedValue)}
                                    disabled={isBetting}
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                >
                                    {isBetting ? 'Placing...' : '🔢 Place Prediction'}
                                </button>
                            </div>
                        ) : (
                            /* Yes/No buttons */
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleQuickBet('YES')}
                                    disabled={isBetting}
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm shadow-indigo-500/20 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                >
                                    {isBetting ? '...' : 'Vote YES'}
                                </button>
                                <button
                                    onClick={() => handleQuickBet('NO')}
                                    disabled={isBetting}
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm shadow-fuchsia-500/20 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                >
                                    {isBetting ? '...' : 'Vote NO'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                     <div className="mt-5 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 p-3.5 rounded-xl text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                        Result: <span className={prediction.result === 'YES' ? 'text-indigo-600 dark:text-indigo-400' : prediction.result === 'NO' ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-purple-600 dark:text-purple-400'}>{prediction.result || 'Pending'}</span>
                     </div>
                )}
            </div>
            <div className="bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700/50 px-5 py-3.5 sm:px-6">
                <Link
                    to={`/prediction/${prediction.id}`}
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                    View Details <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </div>
    );
};

export default PredictionCard;
