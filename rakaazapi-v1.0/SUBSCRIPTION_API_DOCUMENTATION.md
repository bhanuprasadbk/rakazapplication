# Subscription API Documentation

## Overview
The Subscription API provides comprehensive CRUD operations for managing subscriptions and their descriptions. It handles both subscription data and multiple descriptions in single operations, ensuring data consistency through database transactions.

## Database Schema

### tbl_subscriptions
- `id` - Primary key
- `plan_name` - Name of the subscription plan
- `currency` - Currency code (e.g., USD, EUR)
- `price` - Price amount
- `period` - Billing period (e.g., monthly, yearly)
- `payment_provider` - Payment gateway (e.g., stripe, paypal)
- `status` - Subscription status (e.g., active, inactive, suspended)
- `is_deleted` - Soft delete flag
- `created_by` - User ID who created the subscription
- `created_on` - Creation timestamp
- `modified_by` - User ID who last modified the subscription
- `modified_on` - Last modification timestamp

### tbl_subscription_desc
- `id` - Primary key
- `subscription_id` - Foreign key to tbl_subscriptions
- `description` - Description text
- `created_by` - User ID who created the description
- `created_on` - Creation timestamp
- `modified_by` - User ID who last modified the description
- `modified_on` - Last modification timestamp

## API Endpoints

### Authentication
All endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

### 1. Get All Subscriptions
**GET** `/api/subscriptions`

Returns all active subscriptions with their descriptions.

**Response:**
```json
{
  "success": true,
  "message": "Subscriptions fetched successfully",
  "data": [
    {
      "id": 1,
      "plan_name": "Premium Plan",
      "currency": "USD",
      "price": 99.99,
      "period": "monthly",
      "payment_provider": "stripe",
      "status": "active",
      "is_deleted": 0,
      "created_by": 1,
      "created_on": "2024-01-01T00:00:00.000Z",
      "modified_by": 1,
      "modified_on": "2024-01-01T00:00:00.000Z",
      "descriptions": [
        "Unlimited access to all features",
        "24/7 customer support"
      ]
    }
  ]
}
```

### 2. Get Subscription by ID
**GET** `/api/subscriptions/:id`

Returns a specific subscription with its descriptions.

**Parameters:**
- `id` - Subscription ID

**Response:**
```json
{
  "success": true,
  "message": "Subscription fetched successfully",
  "data": {
    "id": 1,
    "plan_name": "Premium Plan",
    "currency": "USD",
    "price": 99.99,
    "period": "monthly",
    "payment_provider": "stripe",
    "status": "active",
    "descriptions": [
      "Unlimited access to all features",
      "24/7 customer support"
    ]
  }
}
```

### 3. Get Subscriptions by Status
**GET** `/api/subscriptions/status/:status`

Returns all subscriptions with a specific status.

**Parameters:**
- `status` - Subscription status (e.g., active, inactive)

### 4. Get Subscriptions by Payment Provider
**GET** `/api/subscriptions/payment-provider/:paymentProvider`

Returns all subscriptions using a specific payment provider.

**Parameters:**
- `paymentProvider` - Payment provider name (e.g., stripe, paypal)

### 5. Create Subscription
**POST** `/api/subscriptions`

Creates a new subscription with optional descriptions in a single operation.

**Request Body:**
```json
{
  "plan_name": "Premium Plan",
  "currency": "USD",
  "price": 99.99,
  "period": "monthly",
  "payment_provider": "stripe",
  "status": "active",
  "descriptions": [
    "Unlimited access to all features",
    "24/7 customer support",
    "Advanced analytics dashboard"
  ],
  "created_by": 1,
  "modified_by": 1
}
```

**Required Fields:**
- `plan_name`
- `currency`
- `price`
- `period`
- `payment_provider`
- `created_by`

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": 1,
    "plan_name": "Premium Plan",
    "currency": "USD",
    "price": 99.99,
    "period": "monthly",
    "payment_provider": "stripe",
    "status": "active",
    "descriptions": [
      "Unlimited access to all features",
      "24/7 customer support",
      "Advanced analytics dashboard"
    ]
  }
}
```

### 6. Update Subscription
**PUT** `/api/subscriptions/:id`

Updates an existing subscription and replaces all descriptions in a single operation.

**Parameters:**
- `id` - Subscription ID

**Request Body:**
```json
{
  "plan_name": "Premium Plan Plus",
  "currency": "USD",
  "price": 129.99,
  "period": "monthly",
  "payment_provider": "stripe",
  "status": "active",
  "descriptions": [
    "Unlimited access to all features",
    "24/7 customer support",
    "Advanced analytics dashboard",
    "Custom integrations"
  ],
  "modified_by": 1
}
```

**Required Fields:**
- `plan_name`
- `currency`
- `price`
- `period`
- `payment_provider`
- `modified_by`

### 7. Update Subscription Status
**PATCH** `/api/subscriptions/:id/status`

Updates only the status of a subscription.

**Parameters:**
- `id` - Subscription ID

**Request Body:**
```json
{
  "status": "inactive",
  "modified_by": 1
}
```

### 8. Get Subscription Descriptions
**GET** `/api/subscriptions/:subscriptionId/descriptions`

Returns all descriptions for a specific subscription.

**Parameters:**
- `subscriptionId` - Subscription ID

### 9. Delete Subscription
**DELETE** `/api/subscriptions/:id`

Soft deletes a subscription and removes all associated descriptions.

**Parameters:**
- `id` - Subscription ID

**Request Body:**
```json
{
  "modified_by": 1
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "plan_name, currency, price, period, payment_provider, and created_by are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Subscription not found"
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

## Usage Examples

### Creating a Subscription with Descriptions
```javascript
const subscriptionData = {
  plan_name: "Basic Plan",
  currency: "USD",
  price: 29.99,
  period: "monthly",
  payment_provider: "stripe",
  status: "active",
  descriptions: [
    "Basic features access",
    "Email support",
    "Standard dashboard"
  ],
  created_by: 1,
  modified_by: 1
};

const response = await fetch('/api/subscriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + jwtToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(subscriptionData)
});
```

### Updating a Subscription
```javascript
const updateData = {
  plan_name: "Basic Plan Plus",
  currency: "USD",
  price: 39.99,
  period: "monthly",
  payment_provider: "stripe",
  status: "active",
  descriptions: [
    "Basic features access",
    "Email support",
    "Standard dashboard",
    "Advanced reporting"
  ],
  modified_by: 1
};

const response = await fetch('/api/subscriptions/1', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + jwtToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});
```

## Important Notes

1. **Transaction Safety**: All create and update operations use database transactions to ensure data consistency between subscriptions and descriptions.

2. **Description Handling**: 
   - When creating a subscription, descriptions are optional
   - When updating a subscription, all existing descriptions are replaced with new ones
   - Descriptions are stored as separate records but retrieved as an array

3. **Soft Delete**: Subscriptions are soft deleted (is_deleted = 1) rather than physically removed from the database.

4. **Authentication**: All endpoints require valid JWT tokens and appropriate role permissions (Customer Admin or Super Admin).

5. **Validation**: The API validates required fields and returns appropriate error messages for missing or invalid data.

## Testing

Use the provided `test_subscription_api.js` file to test all API endpoints. Make sure to:
1. Install axios: `npm install axios`
2. Get a valid JWT token from the login endpoint
3. Update the `JWT_TOKEN` constant in the test file
4. Run the tests: `node test_subscription_api.js` 