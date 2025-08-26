// Test file for Subscription API endpoints
// This file demonstrates how to use the subscription API

const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3002/api';

// You'll need to get a valid JWT token from login first
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE';

// Headers for authenticated requests
const headers = {
    'Authorization': `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json'
};

// Test data for creating a subscription
const subscriptionData = {
    plan_name: "Premium Plan",
    currency: "USD",
    price: 99.99,
    period: "monthly",
    payment_provider: "stripe",
    status: "active",
    descriptions: [
        "Unlimited access to all features",
        "24/7 customer support",
        "Advanced analytics dashboard",
        "Priority queue for requests"
    ],
    created_by: 1, // User ID who is creating the subscription
    modified_by: 1
};

// Test data for updating a subscription
const updateData = {
    plan_name: "Premium Plan Plus",
    currency: "USD",
    price: 129.99,
    period: "monthly",
    payment_provider: "stripe",
    status: "active",
    descriptions: [
        "Unlimited access to all features",
        "24/7 customer support",
        "Advanced analytics dashboard",
        "Priority queue for requests",
        "Custom integrations",
        "White-label solution"
    ],
    modified_by: 1
};

// Test functions
async function testCreateSubscription() {
    try {
        console.log('Creating subscription...');
        const response = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData, { headers });
        console.log('Subscription created:', response.data);
        return response.data.data.id;
    } catch (error) {
        console.error('Error creating subscription:', error.response?.data || error.message);
    }
}

async function testGetAllSubscriptions() {
    try {
        console.log('\nFetching all subscriptions...');
        const response = await axios.get(`${BASE_URL}/subscriptions`, { headers });
        console.log('All subscriptions:', response.data);
    } catch (error) {
        console.error('Error fetching subscriptions:', error.response?.data || error.message);
    }
}

async function testGetSubscriptionById(id) {
    try {
        console.log(`\nFetching subscription with ID: ${id}`);
        const response = await axios.get(`${BASE_URL}/subscriptions/${id}`, { headers });
        console.log('Subscription details:', response.data);
    } catch (error) {
        console.error('Error fetching subscription:', error.response?.data || error.message);
    }
}

async function testGetSubscriptionsByStatus(status) {
    try {
        console.log(`\nFetching subscriptions with status: ${status}`);
        const response = await axios.get(`${BASE_URL}/subscriptions/status/${status}`, { headers });
        console.log('Subscriptions by status:', response.data);
    } catch (error) {
        console.error('Error fetching subscriptions by status:', error.response?.data || error.message);
    }
}

async function testGetSubscriptionsByPaymentProvider(provider) {
    try {
        console.log(`\nFetching subscriptions with payment provider: ${provider}`);
        const response = await axios.get(`${BASE_URL}/subscriptions/payment-provider/${provider}`, { headers });
        console.log('Subscriptions by payment provider:', response.data);
    } catch (error) {
        console.error('Error fetching subscriptions by payment provider:', error.response?.data || error.message);
    }
}

async function testUpdateSubscription(id) {
    try {
        console.log(`\nUpdating subscription with ID: ${id}`);
        const response = await axios.put(`${BASE_URL}/subscriptions/${id}`, updateData, { headers });
        console.log('Subscription updated:', response.data);
    } catch (error) {
        console.error('Error updating subscription:', error.response?.data || error.message);
    }
}

async function testUpdateSubscriptionStatus(id, status) {
    try {
        console.log(`\nUpdating subscription status to: ${status}`);
        const response = await axios.patch(`${BASE_URL}/subscriptions/${id}/status`, {
            status: status,
            modified_by: 1
        }, { headers });
        console.log('Subscription status updated:', response.data);
    } catch (error) {
        console.error('Error updating subscription status:', error.response?.data || error.message);
    }
}

async function testGetSubscriptionDescriptions(id) {
    try {
        console.log(`\nFetching descriptions for subscription ID: ${id}`);
        const response = await axios.get(`${BASE_URL}/subscriptions/${id}/descriptions`, { headers });
        console.log('Subscription descriptions:', response.data);
    } catch (error) {
        console.error('Error fetching subscription descriptions:', error.response?.data || error.message);
    }
}

async function testDeleteSubscription(id) {
    try {
        console.log(`\nDeleting subscription with ID: ${id}`);
        const response = await axios.delete(`${BASE_URL}/subscriptions/${id}`, {
            headers,
            data: { modified_by: 1 }
        });
        console.log('Subscription deleted:', response.data);
    } catch (error) {
        console.error('Error deleting subscription:', error.response?.data || error.message);
    }
}

// Main test function
async function runTests() {
    console.log('Starting Subscription API tests...\n');
    
    // Create a subscription
    const subscriptionId = await testCreateSubscription();
    
    if (subscriptionId) {
        // Test all other endpoints
        await testGetAllSubscriptions();
        await testGetSubscriptionById(subscriptionId);
        await testGetSubscriptionsByStatus('active');
        await testGetSubscriptionsByPaymentProvider('stripe');
        await testGetSubscriptionDescriptions(subscriptionId);
        await testUpdateSubscription(subscriptionId);
        await testUpdateSubscriptionStatus(subscriptionId, 'inactive');
        
        // Get updated subscription
        await testGetSubscriptionById(subscriptionId);
        
        // Delete the subscription
        await testDeleteSubscription(subscriptionId);
    }
    
    console.log('\nAll tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testCreateSubscription,
    testGetAllSubscriptions,
    testGetSubscriptionById,
    testGetSubscriptionsByStatus,
    testGetSubscriptionsByPaymentProvider,
    testUpdateSubscription,
    testUpdateSubscriptionStatus,
    testGetSubscriptionDescriptions,
    testDeleteSubscription
}; 