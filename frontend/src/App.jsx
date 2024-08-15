import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Register } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./components/ForgetPassword";
import UserProfile from "./components/UserProfile";
import ResetPassword from "./components/ResetPassword";
import { SnackbarProvider } from "notistack";
import NotFound from "./NotFound";

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={1}
      classes={{
        containerTopCenter: "mt-20", // Add custom margin class
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/messenger/login" element={<Login />} />
          <Route path="/messenger/register" element={<Register />} />
          <Route
            path="/messenger/forgot-password"
            element={<ForgetPassword />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
