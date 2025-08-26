const countriesController = require("../controllers/countries.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/countries', countriesController.getAllCountries);
    app.get('/api/countries/:id', countriesController.getCountryById);
    app.get('/api/countries/shortname/:shortname', countriesController.getCountryByShortname);
    
    // Protected routes (authentication required)
    app.post('/api/countries', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), countriesController.createCountry);
    app.put('/api/countries/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), countriesController.updateCountry);
    app.delete('/api/countries/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), countriesController.deleteCountry);
}; 