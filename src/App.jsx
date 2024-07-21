import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout";
import { Home, GeneratePix, UserConfig, Login, NotFound, Register, Dashboard } from "./pages";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gerar-pix" element={<GeneratePix />} />
        <Route path="/configuration" element={<UserConfig />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
