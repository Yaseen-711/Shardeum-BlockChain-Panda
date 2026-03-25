import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PredictionDetail from './pages/PredictionDetail';
import Admin from './pages/Admin';
import { connectWallet } from './utils/wallet';

function App() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Initialize Dark Mode
        const savedMode = localStorage.getItem('darkMode');
        const wantsDark = savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(wantsDark);
        if (wantsDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    const handleConnect = async () => {
        try {
            const address = await connectWallet();
            setWalletAddress(address);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Router>
            <div className="min-h-screen transition-colors duration-300">
                <Navbar walletAddress={walletAddress} onConnect={handleConnect} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<Home walletAddress={walletAddress} />} />
                        <Route path="/prediction/:id" element={<PredictionDetail walletAddress={walletAddress} />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
