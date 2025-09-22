#!/usr/bin/env node

import { SolvencyProver } from '../prover';
import { createMockTreasuryData } from '../utils';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('🔐 Generating solvency proof...');
  
  try {
    const prover = new SolvencyProver();
    const treasuryData = createMockTreasuryData();
    
    console.log('📊 Treasury Data:');
    console.log(`  Assets: ${treasuryData.assets.length} items`);
    console.log(`  Liabilities: ${treasuryData.liabilities.length} items`);
    console.log(`  DAO Address: ${treasuryData.daoAddress}`);
    
    const proofArtifact = await prover.generateProof(treasuryData);
    
    // Save proof artifact
    const outputPath = join(process.cwd(), 'artifacts', 'solvency-proof.json');
    writeFileSync(outputPath, JSON.stringify(proofArtifact, null, 2));
    
    console.log('✅ Proof generated successfully!');
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`⏱️  Proving time: ${proofArtifact.metadata.provingTime}ms`);
    console.log(`💰 Total Assets: ${proofArtifact.metadata.totalAssets}`);
    console.log(`💸 Total Liabilities: ${proofArtifact.metadata.totalLiabilities}`);
    console.log(`✅ Solvent: ${proofArtifact.metadata.isSolvent ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('❌ Proof generation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

