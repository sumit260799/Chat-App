import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteFdMsgByUser = createAsyncThunk(
  "user/deleteFriendMessage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/delete-fd-message",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getDeleteFdMessages = createAsyncThunk(
  "user/getDeleteFriendMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/messenger/getDelete-fd-message"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMsgForEveryOne = createAsyncThunk(
  "user/deleteMsgForEveryOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/messenger/delete-message-everyone/${id}`
      );

      console.log("response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  messages: [],
  status: "idle",
  error: null,
  deleteMessages: [],
  deleteMessageGet: false,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    deleteMessageClear: (state, action) => {
      state.deleteMessageGet = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // post delete friend messages........
      .addCase(deleteFdMsgByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFdMsgByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteMessageGet = true;
      })
      .addCase(deleteFdMsgByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get delete friend messages........
      .addCase(getDeleteFdMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeleteFdMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteMessages = action.payload;
      })
      .addCase(getDeleteFdMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteMsgForEveryOne........
      .addCase(deleteMsgForEveryOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMsgForEveryOne.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteMessageGet = true;
      })
      .addCase(deleteMsgForEveryOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteMessageClear } = messageSlice.actions;

export default messageSlice.reducer;
