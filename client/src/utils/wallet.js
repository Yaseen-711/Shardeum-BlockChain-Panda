import { ethers } from 'ethers';

const SHARDEUM_RPC = 'https://api-mezame.shardeum.org';
const SHARDEUM_CHAIN_ID = '0x1FB7'; // 8119 in hex

export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this app');
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await switchNetwork();
        return accounts[0];
    } catch (error) {
        console.error("Wallet connection failed:", error);
        throw error;
    }
};

export const switchNetwork = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SHARDEUM_CHAIN_ID }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: SHARDEUM_CHAIN_ID,
                            chainName: 'Shardeum Mezame Testnet',
                            rpcUrls: [SHARDEUM_RPC],
                            nativeCurrency: {
                                name: 'SHM',
                                symbol: 'SHM',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://explorer-mezame.shardeum.org']
                        },
                    ],
                });
            } catch (addError) {
                throw addError;
            }
        } else {
            throw switchError;
        }
    }
};

export const getProvider = () => {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
};

// Simulate sending a transaction (for demo purposes)
export const sendTransaction = async (ignoredToAddress, amountInShm = "0.01") => {
    if (!window.ethereum) throw new Error("No wallet installed");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Automatically use the Admin Escrow wallet configured in the environment
    const toAddress = import.meta.env.VITE_ADMIN_WALLET || "0x8c488EF577d5913D4928E7432b94Bc6B82A98618";

    const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountInShm.toString())
    });
    
    return tx.hash;
};
