import { NextApiRequest, NextApiResponse } from 'next';
import { PDFReportGenerator } from '@privaudit/ai';

// API endpoint to generate PDF reports from treasury data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reportData, treasuryData, verificationResult } = req.body;

    if (!reportData || !treasuryData) {
      return res.status(400).json({ 
        error: 'Report data and treasury data are required',
        success: false 
      });
    }

    console.log('📄 Generating PDF report for DAO:', treasuryData.daoAddress);

    const pdfGenerator = new PDFReportGenerator();
    const pdfBuffer = await pdfGenerator.generatePDFReport(
      reportData,
      treasuryData,
      verificationResult || { isValid: true }
    );

    console.log('✅ PDF report generated successfully');

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="privaudit-treasury-report-${treasuryData.daoAddress.slice(0, 8)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to generate PDF report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
