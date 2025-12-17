import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,

  permissions: {},

  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuth = payload;
    },

    // setToken: (state, { payload }: PayloadAction<TokenData | null>) => {
    //   state.token = payload;
    // },
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...payload };
    },

    setPermissions: (
      state,
      { payload }: PayloadAction<Record<string, string>>
    ) => {
      state.permissions = payload;
    },

    logout: (state) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const {
  setAuth,
  setUser,
  logout,

  setPermissions,
} = authSlice.actions;

export default authSlice.reducer;
