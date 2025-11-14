# Loan Monitoring API

A secure, role-based loan application management system built with Node.js, Express, TypeScript, and Firebase Admin SDK. This API enables users to submit loan applications, loan officers to review them, and managers to make final approval decisions.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Request Examples](#api-request-examples)
- [Security Configuration](#security-configuration)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Project Overview

The Loan Monitoring API is designed to streamline the loan application process with a three-tier workflow:

1. **Users** submit loan applications
2. **Loan Officers** review applications and add notes
3. **Managers** make final approval/rejection decisions

The API implements robust security features including JWT authentication, role-based access control (RBAC), CORS protection, and Helmet security headers.

### Why This API?

- **Role-Based Access Control**: Ensures users can only access resources appropriate to their role
- **Secure Authentication**: Firebase Admin SDK for enterprise-grade authentication
- **Audit Trail**: Track who reviewed and approved each loan application
- **RESTful Design**: Clean, predictable API endpoints following REST principles
- **Comprehensive Documentation**: Full OpenAPI 3.0 documentation with interactive Swagger UI

---

## Features

- **User Management**
  - User authentication via Firebase JWT tokens
  - Custom claims for role assignment (user, officer, manager)
  - User listing with pagination

- **Loan Application Workflow**
  - Create loan applications (Users)
  - Review applications with notes (Loan Officers)
  - Approve or reject applications (Managers)
  - Filter loans by status and user

- **Security**
  - JWT Bearer token authentication
  - Role-based authorization middleware
  - CORS protection with configurable origins
  - Helmet security headers
  - Environment variable management with dotenv

- **Logging & Monitoring**
  - Request logging with Morgan
  - Custom access and error logging
  - Health check endpoints

- **API Documentation**
  - Interactive Swagger UI
  - Complete OpenAPI 3.0 specification
  - Request/response examples
  - Authentication testing interface

---

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: Firebase Admin SDK
- **Database**: Firestore (Firebase)
- **Security**: Helmet, CORS
- **Logging**: Morgan, Winston
- **Documentation**: Swagger UI, swagger-jsdoc
- **Testing**: Jest, Supertest
- **Development**: ts-node, nodemon

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase project with Admin SDK credentials
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Cusiokhale/loan-monitoring-pixell-river.git
cd loan-monitoring-pixell-river
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `service-account-key.json` in the project root

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Alternative: Path to service account key file
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account-key.json

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration (production only)
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Swagger Documentation URL
SWAGGER_SERVER_URL=http://localhost:3000/api/v1
```

**Important**: Never commit `.env` or `service-account-key.json` to version control. These files are already listed in `.gitignore`.

---

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Yes | Your Firebase project ID | - |
| `FIREBASE_PRIVATE_KEY` | Yes* | Firebase service account private key | - |
| `FIREBASE_CLIENT_EMAIL` | Yes* | Firebase service account email | - |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Yes* | Path to service account JSON file | `./service-account-key.json` |
| `PORT` | No | Server port number | `3000` |
| `NODE_ENV` | No | Environment (development/production) | `development` |
| `ALLOWED_ORIGINS` | No** | Comma-separated list of allowed CORS origins | - |
| `SWAGGER_SERVER_URL` | No | Base URL for Swagger documentation | `http://localhost:3000/api/v1` |

\* Either provide individual Firebase credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`) OR use `FIREBASE_SERVICE_ACCOUNT_PATH`
\*\* Required in production for CORS protection

---

## Running the Application

### Development Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
NODE_ENV=production node dist/app.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## API Documentation

### Interactive Documentation (Swagger UI)

When running the application locally, access the interactive API documentation at:

**URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Interactive "Try it out" functionality
- Authentication testing with JWT tokens
- Multiple request examples per endpoint

### Public Documentation

The API documentation is also deployed to GitHub Pages for public access:

**Live Documentation**: [https://cusiokhale.github.io/loan-monitoring-pixell-river/](https://cusiokhale.github.io/loan-monitoring-pixell-river/)

### Accessing Local Documentation

1. Start the application:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api-docs
   ```

3. To test authenticated endpoints:
   - Click the **Authorize** button (top right)
   - Enter your Firebase JWT token in the format: `Bearer <your-token>`
   - Click **Authorize**
   - Now you can test protected endpoints using "Try it out"

---

## API Request Examples

Below are examples of how to make requests to the API using different tools and programming languages.

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All endpoints (except `/` and `/health`) require authentication. Include your Firebase JWT token in the `Authorization` header:

```
Authorization: Bearer <your-firebase-jwt-token>
```

---

### Example 1: Create a Loan Application

**Endpoint**: `POST /loans`
**Required Role**: `user`

#### cURL

```bash
curl -X POST http://localhost:3000/api/v1/loans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "amount": 50000,
    "purpose": "Home renovation"
  }'
```

#### JavaScript (Fetch)

```javascript
fetch('http://localhost:3000/api/v1/loans', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({
    amount: 50000,
    purpose: 'Home renovation'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python (Requests)

```python
import requests

url = "http://localhost:3000/api/v1/loans"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
data = {
    "amount": 50000,
    "purpose": "Home renovation"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

#### Node.js (Axios)

```javascript
const axios = require('axios');

const createLoan = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/loans',
      {
        amount: 50000,
        purpose: 'Home renovation'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

createLoan();
```

**Expected Response** (201 Created):

```json
{
  "message": "Loan created successfully",
  "loan": {
    "id": "loan123abc",
    "userId": "user456def",
    "amount": 50000,
    "purpose": "Home renovation",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Example 2: Get All Loans with Filters

**Endpoint**: `GET /loans`
**Required Roles**: `officer`, `manager`

#### cURL

```bash
curl -X GET "http://localhost:3000/api/v1/loans?status=pending&userId=user456def" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript (Fetch)

```javascript
const params = new URLSearchParams({
  status: 'pending',
  userId: 'user456def'
});

fetch(`http://localhost:3000/api/v1/loans?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python (Requests)

```python
import requests

url = "http://localhost:3000/api/v1/loans"
headers = {
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
params = {
    "status": "pending",
    "userId": "user456def"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```

**Expected Response** (200 OK):

```json
{
  "count": 2,
  "loans": [
    {
      "id": "loan123abc",
      "userId": "user456def",
      "amount": 50000,
      "purpose": "Home renovation",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "loan789ghi",
      "userId": "user456def",
      "amount": 25000,
      "purpose": "Car purchase",
      "status": "pending",
      "createdAt": "2024-01-16T14:20:00Z"
    }
  ]
}
```

---

### Example 3: Review a Loan Application

**Endpoint**: `PUT /loans/:id/review`
**Required Role**: `officer`

#### cURL

```bash
curl -X PUT http://localhost:3000/api/v1/loans/loan123abc/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "notes": "Documents verified, customer has excellent credit history. Recommending for approval."
  }'
```

#### JavaScript (Fetch)

```javascript
fetch('http://localhost:3000/api/v1/loans/loan123abc/review', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({
    notes: 'Documents verified, customer has excellent credit history. Recommending for approval.'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Node.js (Axios)

```javascript
const axios = require('axios');

const reviewLoan = async (loanId) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/v1/loans/${loanId}/review`,
      {
        notes: 'Documents verified, customer has excellent credit history. Recommending for approval.'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

reviewLoan('loan123abc');
```

**Expected Response** (200 OK):

```json
{
  "message": "Loan reviewed successfully",
  "loan": {
    "id": "loan123abc",
    "userId": "user456def",
    "amount": 50000,
    "purpose": "Home renovation",
    "status": "under_review",
    "createdAt": "2024-01-15T10:30:00Z",
    "reviewedBy": "officer789ghi"
  },
  "notes": "Documents verified, customer has excellent credit history. Recommending for approval."
}
```

---

### Example 4: Set User Claims (Admin)

**Endpoint**: `POST /admin/users/:userId/claims`
**Required Role**: Authenticated user

#### cURL

```bash
curl -X POST http://localhost:3000/api/v1/admin/users/user123abc/claims \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "role": "officer"
  }'
```

#### Python (Requests)

```python
import requests

url = "http://localhost:3000/api/v1/admin/users/user123abc/claims"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
data = {
    "role": "officer"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

**Expected Response** (200 OK):

```json
{
  "message": "User claims set successfully",
  "user": {
    "uid": "user123abc",
    "email": "user@example.com",
    "customClaims": {
      "role": "officer"
    }
  }
}
```

---

### Health Check Endpoints

#### Check Server Health

```bash
curl http://localhost:3000/health
```

**Response**: `Server is healthy`

#### Root Endpoint

```bash
curl http://localhost:3000/
```

**Response**: `Hello, Cordelia! Application is Working!`

---

## Security Configuration

### CORS Configuration

The API implements environment-specific CORS policies to protect against unauthorized cross-origin requests.

**Location**: [`src/config/corsConfig.ts`](src/config/corsConfig.ts)

#### Development Mode

In development (`NODE_ENV=development`), CORS is configured to allow all origins for easy testing:

```typescript
{
  origin: true,              // Allow all origins
  credentials: true          // Allow credentials (cookies, auth headers)
}
```

**Why**: During development, you may need to test the API from various origins (localhost:3000, localhost:3001, etc.) without restrictions.

#### Production Mode

In production, CORS is strictly configured to only allow whitelisted origins:

```typescript
{
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [],  // Whitelist specific domains
  credentials: true,                                       // Allow credentials
  methods: ["GET", "POST", "PUT", "DELETE"],              // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"]       // Allowed headers
}
```

**Why**:
- **Security**: Prevents unauthorized websites from making requests to your API
- **Data Protection**: Only trusted origins can access sensitive loan and user data
- **Compliance**: Meets security requirements for production applications

**Configuration**:

Set the `ALLOWED_ORIGINS` environment variable in your `.env` file:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

### Helmet Security Headers

Helmet helps secure Express apps by setting various HTTP headers to protect against common vulnerabilities.

**Location**: [`src/config/helmetConfig.ts`](src/config/helmetConfig.ts)

#### Base Configuration (All Environments)

```typescript
{
  contentSecurityPolicy: false,  // Disabled for JSON APIs
  hidePoweredBy: true,           // Hide X-Powered-By header
  noSniff: true                  // Prevent MIME type sniffing
}
```

**Why**:
- **hidePoweredBy**: Removes `X-Powered-By: Express` header, making it harder for attackers to identify your tech stack
- **noSniff**: Sets `X-Content-Type-Options: nosniff` to prevent browsers from MIME-sniffing responses
- **contentSecurityPolicy**: Disabled because this is a JSON API, not serving HTML content

#### Development Mode

```typescript
{
  ...baseConfig,
  hsts: false  // HTTPS enforcement disabled
}
```

**Why**: In development, you typically use HTTP (not HTTPS), so HSTS is disabled.

#### Production Mode

```typescript
{
  ...baseConfig,
  hsts: {
    maxAge: 31536000,           // 1 year in seconds
    includeSubDomains: true,    // Apply to all subdomains
    preload: true               // Allow preload list inclusion
  },
  frameguard: {
    action: "deny"              // Prevent clickjacking
  },
  referrerPolicy: {
    policy: "no-referrer"       // Don't send referrer information
  }
}
```

**Why**:
- **HSTS (HTTP Strict Transport Security)**: Forces browsers to only connect via HTTPS for 1 year
  - `includeSubDomains`: Applies to all subdomains for comprehensive protection
  - `preload`: Allows inclusion in browser HSTS preload lists for maximum security

- **frameguard**: Sets `X-Frame-Options: DENY` to prevent your API from being embedded in iframes (clickjacking protection)

- **referrerPolicy**: Sets `Referrer-Policy: no-referrer` to prevent leaking sensitive information in the Referer header

---

### Environment Variable Security

**Best Practices Implemented**:

1. **Separation of Concerns**: All sensitive configuration is stored in `.env` file, separate from code

2. **Git Protection**: `.env` file is listed in `.gitignore` to prevent accidental commits

3. **Template File**: `.env.example` provides a template without sensitive data for team members

4. **Early Loading**: Environment variables are loaded at the very start of the application:
   ```typescript
   // app.ts - First lines
   import * as dotenv from "dotenv";
   dotenv.config();
   ```

5. **Validation**: Firebase configuration validates required environment variables on startup

**Setup Instructions**:

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials:
   ```env
   FIREBASE_PROJECT_ID=your-actual-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   ```

3. **Never commit** `.env` or `service-account-key.json` to version control

4. For production deployments, set environment variables through your hosting platform's dashboard (e.g., Heroku Config Vars, AWS Systems Manager, etc.)

---

## Project Structure

```
loan-monitoring-pixell-river/
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── controllers/        # Request handlers
│   │       │   ├── admin.ts
│   │       │   └── loans.ts
│   │       ├── middleware/         # Custom middleware
│   │       │   ├── authenticate.ts
│   │       │   ├── authorize.ts
│   │       │   ├── errorHandler.ts
│   │       │   └── logger.ts
│   │       ├── routes/             # Route definitions
│   │       │   ├── admin.ts
│   │       │   └── loans.ts
│   │       └── types/              # TypeScript types
│   │           └── index.ts
│   ├── config/                     # Configuration files
│   │   ├── corsConfig.ts
│   │   ├── firebaseConfig.ts
│   │   ├── helmetConfig.ts
│   │   ├── swagger.ts
│   │   └── swaggerOptions.ts
│   └── app.ts                      # Application entry point
├── .github/
│   └── workflows/
│       └── deploy-docs.yml         # GitHub Actions workflow
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## Testing

The project uses Jest and Supertest for testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are located in `__tests__` directories alongside the code they test:

```
src/
├── api/
│   └── v1/
│       ├── controllers/
│       │   ├── __tests__/
│       │   │   ├── admin.test.ts
│       │   │   └── loans.test.ts
```

---

## Deployment

### GitHub Pages (Documentation)

The API documentation is automatically deployed to GitHub Pages using GitHub Actions.

**Workflow**: [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml)

To manually trigger a documentation deployment:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy Documentation** workflow
4. Click **Run workflow**

The documentation will be available at: `https://cusiokhale.github.io/loan-monitoring-pixell-river/`

### Production Deployment

For deploying the API to production, you can use platforms like:

- **Heroku**: `git push heroku main`
- **Railway**: Connect your GitHub repository
- **AWS**: Use Elastic Beanstalk or ECS
- **Google Cloud**: Use App Engine or Cloud Run
- **Azure**: Use App Service

**Important**: Set all required environment variables in your hosting platform's configuration before deploying.

---

## API Endpoints Summary

### Loans

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/loans` | user | Create a new loan application |
| GET | `/api/v1/loans` | officer, manager | Get all loans with optional filters |
| PUT | `/api/v1/loans/:id/review` | officer | Review a loan application |
| PUT | `/api/v1/loans/:id/approve` | manager | Approve or reject a loan |

### Admin

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/admin/:userId` | authenticated | Get user details by ID |
| GET | `/api/v1/admin/users` | authenticated | List all users (paginated) |
| POST | `/api/v1/admin/users/:userId/claims` | authenticated | Set user role and custom claims |

### Health

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/` | none | Root endpoint (health check) |
| GET | `/health` | none | Server health status |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features
- Update documentation as needed

---

## License

This project is licensed under the ISC License.

---

## Support

For issues, questions, or contributions, please:

- Open an issue on [GitHub](https://github.com/Cusiokhale/loan-monitoring-pixell-river/issues)
- Check the [API Documentation](https://cusiokhale.github.io/loan-monitoring-pixell-river/)
- Review the Swagger UI at `http://localhost:3000/api-docs` when running locally

---

## Acknowledgments

- Firebase Admin SDK for authentication and database
- Express.js community for excellent middleware
- Swagger/OpenAPI for API documentation standards
- All contributors and users of this project

---

**Built with ❤️ using Node.js, TypeScript, and Firebase**
