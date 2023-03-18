import {
  ClaimConditionInput,
  NFTContractDeployMetadata,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";

export type SmartContract = {
  address: string;
  contractType:
    | "custom"
    | "edition-drop"
    | "edition"
    | "marketplace"
    | "multiwrap"
    | "nft-collection"
    | "nft-drop"
    | "pack"
    | "signature-drop"
    | "split"
    | "token-drop"
    | "token"
    | "vote";
  metadata: any;
  totalSupply: string;
  updatedAt: Date;
};

const deployNFTDrop = async (
  chain: string,
  collectionName: string,
  description?: string,
  collectionUrl?: string,
  image?: string,
  maxTotalSupply?: string,
  passedSdk?: ThirdwebSDK
) => {
  const sdk = passedSdk || (await getSdk(chain));
  const deployerAddress = await sdk.getSigner()?.getAddress();
  if (!deployerAddress) {
    throw new Error("No address found");
  }

  try {
    const callData: NFTContractDeployMetadata = {
      name: collectionName,
      primary_sale_recipient: deployerAddress,
    };
    if (description) {
      callData["description"] = description;
    }
    if (image) {
      callData["image"] = image;
    }
    if (collectionUrl) {
      callData["external_link"] = collectionUrl;
    }
    console.log("callData", callData);
    const contractAddress = await sdk.deployer.deployNFTDrop(callData);
    const nftCollection = await sdk.getContract(contractAddress);

    if (maxTotalSupply) {
      await nftCollection.call("setMaxTotalSupply", Number(maxTotalSupply));
    }

    return { contractAddress, sdk };
  } catch (error) {
    return { error: { message: "Error deploying constract", error } };
  }
};

const deployCollectionContract = async (
  chain: string,
  collectionName: string,
  description?: string,
  collectionUrl?: string,
  image?: string
) => {
  const sdk = await getSdk(chain);
  const deployerAddress = await sdk.getSigner()?.getAddress();
  if (!deployerAddress) {
    throw new Error("No address found");
  }

  try {
    const callData: NFTContractDeployMetadata = {
      name: collectionName,
      primary_sale_recipient: deployerAddress,
    };
    if (description) {
      callData["description"] = description;
    }
    if (image) {
      callData["image"] = image;
    }
    if (collectionUrl) {
      callData["external_link"] = collectionUrl;
    }
    console.log("callData", callData);
    const contractAddress = await sdk.deployer.deployNFTCollection(callData);
    return { contractAddress };
  } catch (error) {
    return { error: { message: "Error deploying constract", error } };
  }
};

async function getSdk(chain: string) {
  const [
    { default: Web3Modal },
    { default: WalletConnectProvider },
    { default: CoinbaseWalletSDK },
    { Web3Provider },
  ] = await Promise.all([
    import("web3modal"),
    import("@walletconnect/web3-provider"),
    import("@coinbase/wallet-sdk"),
    import("@ethersproject/providers"),
  ]);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          "1": process.env.NEXT_PUBLIC_ALCHEMY_ETH_RPC,
        },
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Preparty",
        rpc: process.env.NEXT_PUBLIC_ALCHEMY_ETH_RPC,
        chainId: 1,
        darkMode: false,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: chain,
    cacheProvider: false,
    providerOptions,
  });

  const instance = await web3Modal.connect();
  const provider = new Web3Provider(instance);
  const signer = provider.getSigner();
  const sdk = ThirdwebSDK.fromSigner(signer, chain);

  return sdk;
}

const getAllNfts = async (
  SmartContractAddress: string,
  chain: string,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftDrop = await sdk.getContract(SmartContractAddress);

  const result = await nftDrop.erc721.getAll();
  return { result, sdk };
};

const addPriceClaim = async (
  SmartContractAddress: string,
  chain: string,
  price: number,
  startTime?: Date,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  // price must be non zero
  if (price <= 0) {
    return { error: { message: "Price must be greater than 0" } };
  }
  const nftDrop = await sdk.getContract(SmartContractAddress);

  const condition: ClaimConditionInput = {};
  if (startTime) {
    condition.startTime = startTime;
  }

  condition.price = price;

  const result = await nftDrop.erc721.claimConditions.set([condition]);
  return { result, sdk };
};

const addClaim = async (
  SmartContractAddress: string,
  chain: string,
  startTime?: Date,
  toAddresses?: string[],
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftDrop = await sdk.getContract(SmartContractAddress);

  const condition: ClaimConditionInput = {};
  if (startTime) {
    condition.startTime = startTime;
  }
  if (toAddresses && toAddresses.length > 0) {
    //convert toaddresses to map of address and maxClaimable 1
    const toAddressMap: {
      maxClaimable?: string | number | undefined;
      address: string;
    }[] = [];
    toAddresses.forEach((address) => {
      toAddressMap.push({ address, maxClaimable: 1 });
    });
    console.log("toAddressMap", toAddressMap);

    condition.snapshot = toAddresses;
  }

  const result = await nftDrop.erc721.claimConditions.set([condition]);
  return { result, sdk };
};

const claimTo = async (
  toAddress: string,
  SmartContractAddress: string,
  chain: string,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftCollection = await sdk.getContract(SmartContractAddress);

  const result = await nftCollection.erc721.claimTo(toAddress, 1);
  return { result, sdk };
};

const mintTo = async (
  toAddress: string,
  SmartContractAddress: string,
  chain: string,
  name: string,
  description: string,
  image: string | ArrayBuffer | null,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftCollection = await sdk.getContract(SmartContractAddress);

  const metadata = {
    name,
    description,
    image,
  };

  const minted = await nftCollection.erc721.mintTo(toAddress, metadata);
  return { minted, sdk };
};

const getSmartContractList = async (
  address: string,
  chain: string,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  console.log("getting smart contract for address:", address);
  const nftCollection = await sdk.getContractList(address);
  return { nftCollection, sdk };
};

const getSmartContract = async (
  address: string,
  chain: string,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  console.log("getting smart contract for address:", address);
  const nftCollection = await sdk.getContract(address);
  return { nftCollection, sdk };
};

const batchLazyMint = async (
  SmartContractAddress: string,
  chain: string,
  metadatas: {
    name: string;
    description: string;
    image: string | ArrayBuffer | null;
  }[],
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftCollection = await sdk.getContract(SmartContractAddress);

  const minted = await nftCollection.erc721.lazyMint(metadatas);
  return { minted, sdk };
};

const lazyMint = async (
  SmartContractAddress: string,
  chain: string,
  name: string,
  description: string,
  image: string | ArrayBuffer | null,
  passedSdk?: ThirdwebSDK
) => {
  let sdk = passedSdk;
  if (!sdk) {
    sdk = await getSdk(chain);
  }
  const nftCollection = await sdk.getContract(SmartContractAddress);

  const metadata = {
    name,
    description,
    image,
  };

  const [minted] = await nftCollection.erc721.lazyMint([metadata]);
  return { minted, sdk };
};

export {
  mintTo,
  deployCollectionContract,
  deployNFTDrop,
  addClaim,
  addPriceClaim,
  claimTo,
  lazyMint,
  batchLazyMint,
  getSmartContractList,
  getSmartContract,
  getAllNfts,
};
