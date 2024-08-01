import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

export const addCustomer = async (name: string, email: string, notify: boolean, purchasedItems: string[]) => {
    try {
      await addDoc(collection(db, 'customers'), {
        name,
        email,
        notify,
        purchasedItems,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

export const getCustomers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'customers'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const updateCustomerNotification = async (customerId: string) => {
  try {
    const customerDocRef = doc(db, 'customers', customerId);
    await updateDoc(customerDocRef, {
      lastNotified: new Date()
    });
  } catch (error) {
    console.error('Error updating customer notification:', error);
  }
};
