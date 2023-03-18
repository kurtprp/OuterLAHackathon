// src/pages/CreatorPage.tsx
import React, { useState, useEffect } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Card from "../components/Card";
import { CardData, getCardsByCreator } from "../utils/firestore";

const CreatorPage: React.FC = () => {
  const { account } = useWeb3React();
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    if (account) {
      const fetchCards = async () => {
        const fetchedCards = await getCardsByCreator(account);
        setCards(fetchedCards);
      };

      fetchCards();
    }
  }, [account]);

  const handleUpload = async () => {
    // Upload card logic here
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button onClick={handleUpload}>Upload Card</Button>
      </Box>
      <VStack spacing={4}>
        {cards.map((card) => (
          <Card
            key={card.id}
            imageUrl={card.imageUrl}
            name={card.name}
            price={card.price}
            numberSold={card.numberSold}
            creator={card.creator}
            onBuy={() => console.log("buy")}
            onClick={() => console.log("click")}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default CreatorPage;
