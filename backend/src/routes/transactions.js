import express from 'express';
import prisma from '../db/prisma.js';

const router = express.Router();

// Create transaction (atomic checkout)
router.post('/checkout', async (req, res) => {
  try {
    const { items } = req.body; // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      let totalItems = 0;
      const transactionItems = [];

      // Process each item
      for (const item of items) {
        const { productId, quantity } = item;

        // Get product
        const product = await tx.product.findUnique({
          where: { id: productId }
        });

        if (!product) {
          throw new Error(`Product ${productId} not found`);
        }

        // Check stock availability
        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`);
        }

        // Calculate subtotal
        const subtotal = parseFloat(product.price) * quantity;
        totalAmount += subtotal;
        totalItems += quantity;

        // Prepare transaction item
        transactionItems.push({
          productId: product.id,
          productName: product.name,
          quantity,
          pricePerUnit: product.price,
          subtotal
        });

        // Deduct stock
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } }
        });
      }

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          totalAmount,
          itemCount: totalItems,
          items: {
            create: transactionItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return transaction;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await prisma.transaction.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

export default router;
