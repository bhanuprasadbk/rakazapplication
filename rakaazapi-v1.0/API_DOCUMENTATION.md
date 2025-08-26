# Rakaz API Documentation

This document provides comprehensive documentation for all the API endpoints in the Rakaz system.

## Base URL
```
http://localhost:3002/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. There are two types of users:
- **System Users** (from `tbl_users` table)
- **Customers** (from `tbl_customer_admins` table)

### Getting a JWT Token

#### User Login
- **URL:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Customer Login
- **URL:** `POST /api/auth/customer-login`
- **Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

### Using JWT Tokens

Include the JWT token in the Authorization header for all protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```

### Token Refresh
- **URL:** `POST /api/auth/refresh-token`
- **Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

## API Endpoints

### Authentication Endpoints

#### User Login
- **URL:** `POST /api/auth/login`
- **Description:** Authenticate system user
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
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

#### Customer Login
- **URL:** `POST /api/auth/customer-login`
- **Description:** Authenticate customer
- **Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```
- **Response:**
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

#### Refresh Token
- **URL:** `POST /api/auth/refresh-token`
- **Description:** Get new access token using refresh token
- **Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response:**
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

#### Get User Profile
- **URL:** `GET /api/auth/profile`
- **Description:** Get current user profile (requires authentication)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role_name": "Admin",
    "customer_name": "ABC Corp"
  }
}
```

#### Change Password
- **URL:** `POST /api/auth/change-password`
- **Description:** Change user password (requires authentication)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Logout
- **URL:** `POST /api/auth/logout`
- **Description:** Logout user (requires authentication)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 1. Cities Management

**Authentication:** Read operations are public, write operations require Admin/Super Admin role.

#### Get All Cities
- **URL:** `GET /api/cities`
- **Description:** Retrieve all cities (Public - No authentication required)
- **Response:**
```json
{
  "success": true,
  "message": "Cities fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "New York",
      "state_id": 1
    }
  ]
}
```

#### Get Cities by State
- **URL:** `GET /api/cities/state/:stateId`
- **Description:** Retrieve all cities for a specific state
- **Parameters:** `stateId` (integer)
- **Response:** Same as Get All Cities

#### Get City by ID
- **URL:** `GET /api/cities/:id`
- **Description:** Retrieve a specific city by ID
- **Parameters:** `id` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "City fetched successfully",
  "data": {
    "id": 1,
    "name": "New York",
    "state_id": 1
  }
}
```

#### Create City
- **URL:** `POST /api/cities`
- **Description:** Create a new city (Requires Admin/Super Admin role)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "New City",
  "state_id": 1
}
```
- **Response:**
```json
{
  "success": true,
  "message": "City created successfully",
  "data": {
    "id": 2,
    "name": "New City",
    "state_id": 1
  }
}
```

#### Update City
- **URL:** `PUT /api/cities/:id`
- **Description:** Update an existing city (Requires Admin/Super Admin role)
- **Headers:** `Authorization: Bearer <token>`
- **Parameters:** `id` (integer)
- **Body:** Same as Create City
- **Response:** Same as Create City

#### Delete City
- **URL:** `DELETE /api/cities/:id`
- **Description:** Delete a city (Requires Admin/Super Admin role)
- **Headers:** `Authorization: Bearer <token>`
- **Parameters:** `id` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "City deleted successfully"
}
```

### 2. Countries Management

#### Get All Countries
- **URL:** `GET /api/countries`
- **Description:** Retrieve all countries
- **Response:**
```json
{
  "success": true,
  "message": "Countries fetched successfully",
  "data": [
    {
      "id": 1,
      "shortname": "US",
      "name": "United States",
      "phonecode": 1
    }
  ]
}
```

#### Get Country by ID
- **URL:** `GET /api/countries/:id`
- **Description:** Retrieve a specific country by ID
- **Parameters:** `id` (integer)

#### Get Country by Shortname
- **URL:** `GET /api/countries/shortname/:shortname`
- **Description:** Retrieve a country by its shortname
- **Parameters:** `shortname` (string, e.g., "US")

#### Create Country
- **URL:** `POST /api/countries`
- **Description:** Create a new country
- **Body:**
```json
{
  "shortname": "CA",
  "name": "Canada",
  "phonecode": 1
}
```

#### Update Country
- **URL:** `PUT /api/countries/:id`
- **Description:** Update an existing country
- **Parameters:** `id` (integer)
- **Body:** Same as Create Country

#### Delete Country
- **URL:** `DELETE /api/countries/:id`
- **Description:** Delete a country
- **Parameters:** `id` (integer)

### 3. Customer Admin Types Management

#### Get All Customer Admin Types
- **URL:** `GET /api/customer-admin-types`
- **Description:** Retrieve all customer admin types
- **Response:**
```json
{
  "success": true,
  "message": "Customer admin types fetched successfully",
  "data": [
    {
      "id": 1,
      "cust_admin_type": "Super Admin"
    }
  ]
}
```

#### Get Customer Admin Type by ID
- **URL:** `GET /api/customer-admin-types/:id`
- **Description:** Retrieve a specific customer admin type by ID
- **Parameters:** `id` (integer)

#### Get Customer Admin Type by Name
- **URL:** `GET /api/customer-admin-types/name/:name`
- **Description:** Retrieve a customer admin type by name
- **Parameters:** `name` (string)

#### Create Customer Admin Type
- **URL:** `POST /api/customer-admin-types`
- **Description:** Create a new customer admin type
- **Body:**
```json
{
  "cust_admin_type": "New Admin Type"
}
```

#### Update Customer Admin Type
- **URL:** `PUT /api/customer-admin-types/:id`
- **Description:** Update an existing customer admin type
- **Parameters:** `id` (integer)
- **Body:** Same as Create Customer Admin Type

#### Delete Customer Admin Type
- **URL:** `DELETE /api/customer-admin-types/:id`
- **Description:** Delete a customer admin type
- **Parameters:** `id` (integer)

### 4. Customers Management

#### Get All Customers
- **URL:** `GET /api/customers`
- **Description:** Retrieve all customers with related data
- **Response:**
```json
{
  "success": true,
  "message": "Customers fetched successfully",
  "data": [
    {
      "id": 1,
      "organization_name": "ABC Corp",
      "contact_person_name": "John Doe",
      "customer_admin_name": "Admin User",
      "email": "admin@abccorp.com",
      "contact_number": "+1234567890",
      "customer_admin_type": 1,
      "currency": "USD",
      "address": "123 Main St",
      "country_id": 1,
      "state_id": 1,
      "city_id": 1,
      "created_by": 1,
      "created_on": "2025-01-01T00:00:00.000Z",
      "modified_by": null,
      "modified_on": "2025-01-01T00:00:00.000Z",
      "cust_admin_type": "Super Admin",
      "country_name": "United States",
      "state_name": "New York",
      "city_name": "New York"
    }
  ]
}
```

#### Get Customer by ID
- **URL:** `GET /api/customers/:id`
- **Description:** Retrieve a specific customer by ID
- **Parameters:** `id` (integer)

#### Get Customer by Email
- **URL:** `GET /api/customers/email/:email`
- **Description:** Retrieve a customer by email
- **Parameters:** `email` (string)

#### Get Customers by Admin Type
- **URL:** `GET /api/customers/admin-type/:adminTypeId`
- **Description:** Retrieve all customers for a specific admin type
- **Parameters:** `adminTypeId` (integer)

#### Create Customer
- **URL:** `POST /api/customers`
- **Description:** Create a new customer
- **Body:**
```json
{
  "organization_name": "New Corp",
  "contact_person_name": "Jane Doe",
  "customer_admin_name": "Admin User",
  "email": "admin@newcorp.com",
  "contact_number": "+1234567890",
  "customer_admin_type": 1,
  "currency": "USD",
  "password": "hashedpassword",
  "address": "456 Oak St",
  "country_id": 1,
  "state_id": 1,
  "city_id": 1,
  "created_by": 1
}
```

#### Update Customer
- **URL:** `PUT /api/customers/:id`
- **Description:** Update an existing customer
- **Parameters:** `id` (integer)
- **Body:** Same as Create Customer (with `modified_by` instead of `created_by`)

#### Delete Customer
- **URL:** `DELETE /api/customers/:id`
- **Description:** Delete a customer
- **Parameters:** `id` (integer)

### 5. Roles Management

#### Get All Roles
- **URL:** `GET /api/roles`
- **Description:** Retrieve all roles
- **Response:**
```json
{
  "success": true,
  "message": "Roles fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Admin"
    }
  ]
}
```

#### Get Role by ID
- **URL:** `GET /api/roles/:id`
- **Description:** Retrieve a specific role by ID
- **Parameters:** `id` (integer)

#### Get Role by Name
- **URL:** `GET /api/roles/name/:name`
- **Description:** Retrieve a role by name
- **Parameters:** `name` (string)

#### Create Role
- **URL:** `POST /api/roles`
- **Description:** Create a new role
- **Body:**
```json
{
  "name": "New Role"
}
```

#### Update Role
- **URL:** `PUT /api/roles/:id`
- **Description:** Update an existing role
- **Parameters:** `id` (integer)
- **Body:** Same as Create Role

#### Delete Role
- **URL:** `DELETE /api/roles/:id`
- **Description:** Delete a role
- **Parameters:** `id` (integer)

### 6. States Management

#### Get All States
- **URL:** `GET /api/states`
- **Description:** Retrieve all states
- **Response:**
```json
{
  "success": true,
  "message": "States fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "New York",
      "country_id": 1
    }
  ]
}
```

#### Get States by Country
- **URL:** `GET /api/states/country/:countryId`
- **Description:** Retrieve all states for a specific country
- **Parameters:** `countryId` (integer)

#### Get State by ID
- **URL:** `GET /api/states/:id`
- **Description:** Retrieve a specific state by ID
- **Parameters:** `id` (integer)

#### Create State
- **URL:** `POST /api/states`
- **Description:** Create a new state
- **Body:**
```json
{
  "name": "New State",
  "country_id": 1
}
```

#### Update State
- **URL:** `PUT /api/states/:id`
- **Description:** Update an existing state
- **Parameters:** `id` (integer)
- **Body:** Same as Create State

#### Delete State
- **URL:** `DELETE /api/states/:id`
- **Description:** Delete a state
- **Parameters:** `id` (integer)

### 7. Users Management

#### Get All Users
- **URL:** `GET /api/users`
- **Description:** Retrieve all users with related data
- **Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "password_hash": "hashedpassword",
      "role_id": 1,
      "customer_id": 1,
      "is_active": 1,
      "created_at": "2025-01-01T00:00:00.000Z",
      "role_name": "Admin",
      "customer_name": "ABC Corp"
    }
  ]
}
```

#### Get User by ID
- **URL:** `GET /api/users/:id`
- **Description:** Retrieve a specific user by ID
- **Parameters:** `id` (integer)

#### Get User by Email
- **URL:** `GET /api/users/email/:email`
- **Description:** Retrieve a user by email
- **Parameters:** `email` (string)

#### Get User by Username
- **URL:** `GET /api/users/username/:username`
- **Description:** Retrieve a user by username
- **Parameters:** `username` (string)

#### Get Users by Role
- **URL:** `GET /api/users/role/:roleId`
- **Description:** Retrieve all users for a specific role
- **Parameters:** `roleId` (integer)

#### Get Users by Customer
- **URL:** `GET /api/users/customer/:customerId`
- **Description:** Retrieve all users for a specific customer
- **Parameters:** `customerId` (integer)

#### Create User
- **URL:** `POST /api/users`
- **Description:** Create a new user
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "username": "janedoe",
  "password_hash": "hashedpassword",
  "role_id": 1,
  "customer_id": 1,
  "is_active": 1
}
```

#### Update User
- **URL:** `PUT /api/users/:id`
- **Description:** Update an existing user
- **Parameters:** `id` (integer)
- **Body:** Same as Create User

#### Delete User
- **URL:** `DELETE /api/users/:id`
- **Description:** Delete a user
- **Parameters:** `id` (integer)

#### Update User Status
- **URL:** `PATCH /api/users/:id/status`
- **Description:** Update user active status
- **Parameters:** `id` (integer)
- **Body:**
```json
{
  "is_active": 0
}
```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Required field is missing"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Database Relationships

The API supports the following relationships:

1. **Countries** → **States** (One-to-Many)
2. **States** → **Cities** (One-to-Many)
3. **Countries** → **Customers** (One-to-Many)
4. **States** → **Customers** (One-to-Many)
5. **Cities** → **Customers** (One-to-Many)
6. **Customer Admin Types** → **Customers** (One-to-Many)
7. **Roles** → **Users** (One-to-Many)
8. **Customers** → **Users** (One-to-Many)

## Notes

- All timestamps are in ISO 8601 format
- Passwords should be hashed before sending to the API
- The API uses JWT tokens for authentication
- All endpoints return JSON responses
- Error handling is consistent across all endpoints
- The API supports CORS for cross-origin requests 