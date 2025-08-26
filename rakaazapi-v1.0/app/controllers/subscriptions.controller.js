const subscriptionsModel = require('../models/subscriptions.model');
const logger = require('../logger/logger');
const errorlog = require('../logger/logger').errorlog;
const successlog = require('../logger/logger').successlog;

module.exports = {
    // Get all subscriptions
    getAllSubscriptions: async (req, res) => {
        try {
            const { customer_id } = req.body;
            subscriptionsModel.getAllSubscriptions(customer_id, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching subscriptions:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching subscriptions',
                        error: error.message
                    });
                }
                successlog.info('Subscriptions fetched successfully');
                return res.status(200).json({
                    success: true,
                    message: 'Subscriptions fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getAllSubscriptions:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get subscription by ID
    getSubscriptionById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required'
                });
            }

            subscriptionsModel.getSubscriptionById(id, (error, result) => {
                if (error) {
                    errorlog.error('Error fetching subscription by ID:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching subscription',
                        error: error.message
                    });
                }
                
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Subscription not found'
                    });
                }

                successlog.info(`Subscription fetched with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscription fetched successfully',
                    data: result
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSubscriptionById:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get subscriptions by status
    getSubscriptionsByStatus: async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            subscriptionsModel.getSubscriptionsByStatus(status, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching subscriptions by status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching subscriptions by status',
                        error: error.message
                    });
                }
                successlog.info(`Subscriptions fetched for status: ${status}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscriptions fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSubscriptionsByStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get subscriptions by payment provider
    getSubscriptionsByPaymentProvider: async (req, res) => {
        try {
            const { paymentProvider } = req.params;
            
            if (!paymentProvider) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment provider is required'
                });
            }

            subscriptionsModel.getSubscriptionsByPaymentProvider(paymentProvider, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching subscriptions by payment provider:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching subscriptions by payment provider',
                        error: error.message
                    });
                }
                successlog.info(`Subscriptions fetched for payment provider: ${paymentProvider}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscriptions fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSubscriptionsByPaymentProvider:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Create new subscription with descriptions
    createSubscription: async (req, res) => {
        try {
            console.log("createSubscription",req.body);
            const {
                plan_name, currency, price, period, payment_provider, 
                status, descriptions, created_by, modified_by
            } = req.body;
            

            if (!plan_name || !currency || !price || !period || !payment_provider || !created_by) {
                return res.status(400).json({
                    success: false,
                    message: 'plan_name, currency, price, period, payment_provider, and created_by are required'
                });
            }

            const subscriptionData = {
                plan_name,
                currency,
                price,
                period,
                payment_provider,
                status,
                descriptions: descriptions || [],
                created_by,
                modified_by
            };
            
            subscriptionsModel.createSubscription(subscriptionData, (error, insertId) => {
                if (error) {
                    errorlog.error('Error creating subscription:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error creating subscription',
                        error: error.message
                    });
                }
                successlog.info(`Subscription created with ID: ${insertId}`);
                return res.status(201).json({
                    success: true,
                    message: 'Subscription created successfully',
                    data: { 
                        id: insertId, 
                        plan_name, 
                        currency, 
                        price, 
                        period, 
                        payment_provider, 
                        status: status || 'active',
                        descriptions: descriptions || []
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in createSubscription:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update subscription with descriptions
    updateSubscription: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                plan_name, currency, price, period, payment_provider, 
                status, descriptions, modified_by
            } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required'
                });
            }

            if (!plan_name || !currency || !price || !period || !payment_provider || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'plan_name, currency, price, period, payment_provider, and modified_by are required'
                });
            }

            const subscriptionData = {
                plan_name,
                currency,
                price,
                period,
                payment_provider,
                status,
                descriptions: descriptions || [],
                modified_by
            };
            
            subscriptionsModel.updateSubscription(id, subscriptionData, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating subscription:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating subscription',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Subscription not found'
                    });
                }

                successlog.info(`Subscription updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscription updated successfully',
                    data: { 
                        id, 
                        plan_name, 
                        currency, 
                        price, 
                        period, 
                        payment_provider, 
                        status,
                        descriptions: descriptions || []
                    }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSubscription:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete subscription
    deleteSubscription: async (req, res) => {
        try {
            console.log("deleteSubscription",req.body);
            const { id, modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required'
                });
            }

            if (!modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'modified_by is required'
                });
            }

            subscriptionsModel.deleteSubscription(id, modified_by, (error, deleted) => {
                if (error) {
                    errorlog.error('Error deleting subscription:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error deleting subscription',
                        error: error.message
                    });
                }
                
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Subscription not found'
                    });
                }

                successlog.info(`Subscription deleted with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscription deleted successfully'
                });
            });
        } catch (error) {
            errorlog.error('Exception in deleteSubscription:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update subscription status
    updateSubscriptionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, modified_by } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required'
                });
            }

            if (!status || !modified_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Status and modified_by are required'
                });
            }

            subscriptionsModel.updateSubscriptionStatus(id, status, modified_by, (error, updated) => {
                if (error) {
                    errorlog.error('Error updating subscription status:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating subscription status',
                        error: error.message
                    });
                }
                
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Subscription not found'
                    });
                }

                successlog.info(`Subscription status updated with ID: ${id}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscription status updated successfully',
                    data: { id, status }
                });
            });
        } catch (error) {
            errorlog.error('Exception in updateSubscriptionStatus:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get subscription descriptions
    getSubscriptionDescriptions: async (req, res) => {
        try {
            const { subscriptionId } = req.params;
            
            if (!subscriptionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required'
                });
            }

            subscriptionsModel.getSubscriptionDescriptions(subscriptionId, (error, results) => {
                if (error) {
                    errorlog.error('Error fetching subscription descriptions:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching subscription descriptions',
                        error: error.message
                    });
                }
                successlog.info(`Subscription descriptions fetched for ID: ${subscriptionId}`);
                return res.status(200).json({
                    success: true,
                    message: 'Subscription descriptions fetched successfully',
                    data: results
                });
            });
        } catch (error) {
            errorlog.error('Exception in getSubscriptionDescriptions:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}; 