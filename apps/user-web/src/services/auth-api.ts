import { createApi } from '@reduxjs/toolkit/query/react';
import getBaseQueryWithLogout from './base-query';
import { getApiBaseUrl } from '@/lib/api-base';

export const authApi = createApi({
  reducerPath: 'auth-api',
  baseQuery: getBaseQueryWithLogout(getApiBaseUrl()),
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
