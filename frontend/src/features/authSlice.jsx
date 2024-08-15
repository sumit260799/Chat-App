import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwtDecode
import Cookies from "js-cookie";

const initialState = {
  user: null,
  selectedUser: null,
  authenticate: false,
  error: [],
  loading: false, // Add loading to the initial state
};

const decodeToken = (token) => {
  return jwtDecode(token);
};

const getToken = Cookies.get("authToken");

if (getToken) {
  const getUser = decodeToken(getToken);

  if (getUser) {
    initialState.user = getUser;
    initialState.authenticate = true;
  }
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/messenger/user-login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = response.data?.token;
      const user = decodeToken(token); // Decode the token to get user data
      return { token, user }; // Return the token and user data
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/messenger/user-register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const token = response.data?.token;
      const user = decodeToken(token); // Decode the token to get user data
      return { token, user }; // Return the token and user data
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/messenger/forgot-password",
        email
      );
      return response.data; // Return the token and user data
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (id, { rejectWithValue }) => {
    console.log("logout successfully");
    try {
      const response = await axios.post(
        "/api/messenger/user-logout",
        { id },
        { withCredentials: true }
      );
      return response.data; // Return the response data
    } catch (error) {
      console.log(error);
      const errorMessage = error.response ? error.response.data : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "user/profileImage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/upload-cropped-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const token = response.data?.token;
      const user = decodeToken(token); // Decode the token to get user data
      return { token, user }; // Return the token and user data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/update-profile",
        data,
        {
          withCredentials: true,
        }
      );
      const token = response.data?.token;
      const user = decodeToken(token); // Decode the token to get user data
      return { token, user }; // Return the token and user data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // registerUser................
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true; // Set loading to true
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload.user; // Set the user data
      state.authenticate = true; // Set authenticate to true
      state.loading = false; // Set loading to false
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      // state.error = action.payload;
      state.loading = false; // Set loading to false
    });
    // login user..............
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true; // Set loading to true
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user; // Set the user data
      state.authenticate = true; // Set authenticate to true
      state.loading = false; // Set loading to false
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      // state.error = action.payload;
      state.loading = false; // Set loading to false
    });
    // logout user..............
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true; // Set loading to true
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.authenticate = false; // Set authenticate to true
      state.loading = false; // Set loading to false
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      // state.error = action.payload;
      state.loading = false; // Set loading to false
    });
    // updateProfileImage................
    builder.addCase(updateProfileImage.pending, (state) => {
      state.loading = true; // Set loading to true
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.user = action.payload.user; // Set the user data
      state.authenticate = true; // Set authenticate to true
      state.loading = false; // Set loading to false
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      // state.error = action.payload;
      state.loading = false; // Set loading to false
    });
    // updateProfile................
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true; // Set loading to true
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload.user; // Set the user data
      state.authenticate = true; // Set authenticate to true
      state.loading = false; // Set loading to false
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      // state.error = action.payload;
      state.loading = false; // Set loading to false
    });
  },
});

export const { setSelectedUser } = authSlice.actions;
export default authSlice.reducer;
