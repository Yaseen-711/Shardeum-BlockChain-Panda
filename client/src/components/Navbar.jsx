import { Link } from 'react-router-dom';

const Navbar = ({ walletAddress, onConnect, onLogout }) => {
    const userEmail = localStorage.getItem('userEmail');

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">QuickPredict</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Markets
                            </Link>
                            <Link to="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Admin
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {userEmail && <span className="text-sm text-gray-500 hidden sm:block">{userEmail}</span>}
                        {walletAddress ? (
                            <div className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </div>
                        ) : (
                            <button
                                onClick={onConnect}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Connect Wallet
                            </button>
                        )}
                        <button
                            onClick={onLogout}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
