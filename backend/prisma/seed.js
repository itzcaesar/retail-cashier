import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');

    // Optional: Clear existing data (uncomment to reset database)
    // await prisma.transactionItem.deleteMany();
    // await prisma.transaction.deleteMany();
    // await prisma.product.deleteMany();
    // console.log('✓ Existing data cleared');

    // Check if products already exist
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      console.log(`ℹ️  Database already has ${existingProducts} products`);
      console.log('   To reset, uncomment the delete lines in seed.js');
      return;
    }

    // Sample products
    const products = [
    {
      code: 'SNACK001',
      name: 'Indomie Goreng',
      price: 3500,
      stock: 100
    },
    {
      code: 'SNACK002',
      name: 'Chitato BBQ',
      price: 8000,
      stock: 50
    },
    {
      code: 'DRINK001',
      name: 'Aqua 600ml',
      price: 4000,
      stock: 75
    },
    {
      code: 'DRINK002',
      name: 'Teh Botol Sosro',
      price: 5000,
      stock: 60
    },
    {
      code: 'CANDY001',
      name: 'Kopiko Coffee Candy',
      price: 2000,
      stock: 120
    },
    {
      code: 'BISCUIT001',
      name: 'Oreo Original',
      price: 10000,
      stock: 40
    },
    {
      code: 'MILK001',
      name: 'Susu Ultra Coklat',
      price: 6500,
      stock: 30
    },
    {
      code: 'BREAD001',
      name: 'Roti Tawar Sari Roti',
      price: 15000,
      stock: 25
    },
    {
      code: 'SOAP001',
      name: 'Sabun Lifebuoy',
      price: 7000,
      stock: 45
    },
    {
      code: 'SHAMPOO001',
      name: 'Pantene Sachet',
      price: 1500,
      stock: 8
    },
    {
      code: 'TISSUE001',
      name: 'Tisu Paseo',
      price: 12000,
      stock: 2
    },
    {
      code: 'EGGS001',
      name: 'Telur Ayam (10 butir)',
      price: 25000,
      stock: 0
    }
  ];

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
    console.log(`✓ Created: ${product.name} (${product.code})`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`📦 Created ${products.length} products`);
  console.log('\n📊 Stock levels:');
  console.log('   - In Stock: 9 products');
  console.log('   - Low Stock (< 10): 2 products');
  console.log('   - Out of Stock: 1 product');
  
  } catch (error) {
    console.error('❌ Error details:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
