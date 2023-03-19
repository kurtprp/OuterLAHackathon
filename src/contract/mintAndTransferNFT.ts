import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { GiftNFT_ABI } from "./CardNFT"; // Make sure to import the ABI from the correct file
import detectEthereumProvider from "@metamask/detect-provider";

export const mintAndTransferNFT = async (
  contractAddress: string,
  receiver: string,
  tokenURI: string,
  nftPrice: string
) => {
  console.log(
    "mintAndTransferNFT",
    contractAddress,
    receiver,
    tokenURI,
    nftPrice
  );
  // Detect the Ethereum provider (MetaMask)
  const provider = await detectEthereumProvider();

  if (provider) {
    // Initialize web3 instance with the MetaMask provider
    const web3 = new Web3(provider as any);

    // Request account access
    const accounts = await (provider as any).request({
      method: "eth_requestAccounts",
    });
    console.log("accounts", accounts);
    const buyer = accounts[0];

    // Create a new contract instance
    const contract = new web3.eth.Contract(
      GiftNFT_ABI as AbiItem[],
      contractAddress
    );
    const nftPriceValue = web3.utils.toWei(nftPrice, "ether"); // Replace with the desired NFT price

    console.log("nftPriceValue:", nftPriceValue);
    // Estimate the gas required to call mintAndTransferNFT

    const gas = await contract.methods
      .mintAndTransferNFT(buyer, receiver, tokenURI)
      .estimateGas({
        from: buyer,
        value: nftPriceValue,
      });

    /*const gas = await contract.methods
      .mintAndTransferNFT(buyer, receiver, tokenURI)
      .estimateGas({ from: buyer, value: nftPriceValue });*/

    console.log("Gas required:", gas.toString());

    // Create the transaction object
    const transaction = {
      from: buyer,
      to: contractAddress,
      gas: gas.toString(),
      data: contract.methods
        .mintAndTransferNFT(buyer, receiver, tokenURI)
        .encodeABI(),
      value: nftPriceValue,
    };

    // Send the transaction
    const tx = await (provider as any)
      .request({
        method: "eth_sendTransaction",
        params: [transaction],
      })
      .then((txHash: string) => {
        console.log("Transaction hash:", txHash);
        return txHash;
      })
      .catch((error: Error) => {
        console.error("Transaction failed:", error.message);
      });
    return {
      tx,
      buyer,
    };
  } else {
    alert("Please install MetaMask.");
  }
};
