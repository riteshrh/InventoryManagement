// import { useState, useEffect } from 'react';
// import { Box, Typography, Grid, TextField, Button, Avatar } from '@mui/material';
// import { auth, db } from '../firebaseConfig'; // Ensure the path is correct
// import { onAuthStateChanged, updatePassword } from 'firebase/auth';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// const Profile = () => {
//     const [user, setUser] = useState<any>(null);
//     const [profileData, setProfileData] = useState<any>({});
//     const [newPassword, setNewPassword] = useState('');

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUser(user);
//                 fetchProfileData(user.uid);
//             } else {
//                 window.location.href = '/login/login';
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const fetchProfileData = async (userId: string) => {
//         try {
//             const docRef = doc(db, 'users', userId);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 setProfileData(docSnap.data());
//             } else {
//                 console.log('No such document!');
//             }
//         } catch (error) {
//             console.error('Error fetching profile data:', error);
//         }
//     };

//     const handleUpdateProfile = async () => {
//         try {
//             const docRef = doc(db, 'users', user.uid);
//             await updateDoc(docRef, profileData);
//             alert('Profile updated successfully');
//         } catch (error) {
//             console.error('Error updating profile:', error);
//         }
//     };

//     const handleChangePassword = async () => {
//         try {
//             if (auth.currentUser) {
//                 await updatePassword(auth.currentUser, newPassword);
//                 alert('Password updated successfully');
//             }
//         } catch (error) {
//             console.error('Error updating password:', error);
//         }
//     };

//     return (
//         <Box p={3}>
//             <Typography variant="h4" gutterBottom>
//                 Profile
//             </Typography>
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
//                     <TextField
//                         label="Full Name"
//                         fullWidth
//                         margin="normal"
//                         value={profileData.name || ''}
//                         onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                     />
//                     <TextField
//                         label="Email"
//                         fullWidth
//                         margin="normal"
//                         value={profileData.email || ''}
//                         disabled
//                     />
//                     <TextField
//                         label="Phone Number"
//                         fullWidth
//                         margin="normal"
//                         value={profileData.phone || ''}
//                         onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
//                     />
//                     <TextField
//                         label="Address"
//                         fullWidth
//                         margin="normal"
//                         value={profileData.address || ''}
//                         onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
//                     />
//                     <Button variant="contained" color="primary" onClick={handleUpdateProfile} sx={{ mt: 2 }}>
//                         Update Profile
//                     </Button>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="h6" gutterBottom>
//                         Change Password
//                     </Typography>
//                     <TextField
//                         label="New Password"
//                         type="password"
//                         fullWidth
//                         margin="normal"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                     <Button variant="contained" color="primary" onClick={handleChangePassword} sx={{ mt: 2 }}>
//                         Change Password
//                     </Button>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default Profile;
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Profile() {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const querySnapshot = await getDocs(collection(db, 'suggestions'));
      const suggestionsList = querySnapshot.docs.map(doc => doc.data());
      setSuggestions(suggestionsList);
    };

    fetchSuggestions();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {suggestions.length === 0 ? (
        <Typography>No suggestions available</Typography>
      ) : (
        suggestions.map((suggestion, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{suggestion.title}</Typography>
              <Typography>{suggestion.description}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
