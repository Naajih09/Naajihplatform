import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    console.log(`🚀 Starting upload for: ${file.originalname} (Size: ${file.size} bytes)`);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto', 
          folder: 'naajih-pitches',
          timeout: 60000 // <--- ADD THIS: Wait 60 seconds (default is shorter)
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary Error:', error);
            return reject(error);
          }
          console.log('✅ Upload Success:', result?.secure_url);
          resolve(result!);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}