# Klantroef Media Platform (Node.js / Express / MySQL / Redis)

A backend microservice for managing media assets (audio/video) with secure streaming, analytics tracking, and JWT-based authentication. Admin users can upload media, generate temporary streaming links, and track who watched what and when.

## ✨ Features

* Admin signup/login with JWT authentication
* Media upload (video/audio) with metadata storage
* Stream media via secure 10-minute URLs
* Track media views (IP + timestamp)
* Aggregated analytics per media (total views, unique IPs, views per day)
* Redis caching for analytics
* Rate limiting for view logging
* JWT blacklist on logout
* Error handling middleware

## 🧭 Architecture

**High-level flow**

```
Client → Routes → Controllers → Services → Database (Prisma/MySQL) / Redis
```

**Data flow**

* `Controllers` handle HTTP requests and responses
* `Services` contain core business logic
* `Prisma` manages database interactions
* `Redis` caches analytics and stores blacklisted tokens
* `Middlewares` handle authentication, rate-limiting, file upload, and errors

🗂️ File Structure
The project follows a modular and organized structure to ensure maintainability and scalability.

backend/
├── .env.example              # Template for environment variables
├── .gitignore                # Specifies files to be ignored by Git
├── Dockerfile                # Docker configuration for the application
├── docker-compose.yml        # Docker Compose file for multi-container setup
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locks dependency versions for consistent installs
├── README.md                 # Project overview and documentation
│
├── prisma/                   # Prisma ORM setup
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration files
│
├── src/                      # Source code directory
│   ├── config/               # Configuration files
│   │   ├── prisma.js         # Prisma client configuration
│   │   └── redis.js          # Redis client configuration
│   │
│   ├── controllers/          # Handles incoming requests and business logic
│   │   ├── authController.js   # User authentication logic
│   │   └── mediaController.js  # Media-related operations (upload, retrieval)
│   │
│   ├── middlewares/          # Middleware functions for request processing
│   │   ├── authMiddleware.js     # Authentication and token validation
│   │   ├── errorMiddleware.js    # Centralized error handling
│   │   ├── rateLimitMiddleware.js  # API rate limiting
│   │   └── uploadMiddleware.js   # Handles media file uploads
│   │
│   ├── routes/               # API routes definitions
│   │   ├── authRoutes.js       # Routes for user authentication
│   │   └── mediaRoutes.js      # Routes for media operations
│   │
│   ├── services/             # Business logic and data manipulation
│   │   ├── authService.js      # Core authentication services
│   │   └── mediaService.js     # Core media services
│   │
│   └── utils/                # Utility functions
│       └── signer.js         # Cryptographic signing/token generation
│
├── tests/                    # Test files
│   ├── analyticsTest.js      # Tests for analytics functionality
│   ├── appTest.js            # General application tests
│   └── authTest.js           # Tests for authentication
│
└── uploads/                  # Directory for storing uploaded files


## 🔐 Authentication & Authorization

* `/auth/signup` → Register admin user
* `/auth/login` → Returns JWT token
* `/auth/logout` → Blacklist token in Redis (expires automatically)
* Protected routes check JWT and blacklist

## 🎥 Media Management

* `/media` (POST) → Upload media metadata
* `/media/:id/stream-url` (GET) → Returns secure 10-min streaming link
* `/media/:id/stream` → Streams the media file (used internally by the link)

## 📊 Analytics

* `/media/:id/view` (POST) → Log view with IP + timestamp, rate-limited
* `/media/:id/analytics` (GET) → Return total views, unique IPs, views per day
* Analytics cached in Redis for performance (10-minute TTL)

## ⚡ Additional Features

* Rate limiting for abuse prevention
* Redis caching for analytics
* JWT blacklisting on logout
* Centralized error handling middleware
* Automated tests using Jest

## ⚙️ Setup Steps

1. Clone the repo
2. Copy `.env.example` to `.env` and fill your environment variables
3. Install dependencies

   ```bash
   npm install
   ```
4. Generate Prisma client and migrate database

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the server

   ```bash
   npm run dev
   ```
6. Run tests

   ```bash
   npm test
   ```

## 🐳 Dockerization

* Build Docker image

  ```bash
  docker build -t klantroef-backend .
  ```
* Run container

  ```bash
  docker run -p 5000:5000 --env-file .env klantroef-backend
  ```

## 📝 Notes

* Secure streaming URLs are generated with time-limited JWT tokens
* Analytics queries use both MySQL (Prisma) and Redis caching
* Logout tokens are stored in Redis with TTL to enforce blacklisting
* Error and edge cases (missing media, invalid tokens) are handled gracefully
