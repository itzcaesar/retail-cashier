# 📦 Tablet-Based POS System — MVP Documentation

This documentation defines the **features, scope, architecture, and structure** of a tablet-based Point of Sale (POS) system. It is written for **AI coding assistants (Cursor / GitHub Copilot)** and human developers to consistently validate scope and implementation.

---

## 1. Project Overview

**Project Type:** Point of Sale (POS) System
**Primary Platform (MVP):** Android tablet / phone
**Secondary Platform (Scalable):** Desktop / Laptop (Windows, macOS, Linux)
**Input Methods:** Bluetooth / USB barcode scanner (HID / keyboard mode)

### Objective

Build a **device-agnostic POS system** that works on tablets, phones, and computers, starting with tablet-first UX but designed to **scale seamlessly to desktop environments** without rewriting core logic.

---

## 2. Target Users

* Small retail store owners
* Cashiers with minimal technical experience
* Tablet-only checkout environments

---

## 3. MVP Scope Definition

### In Scope (MVP)

* Barcode & QR scanning via Bluetooth scanner
* Cart-based checkout flow
* Cash payment handling
* Automatic inventory deduction
* Product creation during checkout
* Internal QR code generation
* Daily sales reporting

### Out of Scope (Explicitly Excluded)

* QRIS / digital payments
* Loyalty or membership system
* Multi-branch support
* Advanced analytics or charts
* Receipt printing

---

## 4. Core Features

### 4.1 Checkout / Sales

* Scan product barcode or QR code
* Add item to cart automatically
* Increase quantity on repeated scans
* Display real-time subtotal and total
* Complete checkout with cash payment
* Persist transaction data

---

### 4.2 Product Management

* Add product when scanned code is not found
* Auto-fill scanned barcode or QR code
* Required fields:

  * Product name
  * Price
  * Initial stock
* Edit product price and stock

---

### 4.3 Inventory Management

* Automatic stock deduction on checkout
* Manual stock adjustment (restock / correction)
* Low-stock indicator

---

### 4.4 QR Code System

* Auto-generate internal QR codes using `product_id`
* QR content references internal product ID only
* Support bulk QR generation via CSV upload
* Export printable QR labels as PDF

---

### 4.5 Sales Reporting

* Daily total sales amount
* Number of transactions per day
* Top-selling products (basic ranking)

---

## 5. UX & POS Rules

* Checkout requires **zero manual typing per item**
* Always-on scan input field (auto-focused)
* Input auto-refocus after every scan or action
* Large buttons and large text
* No complex navigation or nested menus

---

## 6. Hardware Integration

### Barcode Scanner

* Bluetooth or USB barcode scanner
* HID / keyboard emulation mode
* Works identically on:

  * Android tablets / phones
  * Desktop browsers (Windows, macOS, Linux)
* Scanner inputs terminate with ENTER key
* No SDK, drivers, or OS-specific dependencies

### Supported Devices

* Android tablet (primary MVP device)
* Android phone (fallback)
* Desktop / laptop with keyboard and mouse (future scale)

### Device Setup

* Fullscreen / kiosk-style mode (tablet)
* Windowed or fullscreen mode (desktop)
* App pinning / kiosk mode recommended where supported

---

## 7. Technical Architecture

### Architecture Principle

* **Single codebase** for all devices
* **Web-first, device-agnostic design**
* Business logic centralized in backend
* UI adapts based on screen size and input method

---

### Frontend

* Web-based POS (PWA-style)
* Built with React or Next.js
* Responsive layout:

  * Tablet-first UI
  * Desktop-optimized layout enabled via breakpoints
* Keyboard-first interaction support

---

### Backend

* Node.js + Express
* REST API architecture
* Stateless services
* Atomic transaction handling

---

### Database

* PostgreSQL
* Designed for:

  * Single store (MVP)
  * Multi-terminal setup (future)

---

## 8. Data Models (High-Level)

### Products

* id
* name
* price
* stock
* barcode
* qr_code

### Transactions

* id
* total_amount
* payment_method
* created_at

### Transaction Items

* id
* transaction_id
* product_id
* quantity
* price_at_sale

---

## 9. Core API Responsibilities

* Lookup product by barcode or QR
* Create product
* Create transaction (atomic)
* Deduct inventory on checkout
* Fetch daily sales report

---

## 10. POS Checkout Flow (Critical Path)

This checkout flow must work **identically on tablet and desktop**.

1. Scanner scans code (Bluetooth or USB)
2. Input field captures value
3. System looks up product (barcode or QR)
4. Item added to cart
5. Quantity increments on repeated scans
6. Total updates instantly
7. Cash checkout triggered
8. Transaction saved atomically
9. Inventory deducted

---

## 11. Success Criteria

* Cashier can complete checkout without touching the screen during scanning
* Inventory remains accurate after every sale
* POS handles busy checkout periods reliably
* Non-technical users can operate the system within 5 minutes

---

## 12. Future Extensions (Post-MVP)

### Platform & Scale

* Desktop-optimized POS layout
* Multi-terminal per store
* Centralized cloud sync

### Payments

* QRIS integration
* Card payments

### Reliability

* Offline-first mode with sync queue
* Automatic recovery from network failure

### Operations

* Receipt printing (USB / Bluetooth)
* Supplier & purchase order module

---

## 13. AI Assistant Instructions

* Do NOT implement out-of-scope features
* Prioritize checkout speed and stability
* Favor simple, predictable UI behavior
* Treat this system as a real retail POS, not a demo app

---

**End of MVP Documentation**
