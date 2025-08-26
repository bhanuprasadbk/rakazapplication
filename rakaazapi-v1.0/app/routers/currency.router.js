const currencyController = require("../controllers/currency.countroller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Public routes (read-only)
    app.get('/api/currencies', currencyController.getCurrencies);
}; 