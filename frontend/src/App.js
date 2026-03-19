import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./HomePage";
import CodeDetailPage from "./CodeDetailPage";
import FindCodePage from "./FindCodePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code/:code" element={<CodeDetailPage />} />
        <Route path="/codes" element={<FindCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
