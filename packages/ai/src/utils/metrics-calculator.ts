import { TreasuryMetrics, AssetDiversification, RiskMetrics } from '../types';
import { TreasurySnapshot } from '@privaudit/core';

// TODO: Move these calculations to a separate service
// This is getting messy with all the business logic here
export class MetricsCalculator {
  static calculateMetrics(snapshot: any): TreasuryMetrics {
    const totalAssets = snapshot.assets.reduce((sum: number, asset: any) => sum + asset.valueUSD, 0);
    const totalLiabilities = snapshot.liabilities.reduce((sum: number, liability: any) => sum + liability.valueUSD, 0);
    
    // Calculate diversification - this could be more sophisticated
    const diversification = this.calculateDiversification(snapshot.assets);
    
    // Risk assessment - placeholder logic for now
    const riskMetrics = this.assessRisks(snapshot.assets, snapshot.liabilities);
    
    // Runway calculation - assuming monthly expenses of 10% of total assets
    const monthlyBurnRate = totalAssets * 0.1;
    const runwayMonths = monthlyBurnRate > 0 ? totalAssets / monthlyBurnRate : 0;
    
    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      assetDiversification: diversification,
      riskMetrics,
      runwayMonths: Math.round(runwayMonths * 10) / 10, // Round to 1 decimal
      solvencyRatio: totalLiabilities > 0 ? totalAssets / totalLiabilities : 0
    };
  }

  private static calculateDiversification(assets: any[]): AssetDiversification {
    const total = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    
    if (total === 0) {
      return { stablecoins: 0, crypto: 0, nfts: 0, lpTokens: 0, other: 0 };
    }

    const diversification = { stablecoins: 0, crypto: 0, nfts: 0, lpTokens: 0, other: 0 };
    
    assets.forEach(asset => {
      const percentage = (asset.valueUSD / total) * 100;
      
      // Simple categorization - could be improved with more sophisticated logic
      if (asset.symbol === 'USDC' || asset.symbol === 'USDT' || asset.symbol === 'DAI') {
        diversification.stablecoins += percentage;
      } else if (asset.type === 'nft') {
        diversification.nfts += percentage;
      } else if (asset.type === 'lp') {
        diversification.lpTokens += percentage;
      } else if (asset.symbol === 'ETH' || asset.symbol === 'BTC' || asset.symbol === 'WBTC') {
        diversification.crypto += percentage;
      } else {
        diversification.other += percentage;
      }
    });

    return diversification;
  }

  private static assessRisks(assets: any[], liabilities: any[]): RiskMetrics {
    // This is pretty basic risk assessment - could be much more sophisticated
    const totalAssets = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.valueUSD, 0);
    
    // Concentration risk - check if any single asset is >50% of portfolio
    const maxAssetPercentage = Math.max(...assets.map(asset => (asset.valueUSD / totalAssets) * 100));
    const concentrationRisk = maxAssetPercentage > 50 ? 'high' : maxAssetPercentage > 25 ? 'medium' : 'low';
    
    // Volatility risk - based on asset types
    const cryptoPercentage = assets
      .filter(asset => ['ETH', 'BTC', 'WBTC'].includes(asset.symbol))
      .reduce((sum, asset) => sum + asset.valueUSD, 0) / totalAssets * 100;
    
    const volatilityRisk = cryptoPercentage > 70 ? 'high' : cryptoPercentage > 30 ? 'medium' : 'low';
    
    // Liquidity risk - assume all assets are liquid for now
    const liquidityRisk = 'low';
    
    // Counterparty risk - based on number of different tokens
    const counterpartyRisk = assets.length > 10 ? 'low' : assets.length > 5 ? 'medium' : 'high';
    
    return {
      concentrationRisk,
      volatilityRisk,
      liquidityRisk,
      counterpartyRisk
    };
  }
}

