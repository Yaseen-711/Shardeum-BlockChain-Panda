# 🔮 QuickPredict – Shardeum Prediction Market

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Shardeum-6C5CE7?style=for-the-badge&logo=ethereum&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20+%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Oracle-CoinGecko%20API-F5C518?style=for-the-badge&logo=coingecko&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

> **Forecast events, stake SHM, win rewards.**

---

## ✨ Overview & Key Features
- **MetaMask wallet** – one‑click connection to Shardeum testnet.
- **Create & join markets** – Yes/No or numeric predictions.
- **Live oracle** – market outcomes are resolved with real‑time CoinGecko price data.
- **Escrow & automatic payouts** – bets are locked in an admin escrow wallet and winners receive SHM automatically.
- **Responsive UI** – built with Tailwind CSS, works on desktop and mobile.

---

## 🛠 Tech Stack
| Layer | Tech |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, ethers v6, Axios |
| Backend | Node .js, Express, ethers v6, Axios |
| Blockchain | Shardeum EVM Testnet (RPC `https://api-mezame.shardeum.org`) |
| Oracle | CoinGecko price API |

---

## 📁 Project Structure (high‑level)
```
quickpredict/
├─ client/          # React UI (Vite)
│  ├─ src/          # components, pages, utils
│  └─ .env          # VITE_BACKEND_URL, VITE_ADMIN_WALLET
└─ server/          # Express API
   ├─ routes/api.js  # markets, bets, resolve (oracle & payouts)
   └─ .env          # PORT, ESCROW_PRIVATE_KEY, API keys
```

---

## 🚀 Getting Started
### Prerequisites
- Node ≥ 18, npm ≥ 9
- MetaMask extension (set to Shardeum testnet)
- Testnet SHM (from the Shardeum faucet)

### Install & Run
```bash
# Clone repo
git clone https://github.com/Yaseen-711/Shardeum-BlockChain-Panda.git
cd Shardeum-BlockChain-Panda

# Backend
cd server
npm install
cp .env.example .env   # fill ESCROW_PRIVATE_KEY, etc.
npm run dev   # http://localhost:5000

# Frontend
cd ../client
npm install
cp .env.example .env   # set VITE_BACKEND_URL=http://localhost:5000/api
npm run dev   # http://localhost:5173
```
Open the frontend URL, connect your wallet, and you can create or join markets.

---

## 🔐 Environment Variables (brief)
**Server (`server/.env`)**
```
PORT=5000
ESCROW_PRIVATE_KEY=your_admin_private_key   # required for payouts
COINGECKO_API=https://api.coingecko.com/api/v3
```
**Client (`client/.env`)**
```
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ADMIN_WALLET=0xYourAdminWalletAddress
```
Never commit `.env` files.

---

## 🎮 How It Works (quick flow)
1. **User** connects MetaMask → places a bet → SHM is sent to the admin escrow wallet.
2. **Admin** clicks *Resolve* → backend fetches the latest price from CoinGecko.
3. If `price >= threshold` → market result = **YES**, else **NO**.
4. Backend distributes the pool proportionally to the winning bettors using ethers.js.

---

## 🌍 Deployment (Render + Vercel)
- **Backend** → Render Web Service, root `server`, build `npm install`, start `node index.js`. Add the same env vars as above.
- **Frontend** → Vercel project, root `client`, framework **Vite**. Set `VITE_BACKEND_URL` to the Render URL ending with `/api`.
Both platforms auto‑deploy on every `git push`.

---

## 📚 API Reference (essential endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/markets` | List all markets with pool stats |
| POST | `/api/markets` | Create a new market |
| POST | `/api/bets` | Place a bet (requires `userAddress`, `predictionId`, `choice`, `amount`) |
| POST | `/api/resolve` | Resolve a market and trigger payouts |
All requests are JSON; CORS is enabled for the Vercel domain.

---

## 🗺 Roadmap (short list)
- [ ] Solidity escrow contract for trust‑less fund locking
- [ ] Automated cron/Chainlink resolution
- [ ] Weather & sports oracle integrations
- [ ] Persistent DB for markets & bets
- [ ] User dashboard with bet history

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit & push
4. Open a Pull Request

---

## 📄 License
MIT – see the `LICENSE` file.

---

<p align="center">
  <b>Built with ❤️ for the Shardeum ecosystem</b><br>
  <i>QuickPredict — Predict. Stake. Win.</i>
</p>
