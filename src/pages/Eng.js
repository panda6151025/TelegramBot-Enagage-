// import React, { useEffect, useState, useRef } from 'react';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { db } from '../firebase'; // Adjust the path as needed
// import coinsmall from "../images/engagesmall.webp";
// import { NavLink } from 'react-router-dom';
// import tapmecoin from "../images/tapinmain.webp";
// import styled, { keyframes } from "styled-components";
// import flash from "../images/flash.webp";
// import { MdOutlineTimer } from "react-icons/md";
// import { PiHandTap, PiTimerDuotone, PiTimerFill } from 'react-icons/pi';
// import { IoCheckmarkCircleSharp } from "react-icons/io5";
// 
// import Animate from '../Components/Animate';
// import Spinner from '../Components/Spinner';
// import { useUser } from '../context/userContext';

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

// const TapEarn = () => {

//   const imageRef = useRef(null);
//   const [clicks, setClicks] = useState([]);
//   const { balance, setBalance, level, setLevel, loading, setLoading, energy, setEnergy, sendUserData, initialized, setInitialized } = useUser();


//   const [points, setPoints] = useState(0);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(null);
//   const [isTimerVisible, setIsTimerVisible] = useState(false);
//   const [openClaim, setOpenClaim] = useState(false);

//   const [congrats, setCongrats] = useState(false)


//   const handleClick = (e) => {
//     if (energy <= 0 || isDisabled) {
//       return; // Exit if no energy left or if clicks are disabled
//     }

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
//     setEnergy((prevEnergy) => {
//       const newEnergy = prevEnergy - 1;
//       if (newEnergy <= 0) {
//         // Set a timer for 1 minute
//         const endTime = new Date(new Date().getTime() + 60000);
//         localStorage.setItem('endTime', endTime);
//         localStorage.setItem('energy', newEnergy);
//         setIsDisabled(true);
//         const timer = setInterval(() => {
//           const newTimeLeft = new Date(endTime) - new Date();
//           if (newTimeLeft <= 0) {
//             clearInterval(timer);
//             localStorage.removeItem('endTime');
//             setIsDisabled(false);
//             setIsTimerVisible(false);
//             setEnergy(1000);
//           } else {
//             setTimeRemaining(newTimeLeft);
//           }
//         }, 1000);
//         return newEnergy;
//       }
//       return newEnergy;
//     });
//     setPoints((prevPoints) => prevPoints + 1);

//     if (points === 20) {
//       const taps = document.getElementById("tapmore");
//       taps.style.display = "block";
//       setTimeout(() => {
//         taps.style.display = "none";
//       }, 2000)
//     }
//     if (points === 80) {
//       const taps = document.getElementById("tapmore2");
//       taps.style.display = "block";
//       setTimeout(() => {
//         taps.style.display = "none";
//       }, 2000)
//     }
//     if (points === 150) {
//       const taps = document.getElementById("tapmore3");
//       taps.style.display = "block";
//       setTimeout(() => {
//         taps.style.display = "none";
//       }, 2000)
//     }

//     // Remove the click after the animation duration
//     setTimeout(() => {
//       setClicks((prevClicks) =>
//         prevClicks.filter((click) => click.id !== newClick.id)
//       );
//     }, 1000); // Match this duration with the animation duration
//   };



//   const handleClaim = async () => {
//     const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//     if (telegramUser) {
//       const { id: userId } = telegramUser;
//       const userRef = doc(db, 'telegramUsers', userId.toString());
//       try {
//         await updateDoc(userRef, {
//           balance: balance + points,
//           energy: energy
     
//         });
//         setBalance((prevBalance) => prevBalance + points);
//         localStorage.setItem('energy', energy);

//         if (energy <= 0) {
//           setIsTimerVisible(true);
//         }
//         console.log('Points claimed successfully');
//       } catch (error) {
//         console.error('Error updating balance and energy:', error);
//       }
//     }
//     openClaimer();
//   };




//   useEffect(() => {
//     const savedEndTime = localStorage.getItem('endTime');
//     if (savedEndTime) {
//       const endTime = new Date(savedEndTime);
//       const newTimeLeft = endTime - new Date();
//       if (newTimeLeft > 0) {
//         setIsDisabled(true);
//         setIsTimerVisible(true);
//         setTimeRemaining(newTimeLeft);
//         const timer = setInterval(() => {
//           const updatedTimeLeft = endTime - new Date();
//           if (updatedTimeLeft <= 0) {
//             clearInterval(timer);
//             localStorage.removeItem('endTime');
//             setIsDisabled(false);
//             setIsTimerVisible(false);
//             setEnergy(1000);
//           } else {
//             setTimeRemaining(updatedTimeLeft);
//           }
//         }, 1000);
//       } else {
//         localStorage.removeItem('endTime');
//       }
//     }
//   }, []);

//     // Initial effect to run only once on component mount
//     // useEffect(() => {
//     //   const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//     //   const savedEndTime = localStorage.getItem('endTime');
//     //   const savedEnergy = localStorage.getItem('energy');
//     //   const endTime = new Date(savedEndTime);
//     //   const newTimeLeft = endTime - new Date();
//     //   console.log("Local timeEDD", newTimeLeft);
//     //   console.log("Energy Remaining:", savedEnergy);
//     //   if (telegramUser) {
//     //     const { id: userId } = telegramUser;
//     //     const userRef = doc(db, 'telegramUsers', userId.toString());
//     //     const updateEnergy = async () => {
//     //       if (newTimeLeft < 0 && savedEnergy <= 0) {
//     //       try {
//     //         await updateDoc(userRef, { energy: 1000 });
//     //         setEnergy(1000);
//     //         console.log('Energy updated in Firestore');
//     //       } catch (error) {
//     //         console.error('Error updating energy:', error);
//     //       }
//     //     }
//     //     };
      
//     //     updateEnergy().then(() => setInitialized(true));
    
//     // }
//     // }, []); // Empty dependency array to run the effect only once on mount
  
  

//   // Effect to log the values of timeRemaining and energy whenever they change
//   useEffect(() => {
//     if (initialized) {
//       const savedEnergy = localStorage.getItem('energy');
//       console.log("Energy Remaining:", savedEnergy);
//     }
//   }, [timeRemaining, energy, initialized]);

//   const closeClaimer = () => {
//     setOpenClaim(false);
//     setPoints(0); // Reset points after claiming
 
//   };

//   const openClaimer = () => {
//     setOpenClaim(true)
//     setCongrats(true)

//     setTimeout(() => {
//         setCongrats(false)
//     }, 4000)

   
//   }



//   const formatTimeRemaining = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${hours}h ${minutes}m ${seconds}s`;
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
// <>
//       {loading ? (
//         <Spinner />
//       ) : (
  
//       <Animate>
         
//     <div className='w-full flex justify-center flex-col space-y-3 px-5 pt-3'>
      
//       <h1 className='flex w-full justify-center items-center space-x-1 pb-2'>
//         <img alt="engy" src={coinsmall} className='w-[32px] animate-pulse' alt='engagecoin'/>
//          <span className='text-[#fff] text-[26px] font-bold'>
//            <span className='pl-[2px]'>{formatNumber(balance)} <span className='text-[#8b8f8b]'>ENG</span></span>
//         </span>
//       </h1>

//       <p className='text-[15px] text-[#fff] w-full px-8 text-center'>
//         Tap, tap, tap! Refill your energy, continue the fun! Let's go 🤙
//       </p>

//       <div className='w-full flex items-center justify-center space-x-5'>
//         <div className='bg-[#a4a4a433] text-[#dddddd] py-[10px] px-5 w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px] font-medium'>
//           <span className='text-[16px]'>
//             <PiHandTap size={18} className='tesxt-[#bcbcbc] text-[#e1f75c]'/>
//           </span>
//           {isTimerVisible ? (
//                     <span>
//                     wait for refill
//                       </span>

//                       ) : (
//                         <span className='text-nowrap'>
//                         {energy} taps left</span>
//                       )}   
//         </div>
//         <div className='bg-[#a4a4a433] py-[10px] px-5 text-[#e1f75c] font-medium w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px]'>
//           <span className='text-[16px]'>
//             <PiTimerDuotone size={18} className='' />
//           </span>
//           {isTimerVisible ? (
//             <span className='text-nowrap'>{`${formatTimeRemaining(timeRemaining)}`}</span>
//           ) : (
//             <span>
//             tap now
//             </span>
//           )}        
//         </div>
//       </div>

//       <div className='w-full flex justify-center items-center py-6'>
//         <div className="image-container">
//           <Container>
//             <img
//               onPointerDown={handleClick}
//               ref={imageRef}
//               src="https://ucarecdn.com/cb380459-705a-4ab2-a887-8a235bb73580/tapinmain.webp"
//               alt="Wobble"
//               className={`wobble-image select-none`}
//             />
//             {clicks.map((click) => (
//               <SlideUpText key={click.id} x={click.x} y={click.y}>
//                 +1
//               </SlideUpText>
//             ))}
//                         <span id="tapmore" className='bg-[#975353d4] hidden tapmore p-[6px] rounded-[6px] absolute top-0 right-0'>
//               tap morre!
//             </span>
//             <span id="tapmore2" className='bg-[#975353d4] hidden tapmore p-[6px] rounded-[6px] absolute top-0 left-0'>
//               wo hoo! let's go!
//             </span>
//             <span id="tapmore3" className='bg-[#975353d4] hidden tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
//               tap! tap! tap!!
//             </span>
//           </Container>
//         </div>
//       </div>

//       <div className='w-full flex justify-center'>
//         <div className='w-full flex justify-between items-center bg-[#a4a4a433] rounded-[12px] py-3 px-4'>
//           <span className='text-[#fff] font-semibold text-[24px]'>
//             <span className='pl-[2px]'>{points} <span className='text-[#8b8f8b]'>ENG</span></span>
//           </span>
//           <button 
//             onClick={handleClaim} 
//             disabled={points === 0} 
//             className={`${points === 0 || openClaim ? 'text-[#ffffff71] bg-[#00000066]' : 'bg-[#fff] text-[#000]'} py-[14px] px-8 rounded-[12px] font-bold text-[16px]`}
//           >
//             Claim
//           </button>
//         </div>
//       </div>

//       {/* Claim Modal */}

//       <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none'>
//       {congrats ? (<img alt="engy" src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
//       </div>

//       <div
//         className={`${
//           openClaim === true ? "visible" : "invisible"
//         } fixed top-[-12px] bottom-0 left-0 z-10 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
//       >
  

//     <div className={`${
//           openClaim === true ? "opacity-100 mt-0" : "opacity-0 mt-[100px]"
//         } w-full bg-[#303030] relative rounded-[16px] flex flex-col justify-center p-8 ease-in duration-300 transition-all`}>
//           <div className="w-full flex justify-center flex-col items-center space-y-3">
//             <div className="w-full items-center justify-center flex flex-col space-y-2">
//               <IoCheckmarkCircleSharp size={32} className='text-[#e1f75c]'/>
//               <p className='font-medium'>Let's go!!</p>
//             </div>
//             <h3 className="font-medium text-[24px] text-[#ffffff] pt-2 pb-2">
//               <span className='text-[#e1f75c]'>+{points}</span> ENG
//             </h3>
//             <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
//               Keep grinding! something huge is coming! Get more ENG now! 
//             </p>
//           </div>

//           <div className="w-full flex justify-center">
//             <button
//               onClick={closeClaimer}
//               className="bg-[#383838] w-fit py-[10px] border-[1px] border-[#d3d3d3] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
//             >
//               Tap Morrre!
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
// </Animate>
//       )}
// </>
//   );
// };

// export default TapEarn;
