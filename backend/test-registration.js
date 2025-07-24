import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api/v1';

async function testUserRegistration() {
  try {
    console.log('🧪 Testing user registration...');
    
    // Create form data
    const form = new FormData();
    form.append('fullName', 'Test User');
    form.append('username', 'testuser' + Date.now());
    form.append('email', 'test' + Date.now() + '@example.com');
    form.append('password', 'testpassword123');
    
    // Create a simple test image file
    const testImageBuffer = Buffer.from('fake-image-data');
    form.append('avatar', testImageBuffer, {
      filename: 'test-avatar.jpg',
      contentType: 'image/jpeg'
    });
    
    form.append('coverImage', testImageBuffer, {
      filename: 'test-cover.jpg', 
      contentType: 'image/jpeg'
    });

    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const result = await response.text();
    console.log('📝 Status:', response.status);
    console.log('📄 Response:', result);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testUserRegistration();
