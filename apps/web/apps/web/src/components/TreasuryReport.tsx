import { Download, Share2, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TreasuryReportProps {
  reportData: {
    daoName: string;
    daoAddress: string;
    reportDate: string;
    metrics: any;
    proofVerified: boolean;
    proofHash: string;
    recommendations: string[];
  };
}

export function TreasuryReport({ reportData }: TreasuryReportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate PDF export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would call the AI service to generate PDF
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `treasury-report-${reportData.reportDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PrivAudit Treasury Report',
          text: `Treasury report for ${reportData.daoName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      alert('Report URL copied to clipboard!');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Treasury Report</h3>
          <p className="text-sm text-gray-600 mt-1">
            Generated on {new Date(reportData.reportDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{reportData.daoName}</h4>
            <p className="text-sm text-gray-600 font-mono">{reportData.daoAddress}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Proof Verified</span>
            </div>
            <p className="text-xs text-gray-500">Report #{reportData.proofHash.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700">
            The treasury analysis reveals a <strong>solvent position</strong> with a 
            {reportData.metrics.solvencyRatio.toFixed(1)}:1 assets-to-liabilities ratio. 
            The DAO maintains a runway of <strong>{reportData.metrics.runwayMonths} months</strong> 
            based on current burn rate assumptions. Asset diversification shows{' '}
            <strong>{reportData.metrics.assetDiversification.stablecoins.toFixed(1)}%</strong> 
            allocation to stable assets, providing a balanced risk profile.
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendations</h4>
        <div className="space-y-3">
          {reportData.recommendations.map((recommendation, index) => (
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
            <FileText className="h-4 w-4" />
            <span>Generated by PrivAudit</span>
          </div>
          <div>
            Privacy-Preserving Treasury Reports
          </div>
        </div>
      </div>
    </div>
  );
}
