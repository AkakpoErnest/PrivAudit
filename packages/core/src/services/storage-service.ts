import axios from 'axios';
import { StorageConfig, IngestionResult } from '../types';

export class StorageService {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async storeData(data: IngestionResult): Promise<{ ipfs?: string; arweave?: string }> {
    const hashes: { ipfs?: string; arweave?: string } = {};

    try {
      // Store to IPFS if configured
      if (this.config.ipfs) {
        hashes.ipfs = await this.storeToIPFS(data);
      }

      // Store to Arweave if configured
      if (this.config.arweave) {
        hashes.arweave = await this.storeToArweave(data);
      }

      return hashes;
    } catch (error) {
      throw new Error(`Storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async storeToIPFS(data: IngestionResult): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.ipfs!.gateway}/api/v0/add`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.ipfs!.apiKey && { 'Authorization': `Bearer ${this.config.ipfs!.apiKey}` })
          }
        }
      );

      return response.data.Hash;
    } catch (error) {
      console.warn('IPFS storage failed:', error);
      throw error;
    }
  }

  private async storeToArweave(data: IngestionResult): Promise<string> {
    try {
      // Simplified Arweave implementation
      // In production, use proper Arweave SDK
      const response = await axios.post(
        `${this.config.arweave!.gateway}/tx`,
        {
          data: JSON.stringify(data),
          tags: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'App-Name', value: 'PrivAudit' },
            { name: 'DAO-Address', value: data.snapshot.daoAddress }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.id;
    } catch (error) {
      console.warn('Arweave storage failed:', error);
      throw error;
    }
  }

  async retrieveData(hash: string, storageType: 'ipfs' | 'arweave'): Promise<IngestionResult> {
    try {
      let url: string;
      
      if (storageType === 'ipfs') {
        url = `${this.config.ipfs!.gateway}/ipfs/${hash}`;
      } else {
        url = `${this.config.arweave!.gateway}/${hash}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

