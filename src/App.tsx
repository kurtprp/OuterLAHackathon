import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed";
import CardDetail from "./pages/CardDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/card/:cardId" element={<CardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
