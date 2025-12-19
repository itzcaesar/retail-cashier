import express from 'express';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import prisma from '../db/prisma.js';
import fs from 'fs';
import csvParser from 'csv-parser';

const router = express.Router();

// Generate QR code for a product
router.get('/generate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { format = 'png' } = req.query; // png, svg, or dataurl

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // QR code contains the product code
    const qrData = product.code;

    if (format === 'svg') {
      const svg = await QRCode.toString(qrData, { type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } else if (format === 'dataurl') {
      const dataUrl = await QRCode.toDataURL(qrData);
      res.json({ dataUrl, product });
    } else {
      const buffer = await QRCode.toBuffer(qrData);
      res.setHeader('Content-Type', 'image/png');
      res.send(buffer);
    }
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Generate bulk QR codes as PDF
router.post('/bulk-pdf', async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs required' });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds.map(id => parseInt(id)) }
      }
    });

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=qr-codes.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('QR Code Labels', { align: 'center' });
    doc.moveDown();

    let yPosition = doc.y;
    let xPosition = 50;
    const qrSize = 150;
    const labelWidth = 200;
    const spacing = 20;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Generate QR as data URL
      const qrDataUrl = await QRCode.toDataURL(product.code, { 
        width: qrSize,
        margin: 1 
      });

      // Convert data URL to buffer
      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
      const qrBuffer = Buffer.from(base64Data, 'base64');

      // Add QR code image
      doc.image(qrBuffer, xPosition, yPosition, { width: qrSize });

      // Add product info below QR
      doc.fontSize(10)
        .text(product.name, xPosition, yPosition + qrSize + 5, { 
          width: labelWidth,
          align: 'center'
        })
        .text(`Rp ${parseFloat(product.price).toLocaleString('id-ID')}`, xPosition, yPosition + qrSize + 20, {
          width: labelWidth,
          align: 'center'
        })
        .text(product.code, xPosition, yPosition + qrSize + 35, {
          width: labelWidth,
          align: 'center',
          fontSize: 8
        });

      // Move to next position (2 columns)
      xPosition += labelWidth + spacing;
      if (xPosition > 400) {
        xPosition = 50;
        yPosition += qrSize + 80;
      }

      // New page if needed
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
        xPosition = 50;
      }
    }

    doc.end();
  } catch (error) {
    console.error('Bulk PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Import products from CSV and generate codes
router.post('/import-csv', async (req, res) => {
  try {
    const { filePath } = req.body; // Path to CSV file

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    const products = [];
    
    // Parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Expected columns: name, price, stock, code (optional)
          const code = row.code || `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          products.push({
            code,
            name: row.name,
            price: parseFloat(row.price),
            stock: parseInt(row.stock) || 0
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Create products in database
    const created = await prisma.product.createMany({
      data: products,
      skipDuplicates: true
    });

    res.json({
      message: 'Products imported successfully',
      count: created.count,
      products
    });
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ error: 'Failed to import CSV' });
  }
});

export default router;
