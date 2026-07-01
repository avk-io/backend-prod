# Marketplace API

A production-grade REST API for a marketplace application with JWT authentication, role-based access control, and full CRUD operations.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (access + refresh tokens)
- **Security:** bcrypt, Helmet, CORS, rate limiting

## Features

- User registration and login with bcrypt password hashing
- JWT authentication with access token (15m) and refresh token (7d) rotation
- Refresh token hashing and session binding (IP + User-Agent)
- Role-based access control (buyer/seller)
- Full CRUD for listings
- API versioning (`/api/v1`)
- Rate limiting on auth routes
- Swagger API documentation

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
git clone https://github.com/avk-io/backend-prod.git
cd backend-prod
npm install
```

### Environment Variables

Create a `.env` file in the root:

MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=3001

### Run

```bash
npm run dev      # development
npm start        # production
```

## API Documentation

Swagger UI available at `/api-docs`

- Local: http://localhost:3001/api-docs
- Production: https://backend-prod-production-3a48.up.railway.app/api-docs

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/signup | No | Register user |
| POST | /api/v1/auth/login | No | Login user |
| POST | /api/v1/auth/refresh | No | Refresh access token |
| POST | /api/v1/auth/logout | No | Logout user |
| GET | /api/v1/listings | No | Get all listings |
| GET | /api/v1/listings/:id | No | Get single listing |
| POST | /api/v1/listings | Yes (seller) | Create listing |
| DELETE | /api/v1/listings/:id | Yes (seller) | Delete listing |

## Scalability

This API is structured for horizontal scaling. Each request is stateless — JWT tokens carry identity, and refresh tokens are stored hashed in MongoDB. The modular architecture (routes → controllers → models) allows new features to be added independently. For production scale, this can be extended with Redis for token blacklisting and session caching, a message queue (Bull/RabbitMQ) for async tasks, and deployed behind a load balancer with multiple Node instances. Docker support can be added with a single Dockerfile.