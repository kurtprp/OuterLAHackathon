import { create } from "ipfs-http-client";
import axios from "axios";

const apiKeySecret = process.env.REACT_APP_infura_api_key;
if (!apiKeySecret) throw new Error("No Infura API key found in env file.");

const projectId = "2NFVdvQeZYyBwqXL3g2oqpa3K0v";
const apiKey = apiKeySecret;
console.log(
  "apiKey",
  apiKey,
  "projectId",
  projectId,
  `https://ipfs.infura.io:5001/api/v0?api-key=${apiKey}&project_id=${projectId}`
);
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    Authorization: `Basic ${Buffer.from(`${projectId}:${apiKey}`).toString(
      "base64"
    )}`,
  },
});
async function downloadImage(imageUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = response.data;
    return buffer;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

async function uploadToIPFS(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await ipfs.add(new Uint8Array(buffer));
    return result.path;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
}

export async function createTokenURI(
  imageUrl: string,
  message: string,
  cardName: string
): Promise<string> {
  console.log("imageUrl", imageUrl, "message", message, "cardName", cardName);
  const buffer = await downloadImage(imageUrl);
  const ipfsHash = await uploadToIPFS(buffer);
  const ipfsURL = `ipfs://${ipfsHash}`;
  const metadata = {
    name: cardName ? cardName : "My NFT",
    description: message,
    image: ipfsURL,
  };

  const metadataBuffer = new TextEncoder().encode(JSON.stringify(metadata));
  const metadataIPFSHash = await uploadToIPFS(metadataBuffer);
  const tokenURI = `ipfs://${metadataIPFSHash}`;
  return tokenURI;
}
