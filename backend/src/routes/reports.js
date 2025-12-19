import express from 'express';
import prisma from '../db/prisma.js';

const router = express.Router();

// Get daily sales report
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD
    
    // Default to today if no date provided
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get all transactions for the day
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        items: true
      }
    });

    // Calculate totals
    const totalSales = transactions.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0);
    const transactionCount = transactions.length;
    const itemsSold = transactions.reduce((sum, t) => sum + t.itemCount, 0);

    // Get top-selling products
    const productSales = {};
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantitySold: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantitySold += item.quantity;
        productSales[item.productId].revenue += parseFloat(item.subtotal);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    res.json({
      date: startOfDay.toISOString().split('T')[0],
      summary: {
        totalSales,
        transactionCount,
        itemsSold,
        averageTransactionValue: transactionCount > 0 ? totalSales / transactionCount : 0
      },
      topProducts,
      transactions
    });
  } catch (error) {
    console.error('Daily report error:', error);
    res.status(500).json({ error: 'Failed to generate daily report' });
  }
});

// Get sales summary by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate required' });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    const totalSales = transactions.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0);
    const transactionCount = transactions.length;

    res.json({
      startDate: startDate,
      endDate: endDate,
      totalSales,
      transactionCount,
      averageDaily: totalSales / Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    });
  } catch (error) {
    console.error('Range report error:', error);
    res.status(500).json({ error: 'Failed to generate range report' });
  }
});

export default router;
