import { useState, useEffect } from 'react';

interface DAO {
  address: string;
  name: string;
  description: string;
  network: string;
  treasuryValue?: number;
}

interface DAOSelectorProps {
  walletAddress: string;
  onDAOSelected: (dao: DAO) => void;
}

export function DAOSelector({ walletAddress, onDAOSelected }: DAOSelectorProps) {
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const [customAddress, setCustomAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Popular DAOs for demo
  const popularDAOs: DAO[] = [
    {
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
      name: 'Uniswap DAO',
      description: 'Decentralized exchange protocol governance',
      network: 'ethereum',
      treasuryValue: 1500000000 // 1.5B estimated
    },
    {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      name: 'MakerDAO',
      description: 'Decentralized stablecoin protocol',
      network: 'ethereum',
      treasuryValue: 800000000 // 800M estimated
    },
    {
      address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9', // AAVE
      name: 'Aave DAO',
      description: 'Decentralized lending protocol',
      network: 'ethereum',
      treasuryValue: 200000000 // 200M estimated
    },
    {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
      name: 'Chainlink DAO',
      description: 'Decentralized oracle network',
      network: 'ethereum',
      treasuryValue: 100000000 // 100M estimated
    }
  ];

  const handleDAOSelect = async (dao: DAO) => {
    setSelectedDAO(dao);
    setIsLoading(true);
    
    try {
      // Simulate fetching real treasury data
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDAOSelected(dao);
    } catch (error) {
      console.error('Error selecting DAO:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomAddress = async () => {
    if (!customAddress || customAddress.length !== 42 || !customAddress.startsWith('0x')) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      const customDAO: DAO = {
        address: customAddress,
        name: `Custom DAO (${customAddress.slice(0, 8)}...)`,
        description: 'Custom DAO address',
        network: 'ethereum'
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedDAO(customDAO);
      onDAOSelected(customDAO);
    } catch (error) {
      console.error('Error with custom address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select DAO Treasury to Analyze
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Choose from popular DAOs or enter a custom address
        </p>
      </div>

      {/* Popular DAOs */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Popular DAOs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularDAOs.map((dao) => (
            <button
              key={dao.address}
              onClick={() => handleDAOSelect(dao)}
              disabled={isLoading}
              className={`p-4 border rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 ${
                selectedDAO?.address === dao.address 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400' 
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">{dao.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{dao.description}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
                {dao.address.slice(0, 8)}...{dao.address.slice(-8)}
              </div>
              {dao.treasuryValue && (
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  ~${dao.treasuryValue.toLocaleString()} treasury
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Address */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Custom DAO Address</h4>
        <div className="flex space-x-3">
          <input
            type="text"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            placeholder="0x1234567890123456789012345678901234567890"
            className="input-field flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleCustomAddress}
            disabled={isLoading || !customAddress}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Selected DAO Info */}
      {selectedDAO && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">✅</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">Selected DAO</span>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium">{selectedDAO.name}</div>
            <div className="font-mono text-xs mt-1">{selectedDAO.address}</div>
          </div>
        </div>
      )}
    </div>
  );
}

