// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion, increment } from 'firebase/firestore';
// import { db } from '../firebase'; // Import Firestore configuration
// import axios from 'axios';
// import Animate from '../Components/Animate';
// import { Outlet } from 'react-router-dom';
// import Spinner from '../Components/Spinner';
// import { useUser } from "../context/userContext";
// import ManualTasks from '../Components/ManualTasks';
// import { PiNotebook } from 'react-icons/pi';
// import { FaBoxes } from "react-icons/fa";
// import telegram from "../images/telegram.svg"

// const TasksList = () => {
//   const { id, balance, refBonus, setBalance, completedTasks, setCompletedTasks, tasks, setTasks } = useUser(); // Assuming 'id' is the user's document ID in Firestore
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdowns, setCountdowns] = useState({});
//   const [currentError, setCurrentError] = useState({}); // Task-specific error messages
//   const [showVerifyButtons, setShowVerifyButtons] = useState({}); // State to manage the display of Verify buttons
//   const [countdownFinished, setCountdownFinished] = useState({});
//   const [claiming, setClaiming] = useState({});
//   const [claimError, setClaimError] = useState('');
//   const [activeIndex, setActiveIndex] = useState(1);

  

//   const handleMenu = (index) => {
//     setActiveIndex(index);
//   };

//   const telegramBotToken = '7327868388:AAH89ye-KeNy0TcsWFe-ixgXFXKOSRwYDj8';



//   const performTask = (taskId) => {
//     const task = tasks.find(task => task.id === taskId);
//     window.open(task.link, '_blank');
//     setTimeout(() => {
//       setShowVerifyButtons({ ...showVerifyButtons, [taskId]: true });
//     }, 2000); // Show Verify button 2 seconds after clicking Perform
//   };

//   const checkTelegramMembership = async (taskId) => {
//     try {
//       const task = tasks.find(task => task.id === taskId);
//       const response = await axios.get(`https://api.telegram.org/bot${telegramBotToken}/getChatMember`, {
//         params: {
//           chat_id: task.chatId,
//           user_id: id, // Use the user's Firestore document ID as the Telegram user ID
//         }
//       });

//       if (response.data.ok && (response.data.result.status === 'member' || response.data.result.status === 'administrator' || response.data.result.status === 'creator')) {
//         // Update task verification status in Firestore
//         setTasks(tasks.map(task => task.id === taskId ? { ...task, verified: true } : task));
//       } else {
//         setCurrentError({ [taskId]: `Verification failed for Task ${taskId}: Join the channel to verify.` });
//       }
//     } catch (error) {
//       console.error('Error verifying Telegram membership:', error);
//       setCurrentError({ [taskId]: `Verification failed for Task ${taskId}: Could not verify Telegram membership.` });
//     }
//   };

//   const startCountdown = (taskId) => {
//     setCurrentError({}); // Reset error state
//     setCountdowns({ ...countdowns, [taskId]: 5 });

//     const countdownInterval = setInterval(() => {
//       setCountdowns(prevCountdowns => {
//         const newCountdown = prevCountdowns[taskId] - 1;
//         if (newCountdown <= 0) {
//           clearInterval(countdownInterval);
//           setCountdownFinished({ ...countdownFinished, [taskId]: true });
//           return { ...prevCountdowns, [taskId]: 0 };
//         }
//         return { ...prevCountdowns, [taskId]: newCountdown };
//       });
//     }, 1000);

//     checkTelegramMembership(taskId); // Call the API immediately
//   };

//   const claimTask = async (taskId) => {
//     setClaiming({ ...claiming, [taskId]: true });
//     setClaimError('');
//     try {
//       const task = tasks.find(task => task.id === taskId);
//       const userDocRef = doc(db, 'telegramUsers', id);

//       await updateDoc(userDocRef, {
//         balance: increment(task.bonus),
//         tasksCompleted: arrayUnion(taskId)
//       });

//       // Update the balance and completedTasks state
//       setBalance(prevBalance => prevBalance + task.bonus);
//       setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, taskId]);

//       setModalOpen(true);
//     } catch (error) {
//       console.error('Error claiming task:', error);
//       setClaimError('Failed to claim the task. Please try again.');
//     } finally {
//       setClaiming({ ...claiming, [taskId]: false });
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
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
//     <>
//       <Animate>
//       <div className="w-full pt-2 justify-center flex-col space-y-6 px-5">

        
//            <div className='w-fit py-[6px] px-3 flex items-center space-x-1 justify-center border-[1px] border-[#707070] rounded-[25px]'>
//        <span className='w-[22px]'> 
//        <img alt="engy" src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-full'/> 
//         </span>
//         <h1 className="text-[15px] font-bold">
//             {/* {formatNumber(balance + refBonus)} */}
//             {formatNumber('904475')} EN
//             </h1>
//             </div>

//             <div className='w-full flex items-center justify-between'>

                
// <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-[#3a3a3acf] text-[#ebebeb]' : ''}  rounded-[6px] text-[#c6c6c6] py-[10px] px-3 w-[45%] flex space-x-2 justify-center text-center text-[15px] font-semibold items-center`}>
// <PiNotebook size={16} className="" /> 
// <span>Tasks</span>
// </div>

// <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-[#3a3a3acf] text-[#ebebeb]' : ''}  rounded-[6px] text-[#c6c6c6] py-[10px] px-3 w-[45%] space-x-2 font-semibold text-[15px] flex justify-center text-center items-center`}>
// <FaBoxes size={16} className=""/>  <span>
//     Challenges
//     </span>
// </div>


// </div>

// <div className=''>
//     <h1 className='text-[28px] font-semibold'>
//     Earn more tokens
//     </h1>
//     <p className='text-[14px] text-[#c6c6c6] leading-[24px]'>
// Perform tasks daily to earn more EN tokens and level up real quick!
//     </p>
// </div>

// <div class="flex items-end justify-center flex-col space-y-4">

//   <div class="w-[92%] rounded-[25px] bg-gradient-to-r from-[#454545] via-red-500 to-[#575349] p-[1px]">
//     <div class="flex h-full w-full flex-col bg-[#2d2d2d] justify-center rounded-[24px] py-4 pl-12 pr-4 relative">
//         <div className='w-[60px] h-[60px] rounded-[12px] p-2 absolute bg-[#8a8a8a] left-[-26px] todp-[40px] flex items-center justify-center'>
//             <img alt="engy" src={telegram} className='w-[40px]'/>
//         </div>
//         <div className='flex w-full flex-col justify-between h-full space-y-2'>
//       <h1 class="text-[16px] text-nowrap line-clamp-1 mr-[5px] font-semibold text-white">Subscribe our Youtube Channel</h1>
//       <span className='flex items-center w-fit space-x-1 text-[15px] font-semibold'>
//         <span className='w-[10px] h-[10px] bg-[#909b16] rounded-full flex items-center'>
//         </span>
//         <span className=''>
// +100 000
//         </span>
//       </span>
//       <div className='w-full flex items-center justify-between'>


//         <button className='w-fit py-2 px-4 text-[15px] font-semibold bg-[#595959cc] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px]'>
// Perfom
//         </button>

//         <button className='w-fit py-2 px-4 text-[15px] font-semibold bg-[#0000004a] text-[#888] rounded-[6px]'>
// Verify
//         </button>

//         </div>
//       </div>
//     </div>
//   </div>

// </div>








//             {tasks.map(task => (
//                 <>
//                   <div key={task.id} class="w-[92%] rounded-[25px] bg-gradient-to-r from-[#454545] via-red-500 to-[#575349] p-[1px]">
//     <div class="flex h-full w-full flex-col bg-[#2d2d2d] justify-center rounded-[24px] py-4 pl-12 pr-4 relative">
//         <div className='w-[60px] h-[60px] rounded-[12px] p-2 absolute bg-[#8a8a8a] left-[-26px] todp-[40px] flex items-center justify-center'>
//             <img alt="engy" src={telegram} className='w-[40px]'/>
//         </div>
//         <div className='flex w-full flex-col justify-between h-full space-y-2'>
//       <h1 class="text-[16px] text-nowrap line-clamp-1 mr-[5px] font-semibold text-white">
//       {task.title}
//         </h1>
//       <span className='flex items-center w-fit space-x-1 text-[15px] font-semibold'>
//         <span className='w-[10px] h-[10px] bg-[#909b16] rounded-full flex items-center'>
//         </span>
//         <span className=''>
// +{formatNumber(task.bonus)}
//         </span>
//       </span>
//       <div className='w-full flex items-center justify-between'>


//         <button className='w-fit py-2 px-4 text-[15px] font-semibold bg-[#595959cc] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px]'>
// Perfom
//         </button>

//         <button className='w-fit py-2 px-4 text-[15px] font-semibold bg-[#0000004a] text-[#888] rounded-[6px]'>
// Verify
//         </button>

//         </div>
//       </div>
//     </div>
//   </div>

//               <div key={task.id} className="mb-4 p-4 border rounded shadow">
//                 <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
//                 <div className="flex space-x-2">
//                   {!completedTasks.includes(task.id) && (
//                     <>
//                       <button
//                         onClick={() => performTask(task.id)}
//                         className={`px-4 py-2 bg-blue-500 text-white rounded ${task.verified && countdownFinished[task.id] ? 'hidden' : ''}`}
//                         disabled={task.verified && countdownFinished[task.id]}
//                       >
//                         Perform
//                       </button>
//                       <button
//                         onClick={() => startCountdown(task.id)}
//                         className={`px-4 py-2 bg-yellow-500 text-white rounded ${!showVerifyButtons[task.id] || (task.verified && countdownFinished[task.id]) ? 'hidden' : ''}`}
//                         disabled={!showVerifyButtons[task.id] || (task.verified && countdownFinished[task.id])}
//                       >
//                         Verify
//                       </button>
//                     </>
//                   )}
//                   {countdowns[task.id] ? (
//                     <span className="px-4 py-2 text-red-500 font-bold">
//                       checking {countdowns[task.id]}s
//                     </span>
//                   ) : (
//                     <>
//                       {task.verified && !completedTasks.includes(task.id) ? <span className="px-4 py-2 text-green-500 font-bold">Done</span> :
//                       currentError[task.id] && <span className="px-4 py-2 text-red-500 text-[12px]">{currentError[task.id]}</span>}
//                       {completedTasks.includes(task.id) && <span className="px-4 py-2 text-green-500 font-bold">Task Completed</span>}
//                     </>
//                   )}
//                   {!completedTasks.includes(task.id) && (
//                     <button
//                       onClick={() => claimTask(task.id)}
//                       disabled={!task.verified || claiming[task.id]}
//                       className={`px-4 py-2 bg-green-500 text-white rounded ${task.verified ? '' : 'cursor-not-allowed opacity-50'}`}
//                     >
//                       {claiming[task.id] ? 'Claiming...' : 'Claim'}
//                     </button>
//                   )}
//                 </div>
//                 {claimError && (
//                   <p className="text-red-500 text-xs mt-2">{claimError}</p>
//                 )}
//               </div>
//               </>
//             ))}

//             {/*  */}


//             <ManualTasks />


//             {modalOpen && (
//               <div className="fixed inset-0 bg-[#0000004b] bg-opacity-75 flex items-center justify-center z-50">
//                 <div className="bg-cards rounded-lg p-6 shadow-lg max-w-sm w-full">
//                   <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
//                   <p>You have earned points.</p>
//                   <button
//                     onClick={closeModal}
//                     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             )}
    
//         </div>
//         <Outlet />
//       </Animate>
//     </>
//   );
// };

// export default TasksList;
