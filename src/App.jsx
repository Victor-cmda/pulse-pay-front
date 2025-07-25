import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "./layout";
import {
  Home,
  UserConfig,
  Login,
  NotFound,
  Register,
  Dashboard,
  About,
  BankAccountManagement,
  Notifications,
  AdminDashboard,
  Unauthorized,
  Endpoints,
} from "./pages";
import { WalletManagement } from "./pages/WalletManagement/index.js";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./routes";
import { store, persistor } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingSpinner } from "./components";
import BankAccountForm from "./pages/BankAccountForm";
import {
  configureAuthHeaders,
  checkAdminStatus,
} from "./store/slices/userSlice";
import { authService } from "./services/AuthService";
import { paymentService } from "./services/PaymentService";
import { LoadingProvider } from "./context/LoadingContext";
import { LanguageProvider } from "./context/LanguageContext.jsx";

const AuthSetup = () => {
  const dispatch = useDispatch();
  const { user, adminChecked } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      configureAuthHeaders(token);

      if (user && !adminChecked) {
        dispatch(checkAdminStatus());
      }
    }

    const handleLogout = () => {
      dispatch({ type: "user/logout" });
    };

    authService.setLogoutCallback(handleLogout);
    paymentService.setLogoutCallback(handleLogout);
  }, [dispatch, user, adminChecked]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <LanguageProvider>
          <LoadingProvider>
            <AuthSetup />
            <MainLayout>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
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
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
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
                  path="/configuration"
                  element={
                    <ProtectedRoute>
                      <UserConfig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <WalletManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank"
                  element={
                    <ProtectedRoute>
                      <BankAccountManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank/new"
                  element={
                    <ProtectedRoute>
                      <BankAccountForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank/edit/:id"
                  element={
                    <ProtectedRoute>
                      <BankAccountForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/unauthorized"
                  element={
                    <ProtectedRoute>
                      <Unauthorized />
                    </ProtectedRoute>
                  }
                />
                <Route path="/docs" element={<Endpoints />} />
                <Route path="/404" element={<NotFound />} />

                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </MainLayout>
          </LoadingProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
