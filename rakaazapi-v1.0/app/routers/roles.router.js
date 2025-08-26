const rolesController = require("../controllers/roles.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/roles', rolesController.getAllRoles);
    app.get('/api/roles/:id', rolesController.getRoleById);
    app.get('/api/roles/name/:name', rolesController.getRoleByName);
    
    // Protected routes (authentication required)
    app.post('/api/roles', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), rolesController.createRole);
    app.put('/api/roles/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), rolesController.updateRole);
    app.delete('/api/roles/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), rolesController.deleteRole);
}; 