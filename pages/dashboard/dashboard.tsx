import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, TextField, Card, CardContent, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import BuyIcon from '@mui/icons-material/ShoppingCart';
import BuyDialog from '../BuyDialog';

export default function Dashboard() {
    const [items, setItems] = useState<any[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(0);
    const [itemPrice, setItemPrice] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [buyDialogOpen, setBuyDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Check authentication and fetch items
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchItems();
            } else {
                window.location.href = '/login/login';
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'items'));
            const itemsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsList);
        } catch (error) {
            setError('Error fetching items');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (itemName && itemQuantity > 0 && itemPrice > 0) {
            try {
                await addDoc(collection(db, 'items'), {
                    name: itemName,
                    quantity: itemQuantity,
                    price: itemPrice,
                    userId: user?.uid,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                setSuccess('Item added successfully!');
                fetchItems();
                setItemName('');
                setItemQuantity(0);
                setItemPrice(0);
            } catch (error) {
                setError('Error adding item');
            }
        } else {
            setError('Please provide valid item details');
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            setSuccess('Item removed successfully!');
            fetchItems();
        } catch (error) {
            setError('Error removing item');
        }
    };

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        setItemName(item.name);
        setItemQuantity(item.quantity);
        setItemPrice(item.price);
    };

    const handleUpdateItem = async () => {
        if (editingItem && itemName && itemQuantity > 0 && itemPrice > 0) {
            try {
                const itemRef = doc(db, 'items', editingItem.id);
                await updateDoc(itemRef, {
                    name: itemName,
                    quantity: itemQuantity,
                    price: itemPrice,
                    updatedAt: new Date()
                });
                setSuccess('Item updated successfully!');
                fetchItems();
                handleCloseEditDialog();
            } catch (error) {
                setError('Error updating item');
            }
        } else {
            setError('Please provide valid item details');
        }
    };

    const handleCloseEditDialog = () => {
        setEditingItem(null);
        setItemName('');
        setItemQuantity(0);
        setItemPrice(0);
    };

    const handleOpenBuyDialog = (item: any) => {
        setSelectedItem(item);
        setBuyDialogOpen(true);
    };

    // Handle close BuyDialog
    const handleCloseBuyDialog = () => {
        setBuyDialogOpen(false);
        setSelectedItem(null);
    };


    const refreshItems = () => {
        fetchItems();
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Pantry Dashboard
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Add New Item
                                    </Typography>
                                    <TextField
                                        label="Item Name"
                                        fullWidth
                                        margin="normal"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                    />
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={itemQuantity}
                                        onChange={(e) => setItemQuantity(Number(e.target.value))}
                                    />
                                    <TextField
                                        label="Price"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={itemPrice}
                                        onChange={(e) => setItemPrice(Number(e.target.value))}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddItem}
                                        sx={{ mt: 2 }}
                                    >
                                        Add Item
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Inventory
                            </Typography>
                            {items.length === 0 ? (
                                <Typography>No items in the inventory</Typography>
                            ) : (
                                items.map((item) => (
                                    <Card key={item.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item xs>
                                                    <Typography variant="h6">{item.name}</Typography>
                                                    <Typography>Quantity: {item.quantity}</Typography>
                                                    <Typography>Price: ${item.price.toFixed(2)}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<BuyIcon />}
                                                        onClick={() => handleOpenBuyDialog(item)}
                                                        
                                                    >
                                                        Buy
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<RemoveIcon />}
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        sx={{ ml: 2 }}
                                                    >
                                                        Remove
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditItem(item)}
                                                        sx={{ ml: 2 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </Grid>
                    </Grid>


                    {selectedItem && (
                        <BuyDialog
                            open={buyDialogOpen}
                            onClose={handleCloseBuyDialog}
                            item={selectedItem}
                            refreshItems={refreshItems}
                        />
                    )}
                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={() => setError(null)}
                    >
                        <Alert onClose={() => setError(null)} severity="error">
                            {error}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={!!success}
                        autoHideDuration={6000}
                        onClose={() => setSuccess(null)}
                    >
                        <Alert onClose={() => setSuccess(null)} severity="success">
                            {success}
                        </Alert>
                    </Snackbar>

                    <Dialog open={!!editingItem} onClose={handleCloseEditDialog}>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Item Name"
                                fullWidth
                                margin="normal"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={itemQuantity}
                                onChange={(e) => setItemQuantity(Number(e.target.value))}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={itemPrice}
                                onChange={(e) => setItemPrice(Number(e.target.value))}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateItem} color="primary">
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
}
