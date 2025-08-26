const usersController = require("../controllers/users.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    app.get('/api/users', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getAllUsers);
    app.get('/api/users/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getUserById);
    app.get('/api/users/email/:email', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getUserByEmail);
    app.get('/api/users/username/:username', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getUserByUsername);
    app.get('/api/users/role/:roleId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getUsersByRole);
    app.get('/api/users/customer/:customerId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.getUsersByCustomer);
    
    // Admin-only routes
    app.post('/api/users', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.createUser);
    app.put('/api/users/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.updateUser);
    app.delete('/api/users/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.deleteUser);
    app.patch('/api/users/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), usersController.updateUserStatus);
}; 