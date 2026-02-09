import { createApi } from '@reduxjs/toolkit/query/react';
import getBaseQueryWithLogout from './base-query';

export const authApi = createApi({
  reducerPath: 'auth-api',
  baseQuery: getBaseQueryWithLogout((import.meta as any).env.VITE_PUBLIC_BASE_URL || ''),
  endpoints: (builder) => ({
    login: builder.mutation<TApiResponse<any>, any>({
      query: (data) => {
        return {
          url: `users/login`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
