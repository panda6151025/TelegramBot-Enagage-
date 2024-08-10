// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import coinsmall from "../images/coinsmall.webp";
// import { NavLink } from 'react-router-dom';
// import tapmecoin from "../images/tapin.webp";
// import styled, { keyframes } from "styled-components";
// import flash from "../images/flash.webp";
// import { MdOutlineTimer } from "react-icons/md";
// import { PiHandTap, PiTimerDuotone, PiTimerFill } from 'react-icons/pi';
// import { db } from '../firebase'; // Adjust the path as needed
// import { doc, setDoc } from 'firebase/firestore';


// const slideUp = keyframes`
//   0% {
//     opacity: 1;
//     transform: translateY(0);
//   }
//   100% {
//     opacity: 0;
//     transform: translateY(-350px);
//   }
// `;

// const SlideUpText = styled.div`
//   position: absolute;
//   animation: ${slideUp} 3s ease-out;
//   font-size: 2.1em;
//   color: #ffffffa6;
//   font-weight: 600;
//   left: ${({ x }) => x}px;
//   top: ${({ y }) => y}px;
//   pointer-events: none; /* To prevent any interaction */
// `;

// const Container = styled.div`
//   position: relative;
//   display: inline-block;
//   text-align: center;
//   width: 100%;
//   height: 100%;
// `;



// const TapEarn2 = () => {
//   const imageRef = useRef(null);
//   const [clickCount, setClickCount] = useState(0);
//   const [clicks, setClicks] = useState([]);
//   const [points, setPoints] = useState(0);
//   const [balance, setBalance] = useState(0);
//   const [canClick, setCanClick] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [remainingTime, setRemainingTime] = useState(0);
//   const [clickPoints, setClickPoints] = useState(0); // New state for points accumulated during clicks
//   const [clicksRemaining, setClicksRemaining] = useState(0); // New state for clicks remaining
//   const [tapCount, setTapCount] = useState(0); 
//   const [user, setUser] = useState(null);



//   useEffect(() => {
//     if (clickCount === `${tapCount}`) {
//       setCanClick(false);
//     }
//   }, [clickCount, tapCount]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const timerEnd = localStorage.getItem('timerEnd');
//       if (timerEnd) {
//         const now = new Date().getTime();
//         const remainingTime = Math.max(0, (timerEnd - now) / 1000); // Ensure remaining time is not negative
//         if (remainingTime <= 0) {
//           setClickCount(0);
//           setClickPoints(0);
//         setClicksRemaining(tapCount);
//           setCanClick(true);
//           localStorage.removeItem('timerEnd');
//           localStorage.removeItem('clickCount');
//           localStorage.removeItem('clickPoints');
//           localStorage.setItem('clicksRemaining', tapCount);
//         }
//         setRemainingTime(remainingTime);

//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [tapCount]);


//   const handleClick = (e) => {

//     if (!canClick || clickCount >= `${tapCount}` || remainingTime > 0) {
//       return; // Don't handle click if not allowed or timer is active
      
//     }
//     console.log("CLICKS REMAINING", clicksRemaining)
//     const { offsetX, offsetY, target } = e.nativeEvent;
//     const { clientWidth, clientHeight } = target;

//     const horizontalMidpoint = clientWidth / 2;
//     const verticalMidpoint = clientHeight / 2;

//     const animationClass =
//       offsetX < horizontalMidpoint
//         ? "wobble-left"
//         : offsetX > horizontalMidpoint
//         ? "wobble-right"
//         : offsetY < verticalMidpoint
//         ? "wobble-top"
//         : "wobble-bottom";

//     // Remove previous animations
//     imageRef.current.classList.remove(
//       "wobble-top",
//       "wobble-bottom",
//       "wobble-left",
//       "wobble-right"
//     );

//     // Add the new animation class
//     imageRef.current.classList.add(animationClass);

//     // Remove the animation class after animation ends to allow re-animation on the same side
//     setTimeout(() => {
//       imageRef.current.classList.remove(animationClass);
//     }, 500); // duration should match the animation duration in CSS

//     // Increment the count
//     const rect = e.target.getBoundingClientRect();
//     const newClick = {
//       id: Date.now(), // Unique identifier
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     setClicks((prevClicks) => [...prevClicks, newClick]);
//     // Remove the click after the animation duration
//     setTimeout(() => {
//       setClicks((prevClicks) =>
//         prevClicks.filter((click) => click.id !== newClick.id)
//       );
//     }, 1000); // Match this duration with the animation duration


//     const newClickCount = clickCount + 2;
//     const newClickPoints = clickPoints + 5000; // Update points accumulated during clicks
//     setClickCount(newClickCount);
//     setClickPoints(newClickPoints);
//     const newClicksRemaining = tapCount - newClickCount;
//     setClicksRemaining(newClicksRemaining); // Update clicks remaining
//     localStorage.setItem('clickCount', newClickCount);
//     localStorage.setItem('clickPoints', newClickPoints);
//     localStorage.setItem('clicksRemaining', newClicksRemaining); 
//   };

//   const testClick = () => {

//     console.log("tapCount:", tapCount);

//   }

//   const handleClaim = async () => {
//     if (clickCount > 0) {
//         const newPoints = points + clickPoints;
//         const newBalance = balance + clickPoints;
//         setPoints(newPoints);
//         setBalance(newBalance);
  
//         // Update balance in session storage
//         sessionStorage.setItem('balance', newBalance);
  
//         if (clickCount >= `${tapCount}`) {
//           const timerEnd = new Date().getTime() + 60000; // 2 minutes from now
//           localStorage.setItem('timerEnd', timerEnd);
//           setCanClick(false);
//           setClickCount(0);
//           setClickPoints(0);
//           setClicksRemaining(0);
//           localStorage.removeItem('clickCount');
//           localStorage.removeItem('clickPoints');
//         } else {
//           setClickCount(clickCount); // Maintain current click count
//           setClickPoints(0); // Reset click points
//           localStorage.removeItem('clickPoints'); // Remove click points from local storage
//         }
  

//       // Send the updated balance to the server
//       try {
//         const response = await axios.post('http://localhost:3000/api/update-balance', { userId, balance: newBalance });
//         console.log('Balance updated:', response.data);
//       } catch (error) {
//         console.error('Error updating balance:', error);
//       }
//     }
//   };


//   const handleAddTapCount = async () => {
//     if (balance >= 1000000) {
//       const newTapCount = tapCount + 150;
  
//       try {
//         // Update tapCount in the database
//         await axios.post('http://localhost:3000/api/update-tap-count', { userId, tapCount: newTapCount });
//         console.log('tapCount updated');
  
//         // Fetch the updated user data from the server
//         const response = await axios.get(`http://localhost:3000/api/get-user/${userId}`);
//         const { tapCount: updatedTapCount } = response.data;
  
//         // Update tapCount and clicksRemaining in state and session storage
//         setTapCount(updatedTapCount);
//         sessionStorage.setItem('tapCount', updatedTapCount);
  
//         // Update clicksRemaining based on the updated tapCount
//         const updatedClicksRemaining = updatedTapCount - clickCount;
//         setClicksRemaining(updatedClicksRemaining);
//         localStorage.setItem('clicksRemaining', updatedClicksRemaining);
  
//         console.log('tapCount fetched and updated:', updatedTapCount);
//         console.log('clicksRemaining updated:', updatedClicksRemaining);
  
//       } catch (error) {
//         console.error('Error updating tapCount:', error);
//       }
//     }
//   };
  

//   // useEffect(() => {
//   //   const storedUser = JSON.parse(sessionStorage.getItem('telegramUser'));
//   //   const storedBalance = sessionStorage.getItem('balance');
//   //   const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//   //   const storedClickCount = localStorage.getItem('clickCount');
//   //   const storedClickPoints = localStorage.getItem('clickPoints');
//   //   const storedTapCount = sessionStorage.getItem('tapCount');
//   //   const storedClicksRemaining = localStorage.getItem('clicksRemaining'); 
    

//   //   if (storedUser) {
//   //     setUserId(storedUser.userId);
//   //     setBalance(storedBalance ? parseInt(storedBalance) : 0);
//   //     setClickCount(storedClickCount ? parseInt(storedClickCount) : 0);
//   //     setClickPoints(storedClickPoints ? parseInt(storedClickPoints) : 0);
//   //     setTapCount(storedTapCount ? parseInt(storedTapCount) : 0);
//   //     setClicksRemaining(storedClicksRemaining ? parseInt(storedClicksRemaining) : tapCount - (storedClickCount ? parseInt(storedClickCount) : 0));

//   //   } else if (telegramUser) {
//   //     const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
//   //     setUserId(userId);

//   //     // Send user data to the server and store in session storage
//   //     axios.post('http://localhost:3000/api/save-user', { userId, username, firstName, lastName })
//   //       .then(response => {
//   //         console.log('User saved:', response.data);
//   //         sessionStorage.setItem('telegramUser', JSON.stringify({ userId, username, firstName, lastName }));

//   //         // Fetch user data from the server
//   //         axios.get(`http://localhost:3000/api/get-user/${userId}`)
//   //           .then(response => {
//   //             const { balance, tapCount } = response.data;
//   //             setBalance(balance);
//   //             setTapCount(tapCount);
//   //             sessionStorage.setItem('balance', balance);
//   //             sessionStorage.setItem('tapCount', tapCount);
//   //             setClicksRemaining(storedClicksRemaining ? parseInt(storedClicksRemaining) : tapCount - (storedClickCount ? parseInt(storedClickCount) : 0));
//   //             console.log("Count for taps", tapCount);
//   //           })
//   //           .catch(error => {
//   //             console.error('Error fetching user data:', error);
//   //           });
//   //       })
//   //       .catch(error => {
//   //         console.error('Error saving user:', error);
//   //       });
//   //   }
//   // }, []);



//   useEffect(() => {
//     const fetchUserData = async (userId) => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/get-user/${userId}`);
//         const { balance, tapCount } = response.data;
//         setBalance(balance);
//         setTapCount(tapCount);
//         sessionStorage.setItem('balance', balance);
//         sessionStorage.setItem('tapCount', tapCount);
//         setClicksRemaining(storedClicksRemaining ? parseInt(storedClicksRemaining) : tapCount - (storedClickCount ? parseInt(storedClickCount) : 0));
//   console.log("Count for taps", tapCount);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     const storedUser = JSON.parse(sessionStorage.getItem('telegramUser'));
//     const storedBalance = sessionStorage.getItem('balance');
//     const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//     const storedClickCount = localStorage.getItem('clickCount');
//     const storedClickPoints = localStorage.getItem('clickPoints');
//     const storedTapCount = sessionStorage.getItem('tapCount');
//     const storedClicksRemaining = localStorage.getItem('clicksRemaining');

//     if (storedUser) {
//       setUserId(storedUser.userId);
//       if (storedBalance) setBalance(parseInt(storedBalance));
//       if (storedClickCount) setClickCount(parseInt(storedClickCount));
//       if (storedClickPoints) setClickPoints(parseInt(storedClickPoints));
//       if (storedTapCount) setTapCount(parseInt(storedTapCount));
//       setClicksRemaining(storedClicksRemaining ? parseInt(storedClicksRemaining) : tapCount - (storedClickCount ? parseInt(storedClickCount) : 0));
//       fetchUserData(storedUser.userId);
//     } else if (telegramUser) {
//       const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
//       setUserId(userId);
//       setUser(telegramUser);
//       storeUserData(telegramUser);



//       // Send user data to the server and store in session storage
//       axios.post('http://localhost:3000/api/save-user', { userId, username, firstName, lastName })
//         .then(response => {
//           console.log('User saved:', response.data);
//           sessionStorage.setItem('telegramUser', JSON.stringify({ userId, username, firstName, lastName }));

//           // Fetch user data from the server
//           fetchUserData(userId);
//         })
//         .catch(error => {
//           console.error('Error saving user:', error);
//         });
//     }
//   }, []);

//   const storeUserData = async (user) => {
//     try {
//       // Create a document in Firestore with the user's ID
//       await setDoc(doc(db, 'users', user.id.toString()), {
//         username: user.username,
//         userId: user.id,
//         firstName: user.first_name,
//         lastName: user.last_name
//       });
//       console.log('User data stored successfully');
//     } catch (error) {
//       console.error('Error storing user data:', error);
//     }
//   };


//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const formatNumber = (num) => {
//     if (num < 100000) {
//       return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//     } else if (num < 1000000) {
//       return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//     } else {
//       return (num / 1000000).toFixed(3).replace(".", ".") + " M";
//     }
//   };



//   return (
//     <div className='w-full flex justify-center flex-col space-y-3 px-5'>
      
//       <h1 className='flex w-full justify-center items-center space-x-1 pb-2'>

//         {/* <img alt="engy" src={coinsmall} alt='coin' className='w-[35px]'/> */}
//          <span className='text-[#fff] text-[30px] font-bold'>
//          {formatNumber(balance)} <span className='text-[#d86ade] pl-[2px]'>INFX</span>
//         </span>
     

//       </h1>


//       <div className='w-full flex items-center justify-center space-x-5'>

//         <div className='bg-[#c34dc933] text-[#d86ade] py-[6px] px-5 w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[14px] font-medium'>
//         <span className='text-[16px]'>
//         <PiHandTap size={18} className='text-[#f398f9]'/> </span><span className='text-nowrap'>{clicksRemaining > 0 ? (<>{clicksRemaining} taps left</>) : "wait for refill" } </span>
//         </div>
//         <div className='bg-[#c34dc933] py-[6px] px-5 text-[#e4c05d] font-medium w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[14px]'>
//         <span className='text-[16px]'>
//         <PiTimerDuotone size={18} className='' />
//         </span>
//         <span className='text-nowrap'>{remainingTime > 0 ? ( <>{formatTime(remainingTime)}</> ) : "tap now"}</span>
//         </div>

//       </div>
// <div className='w-full flex justify-center items-center py-6'>
//       <div className="image-container">
//                 <Container>
//                   <img
//                     onPointerDown={handleClick}
//                     ref={imageRef}
//                     src={tapmecoin}
//                     alt="Wobble"
//                     className={`${canClick ? "pointer-events-auto" : "pointer-events-none"} wobble-image select-none`}
//                   />
//                   {clicks.map((click) => (
//                     <SlideUpText key={click.id} x={click.x} y={click.y}>
//                       +2
//                     </SlideUpText>
//                   ))}
//                 </Container>
//               </div>
//               </div>

//       <div className='space-x-4 flex-col hidden'>
//         <h1>Click Game</h1>
//         <p>Click count: {clickCount}</p>
//         <p>Points accumulated: {clickPoints}</p>
//         <p>Clicks remaining: </p>
//         <p>Points: {points}</p>
//         <p>Balance: {balance}</p>
//         <p>Timer: {remainingTime > 0 ? ( <>{formatTime(remainingTime)}</> ) : "You can tap now"}</p>
//         </div>


//         <div className='w-full flex justify-center'>


//         <div className='w-full flex justify-between
//          items-center bg-[#c34dc946] rounded-[12px] py-3 px-4'>

//         <span className='text-[#fff] font-semibold text-[24px]'>
//         {clickPoints} <span className='text-[#d86ade] pl-[2px]'>INFX</span>
//         </span>

//         <button onClick={handleClaim} disabled={clickCount === 0} className={`${clickPoints === 0 ? "bg-[#2a1d2a57] text-[#ffffff71]" : "bg-[#ba0cc3] text-[#fff]"} py-[14px] px-8 rounded-[12px] font-bold text-[16px]`}>Claim</button>
//         </div>
//         </div>

//         {balance >= 1000000 && (
//         <div className='w-full flex justify-center'>
//           <button onClick={handleAddTapCount} className="bg-[#0cae3c] text-[#fff] py-[14px] px-8 rounded-[12px] font-bold text-[16px]">Add 150 Tap Count</button>
//         </div>
//       )}

//       </div>
  
//   );
// };

// export default TapEarn2;
