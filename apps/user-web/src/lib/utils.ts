import { TypeOptions, toast } from 'react-toastify';

export const showToast = (message: string, type: TypeOptions) => {
  toast(message, {
    type,
  });
};