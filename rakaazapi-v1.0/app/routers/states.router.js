const statesController = require("../controllers/states.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/states', statesController.getAllStates);
    app.get('/api/states/country/:countryId', statesController.getStatesByCountry);
    app.get('/api/states/:id', statesController.getStateById);
    
    // Protected routes (authentication required)
    app.post('/api/states', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), statesController.createState);
    app.put('/api/states/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), statesController.updateState);
    app.delete('/api/states/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), statesController.deleteState);
}; 