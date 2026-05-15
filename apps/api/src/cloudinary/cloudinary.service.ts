import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private getResourceType(file: Express.Multer.File): 'image' | 'raw' {
    if (file.mimetype.startsWith('image/')) {
      return 'image';
    }

    return 'raw';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'naajih-uploads',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Starting upload (${file.size} bytes)`);
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: this.getResourceType(file),
          folder,
          timeout: 60000,
        },
        (error, result) => {
          if (error) {
            console.error(
              'Cloudinary upload failed:',
              error instanceof Error ? error.message : 'Unknown error',
            );
            return reject(
              error instanceof Error
                ? error
                : new Error('Cloudinary upload failed'),
            );
          }

          if (process.env.NODE_ENV !== 'production') {
            console.log('Upload success');
          }

          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}
