import express from 'express';
import prisma from '../db/prisma.js';

const router = express.Router();

// Lookup product by scanned code (barcode or QR)
router.get('/lookup/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { code }
    });

    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        code 
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Product lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { code, name, price, stock } = req.body;

    // Validate input
    if (!code || !name || price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: code, name, price' 
      });
    }

    // Check if code already exists
    const existing = await prisma.product.findUnique({
      where: { code }
    });

    if (existing) {
      return res.status(409).json({ 
        error: 'Product with this code already exists' 
      });
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        price: parseFloat(price),
        stock: parseInt(stock) || 0
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ error: 'Stock value required' });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) }
    });

    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
