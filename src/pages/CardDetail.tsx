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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      const cardData = await getCardFromFirestore(cardId + "");
      setCard(cardData);
    };
    fetchCard();
  }, [cardId]);

  if (!card) return null;

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <VStack w="100%" h="100%" p={4}>
      <Box display="flex" flexDirection="row">
        <VStack w="40%" h="40%" p={4} alignItems="flex-center">
          <Image src={card.imageUrl} alt={card.name} mr={4} />
          <Text>{message}</Text>
        </VStack>
        <VStack w="40%" h="40%" p={4} alignItems="flex-start">
          <Text>{card.name}</Text>
          <Text>by {card.creator}</Text>
          <Text>{card.price} ETH</Text>
          <Text>{card.numberSold} sold</Text>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Input
              placeholder="Enter a message"
              value={message}
              onChange={handleMessageChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Sender Name (optional)</FormLabel>
            <Input placeholder="Enter sender name" />
          </FormControl>
          <FormControl>
            <FormLabel>Receiver's Wallet Address</FormLabel>
            <Input placeholder="Enter receiver wallet address" />
          </FormControl>
          <Button>Send</Button>
        </VStack>
      </Box>
    </VStack>
  );
}

export default CardDetail;
