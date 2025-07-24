import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
 * Upload file to MinIO S3
 * @param {string} localFilePath - Local file path
 * @param {string} folder - Folder name in S3 bucket (optional)
 * @returns {Promise<Object|null>} - Upload result with url and key
 */
const uploadOnMinIO = async (localFilePath, folder = '') => {
  try {
    if (!localFilePath) {
      console.log('⚠️ No file path provided to uploadOnMinIO');
      return null;
    }
    
    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.error('❌ File does not exist:', localFilePath);
      throw new Error('File does not exist');
    }

    console.log('📤 Uploading file to MinIO:', localFilePath);

    // Read file
    const fileContent = fs.readFileSync(localFilePath);
    const fileName = path.basename(localFilePath);
    const fileExtension = path.extname(fileName);
    
    // Generate unique file name
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    // Determine content type
    const contentType = getContentType(fileExtension);

    // Upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    };

    console.log('📦 Upload params:', {
      bucket: BUCKET_NAME,
      key: key,
      contentType: contentType,
      size: fileContent.length
    });

    // Upload file
    const command = new PutObjectCommand(uploadParams);
    const result = await s3Client.send(command);

    // Construct the URL
    const fileUrl = `${process.env.MINIO_ENDPOINT || 'http://localhost:7000'}/${BUCKET_NAME}/${key}`;

    console.log('✅ File uploaded successfully:', fileUrl);

    // Clean up local file
    fs.unlinkSync(localFilePath);
    console.log('🗑️ Local temp file cleaned up');

    return {
      url: fileUrl,
      key: key,
      bucket: BUCKET_NAME,
      size: fileContent.length,
      contentType: contentType,
      etag: result.ETag,
    };
  } catch (error) {
    console.error('❌ MinIO upload error:', error);
    
    // Clean up local file even if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log('🗑️ Local temp file cleaned up after error');
      }
    } catch (cleanupError) {
      console.error('❌ Error cleaning up local file:', cleanupError);
    }
    
    return null;
  }
};

/**
 * Delete file from MinIO S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} - Success status
 */
const deleteFromMinIO = async (key) => {
  try {
    if (!key) return false;

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    return true;
  } catch (error) {
    console.error('MinIO delete error:', error);
    return false;
  }
};

/**
 * Generate presigned URL for private file access
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<string|null>} - Presigned URL
 */
const getPresignedUrl = async (key, expiresIn = 3600) => {
  try {
    if (!key) return null;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('MinIO presigned URL error:', error);
    return null;
  }
};

/**
 * Get content type based on file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
const getContentType = (extension) => {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Extract S3 key from MinIO URL
 * @param {string} url - MinIO file URL
 * @returns {string|null} - S3 object key
 */
const extractKeyFromUrl = (url) => {
  try {
    if (!url) return null;
    
    // Remove the base URL and bucket name to get the key
    const urlPattern = new RegExp(`^https?://[^/]+/${BUCKET_NAME}/(.+)$`);
    const match = url.match(urlPattern);
    
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting key from URL:', error);
    return null;
  }
};

export { 
  uploadOnMinIO, 
  deleteFromMinIO, 
  getPresignedUrl, 
  extractKeyFromUrl,
  s3Client,
  BUCKET_NAME 
};
