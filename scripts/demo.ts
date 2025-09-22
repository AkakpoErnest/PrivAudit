#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { SolvencyProver } from '@privaudit/proofs';
import { MidnightAdapter, CommitmentService, StorageService } from '@privaudit/core';
import { AIReportGenerator, PDFGenerator } from '@privaudit/ai';

// Demo script - this simulates the full PrivAudit workflow
async function runDemo() {
  console.log('🚀 Starting PrivAudit Demo...\n');

  try {
    // Step 1: Load demo data
    console.log('📊 Step 1: Loading demo treasury data...');
    const seedData = JSON.parse(
      readFileSync(join(process.cwd(), 'demo-data', 'seed-treasury.json'), 'utf8')
    );
    
    const daoConfig = seedData.daoConfigs[0];
    const treasurySnapshot = seedData.treasurySnapshots[0];
    
    console.log(`   DAO: ${daoConfig.name}`);
    console.log(`   Network: ${daoConfig.network}`);
    console.log(`   Assets: ${treasurySnapshot.assets.length} items`);
    console.log(`   Liabilities: ${treasurySnapshot.liabilities.length} items`);
    console.log(`   Total Value: $${treasurySnapshot.totalValueUSD.toLocaleString()}\n`);

    // Step 2: Private data ingestion (simulated)
    console.log('🔍 Step 2: Private data ingestion...');
    const midnightAdapter = new MidnightAdapter(daoConfig);
    const ingestedData = await midnightAdapter.fetchTreasuryData();
    
    console.log(`   ✅ Data ingested successfully`);
    console.log(`   📊 Total assets: $${ingestedData.totalValueUSD.toLocaleString()}\n`);

    // Step 3: Create private commitments
    console.log('🔐 Step 3: Creating private commitments...');
    const commitmentService = new CommitmentService();
    const commitments = commitmentService.createCommitments(ingestedData);
    
    console.log(`   ✅ Assets commitment: ${commitments.assets.commitment.slice(0, 16)}...`);
    console.log(`   ✅ Liabilities commitment: ${commitments.liabilities.commitment.slice(0, 16)}...\n`);

    // Step 4: Generate zero-knowledge proof
    console.log('🧮 Step 4: Generating zero-knowledge proof...');
    const prover = new SolvencyProver();
    const proofArtifact = await prover.generateProof(ingestedData);
    
    console.log(`   ✅ Proof generated successfully`);
    console.log(`   ⏱️  Proving time: ${proofArtifact.metadata.provingTime}ms`);
    console.log(`   💰 Total assets: $${proofArtifact.metadata.totalAssets}`);
    console.log(`   💸 Total liabilities: $${proofArtifact.metadata.totalLiabilities}`);
    console.log(`   ✅ Solvent: ${proofArtifact.metadata.isSolvent ? 'Yes' : 'No'}\n`);

    // Step 5: Verify proof
    console.log('🔍 Step 5: Verifying proof...');
    const verificationResult = await prover.verifyProof(proofArtifact);
    
    if (verificationResult.isValid) {
      console.log(`   ✅ Proof verification successful`);
      console.log(`   ⏱️  Verification time: ${verificationResult.verificationTime}ms\n`);
    } else {
      console.log(`   ❌ Proof verification failed`);
      throw new Error('Proof verification failed');
    }

    // Step 6: Generate AI report
    console.log('🤖 Step 6: Generating AI-powered report...');
    const aiGenerator = new AIReportGenerator({
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4',
      temperature: 0.7
    });
    
    const reportData = await aiGenerator.generateReport(ingestedData, true);
    
    console.log(`   ✅ Report generated successfully`);
    console.log(`   📋 Recommendations: ${reportData.recommendations.length} items`);
    console.log(`   📊 Net worth: $${reportData.metrics.netWorth.toLocaleString()}`);
    console.log(`   ⏱️  Runway: ${reportData.metrics.runwayMonths} months\n`);

    // Step 7: Export reports
    console.log('📄 Step 7: Exporting reports...');
    
    // Save JSON report
    const jsonPath = join(process.cwd(), 'artifacts', 'demo-report.json');
    writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));
    
    // Generate PDF report
    const pdfPath = join(process.cwd(), 'artifacts', 'demo-report.pdf');
    await PDFGenerator.generatePDF(reportData, pdfPath);
    
    console.log(`   ✅ JSON report saved: ${jsonPath}`);
    console.log(`   ✅ PDF report saved: ${pdfPath}\n`);

    // Step 8: Store on decentralized storage (simulated)
    console.log('🌐 Step 8: Storing on decentralized storage...');
    const storageService = new StorageService({
      ipfs: { gateway: 'https://ipfs.io' },
      arweave: { gateway: 'https://arweave.net' }
    });
    
    const storageResult = await storageService.storeData({
      snapshot: ingestedData,
      commitments,
      storageHashes: { ipfs: 'QmMockHash123', arweave: 'arweave-mock-hash-456' }
    });
    
    console.log(`   ✅ IPFS hash: ${storageResult.ipfs}`);
    console.log(`   ✅ Arweave hash: ${storageResult.arweave}\n`);

    // Demo completed
    console.log('🎉 Demo completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • DAO: ${daoConfig.name}`);
    console.log(`   • Total Assets: $${reportData.metrics.totalAssets.toLocaleString()}`);
    console.log(`   • Net Worth: $${reportData.metrics.netWorth.toLocaleString()}`);
    console.log(`   • Solvency Ratio: ${reportData.metrics.solvencyRatio.toFixed(1)}:1`);
    console.log(`   • Runway: ${reportData.metrics.runwayMonths} months`);
    console.log(`   • Proof Verified: ✅`);
    console.log(`   • Reports Generated: JSON + PDF`);
    console.log(`   • Storage: IPFS + Arweave`);

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runDemo();
}
