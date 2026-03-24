import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PredictionDetail from './pages/PredictionDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { connectWallet } from './utils/wallet';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStat = localStorage.getItem('isAuthenticated');
        if (authStat === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleConnect = async () => {
        try {
            const address = await connectWallet();
            setWalletAddress(address);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        setWalletAddress(null);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {isAuthenticated && <Navbar walletAddress={walletAddress} onConnect={handleConnect} onLogout={handleLogout} />}
                <main className={isAuthenticated ? "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" : "w-full"}>
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
                        
                        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home walletAddress={walletAddress} /></ProtectedRoute>} />
                        <Route path="/prediction/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PredictionDetail walletAddress={walletAddress} /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Admin /></ProtectedRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
