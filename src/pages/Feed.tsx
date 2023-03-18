// Feed.tsx
import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Card from "../components/Card";
import { getCardsFromFirestore } from "../utils/firestore";
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "../components/ConnectWalletButton";

function Feed() {
  const [cards, setCards] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cardData = await getCardsFromFirestore();
      setCards(cardData);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Button>Are you a creator?</Button>
        <ConnectWalletButton />
      </Flex>
      <Grid
        templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap={4}
        p={4}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            imageUrl={card.imageUrl}
            name={card.name}
            price={card.price}
            numberSold={card.numberSold}
            creator={"by " +card.creator}
            onBuy={() => navigate(`/card/${card.id}`)}
            onClick={() => navigate(`/card/${card.id}`)}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default Feed;
