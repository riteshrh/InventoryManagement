import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const fetchPantryItems = async () => {
  const querySnapshot = await getDocs(collection(db, 'items'));
  return querySnapshot.docs.map(doc => doc.data());
};
