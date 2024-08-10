// import React from 'react'
// import coinsmall from "../images/coinsmall.webp";
// import bronze from "../images/bronze.webp";

// const referrals = [
//     {
//       username: "Jameslordi",
//       coins: 150420,
//       level: "Bronze"
//     },
//     {
//       username: "Aisha_Oladipo",
//       coins: 78340,
//       level: "Silver"
//     },
//     {
//       username: "AhmedAlMasri",
//       coins: 120540,
//       level: "Gold"
//     },
//     {
//       username: "EmilyWatson",
//       coins: 230760,
//       level: "Platinum"
//     },
//     {
//       username: "NnekaChukwuma",
//       coins: 450930,
//       level: "Diamond"
//     },
//     {
//       username: "Hassan_Jaber",
//       coins: 670890,
//       level: "Master"
//     },
//     {
//       username: "MichaelJones",
//       coins: 15420,
//       level: "Bronze"
//     },
//     {
//       username: "ChinyereUdoh",
//       coins: 80320,
//       level: "Silver"
//     },
//     {
//       username: "Layla_Khalil",
//       coins: 110430,
//       level: "Gold"
//     },
//     {
//       username: "OliviaBrown",
//       coins: 210560,
//       level: "Platinum"
//     },
//     {
//       username: "Suleiman_Abu",
//       coins: 470820,
//       level: "Diamond"
//     },
//     {
//       username: "JohnSmith",
//       coins: 680770,
//       level: "Master"
//     },
//     {
//       username: "TemitopeAdesina",
//       coins: 13450,
//       level: "Bronze"
//     },
//     {
//       username: "Yasmin_Hussein",
//       coins: 76310,
//       level: "Silver"
//     },
//     {
//       username: "HannahTaylor",
//       coins: 123450,
//       level: "Gold"
//     },
//     {
//       username: "OluwaseunAdeyemi",
//       coins: 240670,
//       level: "Platinum"
//     },
//     {
//       username: "Zahra_Najjar",
//       coins: 490910,
//       level: "Diamond"
//     },
//     {
//       username: "DavidClark",
//       coins: 700890,
//       level: "Master"
//     },
//     {
//       username: "FatimaBello",
//       coins: 14460,
//       level: "Bronze"
//     },
//     {
//       username: "Rachel_Miller",
//       coins: 82350,
//       level: "Silver"
//     },
//   ];
  

// const Referra = () => {
//     const formatNumber = (num) => {
//         if (num < 100000) {
//           return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//         } else if (num < 1000000) {
//           return new Intl.NumberFormat().format(num).replace(/,/g, " ");
//         } else {
//           return (num / 1000000).toFixed(3).replace(".", ".") + " M";
//         }
//       };
    

//   return (
//     <div id="refer" className="w-full h-[1000px] touch-auto scroller rounded-[16px] overflow-y-auto pt-2 pb-[150px]">

//     <div className="w-full flex flex-col space-y-3">
//                       {referrals.map((user, index) => (
//               <div
//                 key={index}
//                 className="bg-[#2b2b2b96] rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
//               >
//                 <div className="flex flex-1 flex-col space-y-1">
//                   <div className="text-[#d2d2d2] pl-1 text-[15px] font-semibold">
//                     {user.username}
//                   </div>

//                   <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
//                     <div className="">
//                       <img alt="engy" src={bronze} alt="bronze" className="w-[18px]" />
//                     </div>
//                     <span className="font-medium text-[#9a96a6]">
//                       {user.level}
//                     </span>
//                     <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>

//                     <span className="w-[16px]">
//                       <img
//                         src={coinsmall}
//                         className="w-full"
//                         alt="coin"
//                       />
//                     </span>
//                     <span className="font-normal text-[#ffffff] text-[14px]">
//                       {formatNumber(user.coins)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-[#d5df99] font-semibold text-[14px]">
//                   +{formatNumber(user.coins / 100 * 10)}
//                 </div>
     
//               </div>
//             ))}
//             </div>

//   </div>
//   )
// }

// export default Referra