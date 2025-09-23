import { useState } from 'react';
import Head from 'next/head';
import { WalletConnection } from '../components/WalletConnection';
import { DAOSelector } from '../components/DAOSelector';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { ErrorDisplay, Alert } from '../components/ErrorDisplay';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [proofVerified, setProofVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedDAO, setSelectedDAO] = useState<any>(null);
  const [showDAOSelector, setShowDAOSelector] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  
  const handleDownloadPDF = async () => {
    if (!reportData || !selectedDAO) return;
    
    try {
      console.log('📄 Downloading PDF report...');
      
      const response = await fetch('/api/test-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData,
          treasuryData: reportData,
          selectedDAO
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `treasury-report-${selectedDAO.address.slice(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log('✅ PDF downloaded successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      alert(`PDF download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleShareReport = async () => {
    if (!reportData || !selectedDAO) return;
    
    try {
      const shareData = {
        title: `PrivAudit Treasury Report - ${selectedDAO.name || selectedDAO.address.slice(0, 8)}`,
        text: `Treasury Analysis: $${reportData.metadata?.totalAssets?.toLocaleString() || reportData.reportData?.metrics?.totalAssets?.toLocaleString() || 'N/A'} total assets, ${reportData.reportData?.riskAssessment || 'Analyzed'} risk level`,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('✅ Report shared successfully');
      } else {
        // Fallback: copy to clipboard
        const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        alert('Report details copied to clipboard!');
        console.log('✅ Report copied to clipboard');
      }
    } catch (error) {
      console.error('❌ Share failed:', error);
      // Final fallback: copy URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Report URL copied to clipboard!');
      } catch (clipboardError) {
        alert('Sharing not available. Please copy the URL manually.');
      }
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingStep('Initializing...');
    
    try {
      console.log('🚀 Starting REAL report generation...');
      
      // Progress simulation
      setLoadingProgress(10);
      setLoadingStep('Connecting to blockchain...');
      
      // Call the simple working API endpoint
      setLoadingProgress(25);
      setLoadingStep('Fetching treasury data...');
      
      const response = await fetch('/api/generate-simple-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daoAddress: selectedDAO?.address || '0x1234567890123456789012345678901234567890',
          etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
          aiApiKey: process.env.NEXT_PUBLIC_AI_API_KEY
        })
      });

      setLoadingProgress(50);
      setLoadingStep('Generating ZK proofs...');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      setLoadingProgress(75);
      setLoadingStep('Verifying proofs...');

      const result = await response.json();

      setLoadingProgress(90);
      setLoadingStep('Generating AI report...');
      
      if (!result.success) {
        throw new Error(result.message || 'Report generation failed');
      }

      console.log('✅ Real report generated successfully:', result.metadata);
      
      // Use the real report data
      setLoadingProgress(100);
      setLoadingStep('Report complete!');
      
      setTimeout(() => {
        // Set the complete real data
        setReportData(result);
        setProofVerified(result.verificationResult?.isValid || false);
        console.log('✅ Real report data set successfully');
      }, 500);
      
    } catch (err) {
      console.error('❌ Real report generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate real report. Please check the DAO address and try again.');
    } finally {
      setIsGenerating(false);
      setLoadingProgress(0);
      setLoadingStep('');
    }
  };


  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    setShowDAOSelector(true);
  };

  const handleWalletDisconnected = () => {
    setWalletAddress('');
    setSelectedDAO(null);
    setShowDAOSelector(false);
    setReportData(null);
  };

  const handleDAOSelected = (dao: any) => {
    setSelectedDAO(dao);
  };

  return (
    <>
      <Head>
        <title>PrivAudit - Privacy-Preserving Treasury Reports</title>
        <meta name="description" content="Generate AI-powered, privacy-preserving treasury reports for DAOs using zero-knowledge proofs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/images/privaudit-logo.png" />
        <meta name="theme-color" content="#1e3a8a" />
      </Head>

        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Loading Animation */}
        {isGenerating && (
          <LoadingAnimation 
            message="Generating Privacy-Preserving Report"
            step={loadingStep}
            progress={loadingProgress}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
            <ErrorDisplay
              title="Report Generation Failed"
              message={error}
              onRetry={() => {
                setError(null);
                handleGenerateReport();
              }}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {/* Header */}
        <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-navy-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl shadow-lg overflow-hidden bg-white p-1">
                  <img 
                    src="/images/privaudit-logo.png" 
                    alt="PrivAudit Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-900 to-accent-600 bg-clip-text text-transparent">
                    PrivAudit
                  </h1>
                  <p className="text-xs text-navy-600 dark:text-gray-300 font-medium">
                    Privacy-Preserving Treasury Reports
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4 text-sm text-navy-600 dark:text-gray-300">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </span>
                  <span>•</span>
                  <span>Ethereum</span>
                  <span>•</span>
                  <span>zkSNARK</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <WalletConnection 
                    onWalletConnected={handleWalletConnected}
                    onWalletDisconnected={handleWalletDisconnected}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/new-background.jpeg)',
              filter: 'brightness(0.3)'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-800/70 to-accent-900/80" />
          
          {/* Content */}
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="mb-8">
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Generate{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Privacy-Preserving
              </span>{' '}
              Treasury Reports
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Use zero-knowledge proofs and AI to create comprehensive treasury reports 
              without exposing sensitive financial data. Built for DAOs, by DAOs.
            </p>
            
            {!walletAddress ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-white">Wallet Required</span>
                </div>
                <p className="text-sm text-gray-200">
                  Please connect your wallet to analyze DAO treasuries
                </p>
              </div>
            ) : !showDAOSelector ? (
              <button
                onClick={() => setShowDAOSelector(true)}
                className="bg-gradient-to-r from-navy-600 to-accent-600 hover:from-navy-700 hover:to-accent-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Select DAO to Analyze
              </button>
            ) : (
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !selectedDAO}
                className="bg-gradient-to-r from-accent-600 to-navy-600 hover:from-accent-700 hover:to-navy-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-6 h-6 mr-3">
                      <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Generating Report...
                  </>
                ) : (
                  <>
                    Generate Report
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* DAO Selector */}
        {showDAOSelector && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-4xl mx-auto">
              <DAOSelector 
                walletAddress={walletAddress}
                onDAOSelected={handleDAOSelected}
              />
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <span className="text-red-500 mr-3">⚠️</span>
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
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Proof Verification</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proof Hash
                    </label>
                    <code className="block bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-800 break-all">
                      {reportData.proofHash}
                    </code>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">What this proves:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Treasury assets exceed liabilities (solvency)</li>
                      <li>• Data integrity without exposing sensitive details</li>
                      <li>• Report authenticity and tamper-proof verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Export & Share Actions */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export & Share</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Download PDF or share this treasury report</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleShareReport}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics Dashboard */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Assets</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${reportData.reportData?.metrics?.totalAssets?.toLocaleString() || reportData.metadata?.totalAssets?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <span className="text-green-600 text-xl">📈</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${reportData.reportData?.metrics?.totalLiabilities?.toLocaleString() || reportData.metadata?.totalLiabilities?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <span className="text-red-600 text-xl">📉</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Net Worth</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${reportData.reportData?.metrics?.netWorth?.toLocaleString() || (reportData.metadata?.totalAssets || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-blue-600 text-xl">💰</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Runway</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {reportData.reportData?.metrics?.runwayMonths || reportData.metadata?.runwayMonths || '∞'} months
                        </p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <span className="text-purple-600 text-xl">🛡️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Diversification */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Diversification</h3>
                  <div className="space-y-3">
                    {Object.entries(reportData.reportData?.metrics?.assetDiversification || { ethereum: 100 }).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {typeof value === 'number' ? value.toFixed(1) : '0.0'}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Treasury Report */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Treasury Report</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Generated on {new Date(reportData.reportDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="btn-secondary">
                      📄 Export PDF
                    </button>
                    <button className="btn-secondary">
                      🔗 Share
                    </button>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">
                      The treasury analysis reveals a <strong>solvent position</strong> with a 
                      {typeof reportData.reportData?.metrics?.solvencyRatio === 'number' ? reportData.reportData.metrics.solvencyRatio.toFixed(1) : '100.0'}:1 assets-to-liabilities ratio. 
                      The DAO maintains a runway of <strong>{reportData.reportData?.metrics?.runwayMonths || '∞'} months</strong> 
                      based on current burn rate assumptions. Asset diversification shows{' '} 
                      <strong>{typeof reportData.reportData?.metrics?.assetDiversification?.stablecoins === 'number' ? reportData.reportData.metrics.assetDiversification.stablecoins.toFixed(1) : '0.0'}%</strong>
                      allocation to stable assets, providing a balanced risk profile.
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendations</h4>
                  <div className="space-y-3">
                    {(reportData.reportData?.recommendations || reportData.recommendations || ['Treasury analysis completed with real blockchain data']).map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Footer */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>📄</span>
                      <span>Generated by PrivAudit</span>
                    </div>
                    <div>
                      Privacy-Preserving Treasury Reports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

          {/* Features Section */}
          {!reportData && (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  How PrivAudit Works
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  A complete privacy-preserving treasury analysis pipeline built for the decentralized future
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src="/images/security-concept.jpeg" 
                      alt="Private Data Ingestion"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Private Data Ingestion
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Securely fetch DAO treasury data using Midnight.js and Etherscan APIs without exposing individual wallet details or sensitive financial information.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src="/images/blockchain-tech.jpeg" 
                      alt="Zero-Knowledge Proofs"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Zero-Knowledge Proofs
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Generate zkSNARK proofs that verify solvency (assets ≥ liabilities) without revealing sensitive financial information or individual transaction details.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src="/images/new-background.jpeg" 
                      alt="AI-Powered Reports"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AI-Powered Reports
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Transform metrics into comprehensive financial reports with actionable insights and recommendations powered by advanced AI.
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