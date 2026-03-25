<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Shardeum-6C5CE7?style=for-the-badge&logo=ethereum&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20+%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Oracle-CoinGecko%20API-F5C518?style=for-the-badge&logo=coingecko&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

# 🔮 QuickPredict — Decentralized Prediction Market on Shardeum

> **Forecast real-world events. Stake SHM. Win rewards.**  
> A fully functional, hackathon-ready prediction market dApp built on the **Shardeum EVM Testnet**.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Oracle Mechanism](#-oracle-mechanism)
- [Escrow & Payout System](#-escrow--payout-system)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**QuickPredict** is a decentralized prediction market platform where users can:

1. **Connect** their MetaMask wallet to the Shardeum Testnet.
2. **Browse** active prediction markets on crypto prices, weather, and sports.
3. **Place bets** (YES/NO or a numeric prediction) by staking real testnet SHM tokens.
4. **Win rewards** — when a market resolves, the oracle fetches live data from CoinGecko, compares it against the target, and **automatically distributes winnings** back to the correct bettors.

The entire lifecycle — from market creation to fund locking to autonomous payout — runs **end-to-end on-chain** using the Shardeum EVM Testnet infrastructure.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🦊 **MetaMask Wallet Integration** | One-click wallet connection with automatic Shardeum Testnet network switching. |
| 📊 **Dual Prediction Types** | Admin can create **Yes/No** markets or **Number** prediction markets. |
| 🔒 **Escrow Fund Locking** | All bet funds are automatically transferred to a secure Admin Escrow wallet upon placement. |
| 🌐 **Live Oracle Resolution** | Markets resolve using **real-time CoinGecko price data** — no hardcoded outcomes. |
| 💸 **Automated Payouts** | Winners receive their proportional share of the pool directly to their wallet — no manual transfers. |
| 🛡️ **Protected Routes** | Simple authentication guards the main app behind a login screen. |
| ⚡ **Real-Time Pool Stats** | Live YES/NO pool percentages and SHM amounts visualized with progress bars. |
| 📱 **Responsive Design** | Clean, modern Tailwind CSS UI that works on desktop and mobile. |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                  │
│   ┌─────────────┐    ┌──────────────┐    ┌────────────────┐     │
│   │  React App  │───▶│  Axios API   │───▶│  Express API   │     │
│   │  (Vite)     │    │  Client      │    │  (Backend)     │     │
│   └──────┬──────┘    └──────────────┘    └───────┬────────┘     │
│          │                                        │              │
│          │  MetaMask                              │  ethers.js   │
│          │  (sendTransaction)                     │  (payouts)   │
│          ▼                                        ▼              │
│   ┌──────────────────────────────────────────────────────┐      │
│   │              Shardeum EVM Testnet                     │      │
│   │              Chain ID: 8119                           │      │
│   │              RPC: https://api-mezame.shardeum.org     │      │
│   └──────────────────────────────────────────────────────┘      │
│                              ▲                                   │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │  CoinGecko API    │                        │
│                    │  (Oracle Feed)    │                        │
│                    └───────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

**Flow Summary:**
1. **User** connects wallet → places a bet → SHM is sent to Escrow.
2. **Admin** triggers "Resolve Oracle" → backend fetches live price from CoinGecko.
3. If `livePrice >= threshold` → result is **YES**; otherwise → **NO**.
4. Backend loops through winning bets and sends payouts from Escrow to winners.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI framework |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **ethers.js v6** | Wallet connection, network switching, transaction signing |
| **Axios** | HTTP client for API calls |
| **React Router v6** | Client-side routing and protected routes |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **ethers.js v6** | Server-side transaction signing for automated payouts |
| **Axios** | Fetching live oracle data from CoinGecko |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |

### Blockchain
| Detail | Value |
|--------|-------|
| **Network** | Shardeum EVM Testnet (Mezame) |
| **Chain ID** | `8119` |
| **RPC URL** | `https://api-mezame.shardeum.org` |
| **Explorer** | `https://explorer-mezame.shardeum.org` |
| **Native Token** | SHM |

---

## 📁 Project Structure

```
quickpredict/
├── .gitignore                  # Protects .env files and node_modules
├── README.md                   # You're reading it!
│
├── client/                     # 🎨 React Frontend (Vite)
│   ├── .env                    # VITE_BACKEND_URL, VITE_ADMIN_WALLET
│   ├── index.html              # Entry HTML
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite + Tailwind configuration
│   ├── postcss.config.js       # PostCSS setup
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router + Auth + Wallet state
│       ├── index.css           # Tailwind imports
│       ├── App.css             # Custom styles
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation bar with wallet display
│       │   └── PredictionCard.jsx  # Market card with betting UI
│       ├── pages/
│       │   ├── Home.jsx        # Lists all active markets
│       │   ├── Login.jsx       # Mock authentication page
│       │   ├── Admin.jsx       # Create markets + Resolve oracle
│       │   └── PredictionDetail.jsx  # Individual market view
│       └── utils/
│           ├── api.js          # Axios instance + API methods
│           └── wallet.js       # MetaMask + Shardeum helpers
│
└── server/                     # ⚙️ Node.js Backend (Express)
    ├── .env                    # PORT, ESCROW_PRIVATE_KEY, API keys
    ├── package.json            # Backend dependencies
    ├── index.js                # Express server entry point
    └── routes/
        └── api.js              # All API endpoints + Oracle + Payouts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MetaMask** browser extension
- **Shardeum Testnet SHM** (get from the [Shardeum Faucet](https://faucet.shardeum.org))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Yaseen-711/Shardeum-BlockChain-Panda.git
cd Shardeum-BlockChain-Panda

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### Configure Environment Variables

Create the following `.env` files:

**`server/.env`**
```env
PORT=5000
COINGECKO_API=https://api.coingecko.com/api/v3
WEATHER_API_KEY=YOUR_OPENWEATHER_KEY
WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
SPORTS_API_URL=https://mock.sportsapi.com/v1
ESCROW_PRIVATE_KEY=           # Admin wallet private key for payouts
```

**`client/.env`**
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ADMIN_WALLET=0x8c488EF577d5913D4928E7432b94Bc6B82A98618
```

### Run the Application

```bash
# Terminal 1 — Start the Backend
cd server
npm run dev
# ✅ Server running on port 5000

# Terminal 2 — Start the Frontend
cd client
npm run dev
# ✅ App running on http://localhost:5173
```

Open **http://localhost:5173** in your browser and you're ready to go! 🎉

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Port for the Express server (default: `5000`) |
| `ESCROW_PRIVATE_KEY` | ⚠️ | Private key of the admin escrow wallet. Required for automated payouts. **Use testnet wallets only!** |
| `COINGECKO_API` | ✅ | Base URL for CoinGecko API (`https://api.coingecko.com/api/v3`) |
| `WEATHER_API_KEY` | ❌ | OpenWeather API key (for future weather predictions) |
| `WEATHER_BASE_URL` | ❌ | OpenWeather base URL |
| `SPORTS_API_URL` | ❌ | Sports API URL (for future sports predictions) |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACKEND_URL` | ✅ | Full URL to the backend API (e.g., `http://localhost:5000/api`) |
| `VITE_ADMIN_WALLET` | ✅ | Admin escrow wallet address that receives all bet funds |

> ⚠️ **Security Note:** Never commit `.env` files to Git. The `.gitignore` is already configured to exclude them.

---

## 🎮 How It Works

### For Users

```
1. Open the app → Login with any email/password (mock auth)
2. Click "Connect Wallet" → MetaMask prompts to switch to Shardeum Testnet
3. Browse active markets on the Home page
4. Enter a bet amount (in SHM) and click:
   • "Vote YES" or "Vote NO"  (for Yes/No markets)
   • Enter a number and click "Place Prediction"  (for Number markets)
5. Confirm the MetaMask transaction → SHM is sent to the admin escrow
6. Wait for the admin to resolve the market
7. If you win → SHM is automatically sent back to your wallet! 💰
```

### For Admins

```
1. Navigate to the Admin page
2. Create Market:
   • Enter a question (e.g., "Will ETH hit $4000?")
   • Select category (Finance / Weather / Sports)
   • Select prediction type (Yes/No or Number)
   • Set a threshold/target number
   • Set an end time
3. Resolve Oracle:
   • Select an active market from the dropdown
   • Click "Simulate Oracle & Close Market"
   • The backend fetches live price data from CoinGecko
   • Compares it to the threshold → determines YES or NO
   • Automatically sends payouts to all winning bettors
```

---

## 🔮 Oracle Mechanism

The **Oracle** is the bridge between real-world data and the blockchain. When a market is resolved:

```
Admin clicks "Resolve"
       │
       ▼
Backend reads market.category
       │
       ├── "finance" → Detects coin from question text
       │                 │
       │                 ├── "bitcoin" / "btc" → CoinGecko: /simple/price?ids=bitcoin
       │                 ├── "ethereum" / "eth" → CoinGecko: /simple/price?ids=ethereum
       │                 └── "solana" / "sol"   → CoinGecko: /simple/price?ids=solana
       │                 │
       │                 ▼
       │         Live USD Price fetched
       │                 │
       │                 ├── price >= threshold → Result: YES ✅
       │                 └── price <  threshold → Result: NO  ❌
       │
       ├── "weather" → (Future: OpenWeather API integration)
       └── "sports"  → (Future: Sports API integration)
```

**Example:**
- Market: *"Will Bitcoin hit $100k by end of year?"* (threshold: `100000`)
- CoinGecko returns: `{ "bitcoin": { "usd": 97543 } }`
- `97543 < 100000` → Result: **NO** ❌
- All users who voted **NO** share the entire pool proportionally.

---

## 💸 Escrow & Payout System

### Fund Flow Diagram

```
┌─────────┐     sendTransaction()      ┌──────────────────┐
│  USER    │ ───────────────────────── ▶│  ADMIN ESCROW    │
│  Wallet  │     (SHM via MetaMask)     │  0x8c488E...618  │
└─────────┘                             └────────┬─────────┘
                                                  │
                                          Oracle Resolves
                                                  │
                                                  ▼
                                        ┌─────────────────┐
                                        │  Payout Engine   │
                                        │  (ethers.js)     │
                                        └────────┬────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              ▼                   ▼                   ▼
                        ┌──────────┐       ┌──────────┐       ┌──────────┐
                        │ Winner 1 │       │ Winner 2 │       │ Winner 3 │
                        │ 0xABC... │       │ 0xDEF... │       │ 0x123... │
                        └──────────┘       └──────────┘       └──────────┘
```

### Reward Calculation

```
amountWon = (userBet / totalWinningPool) × totalPool
```

**Example:**
- Total pool: **100 SHM** (70 YES + 30 NO)
- Result: **YES** → winning pool = 70 SHM
- User A bet 20 SHM on YES → receives `(20/70) × 100 = 28.57 SHM`
- User B bet 50 SHM on YES → receives `(50/70) × 100 = 71.43 SHM`

---

## 🌍 Deployment

### Backend → Render (Free Tier)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add environment variables (same as `server/.env`)
5. Deploy → get URL like `https://quickpredict-backend.onrender.com`

### Frontend → Vercel (Free Tier)

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Settings:
   - **Root Directory:** `client`
   - **Framework:** Vite
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`
3. Add environment variables:
   - `VITE_BACKEND_URL` = `https://quickpredict-backend.onrender.com/api`
   - `VITE_ADMIN_WALLET` = `0x8c488EF577d5913D4928E7432b94Bc6B82A98618`
4. Deploy → get URL like `https://quickpredict.vercel.app`

> 💡 **Auto-Deploy:** Every `git push` to `main` will automatically trigger a new build on both platforms.

---

## 📚 API Reference

All endpoints are prefixed with `/api`.

### `GET /api/markets`
Returns all markets with computed pool statistics.

**Response:**
```json
[
  {
    "id": "seed-btc-1",
    "question": "Will Bitcoin hit $100k by end of year?",
    "category": "finance",
    "predictionType": "yes_no",
    "threshold": 100000,
    "endTime": "2026-04-24T00:00:00.000Z",
    "status": "active",
    "result": null,
    "totalYesAmount": 20,
    "totalNoAmount": 5,
    "yesPercentage": 80,
    "noPercentage": 20
  }
]
```

### `POST /api/markets`
Create a new prediction market.

**Body:**
```json
{
  "question": "Will ETH hit $4000?",
  "category": "finance",
  "predictionType": "yes_no",
  "threshold": 4000,
  "endTime": "2026-04-01T00:00:00.000Z"
}
```

### `POST /api/bets`
Place a bet on a market.

**Body:**
```json
{
  "userAddress": "0xYourWalletAddress",
  "predictionId": "seed-btc-1",
  "choice": "YES",
  "amount": 10,
  "txHash": "0xTransactionHash"
}
```

### `POST /api/resolve`
Resolve a market using the oracle and trigger payouts.

**Body:**
```json
{
  "predictionId": "seed-btc-1"
}
```

---

## 🗺 Roadmap

- [x] Wallet connection with MetaMask
- [x] Market creation and browsing
- [x] YES/NO betting with SHM staking
- [x] Number-based predictions
- [x] Admin escrow fund locking
- [x] CoinGecko real-time oracle
- [x] Automated on-chain payouts
- [x] Responsive Tailwind CSS UI
- [ ] Solidity smart contract for trustless escrow
- [ ] Chainlink / automated cron-based resolution
- [ ] Weather oracle (OpenWeather API)
- [ ] Sports oracle integration
- [ ] User dashboard with bet history
- [ ] Persistent database (MongoDB / PostgreSQL)
- [ ] Multi-wallet support (WalletConnect)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ for the Shardeum Ecosystem</b><br>
  <i>QuickPredict — Predict. Stake. Win.</i>
</p>
