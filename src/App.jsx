import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout";
import {
  Home,
  UserConfig,
  Login,
  NotFound,
  Register,
  Dashboard,
  TransactionHistory,
} from "./pages";
import useAxiosInterceptors from "./hooks/useAxiosInterceptors";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  useAxiosInterceptors();

  return (
    <MainLayout>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <ProtectedRoute>
                <UserConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/404"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MainLayout>
  );
};

export default App;
