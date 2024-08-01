import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { addCustomer } from '../services/customer-service';
import { db } from '../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface BuyDialogProps {
  open: boolean;
  onClose: () => void;
  item: any;
  refreshItems: () => void;
}

export default function BuyDialog({ open, onClose, item, refreshItems }: BuyDialogProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notify, setNotify] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!customerName || !customerEmail || quantity <= 0) {
      setError('Please fill in all fields and ensure quantity is greater than zero.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', item.id);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        setError('Item does not exist.');
        return;
      }

      const currentQuantity = itemDoc.data()?.quantity;

      if (currentQuantity === undefined) {
        setError('Item quantity is undefined.');
        return;
      }

      if (currentQuantity < quantity) {
        setError('Not enough stock available.');
        return;
      }

      await addCustomer(customerName, customerEmail, notify, [item.name]); // Pass notify value

      await updateDoc(itemRef, { quantity: currentQuantity - quantity });

      refreshItems(); // Refresh the items in the dashboard
      onClose();
    } catch (error) {
      console.error('Error during purchase:', error);
      setError('An error occurred while processing your purchase.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Buy Item</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Customer Name"
          fullWidth
          margin="normal"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <TextField
          label="Customer Email"
          fullWidth
          margin="normal"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <FormControlLabel
          control={<Checkbox checked={notify} onChange={(e) => setNotify(e.target.checked)} />}
          label="Notify me about updates"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBuy} variant="contained" color="primary">Buy</Button>
      </DialogActions>
    </Dialog>
  );
}
