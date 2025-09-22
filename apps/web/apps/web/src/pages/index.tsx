import { useState } from 'react';
import Head from 'next/head';
import { Shield, Zap, BarChart3, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { TreasuryReport } from '../components/TreasuryReport';
import { ProofVerification } from '../components/ProofVerification';
import { MetricsDashboard } from '../components/MetricsDashboard';

// Main page component - keeping it clean and focused
export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [proofVerified, setProofVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate the report generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report data - in production this would come from the AI service
      const mockReport = {
        daoName: 'Demo DAO',
        daoAddress: '0x1234...5678',
        reportDate: new Date().toISOString().split('T')[0],
        metrics: {
          totalAssets: 1800000,
          totalLiabilities: 200000,
          netWorth: 1600000,
          solvencyRatio: 9.0,
          runwayMonths: 18.0,
          assetDiversification: {
            stablecoins: 55.6,
            crypto: 44.4,
            nfts: 0,
            lpTokens: 0,
            other: 0
          },
          riskMetrics: {
            concentrationRisk: 'medium',
            volatilityRisk: 'medium',
            liquidityRisk: 'low',
            counterpartyRisk: 'low'
          }
        },
        proofVerified: true,
        proofHash: '0x' + Math.random().toString(16).substr(2, 8),
        recommendations: [
          'Consider diversifying into more stable assets to reduce volatility risk',
          'Implement automated treasury management strategies',
          'Set up regular solvency monitoring and alerts',
          'Consider hedging strategies for crypto exposure'
        ]
      };
      
      setReportData(mockReport);
      setProofVerified(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>PrivAudit - Privacy-Preserving Treasury Reports</title>
        <meta name="description" content="Generate AI-powered, privacy-preserving treasury reports for DAOs using zero-knowledge proofs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">PrivAudit</h1>
              </div>
              <div className="text-sm text-gray-500">
                Privacy-Preserving Treasury Reports
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Generate{' '}
              <span className="text-gradient">Privacy-Preserving</span>{' '}
              Treasury Reports
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Use zero-knowledge proofs and AI to create comprehensive treasury reports 
              without exposing sensitive financial data.
            </p>
            
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Zap className="inline-block w-5 h-5 mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </section>
        )}

        {/* Report Content */}
        {reportData && (
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Proof Verification */}
              <ProofVerification 
                verified={proofVerified} 
                proofHash={reportData.proofHash}
              />

              {/* Metrics Dashboard */}
              <MetricsDashboard metrics={reportData.metrics} />

              {/* Treasury Report */}
              <TreasuryReport reportData={reportData} />
            </div>
          </section>
        )}

        {/* Features Section */}
        {!reportData && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                How PrivAudit Works
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Private Data Ingestion
                  </h4>
                  <p className="text-gray-600">
                    Securely fetch DAO treasury data using Midnight.js without exposing individual wallet details.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Zero-Knowledge Proofs
                  </h4>
                  <p className="text-gray-600">
                    Generate zkSNARK proofs that verify solvency without revealing sensitive financial information.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    AI-Powered Reports
                  </h4>
                  <p className="text-gray-600">
                    Transform metrics into comprehensive financial reports with actionable insights and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
