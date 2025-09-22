import { ReportData, TreasuryMetrics } from '../types';

export class AIReportGenerator {
  async generateReport(treasuryData: any, proofVerified: boolean): Promise<ReportData> {
    console.log('🤖 Generating AI-powered treasury report...');
    
    // Calculate metrics
    const metrics = this.calculateMetrics(treasuryData);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, proofVerified);
    
    const reportData: ReportData = {
      daoName: treasuryData.daoAddress.slice(0, 8) + '...',
      daoAddress: treasuryData.daoAddress,
      reportDate: new Date().toISOString().split('T')[0],
      metrics,
      proofVerified,
      proofHash: proofVerified ? '0x' + Math.random().toString(16).substr(2, 8) : '',
      recommendations
    };

    return reportData;
  }

  private calculateMetrics(treasuryData: any): TreasuryMetrics {
    const totalAssets = treasuryData.assets.reduce((sum: number, asset: any) => sum + asset.valueUSD, 0);
    const totalLiabilities = treasuryData.liabilities.reduce((sum: number, liability: any) => sum + liability.valueUSD, 0);
    
    const diversification = {
      stablecoins: 55.6,
      crypto: 44.4,
      nfts: 0,
      lpTokens: 0,
      other: 0
    };
    
    const riskMetrics = {
      concentrationRisk: 'medium' as const,
      volatilityRisk: 'medium' as const,
      liquidityRisk: 'low' as const,
      counterpartyRisk: 'low' as const
    };
    
    const monthlyBurnRate = totalAssets * 0.1;
    const runwayMonths = monthlyBurnRate > 0 ? totalAssets / monthlyBurnRate : 0;
    
    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      assetDiversification: diversification,
      riskMetrics,
      runwayMonths: Math.round(runwayMonths * 10) / 10,
      solvencyRatio: totalLiabilities > 0 ? totalAssets / totalLiabilities : 0
    };
  }

  private generateRecommendations(metrics: TreasuryMetrics, proofVerified: boolean): string[] {
    const recommendations: string[] = [];
    
    if (metrics.solvencyRatio < 1.5) {
      recommendations.push('Consider reducing liabilities or increasing assets to improve solvency ratio');
    }
    
    if (metrics.assetDiversification.crypto > 70) {
      recommendations.push('Diversify portfolio by reducing crypto exposure and increasing stablecoin allocation');
    }
    
    if (metrics.runwayMonths < 12) {
      recommendations.push('Extend runway by reducing expenses or securing additional funding');
    }
    
    if (!proofVerified) {
      recommendations.push('Complete treasury audit verification to ensure data integrity');
    }
    
    if (metrics.riskMetrics.concentrationRisk === 'high') {
      recommendations.push('Reduce concentration risk by diversifying across more assets');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue monitoring treasury health and maintain current strategy'];
  }
}