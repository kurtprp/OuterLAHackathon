import React from "react";
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  card: {
    id: string;
    imageUrl: string;
    name: string;
    creator: string;
    price: number;
    numberSold: number;
  };
}

const Card: React.FC<CardProps> = ({ card }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/card/${card.id}`);
  };

  return (
    <VStack
      onClick={handleClick}
      spacing={2}
      borderWidth="1px"
      borderRadius="lg"
      p={2}
    >
      <Box maxW="sm" overflow="hidden">
        <img src={card.imageUrl} alt={card.name} />
      </Box>
      <Text>{card.name}</Text>
      <Text>{card.creator}</Text>
      <Text>{card.price} ETH</Text>
      <Text>{card.numberSold} sold</Text>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        Buy
      </Button>
    </VStack>
  );
};

export default Card;
