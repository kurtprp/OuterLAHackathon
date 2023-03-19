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
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { useWeb3React } from "@web3-react/core";
import { Category } from "../utils/constants";

function Feed() {
  const [cards, setCards] = useState<any[]>([]);
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [filter, setFilter] = useState(Category.All);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cardData = await getCardsFromFirestore();
      setCards(cardData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("filter", filter );
    console.log("cards", cards);
    const filteredCards =
      filter !== Category.All
        ? cards.filter((card) => card.category === filter)
        : cards;
    setFilteredCards(filteredCards);
  }, [cards, filter]);

  const shortenAddress = (address: string, chars = 4): string => {
    const firstChars = address.slice(0, chars);
    const lastChars = address.slice(-chars);
    return `${firstChars}...${lastChars}`;
  };


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
        <Button
          onClick={handleCreatorButtonClick}
          style={{ backgroundColor: "#ED5753" }}
          css={{ fontFamily: "VT323, monospace", fontSize: "20px" }}
        >
          Are you a creator?
        </Button>
        <ConnectWalletButton />
      </Flex>

      <Flex flexWrap="wrap" align="center" justify="center" my={4}>
        {Object.values(Category).map((category) => (
          <Button
            key={category}
            variant="ghost"
            colorScheme="blue"
            mx={2}
            onClick={() => setFilter(category as Category)}
            // style={{ backgroundColor: "#ED5753" }}
            css={{ fontFamily: "VT323, monospace", fontSize: "24px" }}
          >
            {category}
          </Button>
        ))}
      </Flex>

      <Grid
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={4}
        p={4}
        grid-auto-rows="min-content"
      >
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            category={card.category}
            imageUrl={card.imageUrl}
            name={card.name}
            price={card.price}
            numberSold={card.numberSold}
            creator={shortenAddress(card.creator ?? "")}
            onBuy={() => navigate(`/card/${card.id}`)}
            onClick={() => navigate(`/card/${card.id}`)}
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={closeModal}
              style={{ backgroundColor: "#ED5753" }}
              css={{ fontFamily: "VT323, monospace", fontSize: "20px" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Feed;
