import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  friends: JSON.parse(localStorage.getItem("friends")) || [],
  lastMessage: [],
  loading: false,
  error: null,
  messages: [],
  messageSendSuccess: false,
  imgMessageSendSuccess: false,
  message_get_success: false,
};

// Create an async thunk for fetching friends
export const getFriends = createAsyncThunk(
  "user/getFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messenger/getFriends`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLastMessage = createAsyncThunk(
  "user/getLastMessage",
  async (id, { rejectWithValue }) => {
    console.log("getLastMessage", "hii");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messenger/getLastMessage?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (data, { rejectWithValue }) => {
    console.log("sendMessage", "hii");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/sendMessage",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const sendImageData = createAsyncThunk(
  "user/sendImageData",
  async (data, { rejectWithValue }) => {
    console.log("sendImageData", "hii");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/sendImageData",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMessages = createAsyncThunk(
  "user/getMessages",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    console.log("getMessages", "hii");

    try {
      const response = await axios.get(
        `http://localhost:4000/api/messenger/getMessages`,
        {
          params: { senderId, receiverId },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seenMessage = createAsyncThunk(
  "user/seenMessage",
  async (msg, { rejectWithValue }) => {
    console.log("seenMessage", "hii");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/messenger/seen-message",
        msg
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSocketData: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    setMsgSeenResponse: (state, action) => {
      const index = state.lastMessage.findIndex(
        (f) =>
          f.friendId === action.payload.receiverId ||
          f.friendId === action.payload.senderId
      );
      if (index !== -1 && state.lastMessage[index].msg) {
        state.lastMessage[index].msg.status = "seen";
      }
    },

    setSeenSuccessResponse: (state, action) => {
      const { receiverId, senderId } = action.payload;
      const index = state.lastMessage.findIndex(
        (f) => f.friendId === receiverId
      );
      state.lastMessage[index].msg.status = "seen";
    },
    deleteMessageResponse: (state, action) => {
      console.log(action.payload);
      const { mid } = action.payload;
      const sortMsg = state.messages.filter((m) => m._id !== mid);
      state.messages = sortMsg;
    },

    messageSendSuccessClear: (state) => {
      state.messageSendSuccess = false;
    },
    imgMessageSendSuccessClear: (state) => {
      state.imgMessageSendSuccess = false;
    },
    messageGetSuccessClear: (state) => {
      state.message_get_success = false;
    },
    updateState: (state, action) => {
      const index = state.lastMessage.findIndex(
        (f) => f.friendId === action.payload
      );

      if (state.lastMessage[index]?.msg) {
        state.lastMessage[index].msg.status = "seen";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
        localStorage.setItem("friends", JSON.stringify(state.friends));
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling getLastMessages lifecycle
      .addCase(getLastMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLastMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.lastMessage = action.payload.friendMsg;
      })
      .addCase(getLastMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling sendMessage lifecycle
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = [...state.messages, action.payload.newMessage];
        state.messageSendSuccess = true;
        localStorage.setItem("messages", JSON.stringify(state.messages));
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling imgSendMessage lifecycle
      .addCase(sendImageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendImageData.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = [...state.messages, action.payload.newMessage];
        // state.imgMessageSendSuccess = true;
        state.messageSendSuccess = true;

        // localStorage.setItem("messages", JSON.stringify(state.messages));
      })
      .addCase(sendImageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling getMessages lifecycle
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.message_get_success = true;
        state.messages = action.payload; // Assuming response.data contains the messages
        // localStorage.setItem("messages", JSON.stringify(state.messages));
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and action
export const {
  getData,
  setSocketData,
  setMsgSeenResponse,
  messageSendSuccessClear,
  imgMessageSendSuccessClear,
  messageGetSuccessClear,
  updateState,
  setSeenSuccessResponse,
  deleteMessageResponse,
} = userSlice.actions;
export default userSlice.reducer;
