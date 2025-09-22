#!/usr/bin/env node

import { SolvencyProver } from '../prover';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProofArtifact } from '../types';

async function main() {
  console.log('🔍 Verifying solvency proof...');
  
  try {
    const prover = new SolvencyProver();
    
    // Load proof artifact
    const proofPath = join(process.cwd(), 'artifacts', 'solvency-proof.json');
    const proofData = readFileSync(proofPath, 'utf8');
    const proofArtifact: ProofArtifact = JSON.parse(proofData);
    
    console.log('📋 Proof Details:');
    console.log(`  DAO Address: ${proofArtifact.proof.daoAddress}`);
    console.log(`  Timestamp: ${new Date(proofArtifact.proof.timestamp).toISOString()}`);
    console.log(`  Circuit Version: ${proofArtifact.metadata.circuitVersion}`);
    
    const verificationResult = await prover.verifyProof(proofArtifact);
    
    if (verificationResult.isValid) {
      console.log('✅ Proof verification successful!');
      console.log(`⏱️  Verification time: ${verificationResult.verificationTime}ms`);
      console.log(`💰 Total Assets: ${proofArtifact.metadata.totalAssets}`);
      console.log(`💸 Total Liabilities: ${proofArtifact.metadata.totalLiabilities}`);
      console.log(`✅ Solvent: ${proofArtifact.metadata.isSolvent ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Proof verification failed!');
      if (verificationResult.error) {
        console.log(`   Error: ${verificationResult.error}`);
      }
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
