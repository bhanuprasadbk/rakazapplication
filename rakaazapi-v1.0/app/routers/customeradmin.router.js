const customersController = require("../controllers/customeradmin.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)
    app.post('/api/get-customer-admins', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.getAllCustomerAdmins);
    app.get('/api/customer-admins/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.getCustomerAdminById);
    app.get('/api/customer-admins/email/:email', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.getCustomerAdminByEmail);
    app.get('/api/customer-admins/admin-type/:adminTypeId', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.getCustomerAdminsByAdminType);
    
    // Admin-only routes
    app.post('/api/customer-admins', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.createCustomerAdmin);
    app.put('/api/customer-admins/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.updateCustomerAdmin);
    app.delete('/api/customer-admins/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customersController.deleteCustomerAdmin);
}; 