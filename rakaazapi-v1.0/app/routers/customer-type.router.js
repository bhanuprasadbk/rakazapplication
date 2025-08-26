const customerTypeController = require("../controllers/customer-type.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/customer-types', customerTypeController.getAllCustomerTypes);
    app.get('/api/customer-types/:id', customerTypeController.getCustomerTypeById);
    app.get('/api/customer-types/name/:name', customerTypeController.getCustomerTypeByName);
    
    // Protected routes (authentication required)
    app.post('/api/customer-types', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerTypeController.createCustomerType);
    app.put('/api/customer-types/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerTypeController.updateCustomerType);
    app.delete('/api/customer-types', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), customerTypeController.deleteCustomerType);
}; 