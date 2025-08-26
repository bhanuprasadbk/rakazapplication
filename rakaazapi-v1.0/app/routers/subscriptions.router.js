const subscriptionsController = require("../controllers/subscriptions.controller");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");

module.exports = app => {
    // Protected routes (authentication required)    
    app.get('/api/subscriptions/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.getSubscriptionById);
    app.get('/api/subscriptions/status/:status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.getSubscriptionsByStatus);
    app.get('/api/subscriptions/payment-provider/:paymentProvider', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.getSubscriptionsByPaymentProvider);
    app.get('/api/subscriptions/:subscriptionId/descriptions', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.getSubscriptionDescriptions);
    
    // Admin-only routes
    app.post('/api/get-subscriptions', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.getAllSubscriptions);
    app.post('/api/subscriptions', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.createSubscription);
    app.put('/api/subscriptions/:id', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.updateSubscription);
    app.delete('/api/subscriptions', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.deleteSubscription);
    app.patch('/api/subscriptions/:id/status', authenticateToken, authorizeRole(['Customer Admin', 'Super Admin']), subscriptionsController.updateSubscriptionStatus);
}; 