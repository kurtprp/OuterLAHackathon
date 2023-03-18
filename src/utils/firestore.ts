import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getCardsFromFirestore() {
  const cardsCol = collection(db, "cards");
  const cardsSnapshot = await getDocs(cardsCol);
  const cards = cardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return cards;
}

export async function getCardFromFirestore(cardId: string) {
  const cardDoc = await getDoc(doc(db, "cards", cardId));
  const cardData = { id: cardDoc.id, ...cardDoc.data() };
  return cardData;
}
