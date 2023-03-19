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
  Select,
} from "@chakra-ui/react";
import { getCardFromFirestore, addTransaction } from "../utils/firestore";
import { Category, CategoryPlaceholderMessage } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { mintAndTransferNFT } from "../contract/mintAndTransferNFT";
import { createTokenURI } from "../utils/ipfsman";

const shortenAddress = (address: string, chars = 4): string => {
  const firstChars = address.slice(0, chars);
  const lastChars = address.slice(-chars);
  return `${firstChars}...${lastChars}`;
};

function CardDetail() {
  const { cardId } = useParams();
  const [card, setCard] = useState<any>();
  const [message, setMessage] = useState("");
  const [fontFamily, setFontFamily] = useState("papyrus");
  // add isloading state
  const [isLoading, setIsLoading] = useState(false);

  const [receiverAddress, setReceiverAddress] = useState(
    "0xf753f55EF913a038D2d156cD968e26B61788011c"
  );

  const handleBuyClick = async () => {
    try {
      setIsLoading(true);
      console.log("Buying card...", card);
      if (!receiverAddress) {
        alert("Please enter a receiver address");
        return;
      }

      let contractAddress = card.contractAddress;
      if (!contractAddress) {
        contractAddress = "0x1B77Ee32DC5C769aE2F4F30c871b6D5B560D4817";
      }

      const tokenURI = await createTokenURI(card.imageUrl, message, card.name);

      console.log("tokenURI", tokenURI);
      // Update the parameters below according to your project requirements
      const tx = await mintAndTransferNFT(
        contractAddress,
        receiverAddress,
        tokenURI,
        card.price
      );
      // add tx to firestore
      console.log(
        "Adding transaction to firestore...",
        tx?.buyer,
        tx?.tx,
        card.id,
        receiverAddress
      );
      await addTransaction(card.id, tx?.buyer, receiverAddress, tx?.tx);
      alert("Card added to your collection!");
    } catch (error) {
      console.error("Buying failed:", error);
      alert("Buying failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiverAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiverAddress(event.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      const cardData = await getCardFromFirestore(cardId + "");
      setCard(cardData);
    };
    fetchCard();
  }, [cardId]);
  const handleHomeButtonClick = () => {
    navigate("/");
  };

  if (!card) return null;

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(event.target.value);
  };

  return (
    <Box>
      <Button
        margin={8}
        onClick={handleHomeButtonClick}
        style={{ backgroundColor: "#ED5753" }}
        css={{ fontFamily: "VT323, monospace", fontSize: "24px" }}
      >
        NiFTy cards
      </Button>
      <VStack w="100%" h="100%" p={4}>
        <Box display="flex" flexDirection="row">
          <VStack w="40%" h="40%" p={4} alignItems="flex-center">
            <Image src={card.imageUrl} alt={card.name} mr={4} />
            <Text fontFamily={fontFamily}>
              {message
                ? message
                : CategoryPlaceholderMessage[card.category as Category]}
            </Text>
          </VStack>
          <VStack w="40%" h="40%" p={4} alignItems="flex-start">
            <Text>{card.name}</Text>
            <Text>by {shortenAddress(card.creator ?? "")}</Text>
            <Text>{card.price} ETH</Text>
            <Text>{card.numberSold} sold</Text>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Input
                placeholder={
                  CategoryPlaceholderMessage[card.category as Category]
                }
                value={message}
                onChange={handleMessageChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Font Family</FormLabel>
              <Select value={fontFamily} onChange={handleFontChange}>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="fantasy">Fantasy</option>
                <option value="system-ui">System UI</option>
                <option value="ui-serif">UI Serif</option>
                <option value="apple-system">Apple System</option>
                <option value="arial">Arial</option>
                <option value="helvetica">Helvetica</option>
                <option value="times-new-roman">Times New Roman</option>
                <option value="georgia">Georgia</option>
                <option value="courier-new">Courier New</option>
                <option value="garamond">Garamond</option>
                <option value="palatino">Palatino</option>
                <option value="bookman">Bookman</option>
                <option value="impact">Impact</option>
                <option value="charcoal">Charcoal</option>
                <option value="tahoma">Tahoma</option>
                <option value="arial-black">Arial Black</option>
                <option value="jokerman">Jokerman</option>
                <option value="monaco">Monaco</option>
                <option value="copperplate">Copperplate</option>
                <option value="papyrus">Papyrus</option>
                <option value="verdana">Verdana</option>
                <option value="geneva">Geneva</option>
                <option value="trebuchet-ms">Trebuchet MS</option>
                <option value="optima">Optima</option>
                <option value="avant-garde">Avant Garde</option>
                <option value="rockwell">Rockwell</option>
                <option value="urw-gothic-l">URW Gothic L</option>
                <option value="zapfino">Zapfino</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Sender Name (optional)</FormLabel>
              <Input placeholder="Enter sender name" />
            </FormControl>
            <FormControl>
              <FormLabel>Receiver's Wallet Address</FormLabel>
              <Input
                placeholder="Enter receiver wallet address"
                value={receiverAddress}
                onChange={handleReceiverAddressChange}
              />
            </FormControl>
<Button onClick={handleBuyClick} isLoading={isLoading}  style={{ backgroundColor: "#ED5753" }}
css={{ fontFamily: "VT323, monospace", fontSize: "20px" }}>
              Buy
            </Button>{" "}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default CardDetail;
