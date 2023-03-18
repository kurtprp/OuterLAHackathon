// CardDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  VStack,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { getCardFromFirestore } from "../utils/firestore";

function CardDetail() {
  const { cardId } = useParams();
  const [card, setCard] = useState<any>();

  useEffect(() => {
    const fetchCard = async () => {
      const cardData = await getCardFromFirestore(cardId + "");
      setCard(cardData);
    };
    fetchCard();
  }, [cardId]);

  if (!card) return null;

  return (
    <VStack spacing={4} p={4}>
      <Image src={card.imageUrl} alt={card.name} />
      <Text>{card.name}</Text>
      <Text>{card.creator}</Text>
      <Text>{card.price} ETH</Text>
      <Text>{card.numberSold} sold</Text>
      <FormControl>
        <FormLabel>Message</FormLabel>
        <Input placeholder="Enter a message" />
      </FormControl>
      <FormControl>
        <FormLabel>Sender Name (optional)</FormLabel>
        <Input placeholder="Enter sender name" />
      </FormControl>
      <FormControl>
        <FormLabel>Receiver Wallet Address</FormLabel>
        <Input placeholder="Enter receiver wallet address" />
      </FormControl>
      <Button>Buy</Button>
    </VStack>
  );
}

export default CardDetail;
