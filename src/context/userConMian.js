// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { db } from '../firebase'; // Adjust the path as needed

// const UserMainContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [balance, setBalance] = useState(null);
//   const [level, setLevel] = useState("Bronze");
//   const [id, setId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [energy, setEnergy] = useState(0);
//   const [initialized, setInitialized] = useState(false);

//   const sendUserData = async () => {
//     const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//     const queryParams = new URLSearchParams(window.location.search);
//     let referrerId = queryParams.get("ref");
//     if (referrerId) {
//       referrerId = referrerId.replace(/\D/g, "");
//     }

//     if (telegramUser) {
//       const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

//       try {
//         const userRef = doc(db, 'telegramUsers', userId.toString());
//         const userDoc = await getDoc(userRef);
//         if (userDoc.exists()) {
//           console.log('User already exists in Firestore');
//           const userData = userDoc.data();
//           setBalance(userData.balance);
//           setEnergy(userData.energy);
//           setLevel(userData.level);
//           await updateEnergy(userRef);
//           await updateReferrals(userRef);
//           setInitialized(true);
//           setLoading(false);
//           return;
//         }

//         const userData = {
//           userId: userId.toString(),
//           username,
//           firstName,
//           lastName,
//           balance: 0,
//           level: level,
//           energy: 1000,
//           refereeId: referrerId || null,
//           referrals: []
//         };

//         await setDoc(userRef, userData);
//         console.log('User saved in Firestore');
//         setEnergy(1000);

//         if (referrerId) {
//           const referrerRef = doc(db, 'telegramUsers', referrerId);
//           const referrerDoc = await getDoc(referrerRef);
//           if (referrerDoc.exists()) {
//             await updateDoc(referrerRef, {
//               referrals: arrayUnion({
//                 userId: userId.toString(),
//                 username: username,
//                 balance: 0,
//                 level: level,
//               })
//             });
//             console.log('Referrer updated in Firestore');
//           }
//         }
//       } catch (error) {
//         console.error('Error saving user in Firestore:', error);
//       }
//     }
//   };

//   const updateEnergy = async (userRef) => {
//     const savedEndTime = localStorage.getItem('endTime');
//     const savedEnergy = localStorage.getItem('energy');
//     const endTime = new Date(savedEndTime);
//     const newTimeLeft = endTime - new Date();
//     if (newTimeLeft < 0 && savedEnergy <= 0) {
//       try {
//         await updateDoc(userRef, { energy: 1000 });
//         setEnergy(1000);
//         console.log('Energy updated in Firestore');
//       } catch (error) {
//         console.error('Error updating energy:', error);
//       }
//     }
//   };

//   const updateReferrals = async (userRef) => {
//     const userDoc = await getDoc(userRef);
//     const userData = userDoc.data();
//     const referrals = userData.referrals || [];

//     const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
//       const referralRef = doc(db, 'telegramUsers', referral.userId);
//       const referralDoc = await getDoc(referralRef);
//       if (referralDoc.exists()) {
//         const referralData = referralDoc.data();
//         return {
//           ...referral,
//           balance: referralData.balance,
//           level: referralData.level,
//         };
//       }
//       return referral;
//     }));

//     await updateDoc(userRef, {
//       referrals: updatedReferrals,
//     });
//   };

//   useEffect(() => {
//     sendUserData();
//   }, []);

  

//   return (
//     <UserMainContext.Provider value={{ balance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized }}>
//       {children}
//     </UserMainContext.Provider>
//   );
// };
