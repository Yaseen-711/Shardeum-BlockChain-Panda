import { Link } from 'react-router-dom';

const Navbar = ({ walletAddress, onConnect, isDarkMode, toggleDarkMode }) => {

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 drop-shadow-sm">QuickPredict</span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Markets
                            </Link>
                            <Link to="/admin" className="border-transparent text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Admin
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {walletAddress ? (
                            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-full text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 transition-colors">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </div>
                        ) : (
                            <button
                                onClick={onConnect}
                                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all transform hover:scale-105"
                            >
                                Connect Wallet
                            </button>
                        )}
                        <button
                            onClick={toggleDarkMode}
                            className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-inner"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
