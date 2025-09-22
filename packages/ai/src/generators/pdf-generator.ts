import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface ReportData {
  metrics: {
    netWorth: number;
    solvencyRatio: number;
    runwayMonths: number;
    totalAssets: number;
    totalLiabilities: number;
    assetDiversification: {
      stablecoins: number;
      highConcentration?: boolean;
      topAssetPercentage?: number;
      numberOfAssets?: number;
    };
  };
  recommendations: string[];
  summary: string;
  riskAssessment: string;
}

export interface TreasuryData {
  daoAddress: string;
  totalValueUSD: number;
  assets: Array<{
    symbol: string;
    balance: string;
    balanceFormatted: string;
    valueUSD: number;
    name: string;
  }>;
  timestamp: number;
  network: string;
}

export class PDFReportGenerator {
  async generatePDFReport(
    reportData: ReportData,
    treasuryData: TreasuryData,
    verificationResult: { isValid: boolean }
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Header
        doc.fontSize(24).fillColor('#1f2937').text('PrivAudit Treasury Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#6b7280').text(
          `Generated on ${new Date().toLocaleDateString()} | Privacy-Preserving Analysis`,
          { align: 'center' }
        );
        
        // Add verification badge
        doc.moveDown(1);
        const badgeColor = verificationResult.isValid ? '#10b981' : '#ef4444';
        const badgeText = verificationResult.isValid ? '✓ zkSNARK Verified' : '✗ Verification Failed';
        doc.fontSize(12).fillColor(badgeColor).text(badgeText, { align: 'center' });

        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
        doc.moveDown(1);

        // DAO Information
        doc.fontSize(18).fillColor('#1f2937').text('DAO Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#374151');
        doc.text(`Address: ${treasuryData.daoAddress}`);
        doc.text(`Network: ${treasuryData.network}`);
        doc.text(`Analysis Date: ${new Date(treasuryData.timestamp).toLocaleDateString()}`);
        doc.moveDown(1);

        // Key Metrics
        doc.fontSize(18).fillColor('#1f2937').text('Key Financial Metrics');
        doc.moveDown(0.5);
        
        const metrics = [
          ['Net Worth', `$${reportData.metrics.netWorth.toLocaleString()}`],
          ['Total Assets', `$${reportData.metrics.totalAssets.toLocaleString()}`],
          ['Total Liabilities', `$${reportData.metrics.totalLiabilities.toLocaleString()}`],
          ['Solvency Ratio', `${reportData.metrics.solvencyRatio.toFixed(2)}:1`],
          ['Runway', `${reportData.metrics.runwayMonths} months`],
          ['Stablecoin Allocation', `${reportData.metrics.assetDiversification.stablecoins.toFixed(1)}%`]
        ];

        metrics.forEach(([label, value]) => {
          doc.fontSize(11).fillColor('#374151').text(`${label}:`, 50, doc.y);
          doc.fillColor('#1f2937').text(value, 200, doc.y - 12);
          doc.moveDown(0.3);
        });

        doc.moveDown(1);

        // Asset Breakdown
        doc.fontSize(18).fillColor('#1f2937').text('Asset Breakdown');
        doc.moveDown(0.5);

        // Sort assets by value
        const sortedAssets = treasuryData.assets
          .filter(asset => asset.valueUSD > 0)
          .sort((a, b) => b.valueUSD - a.valueUSD)
          .slice(0, 10); // Top 10 assets

        doc.fontSize(10).fillColor('#6b7280');
        doc.text('Asset', 50, doc.y);
        doc.text('Balance', 200, doc.y - 12);
        doc.text('Value (USD)', 350, doc.y - 12);
        doc.text('% of Total', 450, doc.y - 12);
        doc.moveDown(0.5);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
        doc.moveDown(0.5);

        sortedAssets.forEach((asset) => {
          const percentage = (asset.valueUSD / treasuryData.totalValueUSD) * 100;
          doc.fontSize(10).fillColor('#374151');
          doc.text(asset.symbol, 50, doc.y);
          doc.text(parseFloat(asset.balanceFormatted).toLocaleString(), 200, doc.y - 12);
          doc.text(`$${asset.valueUSD.toLocaleString()}`, 350, doc.y - 12);
          doc.text(`${percentage.toFixed(1)}%`, 450, doc.y - 12);
          doc.moveDown(0.4);
        });

        doc.moveDown(1);

        // Risk Assessment
        doc.fontSize(18).fillColor('#1f2937').text('Risk Assessment');
        doc.moveDown(0.5);
        
        const riskColor = reportData.riskAssessment === 'Low Risk' ? '#10b981' : 
                         reportData.riskAssessment === 'Medium Risk' ? '#f59e0b' : '#ef4444';
        
        doc.fontSize(14).fillColor(riskColor).text(`Overall Risk Level: ${reportData.riskAssessment}`);
        doc.moveDown(0.5);
        
        doc.fontSize(11).fillColor('#374151').text(reportData.summary, {
          width: 495,
          align: 'justify'
        });
        doc.moveDown(1);

        // Recommendations
        doc.fontSize(18).fillColor('#1f2937').text('Recommendations');
        doc.moveDown(0.5);

        reportData.recommendations.forEach((recommendation, index) => {
          doc.fontSize(11).fillColor('#374151');
          doc.text(`${index + 1}. ${recommendation}`, {
            width: 495,
            align: 'justify'
          });
          doc.moveDown(0.5);
        });

        doc.moveDown(2);

        // Footer
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#9ca3af').text(
          'This report was generated using privacy-preserving zkSNARK technology. ' +
          'No sensitive treasury data was exposed during the analysis process.',
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
