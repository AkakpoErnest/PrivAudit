import { createHash } from 'crypto';
import { PrivateCommitment, TreasurySnapshot, IngestionResult } from '../types';

export class CommitmentService {
  private generateNonce(): string {
    return createHash('sha256')
      .update(Math.random().toString())
      .update(Date.now().toString())
      .digest('hex');
  }

  private createCommitment(data: any, nonce: string): string {
    const dataString = JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    
    return createHash('sha256')
      .update(dataString)
      .update(nonce)
      .digest('hex');
  }

  private createDataHash(snapshot: TreasurySnapshot): string {
    const sanitizedSnapshot = {
      daoAddress: snapshot.daoAddress,
      timestamp: snapshot.timestamp,
      network: snapshot.network,
      assetCount: snapshot.assets.length,
      liabilityCount: snapshot.liabilities.length,
      totalValueUSD: snapshot.totalValueUSD
    };

    return createHash('sha256')
      .update(JSON.stringify(sanitizedSnapshot))
      .digest('hex');
  }

  createCommitments(snapshot: TreasurySnapshot): {
    assets: PrivateCommitment;
    liabilities: PrivateCommitment;
  } {
    const assetsNonce = this.generateNonce();
    const liabilitiesNonce = this.generateNonce();
    
    const assetsCommitment = this.createCommitment(snapshot.assets, assetsNonce);
    const liabilitiesCommitment = this.createCommitment(snapshot.liabilities, liabilitiesNonce);
    
    return {
      assets: {
        commitment: assetsCommitment,
        nonce: assetsNonce,
        timestamp: snapshot.timestamp,
        daoAddress: snapshot.daoAddress,
        dataHash: this.createDataHash(snapshot)
      },
      liabilities: {
        commitment: liabilitiesCommitment,
        nonce: liabilitiesNonce,
        timestamp: snapshot.timestamp,
        daoAddress: snapshot.daoAddress,
        dataHash: this.createDataHash(snapshot)
      }
    };
  }

  verifyCommitment(
    data: any,
    commitment: PrivateCommitment
  ): boolean {
    const computedCommitment = this.createCommitment(data, commitment.nonce);
    return computedCommitment === commitment.commitment;
  }
}
