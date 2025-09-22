export interface DAOConfig {
  address: string;
  name: string;
  network: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism';
  rpcUrl?: string;
}

export interface TreasurySnapshot {
  daoAddress: string;
  timestamp: number;
  assets: AssetBalance[];
  liabilities: LiabilityBalance[];
  totalValueUSD: number;
  network: string;
}

export interface AssetBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  priceUSD: number;
  valueUSD: number;
  type: 'token' | 'nft' | 'lp' | 'other';
  contractType: 'erc20' | 'erc721' | 'erc1155' | 'lp' | 'other';
}

export interface LiabilityBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  priceUSD: number;
  valueUSD: number;
  type: 'debt' | 'vesting' | 'commitment' | 'other';
  contractType: 'erc20' | 'erc721' | 'erc1155' | 'lp' | 'other';
}

export interface PrivateCommitment {
  commitment: string;
  nonce: string;
  timestamp: number;
  daoAddress: string;
  dataHash: string;
}

export interface StorageConfig {
  ipfs?: {
    gateway: string;
    apiKey?: string;
  };
  arweave?: {
    gateway: string;
    wallet?: string;
  };
}

export interface IngestionResult {
  snapshot: TreasurySnapshot;
  commitments: {
    assets: PrivateCommitment;
    liabilities: PrivateCommitment;
  };
  storageHashes: {
    ipfs?: string;
    arweave?: string;
  };
}