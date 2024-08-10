import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import { useLocation } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  // const [totalBalance, setTotalBalance] = useState(0);
  const [tapBalance, setTapBalance] = useState(0);
  const [level, setLevel] = useState({ class: 'bronze', bg: "#b66838", id: 1, name: "Bronze Coin", imgUrl: "/Bronze.webp" }); // Initial level as an object with id and name
  const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(500);
  const [battery, setBattery] = useState({ level: 1, energy: 500 });
  const [initialized, setInitialized] = useState(false);
  const [refBonus, SetRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [shooters, setShooters] = useState(10);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]); // State to hold referrals
  const location = useLocation();
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [totalScore, setTotalScore] = useState(0);

  const sendUserData = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    let referrerId = queryParams.get("ref");
    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
    }

    if (telegramUser) {
      const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

      // Use first name and ID as username if no Telegram username exists
      const finalUsername = username || `${firstName}_${userId}`;

      try {
        const tasksRef = collection(db, 'telegramUsers');
        const querySnapshot = await getDocs(tasksRef);
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        const myString = JSON.stringify(tasks);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(myString));
        downloadLink.setAttribute('download', 'data.txt');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        const userRef = doc(db, 'telegramUsers', userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          console.log('User already exists in Firestore');
          const userData = userDoc.data();
          setBalance(userData.balance);
          setTapBalance(userData.tapBalance);
          setTapValue(userData.tapValue);
          setClaimedMilestones(userData.claimedMilestones || []);
          setClaimedReferralRewards(userData.claimedReferralRewards || []);
          setEnergy(userData.energy);
          setBattery(userData.battery);
          setShooters(userData.shooters);
          setTotalScore(userData.totalScore);
          setLevel(userData.level);
          setId(userData.userId);
          SetRefBonus(userData.refBonus || 0);
          await updateEnergy(userRef, userData.battery.energy);
          await updateReferrals(userRef);
          setInitialized(true);
          setLoading(false);
          fetchData(userData.userId); // Fetch data for the existing user
          console.log("Battery is:", userData.battery.energy)
          return;
        }

        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          firstName,
          lastName,
          totalBalance: 0,
          shooters: 10,
          balance: 0,
          totalScore: 0,
          tapBalance: 0,
          tapValue: { level: 1, value: 1 },
          level: { class: 'bronze', bg: "#b66838", id: 1, name: "Bronze Coin", imgUrl: "/Bronze.webp" }, // Set the initial level with id and name
          energy: 500,
          battery: { level: 1, energy: 500 },
          refereeId: referrerId || null,
          referrals: []
        };

        await setDoc(userRef, userData);
        console.log('User saved in Firestore');
        setEnergy(500)
        setShooters(10)
        setId(userId.toString()); // Set the id state for the new user

        if (referrerId) {
          const referrerRef = doc(db, 'telegramUsers', referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { class: 'bronze', bg: "#b66838", id: 1, name: "Bronze Coin", imgUrl: "/Bronze.webp" }, // Include level with id and name
              })
            });
            console.log('Referrer updated in Firestore');
          }
        }

        setInitialized(true);
        setLoading(false);
        fetchData(userId.toString()); // Fetch data for the new user

      } catch (error) {
        console.error('Error saving user in Firestore:', error);
      }
    }
  };

  const updateEnergy = async (userRef, batteryValue) => {
    const savedEndTime = localStorage.getItem('endTime');
    const savedEnergy = localStorage.getItem('energy');
    const endTime = new Date(savedEndTime);
    const newTimeLeft = endTime - new Date();
    if (newTimeLeft < 0 && savedEnergy <= 0) {
      try {
        await updateDoc(userRef, { energy: batteryValue });
        setEnergy(batteryValue);
        console.log('Energy updated in Firestore');
      } catch (error) {
        console.error('Error updating energy:', error);
      }
    }
  };

  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
      const referralRef = doc(db, 'telegramUsers', referral.userId);
      const referralDoc = await getDoc(referralRef);
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        return {
          ...referral,
          balance: referralData.balance,
          level: referralData.level,
        };
      }
      return referral;
    }));

    await updateDoc(userRef, {
      referrals: updatedReferrals,
    });

    const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
    const refBonus = Math.floor(totalEarnings * 0.1);
    const totalBalance = `${balance}` + refBonus;
    console.log(`Total earnings: ${totalEarnings}, Referrer bonus: ${refBonus}`);

    // Save the refBonus to the user's document
    try {
      await updateDoc(userRef, { refBonus, totalBalance });
      console.log('Referrer bonus updated in Firestore');
      console.log('Your balance is:', `${balance}`);
    } catch (error) {
      console.error('Error updating referrer bonus:', error);
    }
  };

  const fetchData = async (userId) => {
    if (!userId) return; // Ensure userId is set
    try {
      // Fetch tasks
      const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);

      // Fetch user data
      const userDocRef = doc(db, 'telegramUsers', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
      }

      // Fetch manual tasks
      const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
      const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(manualTasksData);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchReferrals = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setReferrals(userData.referrals || []);
      }
      setLoading(false);
    }
  };

  const updateUserLevel = async (userId, newTapBalance) => {
    let newLevel = { class: 'bronze', bg: "#b66838", id: 1, name: "Bronze Coin", imgUrl: "/Bronze.webp" };

    if (newTapBalance >= 100 && newTapBalance < 50000) {
      newLevel = { class: 'silver', bg: "#b66838", id: 2, name: "Silver Coin", imgUrl: "/Silver.webp" };
    } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
      newLevel = { class: 'gold', bg: "#b66838", id: 3, name: "Gold Coin", imgUrl: "/Gold.webp" };
    } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
      newLevel = { class: 'platinum', bg: "#b66838", id: 4, name: "Platinum Coin", imgUrl: "/Platinum.webp" };
    } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
      newLevel = { class: 'diamond', bg: "#b66838", id: 5, name: "Diamond Coin", imgUrl: "/Diamond.webp" };
    } else if (newTapBalance >= 2500000) {
      newLevel = { class: 'legendary', bg: "#b66838", id: 6, name: "Legendary Coin", imgUrl: "/Legendary.webp" };
    }

    if (newLevel.id !== level.id) {
      setLevel(newLevel);
      const userRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userRef, { level: newLevel });
      console.log(`User level updated to ${newLevel.name}`);
    }
  };

  useEffect(() => {

    const rewards = document.getElementById('reels');
    const foots = document.getElementById('footermain');

    if (location.pathname === '/rewards') {
      rewards.style.background = `${level.bg}`;
      rewards.style.color = "#000";
      rewards.style.width = "50px";
      rewards.style.height = "50px";
      rewards.style.marginBottom = "4px";
    } else {
      rewards.style.background = "";
      rewards.style.color = "";
      rewards.style.width = "";
      rewards.style.height = "";
      rewards.style.marginBottom = "";

    }

    if (location.pathname === '/') {

      foots.style.background = "transparent"

    } else {
      foots.style.background = ""

    }

  })




  useEffect(() => {
    sendUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      updateUserLevel(id, tapBalance);
    }
    // eslint-disable-next-line
  }, [tapBalance, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <UserContext.Provider value={{ balance, battery, setBattery, tapValue, setTapValue, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, SetRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones, referrals, claimedReferralRewards, setClaimedReferralRewards, shooters, setShooters, totalScore, setTotalScore }}>
      {children}
    </UserContext.Provider>
  );
};
