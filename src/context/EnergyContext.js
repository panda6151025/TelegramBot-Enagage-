// import React, { createContext, useState, useEffect, useRef } from "react";
// import { collection, getDocs, updateDoc } from "firebase/firestore";
// import { db } from "../firebase";

// const EnergyContext = createContext();

// const refillTime = 2 * 60 * 1000; // 2 minutes in milliseconds
// const debounceTime = 5000; // Debounce time to reduce Firestore writes (5 seconds)

// const EnergyProvider = ({ children }) => {
//   const [energy, setEnergy] = useState(500);
//   const [displayEnergy, setDisplayEnergy] = useState(500);
//   const [idme, setIdme] = useState("");
//   const [count, setCount] = useState(0);

//   const energyRef = useRef(energy);
//   const countRef = useRef(count);
//   const idmeRef = useRef(idme);

//   useEffect(() => {
//     energyRef.current = energy;
//     countRef.current = count;
//     idmeRef.current = idme;
//   }, [energy, count, idme]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (energyRef.current < 500) {
//         setEnergy((prevEnergy) => {
//           const newEnergy = Math.min(prevEnergy + 2, 500);
//           setDisplayEnergy(newEnergy); // Update display energy when refilling
//           return newEnergy;
//         });
//       }
//     }, refillTime / 100);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handleUpdateFirestore = async () => {
//       if (idmeRef.current) {
//         try {
//           const userRef = collection(db, "telegramUsers");
//           const querySnapshot = await getDocs(userRef);
//           querySnapshot.forEach((doc) => {
//             if (doc.data().userId === idmeRef.current) {
//               updateDoc(doc.ref, { count: countRef.current, energy: energyRef.current, lastInteraction: new Date() });
//             }
//           });
//           console.log("User stats updated:", { count: countRef.current, energy: energyRef.current });
//         } catch (e) {
//           console.error("Error updating document: ", e);
//         }
//       }
//     };

//     const debouncedUpdate = setTimeout(handleUpdateFirestore, debounceTime);
//     return () => clearTimeout(debouncedUpdate);
//   }, [energy, count, idme]);

//   return (
//     <EnergyContext.Provider
//       value={{
//         energy,
//         setEnergy,
//         displayEnergy,
//         setDisplayEnergy,
//         idme,
//         setIdme,
//         count,
//         setCount,
//       }}
//     >
//       {children}
//     </EnergyContext.Provider>
//   );
// };

// export { EnergyContext, EnergyProvider };
