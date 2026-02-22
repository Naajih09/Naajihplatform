import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dktv7ospa', 
      api_key: '266593211724638',      
      api_secret: 'z5wiX4apIny6oW4LJmZjjcTZQWU',
    });
  },
};