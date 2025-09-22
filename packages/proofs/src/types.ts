export interface TreasuryData {
  assets: Asset[];
  liabilities: Liability[];
  timestamp: number;
  daoAddress: string;
}

export interface Asset {
  address: string;
  symbol: string;
  amount: bigint;
  decimals: number;
  type: 'token' | 'nft' | 'lp' | 'other';
}

export interface Liability {
  address: string;
  symbol: string;
  amount: bigint;
  decimals: number;
  type: 'debt' | 'vesting' | 'commitment' | 'other';
}

export interface SolvencyProof {
  proof: {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
  totalAssetsCommitment: string;
  totalLiabilitiesCommitment: string;
  proofHash: string;
  timestamp: number;
  daoAddress: string;
}

export interface ProofArtifact {
  proof: SolvencyProof;
  metadata: {
    circuitVersion: string;
    provingTime: number;
    verificationTime: number;
    totalAssets: string;
    totalLiabilities: string;
    isSolvent: boolean;
  };
  ipfsHash?: string;
}

export interface VerificationResult {
  isValid: boolean;
  error?: string;
  verificationTime: number;
  publicSignals: string[];
}