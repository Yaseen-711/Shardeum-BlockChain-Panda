import { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeBet } from '../utils/api';
import { sendTransaction } from '../utils/wallet';

const PredictionCard = ({ prediction, walletAddress, onBetPlaced }) => {
    const [betAmount, setBetAmount] = useState('');
    const [isBetting, setIsBetting] = useState(false);
    const isActive = prediction.status === 'active';

    const handleQuickBet = async (choice) => {
        if (!walletAddress) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        
        setIsBetting(true);
        try {
            const hash = await sendTransaction("0x0000000000000000000000000000000000000000", betAmount);
            await placeBet({
                userAddress: walletAddress,
                predictionId: prediction.id,
                choice,
                amount: betAmount,
                txHash: hash
            });
            alert(`Placed ${choice} bet successfully!`);
            setBetAmount('');
            if (onBetPlaced) onBetPlaced(); // Refresh data
        } catch (error) {
            alert(error.message || "Bet failed");
        } finally {
            setIsBetting(false);
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {prediction.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {prediction.status}
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {prediction.question}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Ends: {new Date(prediction.endTime).toLocaleString()}
                    </p>
                </div>
                <div className="mt-4">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block text-green-600">
                                    YES Pool: {prediction.totalYesAmount} SHM
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-red-600">
                                    NO Pool: {prediction.totalNoAmount} SHM
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                            <div style={{ width: `${prediction.yesPercentage || 50}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                        </div>
                    </div>
                </div>

                {isActive ? (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <input
                            type="number"
                            placeholder="Amount in SHM"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border mb-3"
                            disabled={isBetting}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleQuickBet('YES')}
                                disabled={isBetting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                                {isBetting ? '...' : 'Vote YES'}
                            </button>
                            <button
                                onClick={() => handleQuickBet('NO')}
                                disabled={isBetting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                                {isBetting ? '...' : 'Vote NO'}
                            </button>
                        </div>
                    </div>
                ) : (
                     <div className="mt-4 bg-gray-50 p-3 rounded-md text-center text-sm font-medium text-gray-700">
                        Result: {prediction.result || 'Pending'}
                     </div>
                )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
                <Link
                    to={`/prediction/${prediction.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    View Details &rarr;
                </Link>
            </div>
        </div>
    );
};

export default PredictionCard;
