import { ethers } from 'ethers';
import axios from 'axios';

// Real DAO treasury fetcher - connects to actual blockchain data
export class RealDAOFetcher {
  private provider: ethers.JsonRpcProvider;
  private etherscanApiKey: string;

  constructor(rpcUrl: string, etherscanApiKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.etherscanApiKey = etherscanApiKey;
  }

  async fetchRealTreasuryData(daoAddress: string): Promise<any> {
    console.log(`🔍 Fetching REAL treasury data for DAO: ${daoAddress}`);
    
    try {
      // Get all token transfers for this DAO address
      const tokenTransfers = await this.getTokenTransfers(daoAddress);
      
      // Get current token balances
      const tokenBalances = await this.getTokenBalances(daoAddress, tokenTransfers);
      
      // Calculate total value in USD
      const totalValueUSD = await this.calculateTotalValueUSD(tokenBalances);
      
      return {
        daoAddress,
        timestamp: Date.now(),
        assets: tokenBalances.filter(token => parseFloat(token.balance) > 0),
        liabilities: [], // Would need to query specific liability contracts
        totalValueUSD,
        network: 'ethereum',
        isRealData: true
      };
      
    } catch (error) {
      console.error('Failed to fetch real treasury data:', error);
      throw new Error(`Real DAO fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getTokenTransfers(address: string): Promise<any[]> {
    try {
      const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'tokentx',
          address: address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.etherscanApiKey
        }
      });

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        throw new Error(`Etherscan API error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Failed to fetch token transfers:', error);
      return [];
    }
  }

  private async getTokenBalances(address: string, transfers: any[]): Promise<any[]> {
    const uniqueTokens = new Map();
    
    // Extract unique token addresses from transfers
    transfers.forEach(transfer => {
      if (transfer.tokenSymbol && transfer.tokenName) {
        uniqueTokens.set(transfer.contractAddress, {
          address: transfer.contractAddress,
          symbol: transfer.tokenSymbol,
          name: transfer.tokenName,
          decimals: parseInt(transfer.tokenDecimal) || 18
        });
      }
    });

    // Get current balances for each token
    const balances = [];
    for (const [tokenAddress, tokenInfo] of uniqueTokens) {
      try {
        const contract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          this.provider
        );
        
        const balance = await contract.balanceOf(address);
        const balanceFormatted = ethers.formatUnits(balance, tokenInfo.decimals);
        
        if (parseFloat(balanceFormatted) > 0) {
          balances.push({
            ...tokenInfo,
            balance: balance.toString(),
            balanceFormatted: balanceFormatted,
            valueUSD: 0 // Will be calculated later
          });
        }
      } catch (error) {
        console.warn(`Failed to get balance for token ${tokenAddress}:`, error);
      }
    }

    return balances;
  }

  private async calculateTotalValueUSD(tokenBalances: any[]): Promise<number> {
    let totalValue = 0;
    
    for (const token of tokenBalances) {
      try {
        // Get token price from CoinGecko API
        const price = await this.getTokenPrice(token.symbol);
        const valueUSD = parseFloat(token.balanceFormatted) * price;
        token.valueUSD = valueUSD;
        totalValue += valueUSD;
      } catch (error) {
        console.warn(`Failed to get price for ${token.symbol}:`, error);
      }
    }
    
    return totalValue;
  }

  private async getTokenPrice(symbol: string): Promise<number> {
    try {
      // Map common symbols to CoinGecko IDs
      const symbolMap: Record<string, string> = {
        'USDC': 'usd-coin',
        'USDT': 'tether',
        'DAI': 'dai',
        'ETH': 'ethereum',
        'WETH': 'weth',
        'WBTC': 'wrapped-bitcoin',
        'MATIC': 'matic-network',
        'ARB': 'arbitrum',
        'OP': 'optimism'
      };

      const coinGeckoId = symbolMap[symbol] || symbol.toLowerCase();
      
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`
      );
      
      return response.data[coinGeckoId]?.usd || 0;
    } catch (error) {
      console.warn(`Failed to get price for ${symbol}:`, error);
      return 0;
    }
  }
}

