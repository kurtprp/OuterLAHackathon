import React from "react";
import { Box, VStack, Text, Button } from "@chakra-ui/react";

interface CardProps {
  imageUrl: string;
  name: string;
  creator: string;
  price: number;
  numberSold: number;
  onBuy: () => void;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  name,
  creator,
  price,
  numberSold,
  onBuy,
  onClick,
}) => {
  return (
    <VStack
      onClick={onClick}
      spacing={2}
      borderWidth="1px"
      borderRadius="lg"
      p={2}
    >
      <Box maxW="sm" overflow="hidden">
        <img src={imageUrl} alt={name} />
      </Box>
      <Text>{name}</Text>
      <Text>{creator}</Text>
      <Text>{price} ETH</Text>
      <Text>{numberSold} sold</Text>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onBuy();
        }}
      >
        Buy
      </Button>
    </VStack>
  );
};

export default Card;
