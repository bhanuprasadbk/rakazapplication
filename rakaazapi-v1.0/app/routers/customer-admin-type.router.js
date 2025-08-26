const customerAdminTypeController = require("../controllers/customer-admin-type.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/customer-admin-types', customerAdminTypeController.getAllCustomerAdminTypes);
    app.get('/api/customer-admin-types/:id', customerAdminTypeController.getCustomerAdminTypeById);
    app.get('/api/customer-admin-types/name/:name', customerAdminTypeController.getCustomerAdminTypeByName);
    
    // Protected routes (authentication required)
    app.post('/api/customer-admin-types', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerAdminTypeController.createCustomerAdminType);
    app.put('/api/customer-admin-types/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerAdminTypeController.updateCustomerAdminType);
    app.delete('/api/customer-admin-types', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerAdminTypeController.deleteCustomerAdminType);
}; 