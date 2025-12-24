# POS Cashier System

A modern Point of Sale (POS) system built with a full-stack JavaScript architecture. This application provides a seamless cashier experience with features like product lookup, barcode scanning (using a handheld scanner or device camera), cart management, and sales reporting.

## Features

- **Product Management**: View and manage product inventory.
- **Efficient Checkout**: Fast product lookup via barcode scanning or manual code entry.
- **Cart Management**: Add, remove, and update quantities of items in the cart.
- **Mobile Friendly**: Fully responsive design with a mobile-optimized checkout flow (Camera scanning, Sticky footer).
- **Barcode Scanning**:
  - Support for USB/Bluetooth handheld barcode scanners.
  - Built-in camera scanner support for mobile devices.
- **Reports**: View transaction history and sales reports.
- **Transaction Receipts**: (Optional/Planned) Generate PDF receipts.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: Axios
- **QR/Barcode**: `html5-qrcode`, `qrcode.react`

### Backend
- **Server**: [Express.js](https://expressjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (Default) / PostgreSQL (Compatible)
- **Utilities**: `pdfkit` (PDF generation), `csv-parser`

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up the database (Prisma):
```bash
# Push the schema to the database (creates dev.db for SQLite)
npx prisma db push

# (Optional) Seed the database with initial products
npm run db:seed
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
# App runs on http://localhost:3000
```

## Usage

1. Open the frontend URL (http://localhost:3000) in your browser.
2. Use a physical scanner or click "Scan with Camera" to add products.
3. Adjust quantities or remove items as needed.
4. Click "Checkout" to complete the transaction.
