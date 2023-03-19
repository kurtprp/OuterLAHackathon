import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import firebase from "firebase/compat/app";
import deployCreatorContract from "../contract/deployContract";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface CardData {
  id: string;
  image: string;
  price: number;
  creatorName: string;
  numberSold: number;
  creator: string;
  imageUrl: string;
  name: string;
}

export async function getCardsFromFirestore(): Promise<CardData[]> {
  const cardsCol = collection(db, "cards");
  const cardsSnapshot = await getDocs(cardsCol);
  const cards = cardsSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as CardData)
  );
  return cards;
}

export async function getCardsByCreator(
  creatorWallet: string
): Promise<CardData[]> {
  const cardsQuery = query(
    collection(db, "cards"),
    where("creator", "==", creatorWallet)
  );
  const cardsSnapshot = await getDocs(cardsQuery);
  const cards = cardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CardData[];

  return cards;
}

// add transaction to firestore
export async function addTransaction(
  cardId: string,
  buyer: string,
  receiver: string,
  tx: string
): Promise<void> {
  // add data under purchases collection by buyer id
  await addDoc(collection(db, "purchases", buyer), {
    cardId,
    receiver,
    tx,
    // server timestamp
    ts: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export async function getCardFromFirestore(cardId: string): Promise<CardData> {
  const cardDoc = await getDoc(doc(db, "cards", cardId));
  const cardData = { id: cardDoc.id, ...cardDoc.data() } as CardData;
  return cardData;
}

export async function uploadCard(
  image: File,
  price: number,
  name: string,
  creatorWallet: string
): Promise<void> {
  const storage = getStorage(app);
  const imageRef = ref(storage, `cards/${creatorWallet}/${image.name}`);
  const uploadTask = uploadBytesResumable(imageRef, image);

  try {
    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(imageRef);
          const contract = await deployCreatorContract(
            creatorWallet,
            price.toString()
          );

          const cardData = {
            imageUrl: downloadURL,
            price,
            name,
            creator: creatorWallet,
            numberSold: 0,
            contractAddress: contract,
          };
          await addDoc(collection(db, "cards"), cardData);
          resolve(null);
        }
      );
    });
  } catch (error) {
    console.error("Failed to upload card:", error);
    throw error;
  }
}
