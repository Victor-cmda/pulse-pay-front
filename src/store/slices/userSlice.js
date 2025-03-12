import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthService";
import { paymentService } from "../../services/PaymentService";

export const configureAuthHeaders = (token) => {
  if (token) {
    authService.setAuthorizationHeader(token);
    paymentService.setAuthorizationHeader(token);
  } else {
    authService.setAuthorizationHeader(null);
    paymentService.setAuthorizationHeader(null);
  }
};

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        if (response.data.token) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("expiresIn", response.data.expiresIn);

          configureAuthHeaders(token);
        }
        return response.data.user;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAdminStatus = createAsyncThunk(
  "user/checkAdminStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.checkStatus();
      if (response.success && response.data && response.data.isAdmin) {
        return response.data.isAdmin;
      } else {
        return false;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    isAdmin: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.isAdmin = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");

      configureAuthHeaders(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAdminStatus.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
        state.adminChecked = true;
      })
      .addCase(checkAdminStatus.rejected, (state) => {
        state.isAdmin = false;
        state.adminChecked = true;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;