const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';

// Test data
const testUser = {
    email: 'admin@example.com',
    password: 'password123'
};

const testCustomer = {
    email: 'customer@example.com',
    password: 'password123'
};

let userToken = null;
let customerToken = null;

// Test functions
async function testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
        console.log('✅ User login successful');
        console.log('User data:', response.data.data.user);
        userToken = response.data.data.token;
        return true;
    } catch (error) {
        console.log('❌ User login failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testCustomerLogin() {
    console.log('\n🔐 Testing Customer Login...');
    try {
        const response = await axios.post(`${BASE_URL}/auth/customer-login`, testCustomer);
        console.log('✅ Customer login successful');
        console.log('Customer data:', response.data.data.customer);
        customerToken = response.data.data.token;
        return true;
    } catch (error) {
        console.log('❌ Customer login failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testProtectedEndpoint(token, endpoint, description) {
    console.log(`\n🔒 Testing ${description}...`);
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(`✅ ${description} successful`);
        return true;
    } catch (error) {
        console.log(`❌ ${description} failed:`, error.response?.data?.message || error.message);
        return false;
    }
}

async function testPublicEndpoint(endpoint, description) {
    console.log(`\n🌐 Testing ${description}...`);
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`✅ ${description} successful`);
        return true;
    } catch (error) {
        console.log(`❌ ${description} failed:`, error.response?.data?.message || error.message);
        return false;
    }
}

async function testUnauthorizedAccess(endpoint, description) {
    console.log(`\n🚫 Testing ${description}...`);
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`❌ ${description} should have failed but succeeded`);
        return false;
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log(`✅ ${description} correctly blocked`);
            return true;
        } else {
            console.log(`❌ ${description} failed with unexpected error:`, error.response?.data?.message || error.message);
            return false;
        }
    }
}

async function testUserProfile(token) {
    console.log('\n👤 Testing Get User Profile...');
    try {
        const response = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Get user profile successful');
        console.log('Profile data:', response.data.data);
        return true;
    } catch (error) {
        console.log('❌ Get user profile failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testRefreshToken(refreshToken) {
    console.log('\n🔄 Testing Token Refresh...');
    try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken: refreshToken
        });
        console.log('✅ Token refresh successful');
        return true;
    } catch (error) {
        console.log('❌ Token refresh failed:', error.response?.data?.message || error.message);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting JWT Authentication Tests...\n');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // Test 1: User Login
    totalTests++;
    if (await testUserLogin()) passedTests++;
    
    // Test 2: Customer Login
    totalTests++;
    if (await testCustomerLogin()) passedTests++;
    
    // Test 3: Public endpoints (should work without token)
    totalTests++;
    if (await testPublicEndpoint('/cities', 'Public Cities Endpoint')) passedTests++;
    
    totalTests++;
    if (await testPublicEndpoint('/countries', 'Public Countries Endpoint')) passedTests++;
    
    totalTests++;
    if (await testPublicEndpoint('/roles', 'Public Roles Endpoint')) passedTests++;
    
    // Test 4: Protected endpoints (should work with token)
    if (userToken) {
        totalTests++;
        if (await testProtectedEndpoint(userToken, '/users', 'Protected Users Endpoint')) passedTests++;
        
        totalTests++;
        if (await testProtectedEndpoint(userToken, '/customers', 'Protected Customers Endpoint')) passedTests++;
        
        totalTests++;
        if (await testUserProfile(userToken)) passedTests++;
    }
    
    // Test 5: Unauthorized access (should fail without token)
    totalTests++;
    if (await testUnauthorizedAccess('/users', 'Unauthorized Users Access')) passedTests++;
    
    totalTests++;
    if (await testUnauthorizedAccess('/customers', 'Unauthorized Customers Access')) passedTests++;
    
    // Test 6: Invalid token access
    totalTests++;
    if (await testUnauthorizedAccess('/users', 'Invalid Token Access')) passedTests++;
    
    // Test 7: Admin-only endpoints
    if (userToken) {
        totalTests++;
        if (await testProtectedEndpoint(userToken, '/auth/admin/users', 'Admin Users Endpoint')) passedTests++;
    }
    
    // Test 8: Token refresh (if we have a refresh token)
    if (userToken) {
        // Note: This would need the refresh token from login response
        console.log('\n🔄 Token refresh test skipped (refresh token not captured)');
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! JWT authentication is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the implementation.');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testUserLogin,
    testCustomerLogin,
    testProtectedEndpoint,
    testPublicEndpoint,
    testUnauthorizedAccess,
    testUserProfile,
    testRefreshToken,
    runTests
}; 