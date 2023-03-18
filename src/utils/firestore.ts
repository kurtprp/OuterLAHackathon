import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

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
    where("creatorWallet", "==", creatorWallet)
  );
  const cardsSnapshot = await getDocs(cardsQuery);
  const cards = cardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CardData[];

  return cards;
}

export async function getCardFromFirestore(cardId: string): Promise<CardData> {
  const cardDoc = await getDoc(doc(db, "cards", cardId));
  const cardData = { id: cardDoc.id, ...cardDoc.data() } as CardData;
  return cardData;
}
