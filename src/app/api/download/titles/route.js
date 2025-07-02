import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request) {
  try {
    // Parse JSON data from request body
    const data = await request.json();

    // Validate JSON data
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'JSON Data Report',
        Author: 'Next.js App',
      },
    });

    // Create a stream to collect PDF data
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Add content to the PDF
    // Header
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#2e86c1')
      .text('JSON Data Report', { align: 'center' })
      .moveDown();

    // Add a horizontal line
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#2e86c1')
      .stroke()
      .moveDown();

    // Format JSON data as a table-like structure
    doc.font('Helvetica').fontSize(12).fillColor('black');
    let yPosition = doc.y;

    // Iterate through JSON data
    Object.entries(data).forEach(([key, value], index) => {
      // Handle nested objects/arrays
      const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;

      // Draw key
      doc
        .font('Helvetica-Bold')
        .text(`${key}:`, 50, yPosition)
        .font('Helvetica')
        .text(displayValue, 150, yPosition, { width: 400, align: 'left' });

      yPosition += 20; // Move down for the next row

      // Add a separator line between entries
      if (index < Object.keys(data).length - 1) {
        doc
          .moveTo(50, yPosition)
          .lineTo(550, yPosition)
          .strokeColor('#ccc')
          .stroke();
        yPosition += 10;
      }

      // Handle page overflow
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
    });

    // Add footer
    doc
      .fontSize(10)
      .fillColor('#666')
      .text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

    // Finalize the PDF
    doc.end();

    // Convert buffers to a single Buffer
    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // Set response headers for PDF download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="report.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON or server error: ' + error.message },
      { status: 400 }
    );
  }
}