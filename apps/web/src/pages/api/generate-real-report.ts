import { NextApiRequest, NextApiResponse } from 'next';
import { RealDAOFetcher } from '@privaudit/core';
import { RealSolvencyProver } from '@privaudit/proofs';
import { AIReportGenerator } from '@privaudit/ai';

// Real API endpoint that fetches actual DAO data and generates real reports
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { daoAddress, etherscanApiKey, aiApiKey } = req.body;

    if (!daoAddress) {
      return res.status(400).json({ error: 'DAO address is required' });
    }

    console.log('🚀 Starting REAL report generation for DAO:', daoAddress);

    // Step 1: Fetch real treasury data from blockchain
    console.log('📊 Step 1: Fetching real treasury data...');
    const daoFetcher = new RealDAOFetcher(
      'https://eth-mainnet.g.alchemy.com/v2/demo', // Free Alchemy endpoint
      etherscanApiKey || 'YourEtherscanAPIKey'
    );
    
    const treasuryData = await daoFetcher.fetchRealTreasuryData(daoAddress);
    console.log('✅ Real treasury data fetched:', {
      assets: treasuryData.assets.length,
      totalValue: treasuryData.totalValueUSD,
      isRealData: treasuryData.isRealData
    });

    // Step 2: Generate real zkSNARK proof
    console.log('🧮 Step 2: Generating real zkSNARK proof...');
    const prover = new RealSolvencyProver();
    const proofArtifact = await prover.generateRealProof(treasuryData);
    console.log('✅ Real proof generated:', {
      provingTime: proofArtifact.metadata.provingTime,
      isSolvent: proofArtifact.metadata.isSolvent
    });

    // Step 3: Verify the proof
    console.log('🔍 Step 3: Verifying proof...');
    const verificationResult = await prover.verifyRealProof(proofArtifact);
    console.log('✅ Proof verification result:', verificationResult.isValid);

    // Step 4: Generate real AI report
    console.log('🤖 Step 4: Generating AI-powered report...');
    const aiGenerator = new AIReportGenerator(aiApiKey || 'your-ai-api-key');
    const reportData = await aiGenerator.generateReport(treasuryData, verificationResult.isValid);
    console.log('✅ Real AI report generated:', {
      recommendations: reportData.recommendations.length,
      netWorth: reportData.metrics.netWorth
    });

    // Return the complete real report
    res.status(200).json({
      success: true,
      reportData,
      proofArtifact,
      verificationResult,
      treasuryData: {
        ...treasuryData,
        assets: treasuryData.assets.slice(0, 10) // Limit for response size
      },
      metadata: {
        isRealData: true,
        dataSource: 'Blockchain API',
        proofType: 'zkSNARK',
        aiProvider: 'Advanced AI',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Real report generation failed:', error);
    res.status(500).json({
      error: 'Report generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: {
        isRealData: false,
        fallbackAvailable: true
      }
    });
  }
}
