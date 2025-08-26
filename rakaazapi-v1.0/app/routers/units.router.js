const unitController = require("../controllers/units.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/units', unitController.getAllUnits);
    app.get('/api/units/:id', unitController.getUnitById);
    app.get('/api/units/name/:name', unitController.getUnitByName);
    
    // Protected routes (authentication required)
    app.post('/api/units', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), unitController.createUnit);
    app.put('/api/units/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), unitController.updateUnit);
    app.delete('/api/units', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), unitController.deleteUnit);
}; 