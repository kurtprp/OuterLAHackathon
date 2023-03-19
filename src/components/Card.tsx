import React from "react";
import { Box, VStack, Text, Button, HStack } from "@chakra-ui/react";

interface CardProps {
  category: string;
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
      <HStack justify="space-between">
        <Text>{name}</Text>
        {creator && <Text>by {creator}</Text>}
      </HStack>
      <HStack justify="space-between">
        <Text>{price} ETH</Text>
        <Text>{numberSold} sold</Text>
      </HStack>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onBuy();
        }}
        style={{ backgroundColor: "#ED5753" }}
        css={{ fontFamily: "VT323, monospace", fontSize: "20px" }}
      >
        Buy
      </Button>
    </VStack>
  );
};

export default Card;
