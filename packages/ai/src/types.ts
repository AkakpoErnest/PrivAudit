export interface TreasuryMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetDiversification: AssetDiversification;
  riskMetrics: RiskMetrics;
  runwayMonths: number;
  solvencyRatio: number;
}

export interface AssetDiversification {
  stablecoins: number;
  crypto: number;
  nfts: number;
  lpTokens: number;
  other: number;
}

export interface RiskMetrics {
  concentrationRisk: 'low' | 'medium' | 'high';
  volatilityRisk: 'low' | 'medium' | 'high';
  liquidityRisk: 'low' | 'medium' | 'high';
  counterpartyRisk: 'low' | 'medium' | 'high';
}

export interface ReportData {
  daoName: string;
  daoAddress: string;
  reportDate: string;
  metrics: TreasuryMetrics;
  proofVerified: boolean;
  proofHash: string;
  recommendations: string[];
}

export interface AIReport {
  id: string;
  summary: string;
  recommendations: string[];
  confidence: number;
  metadata: {
    generatedAt: string;
    aiProvider: string;
    version: string;
  };
}

export interface ReportOptions {
  includeRiskAnalysis?: boolean;
  includeTechnicalDetails?: boolean;
  format?: 'detailed' | 'summary';
}