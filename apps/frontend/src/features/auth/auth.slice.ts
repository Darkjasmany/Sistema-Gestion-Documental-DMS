import { clearAuth, getAuthToken } from "@/core/utils/storage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as AuthAPI from "./api/AuthAPI"; // ya tienes este archivo

interface AuthState {
  user: any | null;
  token: string | null;
  permissions: string[];
  modules: any[];
  loading: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  user: null,
  token: getAuthToken(), // lee token persistido (AUTH_TOKEN)
  permissions: [],
  modules: [],
  loading: false,
  error: null,
};

// Thunk de login: llama a AuthAPI.authenticateUser (que guarda token en storage)
export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { email, password, rememberMe = true } = payload;
      const token = await AuthAPI.authenticateUser({ formData: { email, password }, rememberMe });
      // Si tu backend devuelve user/permissions/modules, devuélvelos aquí
      return { token } as { token: string };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.modules = [];
      clearAuth(); // borra AUTH_TOKEN de local/session storage
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Login failed";
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
