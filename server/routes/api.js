const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const axios = require('axios');

let markets = [
    {
        id: "seed-btc-1",
        question: "Will Bitcoin hit $100k by end of year?",
        category: "finance",
        predictionType: "yes_no",
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
    const { question, category, predictionType, threshold, endTime } = req.body;
    const newMarket = {
        id: generateId(), question, category, predictionType: predictionType || 'yes_no', threshold: Number(threshold), endTime, status: 'active', result: null
    };
    markets.push(newMarket);
    res.status(201).json(newMarket);
});

// POST /bets
router.post('/bets', (req, res) => {
    const { userAddress, predictionId, choice, amount, txHash } = req.body;
    
    // Check if market is expired or inactive
    const market = markets.find(m => m.id === predictionId);
    if (!market) return res.status(404).json({ error: "Market not found" });
    
    if (new Date() > new Date(market.endTime)) {
        return res.status(400).json({ error: "Market has expired and no longer accepts bets." });
    }
    
    if (market.status !== 'active') {
        return res.status(400).json({ error: "Market is not active." });
    }

    const newBet = { userAddress, predictionId, choice, amount: Number(amount), txHash };
    bets.push(newBet);
    res.status(201).json(newBet);
});

// === STANDALONE ORAcle RESOLUTION FUNCTION ===
async function processResolution(market, manualResult = null) {
    if (market.status === 'resolved') return market;
    
    market.status = 'resolved';
    
    // === REAL ORACLE LOGIC ===
    try {
        console.log(`Resolving oracle for category: ${market.category}`);
        if (market.category === 'finance') {
            const questionLower = market.question.toLowerCase();
            let coinId = 'bitcoin'; // Default fallback
            if (questionLower.includes('ethereum') || questionLower.includes('eth')) {
                coinId = 'ethereum';
            } else if (questionLower.includes('solana') || questionLower.includes('sol')) {
                coinId = 'solana';
            }

            console.log(`Fetching price for ${coinId}...`);
            const response = await axios.get(`${process.env.COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd`);
            const currentPrice = response.data[coinId].usd;
            
            console.log(`Live ${coinId} price: $${currentPrice} | Target Threshold: $${market.threshold}`);
            
            if (currentPrice >= Number(market.threshold)) {
                market.result = 'YES';
            } else {
                market.result = 'NO';
            }
        } else if (market.category === 'sports' && manualResult) {
            console.log(`Manual override provided for sports: ${manualResult}`);
            market.result = manualResult;
        } else {
            // Mock fallback for anything else for the Hackathon demo
            market.result = 'YES';
        }
    } catch (oracleError) {
        console.error("Oracle fetch error, defaulting to YES for demo:", oracleError.message);
        market.result = 'YES';
    }
    
    console.log(`Market resolved mathematically to: ${market.result}`);
    
    // === PAYOUT LOGIC ===
    try {
        if (process.env.ESCROW_PRIVATE_KEY) {
            console.log("Initiating backend escrow payouts...");
            const provider = new ethers.JsonRpcProvider('https://api-mezame.shardeum.org');
            const wallet = new ethers.Wallet(process.env.ESCROW_PRIVATE_KEY, provider);
            
            const pBets = bets.filter(b => b.predictionId === market.id);
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
    
    return market;
}

// POST /resolve (Manual Admin Override Fallback)
router.post('/resolve', async (req, res) => {
    const { predictionId, manualResult } = req.body;
    const market = markets.find(p => p.id === predictionId);
    
    if (market) {
        const updatedMarket = await processResolution(market, manualResult);
        res.json(updatedMarket);
    } else {
        res.status(404).json({ error: 'Market not found' });
    }
});

// === BACKGROUND AUTO-RESOLVER CRON ===
// Runs every 30 seconds to automatically resolve expired markets
setInterval(async () => {
    const now = new Date();
    for (const market of markets) {
        if (market.status === 'active' && now > new Date(market.endTime)) {
            console.log(`[Auto-Resolver] Market ${market.id} expired. Processing...`);
            
            if (market.category === 'sports') {
                // Sports requires manual override. We set status to pending so admin knows to look.
                console.log(`[Auto-Resolver] Market ${market.id} is sports. Awaiting manual logic.`);
                market.status = 'pending_resolution';
            } else {
                // Autonomously process finance / weather via the oracle logic
                await processResolution(market);
            }
        }
    }
}, 30000);

module.exports = router;
