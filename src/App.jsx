import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar, Drawer } from "./layout";
import { Home, GeneratePix } from "./pages";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Drawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gerar-pix" element={<GeneratePix />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
