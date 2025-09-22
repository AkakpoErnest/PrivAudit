#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('🔧 Setting up zkSNARK trusted setup...');
  
  try {
    // Create necessary directories
    mkdirSync(join(process.cwd(), 'build'), { recursive: true });
    mkdirSync(join(process.cwd(), 'keys'), { recursive: true });
    mkdirSync(join(process.cwd(), 'artifacts'), { recursive: true });
    
    console.log('📁 Created directories: build/, keys/, artifacts/');
    
    // Compile circuit
    console.log('🔨 Compiling circuit...');
    execSync('circom circuits/solvency.circom --r1cs --wasm --sym --c --output build/', {
      stdio: 'inherit'
    });
    
    console.log('✅ Circuit compiled successfully!');
    
    // Generate trusted setup (powers of tau)
    console.log('🎲 Generating powers of tau...');
    execSync('snarkjs powersoftau new bn128 12 pot12_0000.ptau -v', {
      stdio: 'inherit'
    });
    
    execSync('snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v', {
      stdio: 'inherit'
    });
    
    execSync('snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v', {
      stdio: 'inherit'
    });
    
    // Generate proving key
    console.log('🔑 Generating proving key...');
    execSync('snarkjs groth16 setup build/solvency.r1cs pot12_final.ptau keys/solvency_0000.zkey', {
      stdio: 'inherit'
    });
    
    execSync('snarkjs zkey contribute keys/solvency_0000.zkey keys/solvency_0001.zkey --name="1st Contributor Name" -v', {
      stdio: 'inherit'
    });
    
    // Generate verification key
    console.log('🔍 Generating verification key...');
    execSync('snarkjs zkey export verificationkey keys/solvency_0001.zkey keys/verification_key.json', {
      stdio: 'inherit'
    });
    
    // Clean up temporary files
    execSync('rm -f pot12_0000.ptau pot12_0001.ptau pot12_final.ptau keys/solvency_0000.zkey', {
      stdio: 'inherit'
    });
    
    console.log('✅ Trusted setup completed successfully!');
    console.log('📁 Generated files:');
    console.log('  - build/solvency.wasm');
    console.log('  - build/solvency.r1cs');
    console.log('  - keys/solvency_0001.zkey');
    console.log('  - keys/verification_key.json');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

