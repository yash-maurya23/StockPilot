import { connectToDatabase } from './mongoose';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    const connection = await connectToDatabase();
    console.log('✅ Database connected successfully!');
    console.log('Connection status:', connection?.connection?.readyState);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
