# 🏦 Online Banking System

A Full Stack Online Banking System developed using **React.js, Node.js, Express.js, and MySQL** that allows users to securely manage their bank accounts online.

The application provides complete banking functionality including account creation, authentication, deposits, withdrawals, fund transfers, transaction history, profile management, password recovery using OTP, PDF bank statements, email notifications, and transaction analytics.


# 📌 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout
- Change Password
- Forgot Password using Email OTP
- Reset Password



## Banking Features

- Deposit Money
- Withdraw Money
- Transfer Money
- View Current Balance
- View Account Information
- View Transaction History
- Transaction Search
- Transaction Filtering
- Transaction Sorting
- Pagination
- Download Bank Statement (PDF)

---

## User Profile

- Edit Profile
- Upload Profile Photo
- View Profile Photo
- Change Profile Picture

---

## Email Services

Automatic email notifications are sent after

- Registration
- Deposit
- Withdrawal
- Money Transfer
- Password Reset OTP

using Nodemailer.

---

## Dashboard

Interactive dashboard displaying

- Current Balance
- Total Deposits
- Total Withdrawals
- Total Transfers
- Recent Transactions
- Bar Chart
- Doughnut Chart

---

# 🛠 Technologies Used

## Frontend

- React.js
- React Router DOM
- Axios
- Chart.js
- CSS

---

## Backend

- Node.js
- Express.js

---

## Database

- MySQL

---

## Authentication

- JWT (JSON Web Token)
- bcrypt

---

## Other Libraries

- Multer
- Nodemailer
- PDFKit
- dotenv
- CORS

---

# 📂 Project Structure


Online-Banking-System
│
├── backend
│   │
│   ├── config
│   │      db.js
│   │      multer.js
│   │
│   ├── controllers
│   │      authController.js
│   │      accountController.js
│   │
│   ├── middleware
│   │      authMiddleware.js
│   │
│   ├── models
│   │      userModel.js
│   │      accountModel.js
│   │      otpModel.js
│   │
│   ├── routes
│   │      authRoutes.js
│   │      accountRoutes.js
│   │
│   ├── utils
│   │      sendEmail.js
│   │
│   ├── uploads
│   │
│   ├── server.js
│   │
│   └── package.json
│
├── frontend
│   │
│   ├── api
│   │      axios.js
│   │
│   ├── components
│   │      Navbar
│   │      ProfileMenu
│   │      SummaryCard
│   │      InfoCard
│   │      TransactionChart
│   │      RecentTransactions
│   │
│   ├── context
│   │      AuthContext
│   │
│   ├── pages
│   │      Login
│   │      Register
│   │      Dashboard
│   │      Deposit
│   │      Withdraw
│   │      Transfer
│   │      Transactions
│   │      Profile
│   │      ChangePassword
│   │      ForgotPassword
│   │      VerifyOTP
│   │      ResetPassword
│   │
│   └── App.jsx


---

# 🔐 Authentication Flow


User Login

      │

      ▼

Backend verifies credentials

      │

      ▼

JWT Token Generated

      │

      ▼

Token stored in LocalStorage

      │

      ▼

Protected Routes use JWT

      │

      ▼

Backend Middleware verifies token

      │

      ▼

Authorized User


---

# 💰 Banking Workflow

## Deposit


User enters amount

↓

Frontend sends request

↓

Backend validates amount

↓

Database updates balance

↓

Transaction recorded

↓

Email notification sent

↓

Updated balance returned


---

## Withdraw


Enter Amount

↓

Balance Check

↓

Enough Balance?

↓

Yes

↓

Deduct Balance

↓

Save Transaction

↓

Send Email

↓

Success


---

## Transfer


Sender enters

Receiver Account Number

↓

Validate Receiver

↓

Validate Balance

↓

Database Transaction Begins

↓

Deduct Sender Balance

↓

Credit Receiver Balance

↓

Store Transaction

↓

Commit Transaction

↓

Email Notification

↓

Success


---

# 📊 Dashboard

Dashboard displays

- User Information
- Current Balance
- Total Deposit
- Total Withdraw
- Total Transfer
- Recent Transactions
- Transaction Charts

---

# 📄 Bank Statement

Users can download their complete transaction history as a PDF statement.

The PDF contains

- Account Details
- Transaction History
- Date
- Amount
- Transaction Type
- Description

---

# 📧 Email Notification

The system sends automatic emails after

- Deposit
- Withdraw
- Transfer
- OTP Generation

using


Nodemailer


---

# 🔑 Password Recovery


Forgot Password

↓

Enter Email

↓

Generate OTP

↓

Store OTP in Database

↓

Send OTP by Email

↓

Verify OTP

↓

Reset Password

↓

Delete OTP


---

# 📈 Charts

Dashboard includes

### Bar Chart

Shows

- Deposit
- Withdraw
- Transfer

comparison.

### Doughnut Chart

Shows percentage distribution of

- Deposits
- Withdrawals
- Transfers

---

# 🗄 Database Tables

## users

Stores

- Name
- Email
- Password
- Address
- Profile Image

---

## accounts

Stores

- Account Number
- User ID
- Balance
- Account Type
- Branch
- IFSC

---

## transactions

Stores

- Sender
- Receiver
- Amount
- Transaction Type
- Description
- Date

---

## password_otps

Stores

- Email
- OTP
- Expiry Time

---

# 🚀 Installation

## Backend

bash
cd backend

npm install

npm start


---

## Frontend

bash
cd frontend

npm install

npm run dev


---

# Environment Variables

Create


.env


inside backend

env
PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=your_password

DB_NAME=online_banking

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password


---

# API Endpoints

## Authentication


POST /api/auth/register

POST /api/auth/login

GET /api/auth/dashboard

PUT /api/auth/profile

PUT /api/auth/change-password

POST /api/auth/forgot-password

POST /api/auth/verify-otp

POST /api/auth/reset-password

POST /api/auth/upload-photo


---

## Banking


POST /api/account/deposit

POST /api/account/withdraw

POST /api/account/transfer

GET /api/account/transactions

GET /api/account/transactions/search

GET /api/account/statement

GET /api/account/summary


---

# Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Email OTP Verification
- Input Validation
- SQL Parameterized Queries
- Secure File Upload using Multer

---

# Future Improvements

- Admin Dashboard
- Mobile Banking Application
- Razorpay Payment Gateway
- Two Factor Authentication
- SMS OTP
- AI Based Fraud Detection
- Loan Management
- Fixed Deposit Module
- Internet Banking Beneficiary Management
- UPI Integration

---

# Author

**Manish Kumar**

B.Tech Computer Science & Engineering

National Institute of Technology Silchar

GitHub:
https://github.com/Manish-kumar0015

LinkedIn:
(Add your LinkedIn URL)
