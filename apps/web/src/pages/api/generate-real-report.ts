import { NextApiRequest, NextApiResponse } from 'next';
import { RealDAOFetcher } from '@privaudit/core';
import { RealSolvencyProver } from '@privaudit/proofs';
import { AIReportGenerator } from '@privaudit/ai';

// Real API endpoint that ONLY fetches actual DAO data - NO MOCK DATA
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { daoAddress, etherscanApiKey, aiApiKey } = req.body;

    if (!daoAddress) {
      return res.status(400).json({ 
        error: 'DAO address is required',
        success: false 
      });
    }

    if (!etherscanApiKey && !process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
      return res.status(400).json({ 
        error: 'Etherscan API key is required for real data',
        success: false 
      });
    }

    console.log('🚀 Starting REAL-ONLY report generation for DAO:', daoAddress);

    // Use multiple RPC providers for better reliability
    const rpcProviders = [
      'https://ethereum-rpc.publicnode.com',
      'https://rpc.ankr.com/eth',
      'https://eth.llamarpc.com',
      'https://ethereum.blockpi.network/v1/rpc/public',
      'https://cloudflare-eth.com'
    ];

    // Step 1: Fetch REAL treasury data from blockchain
    console.log('📊 Step 1: Fetching REAL treasury data...');
    let treasuryData: any = null;
    let lastError: any = null;

    // Try each RPC provider until one works
    for (const rpcUrl of rpcProviders) {
      try {
        console.log(`🔄 Trying RPC provider: ${rpcUrl}`);
        const daoFetcher = new RealDAOFetcher(
          rpcUrl,
          etherscanApiKey || process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || ''
        );
        
        treasuryData = await daoFetcher.fetchRealTreasuryData(daoAddress);
        
        if (treasuryData && treasuryData.assets && treasuryData.assets.length > 0) {
          console.log('✅ Real treasury data fetched successfully');
          break;
        } else {
          throw new Error('No treasury assets found for this DAO');
        }
      } catch (error) {
        console.warn(`❌ RPC provider ${rpcUrl} failed:`, error);
        lastError = error;
        continue;
      }
    }

    if (!treasuryData || !treasuryData.assets || treasuryData.assets.length === 0) {
      throw new Error(`Failed to fetch real treasury data from all providers. Last error: ${lastError?.message || 'No assets found'}`);
    }

    console.log('📈 REAL Treasury Data Summary:', {
      daoAddress: treasuryData.daoAddress,
      assetsFound: treasuryData.assets.length,
      totalValueUSD: `$${treasuryData.totalValueUSD.toLocaleString()}`,
      network: treasuryData.network,
      isRealData: treasuryData.isRealData
    });

    // Step 2: Generate REAL zkSNARK proof for solvency
    console.log('🧮 Step 2: Generating REAL zkSNARK proof...');
    const prover = new RealSolvencyProver();
    const proofArtifact = await prover.generateRealProof(treasuryData);
    console.log('✅ Real proof generated:', {
      provingTime: proofArtifact.metadata.provingTime,
      isSolvent: proofArtifact.metadata.isSolvent,
      circuitUsed: proofArtifact.metadata.circuitName
    });

    // Step 3: Verify the proof
    console.log('🔍 Step 3: Verifying REAL proof...');
    const verificationResult = await prover.verifyRealProof(proofArtifact);
    console.log('✅ Proof verification result:', {
      isValid: verificationResult.isValid,
      verificationTime: verificationResult.verificationTime
    });

    // Step 4: Generate AI-powered report with REAL data
    console.log('🤖 Step 4: Generating AI report with REAL data...');
    const aiGenerator = new AIReportGenerator(aiApiKey || process.env.AI_API_KEY || '');
    const reportData = await aiGenerator.generateReport(treasuryData, verificationResult.isValid);
    console.log('✅ AI report generated with real data:', {
      recommendations: reportData.recommendations.length,
      netWorth: `$${reportData.metrics.netWorth.toLocaleString()}`,
      riskAssessment: reportData.riskAssessment
    });

    // Step 5: Return the complete REAL report
    const completeReport = {
      success: true,
      reportData,
      proofArtifact,
      verificationResult,
      treasuryData: {
        ...treasuryData,
        // Include full asset list for real data
        assets: treasuryData.assets
      },
      metadata: {
        isRealData: true,
        dataSource: 'Live Blockchain Data',
        proofType: 'Real zkSNARK',
        aiProvider: 'Real AI Analysis',
        timestamp: new Date().toISOString(),
        processingTime: Date.now(),
        daoAddress: treasuryData.daoAddress,
        etherscanVerified: true
      }
    };

    console.log('🎉 REAL report generation completed successfully!');
    return res.status(200).json(completeReport);

  } catch (error) {
    console.error('❌ REAL report generation failed:', error);
    
    // NO FALLBACK - Return error instead of mock data
    return res.status(500).json({
      success: false,
      error: 'Failed to generate real treasury report',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestions: [
        'Verify the DAO address is correct and has token activity',
        'Ensure Etherscan API key is valid and has sufficient quota',
        'Try again in a few minutes if rate limits are hit',
        'Check that the DAO has public treasury data available'
      ],
      timestamp: new Date().toISOString()
    });
  }
}