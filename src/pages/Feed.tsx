// Feed.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import Card from "../components/Card";
import { getCardsFromFirestore } from "../utils/firestore";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

function Feed() {
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cardData = await getCardsFromFirestore();
      setCards(cardData);
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const { active } = useWeb3React();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreatorButtonClick = () => {
    if (active) {
      navigate("/creator");
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Button onClick={handleCreatorButtonClick}>Are you a creator?</Button>
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
            creator={card.creator}
            onBuy={() => console.log("buy")}
            onClick={() => console.log("click")}
          />
        ))}
      </Grid>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Connect Your Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            To access the creator page, you need to connect your wallet first.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Feed;
