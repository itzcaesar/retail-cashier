-- Sample Data for POS Cashier System
-- Run this in Supabase SQL Editor: Database → SQL Editor → New Query

-- Insert sample products
INSERT INTO "Product" (code, name, price, stock, "createdAt", "updatedAt") VALUES
('SNACK001', 'Indomie Goreng', 3500, 100, NOW(), NOW()),
('SNACK002', 'Chitato BBQ', 8000, 50, NOW(), NOW()),
('DRINK001', 'Aqua 600ml', 4000, 75, NOW(), NOW()),
('DRINK002', 'Teh Botol Sosro', 5000, 60, NOW(), NOW()),
('CANDY001', 'Kopiko Coffee Candy', 2000, 120, NOW(), NOW()),
('BISCUIT001', 'Oreo Original', 10000, 40, NOW(), NOW()),
('MILK001', 'Susu Ultra Coklat', 6500, 30, NOW(), NOW()),
('BREAD001', 'Roti Tawar Sari Roti', 15000, 25, NOW(), NOW()),
('SOAP001', 'Sabun Lifebuoy', 7000, 45, NOW(), NOW()),
('SHAMPOO001', 'Pantene Sachet', 1500, 8, NOW(), NOW()),
('TISSUE001', 'Tisu Paseo', 12000, 2, NOW(), NOW()),
('EGGS001', 'Telur Ayam (10 butir)', 25000, 0, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Verify the data
SELECT 
    code,
    name,
    price,
    stock,
    CASE 
        WHEN stock = 0 THEN 'Out of Stock'
        WHEN stock < 10 THEN 'Low Stock'
        ELSE 'In Stock'
    END as status
FROM "Product"
ORDER BY name;
