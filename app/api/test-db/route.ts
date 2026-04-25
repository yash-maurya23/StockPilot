import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    const connection = await connectToDatabase();
    console.log('✅ Database connected successfully!');
    
    return Response.json({
      success: true,
      message: 'Database connected successfully!',
      status: connection?.connection?.readyState,
    });
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return Response.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
