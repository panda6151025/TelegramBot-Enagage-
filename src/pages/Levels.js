// import React, { useEffect, useState } from 'react';
// import { useUser } from '../context/userContext';
// import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

// const userLevels = [
//   { name: 'Bronze Coin', icon: 'https://ucarecdn.com/623a9a66-8956-44b0-b392-0d49dd817dfb/bronze.webp', tapBalanceRequired: 1000 },
//   { name: 'Silver Coin', icon: 'https://ucarecdn.com/897972b0-9a8e-4010-9659-d0410ccdd434/silver.webp', tapBalanceRequired: 50000 },
//   { name: 'Gold Coin', icon: 'https://ucarecdn.com/fd20a032-8347-40da-832a-883c626ca89a/gold.webp', tapBalanceRequired: 500000 },
//   { name: 'Platinum Coin', icon: 'https://ucarecdn.com/b3b6e98e-95d4-4c14-ac8c-b999e13fe6e7/platinum.webp', tapBalanceRequired: 1000000 },
//   { name: 'Diamond Coin', icon: 'https://ucarecdn.com/8205f4a9-a8e6-4c23-9460-92cdfa3f6f57/king.webp', tapBalanceRequired: 2500000 },
//   { name: 'Legendary Coin', icon: 'https://ucarecdn.com/aee9b3f4-d9e0-49f2-b46a-aef8b0ae4be7/lordlegend.webp', tapBalanceRequired: 5000000 },
// ];

// const Levels = () => {
//   const { tapBalance } = useUser();
//   const initialLevelIndex = userLevels.findIndex(level => tapBalance < level.tapBalanceRequired);
//   const currentLevelIndex = initialLevelIndex === -1 ? userLevels.length - 1 : initialLevelIndex;

//   const [displayedLevelIndex, setDisplayedLevelIndex] = useState(currentLevelIndex);

//   const handlePrevious = () => {
//     if (displayedLevelIndex > 0) {
//       setDisplayedLevelIndex(displayedLevelIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (displayedLevelIndex < userLevels.length - 1) {
//       setDisplayedLevelIndex(displayedLevelIndex + 1);
//     }
//   };

//   const currentLevel = userLevels[displayedLevelIndex];

//   const formatNumberCliam = (num) => {
//     if (num < 100000) {
//       return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//     } else if (num < 1000000) {
//       return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//     } else if (num < 10000000) {
//         return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//       } else {
//       return (num / 10000000).toFixed(3).replace(".", ".") + " T";
//     }
//   };
//   useEffect(() => {
//     // Show the back button when the component mounts
//     window.Telegram.WebApp.BackButton.show();

//     // Attach a click event listener to handle the back navigation
//     const handleBackButtonClick = () => {
//       window.history.back();
//     };

//     window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);

//     // Clean up the event listener and hide the back button when the component unmounts
//     return () => {
//       window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
//       window.Telegram.WebApp.BackButton.hide();
//     };
//   }, []);

//   return (
//     <div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">

//     <div className="w-full pt-6 justify-center flex-col space-y-6">

//       <div className="flex items-center space-x-4">

//         <div className="flex flex-col items-center">
//         <h1 className="text-[22px] font-semibold">{currentLevel.name}</h1>
//         <p className='text-[15px] text-[#c6c6c6] leading-[24px] w-full text-center px-3 pt-2 pb-[42px]'>
//                                 Your number of shares determines the league you enter:
//                             </p>
//                             <div className='w-full relative flex items-center justify-center'>
//                             <div className="absolute left-[5px]">
//           {displayedLevelIndex > 0 && (
//             <button className="text-[#b0b0b0] hover:text-[#c4c4c4]" onClick={handlePrevious}>
//              <MdOutlineKeyboardArrowLeft size={40} className='' />
//             </button>
//           )}
//         </div>

//           <img src={currentLevel.icon} alt={currentLevel.name} className="w-[200px] h-auto" />

//           <div className="absolute right-[5px]">
//           {displayedLevelIndex < userLevels.length - 1 && (
//             <button className="text-[#b0b0b0] hover:text-[#c4c4c4]" onClick={handleNext}>
//                 <MdOutlineKeyboardArrowRight size={40} className='' />
//             </button>
//           )}
//         </div>

//                             </div>
     
//           {displayedLevelIndex === currentLevelIndex && displayedLevelIndex < userLevels.length - 1 ? (
//             <>
//                <p className="text-[18px] font-semibold text-[#c6c6c6] px-[20px] pt-[35px] pb-[10px]">{tapBalance} / {formatNumberCliam(currentLevel.tapBalanceRequired)}</p>
            
            
//                <div className='w-full px-[44px]'>
//             <div className='flex w-full mt-2 p-[4px] items-center bg-[#252525] rounded-[10px] border-[1px] border-[#323232]'>
       

//         <div className={`h-[8px] rounded-[8px] bg-[#909b15]`} style={{ width: `${(tapBalance / currentLevel.tapBalanceRequired) * 100}%` }}/> 
//         </div>

//    </div>



//             </>
//           ) : (
//             <>
//         <p className="text-[16px] font-medium text-[#c6c6c6] px-[20px] pt-[35px] pb-[10px]">From {formatNumberCliam(currentLevel.tapBalanceRequired)}</p>

//             </>
//           )}
//         </div>

//       </div>
//     </div>

//     </div>
//   );
// };

// export default Levels;
