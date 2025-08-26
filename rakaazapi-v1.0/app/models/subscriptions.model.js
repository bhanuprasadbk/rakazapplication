const db = require('../config/db');

module.exports = {
    // Get all subscriptions with descriptions
    getAllSubscriptions: (customer_id,callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(sd.description SEPARATOR '||') as descriptions
            FROM tbl_subscriptions s
            LEFT JOIN tbl_subscription_desc sd ON s.id = sd.subscription_id
            WHERE s.is_deleted = 0 AND s.status = 'active' and s.created_by = ?
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, [customer_id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            // Parse descriptions back to array
            results.forEach(subscription => {
                if (subscription.descriptions) {
                    subscription.descriptions = subscription.descriptions.split('||');
                } else {
                    subscription.descriptions = [];
                }

                subscription.descriptions = subscription.descriptions.slice().reverse();
            });
            return callback(null, results);
        });
    },

    // Get subscription by ID with descriptions
    getSubscriptionById: (id, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(sd.description SEPARATOR '||') as descriptions
            FROM tbl_subscriptions s
            LEFT JOIN tbl_subscription_desc sd ON s.id = sd.subscription_id
            WHERE s.id = ? AND s.is_deleted = 0
            GROUP BY s.id
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length > 0) {
                const subscription = results[0];
                if (subscription.descriptions) {
                    subscription.descriptions = subscription.descriptions.split('||');
                } else {
                    subscription.descriptions = [];
                }
                return callback(null, subscription);
            }
            return callback(null, null);
        });
    },

    // Get subscriptions by status
    getSubscriptionsByStatus: (status, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(sd.description SEPARATOR '||') as descriptions
            FROM tbl_subscriptions s
            LEFT JOIN tbl_subscription_desc sd ON s.id = sd.subscription_id
            WHERE s.status = ? AND s.is_deleted = 0
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, [status], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            results.forEach(subscription => {
                if (subscription.descriptions) {
                    subscription.descriptions = subscription.descriptions.split('||');
                } else {
                    subscription.descriptions = [];
                }
            });
            return callback(null, results);
        });
    },

    // Get subscriptions by payment provider
    getSubscriptionsByPaymentProvider: (paymentProvider, callback) => {
        const query = `
            SELECT s.*, 
                   GROUP_CONCAT(sd.description SEPARATOR '||') as descriptions
            FROM tbl_subscriptions s
            LEFT JOIN tbl_subscription_desc sd ON s.id = sd.subscription_id
            WHERE s.payment_provider = ? AND s.is_deleted = 0
            GROUP BY s.id
            ORDER BY s.created_on DESC
        `;
        db.query(query, [paymentProvider], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            results.forEach(subscription => {
                if (subscription.descriptions) {
                    subscription.descriptions = subscription.descriptions.split('||');
                } else {
                    subscription.descriptions = [];
                }
            });
            return callback(null, results);
        });
    },

    // Create subscription with descriptions in single method
    createSubscription: (subscriptionData, callback) => {
        const { descriptions, ...subscriptionFields } = subscriptionData;
        
        db.getConnection((error, connection) => {
            if (error) {
                return callback(error, null);
            }

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                // Create subscription first
                const subscriptionQuery = `
                    INSERT INTO tbl_subscriptions (
                        plan_name, currency, price, period, payment_provider, 
                        status, created_by, modified_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const subscriptionValues = [
                    subscriptionFields.plan_name,
                    subscriptionFields.currency,
                    subscriptionFields.price,
                    subscriptionFields.period,
                    subscriptionFields.payment_provider,
                    subscriptionFields.status || 'active',
                    subscriptionFields.created_by,
                    subscriptionFields.modified_by || subscriptionFields.created_by
                ];
                
                connection.query(subscriptionQuery, subscriptionValues, (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(error, null);
                        });
                    }

                    const subscriptionId = results.insertId;

                    // If no descriptions, just return the subscription ID
                    if (!descriptions || descriptions.length === 0) {
                        return connection.commit((error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(error, null);
                                });
                            }
                            connection.release();
                            callback(null, subscriptionId);
                        });
                    }

                    // Create descriptions
                    let completed = 0;
                    let hasError = false;

                    descriptions.forEach((description) => {
                        const descQuery = `
                            INSERT INTO tbl_subscription_desc (
                                subscription_id, description, created_by, modified_by
                            ) VALUES (?, ?, ?, ?)
                        `;
                        const descValues = [
                            subscriptionId,
                            description.description,
                            subscriptionFields.created_by,
                            subscriptionFields.modified_by || subscriptionFields.created_by
                        ];

                        connection.query(descQuery, descValues, (error) => {
                            if (error) {
                                hasError = true;
                            }
                            completed++;

                            if (completed === descriptions.length) {
                                if (hasError) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(new Error('Failed to create some descriptions'), null);
                                    });
                                }
                                return connection.commit((error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            callback(error, null);
                                        });
                                    }
                                    connection.release();
                                    callback(null, subscriptionId);
                                });
                            }
                        });
                    });
                });
            });
        });
    },

    // Update subscription with descriptions in single method
    updateSubscription: (id, subscriptionData, callback) => {
        const { descriptions, ...subscriptionFields } = subscriptionData;
        
        db.getConnection((error, connection) => {
            if (error) {
                return callback(error, null);
            }

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                // Update subscription first
                const subscriptionQuery = `
                    UPDATE tbl_subscriptions SET 
                        plan_name = ?, currency = ?, price = ?, period = ?, 
                        payment_provider = ?, status = ?, modified_by = ?, modified_on = NOW()
                    WHERE id = ? AND is_deleted = 0
                `;
                const subscriptionValues = [
                    subscriptionFields.plan_name,
                    subscriptionFields.currency,
                    subscriptionFields.price,
                    subscriptionFields.period,
                    subscriptionFields.payment_provider,
                    subscriptionFields.status,
                    subscriptionFields.modified_by,
                    id
                ];
                
                connection.query(subscriptionQuery, subscriptionValues, (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(error, null);
                        });
                    }

                    if (results.affectedRows === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(new Error('Subscription not found'), null);
                        });
                    }

                    // Delete existing descriptions
                    const deleteDescQuery = 'DELETE FROM tbl_subscription_desc WHERE subscription_id = ?';
                    connection.query(deleteDescQuery, [id], (error) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(error, null);
                            });
                        }

                        // If no descriptions to add, commit and return
                        if (!descriptions || descriptions.length === 0) {
                            return connection.commit((error) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(error, null);
                                    });
                                }
                                connection.release();
                                callback(null, true);
                            });
                        }

                        // Create new descriptions
                        let completed = 0;
                        let hasError = false;

                        descriptions.forEach((description) => {
                            const descQuery = `
                                INSERT INTO tbl_subscription_desc (
                                    subscription_id, description, created_by, modified_by
                                ) VALUES (?, ?, ?, ?)
                            `;
                            const descValues = [
                                id,
                                description.description,
                                subscriptionFields.modified_by,
                                subscriptionFields.modified_by
                            ];

                            connection.query(descQuery, descValues, (error) => {
                                if (error) {
                                    hasError = true;
                                }
                                completed++;

                                if (completed === descriptions.length) {
                                    if (hasError) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            callback(new Error('Failed to create some descriptions'), null);
                                        });
                                    }
                                    return connection.commit((error) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                callback(error, null);
                                            });
                                        }
                                        connection.release();
                                        callback(null, true);
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    },

    // Delete subscription (soft delete) - this will also remove descriptions
    deleteSubscription: (id, modifiedBy, callback) => {
        db.getConnection((error, connection) => {
            if (error) {
                return callback(error, null);
            }

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                // Delete all descriptions first
                const deleteDescQuery = 'DELETE FROM tbl_subscription_desc WHERE subscription_id = ?';
                connection.query(deleteDescQuery, [id], (error) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(error, null);
                        });
                    }

                    // Soft delete subscription
                    const deleteSubQuery = `
                        UPDATE tbl_subscriptions SET 
                            is_deleted = 1, modified_by = ?, modified_on = NOW()
                        WHERE id = ? AND is_deleted = 0
                    `;
                    connection.query(deleteSubQuery, [modifiedBy, id], (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(error, null);
                            });
                        }

                        if (results.affectedRows === 0) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(new Error('Subscription not found'), null);
                            });
                        }

                        return connection.commit((error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(error, null);
                                });
                            }
                            connection.release();
                            callback(null, true);
                        });
                    });
                });
            });
        });
    },

    // Update subscription status
    updateSubscriptionStatus: (id, status, modifiedBy, callback) => {
        const query = `
            UPDATE tbl_subscriptions SET 
                status = ?, modified_by = ?, modified_on = NOW()
            WHERE id = ? AND is_deleted = 0
        `;
        db.query(query, [status, modifiedBy, id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows > 0);
        });
    },

    // Get subscription descriptions by subscription ID
    getSubscriptionDescriptions: (subscriptionId, callback) => {
        const query = `
            SELECT * FROM tbl_subscription_desc 
            WHERE subscription_id = ? 
            ORDER BY created_on ASC
        `;
        db.query(query, [subscriptionId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    }
}; 