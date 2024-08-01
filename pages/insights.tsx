import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Insights() {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [itemCount, setItemCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'items'));
                let itemsList = querySnapshot.docs.map(doc => doc.data());
                
                setItemCount(itemsList.length);

                let totalValueSum = itemsList.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0);
                setTotalValue(totalValueSum);

                setTotalItems(itemsList.reduce((sum: number, item: any) => sum + item.quantity, 0));
            } catch (error) {
                setError('Error fetching insights');
            }
        };

        fetchInsights();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Pantry Insights
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Items</Typography>
                            <Typography variant="h4">{totalItems}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Inventory Value</Typography>
                            <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Item Count</Typography>
                            <Typography variant="h4">{itemCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Error Notification */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
