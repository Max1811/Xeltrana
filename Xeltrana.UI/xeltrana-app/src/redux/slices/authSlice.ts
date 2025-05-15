import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/types";

const STORAGE_KEYS = {
  token: "token",
  userId: "userId",
  userName: "userName",
  roleId: "roleId",
};

interface UserState {
  id: number;
  name: string;
  roleId: number;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserState | null;
}
const saveAuthToStorage = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.userId, user.id.toString());
  localStorage.setItem(STORAGE_KEYS.userName, user.name);
  localStorage.setItem(STORAGE_KEYS.roleId, user.userRole.id.toString());
};

const clearAuthFromStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

const getUserFromStorage = (): UserState | null => {
  const id = localStorage.getItem(STORAGE_KEYS.userId);
  const name = localStorage.getItem(STORAGE_KEYS.userName);
  const roleId = localStorage.getItem(STORAGE_KEYS.roleId);

  if (!id || !name || !roleId) return null;

  const parsedId = parseInt(id, 10);
  const parsedRoleId = parseInt(roleId, 10);

  if (isNaN(parsedId) || isNaN(parsedRoleId)) return null;

  return {
    id: parsedId,
    name,
    roleId: parsedRoleId,
  };
};

const token = localStorage.getItem(STORAGE_KEYS.token);
const user = getUserFromStorage();

const initialState: AuthState = {
  isAuthenticated: !!token && !!user,
  token,
  user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = {
        id: user.id,
        name: user.name,
        roleId: user.userRole.id,
      };
      saveAuthToStorage(token, user);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      clearAuthFromStorage();
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
