# Rakaz API

A comprehensive Node.js REST API with JWT authentication for managing cities, countries, states, customers, users, and roles.

## Features

- 🔐 **JWT Authentication** - Secure user and customer authentication
- 👥 **Role-Based Access Control** - Admin and Super Admin roles
- 🗺️ **Geographic Data Management** - Countries, States, Cities
- 👤 **User Management** - System users with roles
- 🏢 **Customer Management** - Customer organizations
- 📝 **Comprehensive Logging** - Winston logger with file rotation
- 🔒 **Protected Routes** - Authentication middleware for sensitive operations
- 📚 **Complete API Documentation** - Detailed endpoint documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rakaz_api_28072025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASS=your_db_password
   MYSQL_DB=rakaz_dev
   
   # JWT Configuration
   SECRET_KEY=your-super-secret-jwt-key-here
   REFRESH_SECRET_KEY=your-refresh-token-secret-key-here
   
   # Server Configuration
   PORT=3002
   NODE_ENV=development
   ```

4. **Set up the database**
   - Create a MySQL database named `rakaz_dev`
   - Import the database schema from `schemas.htm` or use the provided SQL structure
   - Ensure the database tables are created with proper relationships

5. **Start the server**
   ```bash
   npm start
   # or
   node server.js
   ```

## Database Setup

The API requires the following MySQL tables:

- `tbl_cities` - Cities with state relationships
- `tbl_countries` - Countries with phone codes
- `tbl_states` - States with country relationships
- `tbl_users` - System users with roles
- `tbl_customer_admins` - Customer organizations
- `tbl_roles` - User roles
- `tbl_customer_admin_type` - Customer admin types

### Optional: Refresh Token Table

For enhanced security, create a refresh token table:

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

## Authentication

### User Types

1. **System Users** (`tbl_users`)
   - Internal system users
   - Have roles (Admin, Super Admin, User)
   - Passwords are hashed with bcrypt

2. **Customers** (`tbl_customer_admins`)
   - External customer organizations
   - Have admin types
   - Passwords should be hashed in production

### Getting Started with Authentication

1. **Create a test user**
   ```sql
   INSERT INTO tbl_roles (name) VALUES ('Admin');
   INSERT INTO tbl_users (name, email, username, password_hash, role_id, is_active) 
   VALUES ('Admin User', 'admin@example.com', 'admin', 
           '$2a$10$hashedpassword', 1, 1);
   ```

2. **Login to get a token**
   ```bash
   curl -X POST http://localhost:3002/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "password123"
     }'
   ```

3. **Use the token for authenticated requests**
   ```bash
   curl -X GET http://localhost:3002/api/users \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## API Endpoints

### Public Endpoints (No Authentication Required)

- `POST /api/auth/login` - User login
- `POST /api/auth/customer-login` - Customer login
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/cities` - Get all cities
- `GET /api/countries` - Get all countries
- `GET /api/states` - Get all states
- `GET /api/roles` - Get all roles

### Protected Endpoints (Authentication Required)

- `GET /api/users` - Get all users (Admin/Super Admin)
- `GET /api/customers` - Get all customers (Admin/Super Admin)
- `POST /api/cities` - Create city (Admin/Super Admin)
- `PUT /api/cities/:id` - Update city (Admin/Super Admin)
- `DELETE /api/cities/:id` - Delete city (Admin/Super Admin)
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

## Testing

### Run the test script
```bash
node test_auth.js
```

### Manual Testing with curl

1. **Login**
   ```bash
   curl -X POST http://localhost:3002/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "password": "password123"}'
   ```

2. **Get users (with token)**
   ```bash
   curl -X GET http://localhost:3002/api/users \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Get public data (no token needed)**
   ```bash
   curl -X GET http://localhost:3002/api/cities
   ```

## Project Structure

```
rakaz_api_28072025/
├── app/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/              # API controllers
│   │   ├── cities.controller.js
│   │   ├── countries.controller.js
│   │   ├── customers.controller.js
│   │   ├── login.controller.js
│   │   ├── roles.controller.js
│   │   ├── states.controller.js
│   │   └── users.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT authentication middleware
│   ├── models/                   # Database models
│   │   ├── cities.model.js
│   │   ├── countries.model.js
│   │   ├── customers.model.js
│   │   ├── login.model.js
│   │   ├── roles.model.js
│   │   ├── states.model.js
│   │   └── users.model.js
│   ├── routers/                  # API routes
│   │   ├── cities.router.js
│   │   ├── countries.router.js
│   │   ├── customers.router.js
│   │   ├── login.router.js
│   │   ├── roles.router.js
│   │   ├── states.router.js
│   │   └── users.router.js
│   └── logger/
│       └── logger.js             # Winston logger configuration
├── logs/                         # Application logs
├── server.js                     # Main application file
├── package.json
├── API_DOCUMENTATION.md          # Complete API documentation
├── AUTHENTICATION_GUIDE.md       # Authentication guide
├── test_auth.js                  # Authentication test script
└── README.md                     # This file
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Role-Based Authorization** - Fine-grained access control
- **Token Validation** - Database-backed token verification
- **Refresh Tokens** - Secure token refresh mechanism
- **Input Validation** - Request data validation
- **Error Handling** - Comprehensive error management
- **Logging** - Security event logging

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USER` | MySQL username | - |
| `DB_PASS` | MySQL password | - |
| `MYSQL_DB` | Database name | rakaz_dev |
| `SECRET_KEY` | JWT secret key | - |
| `REFRESH_SECRET_KEY` | Refresh token secret | - |
| `PORT` | Server port | 3002 |
| `NODE_ENV` | Environment | development |

## Dependencies

### Core Dependencies
- `express` - Web framework
- `mysql` - MySQL database driver
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `winston` - Logging

### Development Dependencies
- `axios` - HTTP client (for testing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the API documentation in `API_DOCUMENTATION.md`
- Review the authentication guide in `AUTHENTICATION_GUIDE.md`
- Run the test script to verify functionality
- Check the logs in the `logs/` directory

## Changelog

### v1.0.0
- Initial release
- JWT authentication system
- Complete CRUD operations for all entities
- Role-based access control
- Comprehensive API documentation 