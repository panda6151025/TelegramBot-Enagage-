import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';


const milestones = [
  { name: 'Bronze Coin', icon: '/Bronze.webp', tapBalanceRequired: 1000, reward: 50000 },
  { name: 'Silver Coin', icon: '/Silver.webp', tapBalanceRequired: 50000, reward: 100000 },
  { name: 'Gold Coin', icon: '/Gold.webp', tapBalanceRequired: 500000, reward: 250000 },
  { name: 'Platinum Coin', icon: '/Platinum.webp', tapBalanceRequired: 1000000, reward: 500000 },
  { name: 'Diamond Coin', icon: '/Diamond.webp', tapBalanceRequired: 2500000, reward: 1000000 },
  { name: 'Legendary Coin', icon: '/Legendary.webp', tapBalanceRequired: 5000000, reward: 2500000 },
];

const MilestoneRewards = () => {
  const { tapBalance, balance, setBalance, id, claimedMilestones, setClaimedMilestones, level } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [congrats, setCongrats] = useState(false)

  const handleClaim = async (milestone) => {
    if (tapBalance >= milestone.tapBalanceRequired && !claimedMilestones.includes(milestone.name)) {
      const newBalance = balance + milestone.reward;
      try {
        const userRef = doc(db, 'telegramUsers', id);
        await updateDoc(userRef, {
          balance: newBalance,
          claimedMilestones: [...claimedMilestones, milestone.name],
        });
        setBalance(newBalance);
        setClaimedMilestones([...claimedMilestones, milestone.name]);
        setModalMessage(
            <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className={`text-${level.class}`}/>
              <p className='font-medium text-center'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[20px] pt-2 pb-2">
              <span className={`text-${level.class}`}>+{formatNumberCliam(milestone.reward)}</span> EN CLAIMED
            </h3>
            <p className="pb-6 text-[15px] w-full text-center">
              Keep tapping and performing tasks to unlock new milestones! something huge is coming!
            </p>
          </div>
        );

        setModalOpen(true);
        setCongrats(true)
  
        setTimeout(() => {
            setCongrats(false)
        }, 4000)
      } catch (error) {
        console.error('Error claiming milestone reward:', error);
      }
    } else {
      setModalMessage('You have already claimed this milestone reward or do not meet the requirements.');
      setModalOpen(true);
    }
  };



  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 10000000) {
        return new Intl.NumberFormat().format(num).replace(/,/g, " ");
      } else {
      return (num / 10000000).toFixed(3).replace(".", ".") + " T";
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col space-y-4">

      {milestones.filter(milestone => !claimedMilestones.includes(milestone.name)).map((milestone) => {
        const progress = (tapBalance / milestone.tapBalanceRequired) * 100;
        const isClaimable = tapBalance >= milestone.tapBalanceRequired && !claimedMilestones.includes(milestone.name);
        return (


            <div key={milestone.name} className='bg-cards rounded-[15px] p-[14px] flex flex-wrap justify-between items-center'>

    <div className='flex flex-1 items-center space-x-2'>

        <div className=''>
            <img src={milestone.icon} alt="bronze" className='w-[55px]'/>
        </div>
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold'>
            {milestone.name}
            </span>
            <div className='flex items-center space-x-1'>
            <span className="">

            <span className={`w-[10px] h-[10px] bg-${level.class} rounded-full flex items-center`}>
        </span>
</span>
<span className='font-medium'>
{formatNumberCliam(milestone.reward)}
</span>
            </div>
        </div>

    </div>

    {/*  */}

    <div className=''>
                <button
              className={`w-fit relative rounded-[8px] font-semibold py-2 px-3 ${
                isClaimable ? `bg-${level.class} hover:bg-[#b4b4b4] ease-in duration-200` : 'bg-btn2 cursor-not-allowed'
              }`}
              disabled={!isClaimable}
              onClick={() => handleClaim(milestone)}
            >
              {isClaimable ? 'Claim' : 'Claim'}
            </button>
    </div>

    <div className='flex w-full mt-2 p-[4px] items-center bg-[#252525] rounded-[10px] border-[1px] border-[#323232]'>
        
         <div className={`h-[8px] rounded-[8px] ${progress >= 100 ? `bg-${level.class}` : `bg-${level.class}`}`} style={{ width: `${progress > 100 ? 100 : progress}%` }}/> 

    </div>

</div>

        );
      })}

<div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>

<div
        className={`${
          modalOpen === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-10 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div className={`${
          modalOpen === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
{modalMessage}
          <div className="w-full flex justify-center">
            <button
              onClick={closeModal}
              className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Continue to next
            </button>
          </div>
        </div>
      </div>



    </div>
  );
};

export default MilestoneRewards;
