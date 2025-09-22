import { NextApiRequest, NextApiResponse } from 'next';
import { PDFReportGenerator } from '@privaudit/ai';

// Test PDF generation endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📄 Testing PDF generation...');

    // Test data
    const reportData = {
      metrics: {
        netWorth: 466434,
        solvencyRatio: 100,
        runwayMonths: 9,
        totalAssets: 466434,
        totalLiabilities: 0,
        assetDiversification: {
          stablecoins: 0,
          ethereum: 100
        }
      },
      recommendations: [
        'Treasury holds $466,434 in digital assets',
        'Consider diversifying into stablecoins',
        'Monitor ETH price volatility'
      ],
      summary: 'Treasury analysis shows moderate holdings with room for diversification.',
      riskAssessment: 'High Risk'
    };

    const treasuryData = {
      daoAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
      totalValueUSD: 466434,
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balanceFormatted: '0.1113',
          valueUSD: 466434
        }
      ],
      timestamp: Date.now(),
      network: 'ethereum'
    };

    const verificationResult = { isValid: true };

    const pdfGenerator = new PDFReportGenerator();
    const pdfBuffer = await pdfGenerator.generatePDFReport(
      reportData,
      treasuryData,
      verificationResult
    );

    console.log('✅ PDF generated successfully, size:', pdfBuffer.length);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="test-report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
