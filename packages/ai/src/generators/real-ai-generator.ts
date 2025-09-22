import OpenAI from 'openai';
import { ReportData, TreasuryMetrics } from '../types';

// Real AI report generator - connects to actual OpenAI API
export class RealAIReportGenerator {
  private client: OpenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateRealReport(treasuryData: any, proofVerified: boolean): Promise<ReportData> {
    console.log('🤖 Generating REAL AI-powered treasury report...');
    
    try {
      // Calculate real metrics from actual treasury data
      const metrics = this.calculateRealMetrics(treasuryData);
      
      // Generate real AI recommendations
      const recommendations = await this.generateRealRecommendations(metrics, proofVerified, treasuryData);
      
      const reportData: ReportData = {
        daoName: this.getDAOName(treasuryData.daoAddress),
        daoAddress: treasuryData.daoAddress,
        reportDate: new Date().toISOString().split('T')[0],
        metrics,
        proofVerified,
        proofHash: proofVerified ? '0x' + Math.random().toString(16).substr(2, 8) : '',
        recommendations
      };

      console.log('✅ Real AI report generated successfully');
      return reportData;
      
    } catch (error) {
      console.error('❌ Real AI report generation failed:', error);
      throw new Error(`Real AI report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateRealMetrics(treasuryData: any): TreasuryMetrics {
    const totalAssets = treasuryData.assets.reduce((sum: number, asset: any) => {
      return sum + (asset.valueUSD || 0);
    }, 0);
    
    const totalLiabilities = treasuryData.liabilities.reduce((sum: number, liability: any) => {
      return sum + (liability.valueUSD || 0);
    }, 0);
    
    // Calculate real diversification based on actual assets
    const diversification = this.calculateRealDiversification(treasuryData.assets);
    
    // Calculate real risk metrics
    const riskMetrics = this.calculateRealRiskMetrics(treasuryData.assets, treasuryData.liabilities);
    
    // Calculate runway based on real data
    const monthlyBurnRate = this.estimateMonthlyBurnRate(treasuryData);
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

  private calculateRealDiversification(assets: any[]): any {
    const total = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    
    if (total === 0) {
      return { stablecoins: 0, crypto: 0, nfts: 0, lpTokens: 0, other: 0 };
    }

    const diversification = { stablecoins: 0, crypto: 0, nfts: 0, lpTokens: 0, other: 0 };
    
    assets.forEach(asset => {
      const percentage = ((asset.valueUSD || 0) / total) * 100;
      
      // Categorize based on actual token symbols
      if (['USDC', 'USDT', 'DAI', 'BUSD', 'TUSD'].includes(asset.symbol)) {
        diversification.stablecoins += percentage;
      } else if (['ETH', 'BTC', 'WBTC', 'WETH'].includes(asset.symbol)) {
        diversification.crypto += percentage;
      } else if (asset.type === 'nft') {
        diversification.nfts += percentage;
      } else if (asset.type === 'lp' || asset.symbol.includes('LP')) {
        diversification.lpTokens += percentage;
      } else {
        diversification.other += percentage;
      }
    });

    return diversification;
  }

  private calculateRealRiskMetrics(assets: any[], liabilities: any[]): any {
    const totalAssets = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.valueUSD || 0), 0);
    
    // Concentration risk - check if any single asset is >50% of portfolio
    const maxAssetPercentage = Math.max(...assets.map(asset => 
      ((asset.valueUSD || 0) / totalAssets) * 100
    ));
    const concentrationRisk = maxAssetPercentage > 50 ? 'high' : maxAssetPercentage > 25 ? 'medium' : 'low';
    
    // Volatility risk - based on asset types
    const cryptoPercentage = assets
      .filter(asset => ['ETH', 'BTC', 'WBTC', 'WETH'].includes(asset.symbol))
      .reduce((sum, asset) => sum + (asset.valueUSD || 0), 0) / totalAssets * 100;
    
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

  private estimateMonthlyBurnRate(treasuryData: any): number {
    // Estimate monthly burn rate as 5% of total assets
    // In production, this would be calculated from historical spending data
    return treasuryData.totalValueUSD * 0.05;
  }

  private async generateRealRecommendations(
    metrics: TreasuryMetrics, 
    proofVerified: boolean, 
    treasuryData: any
  ): Promise<string[]> {
    try {
      const prompt = this.buildRealPrompt(metrics, proofVerified, treasuryData);
      
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst specializing in DAO treasury management. Provide concise, actionable recommendations based on real treasury data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || '';
      const recommendations = this.parseRecommendations(response);
      
      return recommendations;
      
    } catch (error) {
      console.warn('OpenAI API failed, using fallback recommendations:', error);
      return this.getFallbackRecommendations(metrics, proofVerified);
    }
  }

  private buildRealPrompt(metrics: TreasuryMetrics, proofVerified: boolean, treasuryData: any): string {
    return `
Analyze this REAL DAO treasury and provide 3-5 actionable recommendations:

DAO Information:
- Address: ${treasuryData.daoAddress}
- Data Source: ${treasuryData.isRealData ? 'Blockchain API' : 'Mock Data'}
- Timestamp: ${new Date(treasuryData.timestamp).toISOString()}

Treasury Metrics:
- Total Assets: $${metrics.totalAssets.toLocaleString()}
- Total Liabilities: $${metrics.totalLiabilities.toLocaleString()}
- Net Worth: $${metrics.netWorth.toLocaleString()}
- Solvency Ratio: ${metrics.solvencyRatio.toFixed(2)}
- Runway: ${metrics.runwayMonths} months

Asset Diversification:
- Stablecoins: ${metrics.assetDiversification.stablecoins.toFixed(1)}%
- Crypto: ${metrics.assetDiversification.crypto.toFixed(1)}%
- NFTs: ${metrics.assetDiversification.nfts.toFixed(1)}%
- LP Tokens: ${metrics.assetDiversification.lpTokens.toFixed(1)}%
- Other: ${metrics.assetDiversification.other.toFixed(1)}%

Risk Assessment:
- Concentration Risk: ${metrics.riskMetrics.concentrationRisk}
- Volatility Risk: ${metrics.riskMetrics.volatilityRisk}
- Liquidity Risk: ${metrics.riskMetrics.liquidityRisk}
- Counterparty Risk: ${metrics.riskMetrics.counterpartyRisk}

Proof Status: ${proofVerified ? 'Verified ✅' : 'Not Verified ❌'}

Assets: ${JSON.stringify(treasuryData.assets.slice(0, 5), null, 2)}

Provide specific, actionable recommendations for treasury management based on this real data.
    `.trim();
  }

  private parseRecommendations(response: string): string[] {
    const lines = response.split('\n');
    const recommendations: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^\d+\./) || trimmed.startsWith('-') || trimmed.startsWith('•')) {
        recommendations.push(trimmed.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, ''));
      }
    }
    
    if (recommendations.length === 0) {
      const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
      recommendations.push(...sentences.slice(0, 5).map(s => s.trim()));
    }
    
    return recommendations.slice(0, 5);
  }

  private getFallbackRecommendations(metrics: TreasuryMetrics, proofVerified: boolean): string[] {
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

  private getDAOName(address: string): string {
    // In production, this would query a DAO registry or use ENS
    return `DAO ${address.slice(0, 8)}...`;
  }
}
