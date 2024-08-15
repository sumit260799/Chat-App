// components/ForgotPassword.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../features/authSlice";
import { useSnackbar } from "notistack";

const ForgotPassword = () => {
  // theme..........................................

  const [theme, setTheme] = useState(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.add(theme);
    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);

  // ...................................................

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((res) => {
        console.log(res.payload);
        if (res.Status === "Success") {
          enqueueSnackbar(res.message, {
            variant: "success",
          });
          navigate("/messenger/login");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100  dark:bg-gray-800  text-black dark:text-white">
      <div className="w-full max-w-md p-8 space-y-4  bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-t dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg sm:shadow-md">
        <h2 className="text-2xl font-bold text-center ">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white px-4 py-2 font-bold  bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {/* {error?.errors && <p className="text-red-500">{error.errors}</p>} */}
          {message && <p className="text-green-500">{message}</p>}
        </form>
        <div className="text-center">
          <Link to="/messenger/login">
            <p className="text-blue-600 underline">Back to Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
