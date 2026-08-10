import { createApi } from "@reduxjs/toolkit/query/react";
import getBaseQueryWithLogout from "./base-query";
import { getApiBaseUrl } from "@/lib/api-base";

export const authApi = createApi({
  reducerPath: "auth-api",
  baseQuery: getBaseQueryWithLogout(getApiBaseUrl()),
  endpoints: (builder) => ({
    login: builder.mutation<TApiResponse<any>, any>({
      query: (data) => {
        return {
          url: `users/login`,
          method: "POST",
          body: data,
        };
      },
    }),
    verifyEmail: builder.query<
      { status: string; message: string },
      string
    >({
      query: (token) => `users/verify-email?token=${encodeURIComponent(token)}`,
    }),
    resendVerificationEmail: builder.mutation<
      {
        status: string;
        message: string;
        emailed?: boolean;
        verifyUrl?: string;
        deliveryFallback?: string;
      },
      { email: string }
    >({
      query: (data) => ({
        url: `users/verify-email/resend`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyEmailQuery,
  useResendVerificationEmailMutation,
} = authApi;
