import { S3Client, CreateBucketCommand, HeadBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure S3 client for MinIO
const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:7000',
  region: process.env.MINIO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'videotube';

/**
 * Setup MinIO bucket and test connection
 */
async function setupMinIO() {
  try {
    console.log('🔄 Testing MinIO connection...');
    
    // Test connection by listing buckets
    const listCommand = new ListBucketsCommand({});
    const listResult = await s3Client.send(listCommand);
    console.log('✅ MinIO connection successful!');
    console.log('📦 Existing buckets:', listResult.Buckets?.map(b => b.Name).join(', ') || 'None');

    // Check if our bucket exists
    try {
      const headCommand = new HeadBucketCommand({ Bucket: BUCKET_NAME });
      await s3Client.send(headCommand);
      console.log(`✅ Bucket '${BUCKET_NAME}' already exists!`);
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        console.log(`📦 Creating bucket '${BUCKET_NAME}'...`);
        
        // Create the bucket
        const createCommand = new CreateBucketCommand({ Bucket: BUCKET_NAME });
        await s3Client.send(createCommand);
        console.log(`✅ Bucket '${BUCKET_NAME}' created successfully!`);
      } else {
        throw error;
      }
    }

    console.log('\n🎉 MinIO setup completed successfully!');
    console.log(`📍 MinIO Endpoint: ${process.env.MINIO_ENDPOINT}`);
    console.log(`🪣 Bucket Name: ${BUCKET_NAME}`);
    console.log(`🔑 Access Key: ${process.env.MINIO_ACCESS_KEY}`);
    
  } catch (error) {
    console.error('❌ MinIO setup failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Make sure MinIO is running: docker-compose -f infra/docker/backend/minio-compose.yml up -d');
    console.error('2. Check MinIO is accessible at:', process.env.MINIO_ENDPOINT);
    console.error('3. Verify credentials in .env file');
    console.error('4. Try accessing MinIO console at: http://localhost:7001');
    
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('minio-setup.js')) {
  setupMinIO();
}

export { setupMinIO, s3Client, BUCKET_NAME };
