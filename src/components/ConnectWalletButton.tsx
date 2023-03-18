// src/components/ConnectWalletButton.tsx
import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Button, VStack } from "@chakra-ui/react";

const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const shortenAddress = (address: string, chars = 4): string => {
  const firstChars = address.slice(0, chars);
  const lastChars = address.slice(-chars);
  return `${firstChars}...${lastChars}`;
};

const ConnectWalletButton: React.FC = () => {
  const { activate, active, account, deactivate } = useWeb3React();
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await activate(injectedConnector);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnectWallet = () => {
    deactivate();
    setShowDisconnect(false);
  };

  return (
    <VStack spacing={2}>
      <Button
        onClick={() => {
          handleConnectWallet();
          setShowDisconnect(true);
        }}
        isDisabled={active}
      >
        {active ? (
          <>
            <span role="img" aria-label="checkmark">
              ✅
            </span>{" "}
            {shortenAddress(account ?? "")}
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {active && showDisconnect && (
        <Button colorScheme="red" onClick={handleDisconnectWallet}>
          Disconnect
        </Button>
      )}
    </VStack>
  );
};

export default ConnectWalletButton;
