import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { GiftNFT_ABI, GiftNFT_BYTECODE } from "./CardNFT"; // Make sure to import the ABI and bytecode from the correct file

const deployCreatorContract = async (
  creatorAddress: string,
  ethPrice: string
) => {
  // 0x9Ee15C0d1d5043Cd26f9b87aCeaF9e9eE21b7Db7
  console.log(
    "creatorAddress",
    creatorAddress,
    "ethPrice",
    ethPrice,
    process.env
  );
  const privateKey = process.env.REACT_APP_WPRIVATE_KEY;
  if (!privateKey)
    throw new Error("No private key found in env file. (WPRIVATE_KEY)");

  const web3 = new Web3(
    "https://goerli.infura.io/v3/5de26548465e408590b26ae877233908"
  ); // Replace with your Infura Project ID
  const accountFromPrivateKey =
    web3.eth.accounts.privateKeyToAccount(privateKey);
  const account = accountFromPrivateKey.address;

  if (web3 && account) {
    const creator = creatorAddress; // Replace with the desired creator address
    const nftPrice = web3.utils.toWei(ethPrice, "ether"); // Replace with the desired NFT price

    const contract = new web3.eth.Contract(GiftNFT_ABI as AbiItem[]);

    // Calculate gas price and nonce for the transaction
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(account);

    const data = contract
      .deploy({
        data: GiftNFT_BYTECODE,
        arguments: [creator, nftPrice],
      })
      .encodeABI();

    const transaction = {
      from: account,
      gasPrice: gasPrice,
      nonce: nonce,
      data: data,
      gas: 6000000,
    };

    try {
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction + ""
      );
      console.log("Contract deployed at:", receipt);
      return receipt.contractAddress;
    } catch (err) {
      console.error("Contract deployment failed:", err);
    }
  } else {
    alert("Failed to create web3 instance or set account.");
  }
};

export default deployCreatorContract;
