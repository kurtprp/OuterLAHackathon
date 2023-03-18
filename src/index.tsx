// main.tsx
import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App";

const theme = extendTheme({
  // Add custom theme configurations here
});

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
