import { showToast } from '@/lib/utils';
import { setAuth } from '@/store/slices/auth-slice';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { IRootState } from '../store/store';

const getBaseQueryWithLogout = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'same-origin',

    prepareHeaders: (headers, { getState }) => {
      const state = getState() as IRootState;

      headers.set('Accept', 'application/json');

      if (state.auth && state.auth.token?.accessToken && state.auth.isAuth) {
        headers.set('Authorization', `Bearer ${state.auth.token?.accessToken}`);
      }
      return headers;
    },
  });

  const baseQueryWithLogout: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    //console.log(args, '*******payload*******');
    const result = await baseQuery(args, api, extraOptions);

    //console.log(result, '*******responsee*******');

    if (result.error && result.error.status === 401) {
      showToast('Your session expired!', 'error');

      api.dispatch(setAuth(false));
      // window.location = '/login';

      // toast(, {
      //   type: 'error',
      //   toastId: 'session-expired',
      // });
      // api.dispatch(logout());
    }

    return result;
  };

  return baseQueryWithLogout;
};

export default getBaseQueryWithLogout;
