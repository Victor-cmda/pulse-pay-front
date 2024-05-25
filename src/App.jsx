import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout";
import { Home, GeneratePix } from "./pages";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gerar-pix" element={<GeneratePix />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
