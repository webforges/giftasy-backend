Tech Stack

Backend framework → Express.js

Database → MongoDB Atlas (with Mongoose ODM)

Auth → JWT + bcrypt

Payments → Razorpay SDK

Security → Helmet, CORS, Rate-limit, Compression

Logging → Morgan (HTTP logger)

Language → TypeScript

Project Structure
/src
├── config/
│ ├── db.ts # MongoDB connection
│ └── env.ts # dotenv + typed config
├── middlewares/
│ ├── auth.ts # JWT auth middleware
│ └── errorHandler.ts # Global error handler
├── models/
│ ├── User.ts # User schema
│ ├── Order.ts # Order schema
├── routes/
│ ├── auth.routes.ts # /auth/_
│ ├── order.routes.ts # /orders/_
│ ├── payment.routes.ts # /payments/\*
├── controllers/
│ ├── auth.controller.ts
│ ├── order.controller.ts
│ ├── payment.controller.ts
├── utils/
│ ├── generateToken.ts # JWT helper
│ └── hashPassword.ts # bcrypt helpers
├── app.ts # Express app config
└── server.ts # Entry point

Features

✅ User registration & login (with password hashing)

✅ JWT-based protected routes

✅ Order CRUD (linked to user)

✅ Razorpay integration (create order, verify signature, webhook support)

✅ Security best practices (Helmet, CORS, rate limiting, error handling)

📦 What each does

express → backend framework

mongoose → MongoDB ODM

dotenv → environment variables

cors → cross-origin requests

helmet → secure HTTP headers

morgan → request logging

compression → gzip for performance

cookie-parser → parse cookies

bcrypt → password hashing

jsonwebtoken → JWT authentication

validator / express-validator → input validation

rate-limit → prevent brute force & DDoS

express-mongo-sanitize → prevent MongoDB injection

xss-clean → prevent XSS attacks

hpp → prevent HTTP param pollution

razorpay → payments

nodemon → auto-restart in dev
