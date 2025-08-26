const citiesController = require("../controllers/cities.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/cities', citiesController.getAllCities);
    app.get('/api/cities/state/:stateId', citiesController.getCitiesByState);
    app.get('/api/cities/:id', citiesController.getCityById);
    
    // Protected routes (authentication required)
    app.post('/api/cities', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), citiesController.createCity);
    app.put('/api/cities/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), citiesController.updateCity);
    app.delete('/api/cities/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), citiesController.deleteCity);
}; 