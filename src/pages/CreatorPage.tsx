// src/pages/CreatorPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import Card from "../components/Card";
import { CardData, getCardsByCreator, uploadCard } from "../utils/firestore";
import { useNavigate } from "react-router-dom";

interface UploadCardFormData {
  image: FileList;
  price: number;
  cardName: string;
}

const CreatorPage: React.FC = () => {
  const { account } = useWeb3React();
  const [cards, setCards] = useState<CardData[]>([]);
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadCardFormData>();
  const toast = useToast();

  useEffect(() => {
    if (account) {
      const fetchCards = async () => {
        const fetchedCards = await getCardsByCreator(account);
        setCards(fetchedCards);
      };

      fetchCards();
    }
  }, [account]);
  const handleHomeButtonClick = () => {
    navigate("/");
  };

  const shortenAddress = (address: string, chars = 4): string => {
    const firstChars = address.slice(0, chars);
    const lastChars = address.slice(-chars);
    return `${firstChars}...${lastChars}`;
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const onSubmit = async (data: UploadCardFormData) => {
    try {
      setIsLoading(true);
      if (data.image.length > 0) {
        await uploadCard(data.image[0], data.price, data.cardName, account!);
        toast({
          title: "Card uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleCloseUploadModal();
        if (account) {
          const fetchCards = async () => {
            const fetchedCards = await getCardsByCreator(account);
            setCards(fetchedCards);
          };

          fetchCards();
        }
        reset();
      }
    } catch (error: any) {
      console.error("Failed to upload card:", error);
      toast({
        title: "Failed to upload card",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button margin={8} onClick={handleHomeButtonClick}>
          NiFTy cards
        </Button>
        <Button margin={8} onClick={handleUploadClick}>
          Upload Card
        </Button>
      </Box>
      <VStack spacing={4}>
        {cards.map((card) => (
          <Card
            key={card.id}
            imageUrl={card.imageUrl}
            name={card.name}
            price={card.price}
            numberSold={card.numberSold}
            creator={shortenAddress(card.creator ?? "")}
            onBuy={() => {}}
            onClick={() => {}}
          />
        ))}
      </VStack>

      <Modal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Card</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody overflow-y={"auto"}>
              <FormControl mb={4}>
                <FormLabel>Card Image</FormLabel>
                <Input type="file" {...register("image", { required: true })} />
                {errors.image && <p>Please select an image to upload.</p>}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Price (ETH)</FormLabel>
                <NumberInput min={0} precision={4}>
                  <NumberInputField
                    {...register("price", { required: true, min: 0 })}
                  />
                </NumberInput>
                {errors.price && <p>Please enter a valid price.</p>}
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Card Name</FormLabel>
                <Input {...register("cardName", { required: true })} />
                {errors.cardName && <p>Please enter a creator name.</p>}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Upload
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreatorPage;
