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
  Withdraw,
  About,
  WalletManagement,
  BankAccountManagement,
} from "./pages";
import { ProtectedRoute, PublicRoute } from "./routes";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingSpinner } from "./components";

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
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
                path="/withdraw"
                element={
                  <ProtectedRoute>
                    <Withdraw />
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
                    <BankAccountManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bank/edit/:id"
                element={
                  <ProtectedRoute>
                    <BankAccountManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </MainLayout>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
