import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
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
  const { loading, authenticate } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authenticate) {
      navigate("/");
    }
  }, [authenticate, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .catch((err) => {
        enqueueSnackbar(err?.errors[0], {
          variant: "error",
        });
      });
    setFormData({ email: "", password: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center bg-slate-100  dark:bg-gray-800  text-black dark:text-white justify-center h-[100vh]">
      <div className="w-full max-w-md  bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-t dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 sm:rounded-lg sm:shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6  text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black "
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium ">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full text-black  px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex justify-center h-full none items-center ${
                  formData.password.length < 1 && "hidden"
                }`}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="my-3 flex justify-between items-center">
            <Link
              to="/messenger/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 mb-2  text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-3">
          <Link to="/messenger/register">
            <h1 className="text-sm text-blue-600 hover:text-blue-800 underline">
              Don't have an account?
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
