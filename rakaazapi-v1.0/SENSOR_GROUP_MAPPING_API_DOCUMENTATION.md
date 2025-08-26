# Sensor Group Mapping API Documentation

## Overview
The Sensor Group Mapping API provides CRUD operations for managing the relationship between sensor types, sensor groups, customers, and devices. This API allows you to create, read, update, and delete mappings that define which sensor types and groups are associated with specific customers and devices.

## Base URL
```
http://localhost:3002/api/sensor-group-mappings
```

## Authentication
All endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Required Roles
- Customer Admin
- Super Admin

## Endpoints

### 1. Get All Sensor Group Mappings

**GET** `/api/sensor-group-mappings`

Retrieves all sensor group mappings with related information.

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mappings fetched successfully",
  "data": [
    {
      "id": 1,
      "sensor_type": 1,
      "sensor_group": 1,
      "customer_id": 1,
      "device_id": 1,
      "status": "active",
      "is_deleted": 0,
      "created_on": "2024-01-01T00:00:00.000Z",
      "created_by": 1,
      "modified_by": null,
      "modified_on": null,
      "sensor_type_name": "Temperature Sensor",
      "sensor_group_name": "Environmental Sensors",
      "customer_name": "ABC Company",
      "device_name": "Device 001"
    }
  ]
}
```

### 2. Get Sensor Group Mapping by ID

**GET** `/api/sensor-group-mappings/:id`

Retrieves a specific sensor group mapping by its ID.

**Parameters:**
- `id` (path parameter): The ID of the sensor group mapping

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mapping fetched successfully",
  "data": {
    "id": 1,
    "sensor_type": 1,
    "sensor_group": 1,
    "customer_id": 1,
    "device_id": 1,
    "status": "active",
    "is_deleted": 0,
    "created_on": "2024-01-01T00:00:00.000Z",
    "created_by": 1,
    "modified_by": null,
    "modified_on": null,
    "sensor_type_name": "Temperature Sensor",
    "sensor_group_name": "Environmental Sensors",
    "customer_name": "ABC Company",
    "device_name": "Device 001"
  }
}
```

### 3. Get Sensor Group Mappings by Customer

**GET** `/api/sensor-group-mappings/customer/:customerId`

Retrieves all sensor group mappings for a specific customer.

**Parameters:**
- `customerId` (path parameter): The ID of the customer

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mappings fetched successfully",
  "data": [
    {
      "id": 1,
      "sensor_type": 1,
      "sensor_group": 1,
      "customer_id": 1,
      "device_id": 1,
      "status": "active",
      "sensor_type_name": "Temperature Sensor",
      "sensor_group_name": "Environmental Sensors",
      "customer_name": "ABC Company",
      "device_name": "Device 001"
    }
  ]
}
```

### 4. Get Sensor Group Mappings by Device

**GET** `/api/sensor-group-mappings/device/:deviceId`

Retrieves all sensor group mappings for a specific device.

**Parameters:**
- `deviceId` (path parameter): The ID of the device

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mappings fetched successfully",
  "data": [
    {
      "id": 1,
      "sensor_type": 1,
      "sensor_group": 1,
      "customer_id": 1,
      "device_id": 1,
      "status": "active",
      "sensor_type_name": "Temperature Sensor",
      "sensor_group_name": "Environmental Sensors",
      "customer_name": "ABC Company",
      "device_name": "Device 001"
    }
  ]
}
```

### 5. Get Sensor Group Mappings by Sensor Group

**GET** `/api/sensor-group-mappings/sensor-group/:sensorGroupId`

Retrieves all sensor group mappings for a specific sensor group.

**Parameters:**
- `sensorGroupId` (path parameter): The ID of the sensor group

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mappings fetched successfully",
  "data": [
    {
      "id": 1,
      "sensor_type": 1,
      "sensor_group": 1,
      "customer_id": 1,
      "device_id": 1,
      "status": "active",
      "sensor_type_name": "Temperature Sensor",
      "sensor_group_name": "Environmental Sensors",
      "customer_name": "ABC Company",
      "device_name": "Device 001"
    }
  ]
}
```

### 6. Get Sensor Group Mappings by Status

**GET** `/api/sensor-group-mappings/status/:status`

Retrieves all sensor group mappings with a specific status.

**Parameters:**
- `status` (path parameter): The status to filter by (e.g., "active", "inactive")

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mappings fetched successfully",
  "data": [
    {
      "id": 1,
      "sensor_type": 1,
      "sensor_group": 1,
      "customer_id": 1,
      "device_id": 1,
      "status": "active",
      "sensor_type_name": "Temperature Sensor",
      "sensor_group_name": "Environmental Sensors",
      "customer_name": "ABC Company",
      "device_name": "Device 001"
    }
  ]
}
```

### 7. Check Sensor Group Availability

**GET** `/api/sensor-group-mappings/check-availability/:sensorGroupId/:customerId`

Checks if a sensor group is available for mapping to a specific customer.

**Parameters:**
- `sensorGroupId` (path parameter): The ID of the sensor group to check
- `customerId` (path parameter): The ID of the customer to check availability for

**Response:**
```json
{
  "success": true,
  "message": "Sensor group is available for mapping",
  "data": {
    "sensor_group_id": 1,
    "customer_id": 1,
    "available": true,
    "status": "available",
    "mapped_customers": []
  }
}
```

**Alternative Response (when already mapped to other customer):**
```json
{
  "success": true,
  "message": "Sensor group is already mapped to other customer(s): 2, 3",
  "data": {
    "sensor_group_id": 1,
    "customer_id": 1,
    "available": false,
    "status": "mapped_to_other_customer",
    "mapped_customers": ["2", "3"]
  }
}
```

### 8. Create Sensor Group Mapping

**POST** `/api/sensor-group-mappings`

Creates a new sensor group mapping.

**Request Body:**
```json
{
  "sensor_type": 1,
  "sensor_group": 1,
  "customer_id": 1,
  "device_id": 1,
  "status": "active"
}
```

**Required Fields:**
- `sensor_type`: ID of the sensor type (foreign key to tbl_sensors)
- `sensor_group`: ID of the sensor group (foreign key to tbl_sensor_group)
- `customer_id`: ID of the customer (foreign key to tbl_customer)
- `device_id`: ID of the device (foreign key to tbl_devices)

**Optional Fields:**
- `status`: Status of the mapping (defaults to "active")

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mapping created successfully",
  "data": {
    "id": 1
  }
}
```

### 9. Update Sensor Group Mapping

**PUT** `/api/sensor-group-mappings/:id`

Updates an existing sensor group mapping.

**Parameters:**
- `id` (path parameter): The ID of the sensor group mapping to update

**Request Body:**
```json
{
  "sensor_type": 2,
  "sensor_group": 1,
  "customer_id": 1,
  "device_id": 1,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mapping updated successfully"
}
```

### 10. Update Sensor Group Mapping Status

**PATCH** `/api/sensor-group-mappings/:id/status`

Updates only the status of a sensor group mapping.

**Parameters:**
- `id` (path parameter): The ID of the sensor group mapping

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mapping status updated successfully"
}
```

### 11. Delete Sensor Group Mapping

**DELETE** `/api/sensor-group-mappings/:id`

Soft deletes a sensor group mapping (sets is_deleted to 1).

**Parameters:**
- `id` (path parameter): The ID of the sensor group mapping to delete

**Response:**
```json
{
  "success": true,
  "message": "Sensor group mapping deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "sensor_type, sensor_group, customer_id, and device_id are required"
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
  "message": "Sensor group mapping not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Sensor group mapping already exists for this combination"
}
```

```json
{
  "success": false,
  "message": "Sensor group is already mapped to other customer(s): 2, 3. A sensor group can only be mapped to one customer."
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

## Database Schema

The API works with the following table structure:

```sql
CREATE TABLE tbl_sensor_group_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sensor_type INT NOT NULL,
    sensor_group INT NOT NULL,
    customer_id INT NOT NULL,
    device_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    is_deleted TINYINT(1) DEFAULT 0,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    modified_by INT NULL,
    modified_on TIMESTAMP NULL,
    FOREIGN KEY (sensor_type) REFERENCES tbl_sensors(id),
    FOREIGN KEY (sensor_group) REFERENCES tbl_sensor_group(id),
    FOREIGN KEY (customer_id) REFERENCES tbl_customer(id),
    FOREIGN KEY (device_id) REFERENCES tbl_devices(id)
);
```

## Usage Examples

### Create a new mapping
```bash
curl -X POST http://localhost:3002/api/sensor-group-mappings \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_type": 1,
    "sensor_group": 1,
    "customer_id": 1,
    "device_id": 1,
    "status": "active"
  }'
```

### Get mappings for a specific customer
```bash
curl -X GET http://localhost:3002/api/sensor-group-mappings/customer/1 \
  -H "Authorization: Bearer <your_token>"
```

### Update a mapping status
```bash
curl -X PATCH http://localhost:3002/api/sensor-group-mappings/1/status \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'
```

### Check sensor group availability
```bash
curl -X GET http://localhost:3002/api/sensor-group-mappings/check-availability/1/1 \
  -H "Authorization: Bearer <your_token>"
```

## Notes

1. **Soft Delete**: The delete operation performs a soft delete by setting `is_deleted` to 1, preserving data integrity.
2. **Duplicate Prevention**: The API prevents creating duplicate mappings for the same combination of sensor_type, sensor_group, customer_id, and device_id.
3. **Customer Exclusivity**: A sensor group can only be mapped to one customer at a time. The API prevents mapping a sensor group to multiple customers.
4. **Audit Trail**: All operations maintain audit trails with created_by, created_on, modified_by, and modified_on fields.
5. **Foreign Key Validation**: Ensure that all referenced IDs (sensor_type, sensor_group, customer_id, device_id) exist in their respective tables before creating mappings.
6. **Status Values**: Common status values include "active", "inactive", "pending", and "suspended".
