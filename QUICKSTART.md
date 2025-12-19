# ⚡ Quick Start Guide

Get your POS system running in **5 minutes**!

---

## 🎯 Prerequisites

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ PostgreSQL running OR Supabase account
- ✅ Git installed

---

## 🚀 Quick Setup

### 1. Clone & Install

```powershell
# Clone the repository
git clone https://github.com/itzcaesar/retail-cashier.git
cd retail-cashier

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL**
```powershell
cd backend

# Create .env file
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pos_cashier"' > .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL=http://localhost:3000' >> .env

# Run migrations
npx prisma generate
npx prisma migrate dev
```

**Option B: Supabase (Recommended)**
```powershell
cd backend

# Create .env file
echo 'DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres"' > .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL=http://localhost:3000' >> .env

# Run migrations
npx prisma generate
npx prisma migrate deploy
```

### 3. Start Development Servers

Open **TWO terminal windows**:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:3000`

### 4. Open POS

Go to: **http://localhost:3000**

---

## 🎮 Try It Out!

1. **Create your first product:**
   - Type `TEST123` in the scanner input
   - Press `ENTER`
   - Fill in the product modal:
     - Name: `Sample Product`
     - Price: `10000`
     - Stock: `50`
   - Click **"Create & Add to Cart"**

2. **Complete a checkout:**
   - The product is now in your cart
   - Click **"💰 Checkout"**
   - Success modal appears!

3. **View reports:**
   - Click **"📊 Reports"** in the header
   - See your first transaction

---

## 🔧 Common Issues

### Port already in use
```powershell
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Database connection failed
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Test connection: `npx prisma studio`

### Module not found
```powershell
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

---

## 📱 Using with Barcode Scanner

1. **Connect scanner** via Bluetooth or USB
2. **Configure to HID mode** (keyboard emulation)
3. **Scan a barcode** - it should appear in the input field
4. **Press ENTER** or scanner auto-sends it

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Checkout |
| `Ctrl + C` | Clear cart |
| `ESC` | Close modal |

---

## 📂 Project Structure

```
pos-cashier/
├── backend/           # Node.js + Express API
│   ├── prisma/       # Database schema
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   └── index.js  # Server entry
│   └── package.json
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
└── README.md
```

---

## 🎯 Next Steps

- ✅ Read [README.md](README.md) for full documentation
- ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- ✅ Browse [INSTRUCTIONS.md](INSTRUCTIONS.md) for system requirements
- ✅ Customize for your retail store!

---

## 💡 Tips

- **Auto-focus works everywhere** - just start scanning
- **Stock updates in real-time** - inventory always accurate
- **Atomic transactions** - no partial sales, ever
- **Responsive design** - works on tablet, phone, desktop

---

**Happy selling! 🛒**
