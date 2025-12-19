# 🛒 POS Cashier System

A production-ready **Point of Sale (POS) system** built for small retail stores in Indonesia. Supports **Android tablets/phones** with **Bluetooth barcode scanners** in HID keyboard mode, and scales to computers and mobile devices.

---

## ✨ Features

### Core Functionality
- ⚡ **Lightning-fast checkout** with barcode/QR scanning
- 🔄 **Automatic inventory deduction** after each sale
- 📦 **Real-time stock management** with low-stock warnings
- 💰 **Cash payment processing**
- 📊 **Daily sales reporting**
- 🏷️ **QR code generation** for products
- 🔐 **Atomic transactions** (no partial sales)
- ✅ **Transaction success modal** with instant feedback

### User Experience
- 🎯 **Zero typing required** during checkout
- 📱 **Responsive design** - tablet and desktop optimized
- ⌨️ **HID keyboard mode** scanner support
- 🔁 **Auto-focus scanner input** with visual feedback
- ⚠️ **Stock validation** before checkout with warnings
- ➕ **Quick product creation** when barcode not found
- ⌨️ **Keyboard shortcuts** for power users (Ctrl+Enter, Ctrl+C)
- 🎨 **Visual status indicators** for stock levels

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **PostgreSQL** - Database
- **Prisma** - ORM and migrations
- **QRCode** - QR generation
- **PDFKit** - Bulk QR label printing

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Axios** - API client
- **qrcode.react** - QR display

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 14+ installed and running
- **Git** (optional)

---

## 🚀 Installation & Setup

### 1️⃣ Clone or Download Project

```powershell
cd "c:\Users\athylus\Documents\Personal Projects\pos-cashier"
```

### 2️⃣ Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your database credentials
notepad .env
```

**Configure `.env`:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pos_cashier?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Initialize database:**
```powershell
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

**Start backend server:**
```powershell
npm run dev
```

Backend will run on **http://localhost:5000**

### 3️⃣ Frontend Setup

Open a **new terminal** window:

```powershell
# Navigate to frontend
cd "c:\Users\athylus\Documents\Personal Projects\pos-cashier\frontend"

# Install dependencies
npm install

# Create .env.local file
Copy-Item .env.local.example .env.local

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

---

## 📱 Usage Guide

### Starting the System

1. **Start PostgreSQL** (if not running)
2. **Start backend** (`npm run dev` in `/backend`)
3. **Start frontend** (`npm run dev` in `/frontend`)
4. **Open browser** to `http://localhost:3000`

### Using the POS

#### **Checkout Flow**

1. **Focus is on the scanner input field** (blue border)
2. **Scan a barcode** or type manually and press ENTER
3. **Product is added to cart** automatically
   - If product exists: Added/quantity increased
   - If not found: Modal opens to create product
4. **Adjust quantities** using +/- buttons
5. **Click "Checkout"** to complete sale
6. **Inventory is updated** atomically

#### **Creating Products**

**Method 1: During Checkout (Recommended)**
1. Scan unknown barcode
2. Modal opens with barcode pre-filled
3. Enter product name, price, and initial stock
4. Click "Create & Add to Cart"
5. Product is created and added immediately

**Method 2: Product Management Page**
- Go to `/products` page
- View all products
- Update stock by clicking stock numbers
- View/print QR codes

#### **Viewing Reports**

1. Navigate to `/reports` page
2. Select date
3. View:
   - Total sales
   - Transaction count
   - Items sold
   - Top-selling products
   - Recent transactions

---

## 🔌 Barcode Scanner Setup

### Bluetooth Scanner (HID Keyboard Mode)

1. **Pair scanner** with Android tablet/phone via Bluetooth
2. **Scanner acts as keyboard** - no special drivers needed
3. **Scanner sends characters + ENTER key** automatically
4. **POS captures input** via hidden input field

### Configuration

- Scanner must send **ENTER** after barcode
- Minimum barcode length: 3 characters
- Maximum barcode length: 50 characters
- Scan timeout: 100ms between characters

### Tested Scanners

- Generic Bluetooth HID scanners
- USB barcode scanners (on computers)
- Any scanner that emulates keyboard input

---

## ⌨️ Keyboard Shortcuts (Desktop/Laptop)

Boost productivity with these keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Complete checkout |
| `Ctrl + C` | Clear cart |
| `ESC` | Close modals |

The scanner input field auto-focuses, so you can start scanning immediately!

---

## 📊 Database Schema

### **Products**
```prisma
- id: Int (Primary Key)
- code: String (Unique) - Barcode/QR code
- name: String - Product name
- price: Decimal - Price in Rupiah
- stock: Int - Current inventory
- createdAt: DateTime
- updatedAt: DateTime
```

### **Transactions**
```prisma
- id: Int (Primary Key)
- totalAmount: Decimal - Total sale amount
- itemCount: Int - Number of items sold
- paymentMethod: String - Always "CASH"
- createdAt: DateTime
```

### **TransactionItems**
```prisma
- id: Int (Primary Key)
- transactionId: Int (Foreign Key)
- productId: Int (Foreign Key)
- productName: String - Snapshot of name
- quantity: Int
- pricePerUnit: Decimal
- subtotal: Decimal
```

---

## 🔧 API Endpoints

### Products
- `GET /api/products/lookup/:code` - Find product by barcode
- `POST /api/products` - Create new product
- `GET /api/products` - Get all products
- `PATCH /api/products/:id/stock` - Update stock

### Transactions
- `POST /api/transactions/checkout` - Process checkout (atomic)
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily sales report
- `GET /api/reports/range?startDate&endDate` - Date range report

### QR Codes
- `GET /api/qr/generate/:productId?format=png|svg|dataurl` - Generate QR
- `POST /api/qr/bulk-pdf` - Generate bulk QR labels as PDF
- `POST /api/qr/import-csv` - Import products from CSV

---

## 🎨 UI Pages

### `/` - POS Checkout (Main Page)
- Scanner input field (auto-focused)
- Shopping cart
- Product quantity controls
- Total calculation
- Checkout button

### `/products` - Product Management
- Product list with stock levels
- Click stock to edit
- View/print QR codes
- Stock indicators (red/orange/green)

### `/reports` - Daily Sales Report
- Date selector
- Summary cards (sales, transactions, items)
- Top-selling products table
- Recent transactions list

---

## 🔐 Data Integrity & Validation

### Stock Management
- ✅ **Negative stock prevented** at checkout
- ✅ **Stock checked** before adding to cart
- ✅ **Real-time stock display** during scanning

### Atomic Transactions
- ✅ **All-or-nothing** checkout (Prisma transactions)
- ✅ **Automatic rollback** on error
- ✅ **Stock deduction** only on successful checkout

### Input Validation
- ✅ **Required fields** enforced
- ✅ **Unique barcodes** (database constraint)
- ✅ **Price and stock** must be positive
- ✅ **Empty cart** cannot checkout

---

## 📦 Deployment

### Production Build

**Backend:**
```powershell
cd backend
npm install --production
npm start
```

**Frontend:**
```powershell
cd frontend
npm run build
npm start
```

### Environment Variables (Production)

**Backend `.env`:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/pos_cashier"
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

### Deployment Options

- **VPS/Cloud**: Deploy on DigitalOcean, AWS, Azure
- **Database**: Use managed PostgreSQL (AWS RDS, DigitalOcean DB)
- **Frontend**: Deploy on Vercel, Netlify, or same VPS
- **Backend**: Use PM2 for process management

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Scan existing product → Added to cart
- [ ] Scan unknown barcode → Modal opens
- [ ] Create product via modal → Product added to cart
- [ ] Increase quantity with + button
- [ ] Decrease quantity with - button
- [ ] Remove item from cart
- [ ] Checkout with valid stock → Success
- [ ] Try checkout with insufficient stock → Error shown
- [ ] View daily report
- [ ] Update product stock
- [ ] Generate QR code

### Sample Test Data

Create test products manually:
```sql
INSERT INTO "Product" (code, name, price, stock) VALUES
('8992761111017', 'Coca Cola 330ml', 5000, 100),
('8993560312114', 'Indomie Goreng', 3000, 200),
('8999999041533', 'Aqua 600ml', 4000, 150);
```

---

## 🛠️ Troubleshooting

### Scanner Not Working
- **Check**: Scanner is in HID keyboard mode
- **Check**: Scanner sends ENTER after barcode
- **Check**: Input field has blue border (focused)
- **Fix**: Click on input field to refocus

### Database Connection Error
- **Check**: PostgreSQL is running
- **Check**: DATABASE_URL is correct
- **Check**: Database `pos_cashier` exists
- **Fix**: Run `npm run db:migrate`

### Products Not Showing
- **Check**: Backend is running on port 5000
- **Check**: CORS settings allow frontend URL
- **Check**: Network request in browser DevTools
- **Fix**: Check backend console for errors

### Stock Not Updating
- **Check**: Transaction completed successfully
- **Check**: No database errors in backend logs
- **Check**: Refresh products page
- **Fix**: Check Prisma Studio for actual values

---

## 📂 Project Structure

```
pos-cashier/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.js      # Product endpoints
│   │   │   ├── transactions.js  # Checkout & transactions
│   │   │   ├── reports.js       # Sales reports
│   │   │   └── qr.js            # QR generation
│   │   ├── db/
│   │   │   └── prisma.js        # Prisma client
│   │   └── index.js             # Express app
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.js         # POS checkout
│   │   │   ├── products.js      # Product management
│   │   │   ├── reports.js       # Sales reports
│   │   │   └── _app.js          # Next.js app
│   │   ├── components/
│   │   │   ├── ScannerInput.js  # Barcode input component
│   │   │   └── AddProductModal.js # New product modal
│   │   ├── hooks/
│   │   │   └── useBarcodeScanner.js # Scanner hook
│   │   ├── lib/
│   │   │   └── api.js           # API client
│   │   └── styles/
│   │       └── globals.css      # Tailwind styles
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## 🔮 Future Enhancements (Out of Scope for MVP)

- 🚫 QRIS / digital payments
- 🚫 Multi-branch support
- 🚫 Loyalty programs
- 🚫 Receipt printing
- 🚫 Advanced analytics
- 🚫 Multi-user/roles

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API endpoint logs
3. Check browser console for errors
4. Verify database connection

---

## 📄 License

MIT License - Free to use and modify

---

## 🎯 Success Criteria Checklist

- ✅ Cashier can scan items rapidly without touching screen
- ✅ Inventory updates correctly after every sale
- ✅ System handles busy checkout periods without lag
- ✅ Non-technical users can operate within 5 minutes
- ✅ Barcode scanner works in HID keyboard mode
- ✅ Checkout is atomic (all-or-nothing)
- ✅ Stock validation prevents overselling
- ✅ Large, tablet-friendly UI
- ✅ Quick product creation during checkout
- ✅ Daily sales reporting
- ✅ QR code generation and printing

---

**Built with ❤️ for Indonesian retail stores**
