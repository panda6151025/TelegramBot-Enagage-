// import React, { useState, useEffect, useRef, useContext } from "react";
// import styled, { keyframes } from "styled-components";
// import "./App.css";
// import coinsmall from "../src/images/coinsmall.webp";
// import tapmecoin from "../src/images/tapme1.webp";
// import bronze from "../src/images/bronze.webp";
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";
// import { db } from "./firebase";
// import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
// import Animate from "./Components/Animate";
// import Spinner from "./Components/Spinner";
// import Levels from "./Components/Levels";
// import flash from "../src/images/flash.webp";
// import axios from 'axios';

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

// const EnergyFill = styled.div`
//   background-color: #e39725;
//   height: 12px;
//   border-radius: 6px;
//   width: ${({ percentage }) => percentage}%;
// `;

// function Appx() {
//   const imageRef = useRef(null);
//   const [clicks, setClicks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showLevels, setShowLevels] = useState(false);
//   const [userName, setUserName] = useState('');

//   const levelsAction = () => {
//     setShowLevels(true);
//     document.getElementById("footermain").style.zIndex = "50";
//   };

//   [Telegram.WebView] > postEvent web_app_request_viewport 
//   [Telegram.WebView] < receiveEvent viewport_changed {width: 390, height: 787, is_expanded: true, is_state_stable: true}
//   [Telegram.WebView] > postEvent web_app_expand 

//   const handleClick = (e) => {
 
//       const { offsetX, offsetY, target } = e.nativeEvent;
//       const { clientWidth, clientHeight } = target;

//       const horizontalMidpoint = clientWidth / 2;
//       const verticalMidpoint = clientHeight / 2;

//       const animationClass =
//         offsetX < horizontalMidpoint
//           ? "wobble-left"
//           : offsetX > horizontalMidpoint
//           ? "wobble-right"
//           : offsetY < verticalMidpoint
//           ? "wobble-top"
//           : "wobble-bottom";

//       // Remove previous animations
//       imageRef.current.classList.remove(
//         "wobble-top",
//         "wobble-bottom",
//         "wobble-left",
//         "wobble-right"
//       );

//       // Add the new animation class
//       imageRef.current.classList.add(animationClass);

//       // Remove the animation class after animation ends to allow re-animation on the same side
//       setTimeout(() => {
//         imageRef.current.classList.remove(animationClass);
//       }, 500); // duration should match the animation duration in CSS

//       // Increment the count
//       const rect = e.target.getBoundingClientRect();
//       const newClick = {
//         id: Date.now(), // Unique identifier
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       };



//       // Remove the click after the animation duration
//       setTimeout(() => {
//         setClicks((prevClicks) =>
//           prevClicks.filter((click) => click.id !== newClick.id)
//         );
//       }, 1000); // Match this duration with the animation duration
    
//   };

//   useEffect(() => {
//     const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;

//     if (telegramUser) {
//       const { first_name, last_name, username, id } = telegramUser;

//       const userDetails = {
//         firstName: first_name,
//         lastName: last_name,
//         username: username,
//         userId: id,
//       };
//       setUserName(`${first_name} ${last_name}`);

//       // Send user details to the backend
//       const saveUserDetails = async () => {
//         try {
//           await axios.post('http://192.168.253.66:3000/addTelegramUser', userDetails);
//           console.log("User details saved successfully");
//         } catch (error) {
//           console.error("Error saving user details:", error);
//         }
//       };

//       saveUserDetails();
//     }
//   }, []);


//   return (
//     <>
    
//       {/* {loading ? (
//         <Spinner />
//       ) : ( */}
//         <Animate>
//           <div className="flex space-x-[2px] justify-center items-center">
//             <div className="w-[50px] h-[50px]">
//               <img alt="engy" src={coinsmall} className="w-full" alt="coin" />
//             </div>
//             <h1 className="text-[#fff] text-[42px] font-extrabold">
//               {/* {formattedCount} */} {userName}
              
//             </h1>
//           </div>
//           <div
           
//             className="w-full ml-[6px] flex space-x-1 items-center justify-center"
//           >
//             <img
//               src={bronze}
//               className="w-[30px] h-[30px] relative"
//               alt="bronze"
//             />
//             <h2 onClick={levelsAction} className="text-[#9d99a9] text-[20px] font-medium">Bronze</h2>
//             <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
//           </div>
//           <div className="w-full flex justify-center items-center pt-14 pb-36">
//             <div className="w-[265px] h-[265px] relative">
//               <div className="bg-[#efc26999] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] -left-40 rounded-full"></div>
//               <div className="image-container">
//                 <Container>
//                   <img
//                     onPointerDown={handleClick}
//                     ref={imageRef}
//                     src={tapmecoin}
//                     alt="Wobble"
//                     className="wobble-image select-none"
//                   />
//                   {clicks.map((click) => (
//                     <SlideUpText key={click.id} x={click.x} y={click.y}>
//                       +2
//                     </SlideUpText>
//                   ))}
//                 </Container>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
//             <div className="flex flex-col w-full items-center justify-center">
//               <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
//                 <img alt="engy" alt="flash" src={flash} className="w-[20px]" />
//                 <div className="">
//                   <span className="text-[18px] font-bold">displayEnergy</span>
//                   <span className="text-[14px] font-medium">/ 500</span>
//                 </div>
//               </div>
//               <div className="flex w-full p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders2">
//                 {/* <EnergyFill percentage={(energy / 500) * 100} /> */}
//               </div>
//             </div>
//           </div>
//           <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
//         </Animate>
//       {/* )} */}
//     </>
//   );
// }

// export default Appx;
