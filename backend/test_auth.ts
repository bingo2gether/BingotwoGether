import axios from 'axios';

async function testBackend() {
    const API_URL = 'http://localhost:3001';

    console.log('Testing Backend Connectivity...');

    // 1. Health Check
    try {
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health Check: OK', health.data);
    } catch (error: any) {
        console.error('❌ Health Check Failed:', error.message);
        return;
    }

    // 2. Register Test User
    const testUser = {
        email: `test_debug_${Date.now()}@example.com`,
        password: 'password123',
        marketingOptIn: true
    };

    console.log('\nTesting Registration with:', testUser);

    try {
        const register = await axios.post(`${API_URL}/api/auth/register`, testUser);
        console.log('✅ Registration: OK', register.data);
    } catch (error: any) {
        console.error('❌ Registration Failed:', error.response?.data || error.message);
    }
}

testBackend();
