import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.jsx";
import userReducer from "./features/userSlice.jsx";
import messageReducer from "./features/messageSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    message: messageReducer,
  },
});

export default store;
