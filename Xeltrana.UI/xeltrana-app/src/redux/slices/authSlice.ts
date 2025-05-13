import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

const initialToken = localStorage.getItem("token");

const userIdRaw = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

let user: User | null = null;

if (userIdRaw !== null && userName !== null) {
  const parsedId = parseInt(userIdRaw, 10);
  if (!isNaN(parsedId)) {
    user = { id: parsedId, name: userName };
  }
}

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  token: initialToken,
  user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.user?.id);
      localStorage.setItem("userName", action.payload.user?.name);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = {} as User;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
