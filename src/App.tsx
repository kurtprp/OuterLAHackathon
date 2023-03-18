import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed";
import CardDetail from "./pages/CardDetail";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/card/:cardId" element={<CardDetail />} />
        </Routes>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
