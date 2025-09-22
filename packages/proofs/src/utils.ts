import { TreasuryData, Asset, Liability } from './types';

export function normalizeAmount(amount: bigint, decimals: number): bigint {
  return amount / BigInt(10 ** decimals);
}

export function calculateTotalAssets(assets: Asset[]): bigint {
  return assets.reduce((total, asset) => {
    const normalizedAmount = normalizeAmount(asset.amount, asset.decimals);
    return total + normalizedAmount;
  }, BigInt(0));
}

export function calculateTotalLiabilities(liabilities: Liability[]): bigint {
  return liabilities.reduce((total, liability) => {
    const normalizedAmount = normalizeAmount(liability.amount, liability.decimals);
    return total + normalizedAmount;
  }, BigInt(0));
}

export function generateNonce(): bigint {
  return BigInt(Math.floor(Math.random() * 2 ** 64));
}

export function createMockTreasuryData(): TreasuryData {
  return {
    assets: [
      {
        address: '0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C',
        symbol: 'USDC',
        amount: BigInt('1000000000000'), // 1M USDC (6 decimals)
        decimals: 6,
        type: 'token'
      },
      {
        address: '0xB1c97a44F7551b9d5D1D1D1D1D1D1D1D1D1D1D1D',
        symbol: 'ETH',
        amount: BigInt('500000000000000000'), // 500 ETH (18 decimals)
        decimals: 18,
        type: 'token'
      }
    ],
    liabilities: [
      {
        address: '0xD3e99c66H9773d1f7F3F3F3F3F3F3F3F3F3F3F3F',
        symbol: 'USDC',
        amount: BigInt('200000000000'), // 200K USDC (6 decimals)
        decimals: 6,
        type: 'debt'
      }
    ],
    timestamp: Date.now(),
    daoAddress: '0x1234567890123456789012345678901234567890'
  };
}