// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
// import { db } from '../firebase'; // Adjust the path as needed

// const UserContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [balance, setBalance] = useState(0);
//   const [tapBalance, setTapBalance] = useState(0);
//   const [level, setLevel] = useState({ id: 1, name: "Lucky Charm", imgUrl: "https://ucarecdn.com/623a9a66-8956-44b0-b392-0d49dd817dfb/bronze.webp" }); // Initial level as an object with id and name
//   const [id, setId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [energy, setEnergy] = useState(0);
//   const [initialized, setInitialized] = useState(false);
//   const [refBonus, SetRefBonus] = useState(0);
//   const [manualTasks, setManualTasks] = useState([]);
//   const [userManualTasks, setUserManualTasks] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks
//   const [claimedMilestones, setClaimedMilestones] = useState([]);


//   const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;

//   const sendUserData = async () => {
//     const queryParams = new URLSearchParams(window.location.search);
//     let referrerId = queryParams.get("ref");
//     if (referrerId) {
//       referrerId = referrerId.replace(/\D/g, "");
//     }

//     if (telegramUser) {
//       const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

//       // Use first name and ID as username if no Telegram username exists
//       const finalUsername = username || `${firstName}_${userId}`;

//       try {
//         const userRef = doc(db, 'telegramUsers', userId.toString());
//         const userDoc = await getDoc(userRef);
//         if (userDoc.exists()) {
//           console.log('User already exists in Firestore');
//           const userData = userDoc.data();
//           setBalance(userData.balance);
//           setTapBalance(userData.tapBalance);
//           setClaimedMilestones(userData.claimedMilestones || []);
//           setEnergy(userData.energy);
//           setLevel(userData.level);
//           setId(userData.userId);
//           SetRefBonus(userData.refBonus || 0);
//           await updateEnergy(userRef);
//           await updateReferrals(userRef);
//           setInitialized(true);
//           setLoading(false);
//           fetchData(userData.userId); // Fetch data for the existing user
//           return;
//         }

//         const userData = {
//           userId: userId.toString(),
//           username: finalUsername,
//           firstName,
//           lastName,
//           balance: 0,
//           tapBalance: 0,
//           level: { id: 1, name: "Lucky Charm", imgUrl: "https://ucarecdn.com/623a9a66-8956-44b0-b392-0d49dd817dfb/bronze.webp" }, // Set the initial level with id and name
//           energy: 1000,
//           refereeId: referrerId || null,
//           referrals: []
//         };

//         await setDoc(userRef, userData);
//         console.log('User saved in Firestore');
//         setEnergy(1000);
//         setId(userId.toString()); // Set the id state for the new user

//         if (referrerId) {
//           const referrerRef = doc(db, 'telegramUsers', referrerId);
//           const referrerDoc = await getDoc(referrerRef);
//           if (referrerDoc.exists()) {
//             await updateDoc(referrerRef, {
//               referrals: arrayUnion({
//                 userId: userId.toString(),
//                 username: finalUsername,
//                 balance: 0,
//                 level: { id: 1, name: "Lucky Charm", imgUrl: "https://ucarecdn.com/623a9a66-8956-44b0-b392-0d49dd817dfb/bronze.webp" }, // Include level with id and name
//               })
//             });
//             console.log('Referrer updated in Firestore');
//           }
//         }
        
//         setInitialized(true);
//         setLoading(false);
//         fetchData(userId.toString()); // Fetch data for the new user

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
//         await updateDoc(userRef, { energy: 20 });
//         setEnergy(20);
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

//     const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
//     const refBonus = Math.floor(totalEarnings * 0.1);
//     console.log(`Total earnings: ${totalEarnings}, Referrer bonus: ${refBonus}`);

//     // Save the refBonus to the user's document
//     try {
//       await updateDoc(userRef, { refBonus });
//       console.log('Referrer bonus updated in Firestore');
//     } catch (error) {
//       console.error('Error updating referrer bonus:', error);
//     }
//   };

//   const fetchData = async (userId) => {
//     if (!userId) return; // Ensure userId is set
//     try {
//       // Fetch tasks
//       const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
//       const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTasks(tasksData);

//       // Fetch user data
//       const userDocRef = doc(db, 'telegramUsers', userId);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         setBalance(userData.balance);
//         setCompletedTasks(userData.tasksCompleted || []);
//         setUserManualTasks(userData.manualTasks || []);
//       }

//       // Fetch manual tasks
//       const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
//       const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setManualTasks(manualTasksData);

//     } catch (error) {
//       console.error("Error fetching data: ", error);
//     }
//   };

//   const updateUserLevel = async (userId, newTapBalance) => {
//     let newLevel = { id: 1, name: "Lucky Charm", imgUrl: "https://ucarecdn.com/623a9a66-8956-44b0-b392-0d49dd817dfb/bronze.webp" };

//     if (newTapBalance >= 1000 && newTapBalance < 50000) {
//       newLevel = { id: 2, name: "Fortune Finder", imgUrl: "https://ucarecdn.com/897972b0-9a8e-4010-9659-d0410ccdd434/silver.webp" };
//     } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
//       newLevel = { id: 3, name: "Treasure Seeker", imgUrl: "https://ucarecdn.com/fd20a032-8347-40da-832a-883c626ca89a/gold.webp" };
//     } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
//       newLevel = { id: 4, name: "Prize Hunter", imgUrl: "https://ucarecdn.com/b3b6e98e-95d4-4c14-ac8c-b999e13fe6e7/platinum.webp" };
//     } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
//       newLevel = { id: 5, name: "Jackpot King", imgUrl: "https://ucarecdn.com/8205f4a9-a8e6-4c23-9460-92cdfa3f6f57/king.webp" };
//     } else if (newTapBalance >= 2500000) {
//       newLevel = { id: 6, name: "Legend Lord", imgUrl: "https://ucarecdn.com/aee9b3f4-d9e0-49f2-b46a-aef8b0ae4be7/lordlegend.webp" };
//     }

//     if (newLevel.id !== level.id) {
//       setLevel(newLevel);
//       const userRef = doc(db, 'telegramUsers', userId);
//       await updateDoc(userRef, { level: newLevel });
//       console.log(`User level updated to ${newLevel.name}`);
//     }
//   };

//   useEffect(() => {
//     sendUserData();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchData(id);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (id) {
//       updateUserLevel(id, tapBalance);
//     }
//   }, [tapBalance, id]);


//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, []);

//   return (
//     <UserContext.Provider value={{ balance, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, SetRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
