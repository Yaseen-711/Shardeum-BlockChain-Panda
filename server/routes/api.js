const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

let markets = [
    {
        id: "seed-btc-1",
        question: "Will Bitcoin hit $100k by end of year?",
        category: "finance",
        threshold: 100000,
        endTime: new Date(Date.now() + 86400000 * 30).toISOString(),
        status: "active",
        result: null
    }
];

let bets = [
    { predictionId: "seed-btc-1", choice: "YES", amount: 20 },
    { predictionId: "seed-btc-1", choice: "NO", amount: 5 }
];

const generateId = () => Math.random().toString(36).substr(2, 9);

// GET /markets
router.get('/markets', (req, res) => {
    const activeMarkets = markets.map(p => {
        const pBets = bets.filter(b => b.predictionId === p.id);
        const yesBetsAmount = pBets.filter(b => b.choice === 'YES').reduce((sum, b) => sum + Number(b.amount), 0);
        const noBetsAmount = pBets.filter(b => b.choice === 'NO').reduce((sum, b) => sum + Number(b.amount), 0);
        const totalAmount = yesBetsAmount + noBetsAmount;
        
        return {
            ...p,
            totalYesAmount: yesBetsAmount,
            totalNoAmount: noBetsAmount,
            yesPercentage: totalAmount ? Math.round((yesBetsAmount / totalAmount) * 100) : 50,
            noPercentage: totalAmount ? Math.round((noBetsAmount / totalAmount) * 100) : 50
        };
    });
    res.json(activeMarkets);
});

// POST /markets
router.post('/markets', (req, res) => {
    const { question, category, threshold, endTime } = req.body;
    const newMarket = {
        id: generateId(), question, category, threshold: Number(threshold), endTime, status: 'active', result: null
    };
    markets.push(newMarket);
    res.status(201).json(newMarket);
});

// POST /bets
router.post('/bets', (req, res) => {
    const { userAddress, predictionId, choice, amount, txHash } = req.body;
    const newBet = { userAddress, predictionId, choice, amount: Number(amount), txHash };
    bets.push(newBet);
    res.status(201).json(newBet);
});

// POST /resolve
router.post('/resolve', async (req, res) => {
    const { predictionId } = req.body;
    const market = markets.find(p => p.id === predictionId);
    
    if (market) {
        market.status = 'resolved';
        market.result = 'YES'; // Mock resolution decision for demo
        
        // === PAYOUT LOGIC ===
        try {
            if (process.env.ESCROW_PRIVATE_KEY) {
                console.log("Initiating backend escrow payouts...");
                const provider = new ethers.JsonRpcProvider('https://api-mezame.shardeum.org');
                const wallet = new ethers.Wallet(process.env.ESCROW_PRIVATE_KEY, provider);
                
                const pBets = bets.filter(b => b.predictionId === predictionId);
                const winningBets = pBets.filter(b => b.choice === market.result);
                const totalPool = pBets.reduce((sum, b) => sum + b.amount, 0);
                const winningPool = winningBets.reduce((sum, b) => sum + b.amount, 0);

                if (winningPool > 0) {
                    for (const bet of winningBets) {
                        try {
                            const amountWon = (bet.amount / winningPool) * totalPool;
                            console.log(`Attempting payout of ${amountWon} SHM to ${bet.userAddress}...`);
                            
                            // Check for invalid addresses like "0xMockUser1"
                            if (!ethers.isAddress(bet.userAddress)) {
                                console.log(`Skipping: ${bet.userAddress} is not a valid EVM address.`);
                                continue;
                            }

                            const tx = await wallet.sendTransaction({
                                to: bet.userAddress,
                                value: ethers.parseEther(amountWon.toString())
                            });
                            console.log(`Transaction successfully broadcasted: ${tx.hash}`);
                            // await tx.wait(); // Optional: wait for mining
                        } catch (txError) {
                            console.error(`Failed to send payout to ${bet.userAddress}:`, txError.message);
                        }
                    }
                }
            } else {
                console.log("ESCROW_PRIVATE_KEY not set in .env! Skipping automated on-chain payouts, but resolving logically.");
            }
        } catch (error) {
            console.error("Critical Payout Processing Error:", error);
        }

        res.json(market);
    } else {
        res.status(404).json({ error: 'Market not found' });
    }
});

module.exports = router;
