# JWT Authentication Guide

This guide explains how to use the JWT authentication system implemented in the Rakaz API.

## Overview

The API uses JWT (JSON Web Tokens) for authentication and authorization. There are two types of users:
- **System Users** (from `tbl_users` table)
- **Customers** (from `tbl_customer_admins` table)

## Authentication Flow

### 1. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role_name": "Admin",
      "customer_name": "ABC Corp"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 2. Customer Login

**Endpoint:** `POST /api/auth/customer-login`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "customer": {
      "id": 1,
      "organization_name": "ABC Corp",
      "customer_admin_name": "Admin User",
      "email": "customer@example.com",
      "cust_admin_type": "Super Admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## Using JWT Tokens

### Authorization Header

Include the JWT token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request

```bash
curl -X GET \
  http://localhost:3002/api/users \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

## Protected Endpoints

### Public Endpoints (No Authentication Required)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/customer-login` - Customer login
- `POST /api/auth/refresh-token` - Refresh access token

#### Read-Only Data
- `GET /api/cities` - Get all cities
- `GET /api/cities/:id` - Get city by ID
- `GET /api/cities/state/:stateId` - Get cities by state
- `GET /api/countries` - Get all countries
- `GET /api/countries/:id` - Get country by ID
- `GET /api/countries/shortname/:shortname` - Get country by shortname
- `GET /api/states` - Get all states
- `GET /api/states/:id` - Get state by ID
- `GET /api/states/country/:countryId` - Get states by country
- `GET /api/customer-admin-types` - Get all customer admin types
- `GET /api/customer-admin-types/:id` - Get customer admin type by ID
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID

### Protected Endpoints (Authentication Required)

#### User Management (Admin/Super Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/status` - Update user status

#### Customer Management (Admin/Super Admin Only)
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

#### Master Data Management (Admin/Super Admin Only)
- `POST /api/cities` - Create new city
- `PUT /api/cities/:id` - Update city
- `DELETE /api/cities/:id` - Delete city
- `POST /api/countries` - Create new country
- `PUT /api/countries/:id` - Update country
- `DELETE /api/countries/:id` - Delete country
- `POST /api/states` - Create new state
- `PUT /api/states/:id` - Update state
- `DELETE /api/states/:id` - Delete state
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role
- `POST /api/customer-admin-types` - Create new customer admin type
- `PUT /api/customer-admin-types/:id` - Update customer admin type
- `DELETE /api/customer-admin-types/:id` - Delete customer admin type

#### User Profile (Authenticated Users)
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

## Role-Based Authorization

The system supports role-based access control:

### Available Roles
- **Admin** - Full system access
- **Super Admin** - Full system access
- **User** - Limited access (based on implementation)

### Role Authorization

Endpoints are protected using role-based middleware:

```javascript
// Example: Only Admin and Super Admin can access
app.get('/api/users', authenticateToken, authorizeRole(['Admin', 'Super Admin']), usersController.getAllUsers);
```

## Token Management

### Access Token
- **Expiration:** 24 hours
- **Purpose:** API access
- **Format:** JWT

### Refresh Token
- **Expiration:** 7 days
- **Purpose:** Get new access token
- **Format:** JWT

### Token Refresh

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## Password Management

### Change Password

**Endpoint:** `POST /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Responses

### Authentication Errors

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### 403 Insufficient Permissions
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Login Errors

#### 401 Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Security Features

### Password Hashing
- User passwords are hashed using bcrypt
- Salt rounds: 10
- Customer passwords should be hashed in production

### Token Security
- Tokens are signed with a secret key
- Tokens include user information and expiration
- Database validation for token authenticity

### Rate Limiting
Consider implementing rate limiting for login endpoints to prevent brute force attacks.

## Environment Variables

Set these environment variables in your `.env` file:

```env
SECRET_KEY=your-jwt-secret-key-here
REFRESH_SECRET_KEY=your-refresh-token-secret-key-here
```

## Database Requirements

### Required Tables
- `tbl_users` - System users
- `tbl_customer_admins` - Customer accounts
- `tbl_roles` - User roles
- `tbl_customer_admin_type` - Customer admin types

### Optional Tables (for refresh tokens)
- `user_refresh_tokens` - Store refresh tokens

```sql
CREATE TABLE user_refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE CASCADE
);
```

## Best Practices

### Client-Side
1. Store tokens securely (HttpOnly cookies or secure storage)
2. Implement automatic token refresh
3. Clear tokens on logout
4. Handle authentication errors gracefully

### Server-Side
1. Use HTTPS in production
2. Implement proper CORS settings
3. Set secure cookie flags
4. Log authentication events
5. Implement account lockout for failed attempts

### Token Security
1. Keep secret keys secure
2. Rotate keys periodically
3. Use short expiration times for access tokens
4. Implement token blacklisting for logout

## Example Implementation

### Frontend (JavaScript)

```javascript
// Login
async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Store token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return data.data.user;
    } else {
        throw new Error(data.message);
    }
}

// API call with token
async function apiCall(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    if (response.status === 401) {
        // Token expired, try to refresh
        await refreshToken();
        // Retry the request
        return apiCall(url, options);
    }
    
    return response.json();
}

// Refresh token
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('token', data.data.token);
    } else {
        // Redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
}
```

This authentication system provides secure, scalable authentication for your Rakaz API with proper role-based access control and token management. 