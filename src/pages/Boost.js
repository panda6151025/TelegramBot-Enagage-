import React, { useEffect, useRef, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useUser } from "../context/userContext";
import { GiMagicPalm } from "react-icons/gi";
import { MdBatteryCharging90 } from "react-icons/md";
import { IoIosFlash } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import Levels from "../Components/Levels";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GiBoltDrop } from "react-icons/gi";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import { IoClose } from "react-icons/io5";




import { PiRocketLaunchFill } from "react-icons/pi";


const tapValues = [
  {
    level: 1,
    value: 1,
  },
  {
    level: 2,
    value: 2,
  },
  {
    level: 3,
    value: 3,
  },
  {
    level: 4,
    value: 4,
  },
  {
    level: 5,
    value: 5,
  },
  {
    level: 6,
    value: 6,
  },
  {
    level: 7,
    value: 7,
  },
  {
    level: 8,
    value: 8,
  },
  {
    level: 9,
    value: 9,
  },
  {
    level: 10,
    value: 10,
  },
  {
    level: 11,
    value: 11,
  },
  {
    level: 12,
    value: 12,
  },
  {
    level: 13,
    value: 13,
  },
  {
    level: 14,
    value: 14,
  },
];

const energyValues = [
  {
    level: 1,
    energy: 500,
  },
  {
    level: 2,
    energy: 1000,
  },
  {
    level: 3,
    energy: 1500,
  },
  {
    level: 4,
    energy: 2000,
  },
  {
    level: 5,
    energy: 2500,
  },
  {
    level: 6,
    energy: 3000,
  },
  {
    level: 7,
    energy: 3500,
  },
  {
    level: 8,
    energy: 4000,
  },
  {
    level: 9,
    energy: 4500,
  },
  {
    level: 10,
    energy: 5000,
  },
  {
    level: 11,
    energy: 5500,
  },
  {
    level: 12,
    energy: 6000,
  },
  {
    level: 13,
    energy: 6600,
  },
  {
    level: 14,
    energy: 7000,
  },
];


const upgradeCosts = [0, 2000, 5000, 10000, 20000, 40000, 80000, 100000, 150000, 200000, 250000, 300000, 400000, 500000];


const energyUpgradeCosts = [0, 3000, 6000, 12000, 24000, 50000, 100000, 200000, 300000, 400000, 600000, 800000, 1000000, 2000000];


const Boost = () => {
  const { level, balance, id, tapValue, setTapValue, battery, setEnergy, setBattery, setBalance, refBonus } = useUser();
  const [showLevel, setShowLevel] = useState();
  const [openInfo, setOpenInfo] = useState(false);
  const [openInfoTwo, setOpenInfoTwo] = useState(false);
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [isUpgradeModalVisibleEn, setIsUpgradeModalVisibleEn] = useState(false);
  const [congrats, setCongrats] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isUpgradingEn, setIsUpgradingEn] = useState(false);


  const infoRef = useRef(null);
  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setOpenInfo(false);
    }
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfo || openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openInfo, openInfoTwo]);

  const openit = () => {
    setOpenInfo(true);
  }

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const nextLevel = tapValue.level;
    const upgradeCost = upgradeCosts[nextLevel];
    if (nextLevel < tapValues.length && (balance + refBonus) >= upgradeCost && id) {
      const newTapValue = tapValues[nextLevel];
      const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          tapValue: newTapValue,
          balance: balance - upgradeCost
        });
        setTapValue(newTapValue);
        setBalance((prevBalance) => prevBalance - upgradeCost);
        setIsUpgrading(false);
        setIsUpgradeModalVisible(false);
        setCongrats(true)

        setTimeout(() => {
          setCongrats(false)
        }, 4000)
        console.log('Tap value upgraded successfully');
      } catch (error) {
        console.error('Error updating tap value:', error);
      }

    }

  };

  const handleEnergyUpgrade = async () => {
    setIsUpgradingEn(true);
    const nextEnergyLevel = battery.level;
    const energyUpgradeCost = energyUpgradeCosts[nextEnergyLevel];
    if (nextEnergyLevel < energyValues.length && (balance + refBonus) >= energyUpgradeCost && id) {
      const newEnergyValue = energyValues[nextEnergyLevel];
      const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          battery: newEnergyValue,
          balance: balance - energyUpgradeCost,
          energy: newEnergyValue.energy
        });
        setBattery(newEnergyValue);
        localStorage.setItem('energy', newEnergyValue.energy);
        setEnergy(newEnergyValue.energy);
        setBalance((prevBalance) => prevBalance - energyUpgradeCost);
        setIsUpgradingEn(false);
        setCongrats(true)
        setIsUpgradeModalVisibleEn(false);
        setTimeout(() => {
          setCongrats(false)
        }, 4000)
        console.log('Energy value upgraded successfully');
        console.log('Energy value upgraded successfully +', newEnergyValue.value);
      } catch (error) {
        console.error('Error updating energy value:', error);
      }

    }

  };


  const nextUpgradeCost = upgradeCosts[tapValue.level];
  const hasSufficientBalance = (balance + refBonus) >= nextUpgradeCost;

  const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
  const hasSufficientBalanceEn = (balance + refBonus) >= nextEnergyUpgradeCost;


  return (
    <>

      <Animate>
        <div className="w-full pt-1 justify-center flex-col space-y-3">

          <div className='w-full flex-col space-y-4 flex px-5 pb-3 z-10'>
            <div className='w-full flex justify-between'>

              <button onClick={() => setShowLevel(true)} className='w-[55%] flex space-x-1 items-center'>
                <span className='flex items-center justify-center'>

                  <img alt="engy" src={level.imgUrl} className='w-[18px] h-full' />

                </span>
                <span className='levelName font-semibold text-[15px] flex items-center space-x-1'>
                  <span className=''> {level.name}</span>
                  <span className='flex items-center'>  <RiArrowRightSLine size={22} className='' /> </span>
                </span>
              </button>




              <div className='w-fit py-[4px] px-3 flex items-center space-x-1 justify-center border-[1px] border-[#707070] rounded-[25px]'>
                <span className='w-[18px] levelImg'>
                  <img alt="engy" src='/engagetap2.svg' className='w-full' />
                </span>
                <h1 className="text-[15px] font-bold">
                  {formatNumber(balance + refBonus)}
                </h1>
              </div>

            </div>

            <div className="pb-1">
              <h1 className='text-[24px] font-semibold pb-1'>
                Buy Boosters
              </h1>
              <p className='text-[14px] leading-[24px] pr-6'>
                Purchase boosters & earn more tokens!
              </p>
            </div>

          </div>

          <div className='w-full relative h-screen bg-cards shadowtop border-[0.5px] border-[#595959] bordercut rounded-tl-[40px] rounded-tr-[40px]'>
            <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5 pt-[6px]'>

              <div className="w-full flex flex-col overflow-y-auto pb-[100px] h-[60vh] scroller">
                <div className="w-full flex items-center justify-between space-x-4 pt-7 pb-4">

                  <button
                    onClick={() => setIsUpgradeModalVisible(true)}
                    disabled={tapValue.level >= tapValues.length}
                    className="w-[48%] h-[120px] justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
                    <div className="flex space-x-2">
                      <GiMagicPalm size={45} className="text-[#bcbcbc] boostImg" />
                      <span className="font-medium boostTitle text-[15px] items-start text-left flex flex-col space-y-[2px]">
                        <h3 className=""> Multitap</h3>
                        <p className="text-[11px] text-[#d0d0d0] text-left">
                          Level {tapValue.level}
                        </p>
                      </span>

                    </div>
                    <span className="text-[#e7e7e7] boostAmount font-semibold text-[24px] pl-1 flex items-center justify-between w-full">
                      <span> {formatNumber(nextUpgradeCost)}</span>
                      <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />
                    </span>

                  </button>

                  <button
                    onClick={() => setIsUpgradeModalVisibleEn(true)}
                    disabled={battery.level >= energyValues.length}

                    className="w-[48%] h-[120px] justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
                    <div className="flex space-x-2">
                      <MdBatteryCharging90 size={45} className="text-[#bcbcbc] boostImg" />
                      <span className="font-medium boostTitle text-[15px] items-start text-left flex flex-col space-y-[2px]">
                        <h3> Tap Limit</h3>
                        <p className="text-[11px] text-[#d0d0d0] text-left">
                          Level {battery.level}
                        </p>
                      </span>

                    </div>
                    <span className="text-[#e7e7e7] boostAmount font-semibold text-[24px] pl-1 flex items-center justify-between w-full">
                      <span> {formatNumber(nextEnergyUpgradeCost)}</span>
                      <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />
                    </span>

                  </button>

                </div>

                {/*  */}
                <div className="w-full flex-col space-y-6">

                  <div onClick={openit} class="isolate cardios aspect-video w-full rounded-xl relative overflow-hidden p-6">

                    <img alt="engy" src='https://ucarecdn.com/6c6a2ee0-152e-4304-8cf7-017f02c97f58/daxcard.webp'
                      className="absolute left-0 right-0 top-[-32px] bottom-0 object-cover opacity-[0.09] z-0 pointer-events-none"
                    />
                    <div className="backdrop-blur-[10px] cards absolute left-0 right-0 top-0 bottom-0 z-0 pointer-events-none" />

                    <div className="flex w-full flex-col relative z-10 space-y-1">
                      <div className="flex justify-between">

                        <PiRocketLaunchFill size={40} className="text-[#bcbcbc] xxImg" />
                        <IoMdInformationCircleOutline size={20} className="text-[#d0d0d0b7]" />

                      </div>

                      <h4 className="text-[16px] xxTitle text-[#f2f2f2] font-semibold uppercase">
                        Balance boost card
                      </h4>
                      <span className="text-[32px] xxAmount text-[#e7e7e7] font-semibold flex items-center space-x-2">
                        <span>500 000</span>
                        <span className={`not-italic text-[20px] mt-1 text-${level.class} flex items-center`}>
                          <span>x2</span>
                          <IoIosFlash size={20} className="" />
                        </span>
                      </span>

                      <button className="text-[#d0d0d0] py-1 px-3 bg-[#ffffff14] rounded-[5px] font-medium text-[14px] w-fit">
                        Coming soon...
                      </button>

                    </div>

                  </div>

                  {/*  */}

                  <button onClick={() => setOpenInfoTwo(true)} className="w-full justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
                    <div className="flex space-x-2 w-full">
                      <GiBoltDrop size={45} className="text-[#bcbcbc] boostImg" />
                      <div className="font-semibold boostTitle text-[15px] flex-1 items-start text-left flex flex-col space-y-[2px]">
                        <h3> Airdrop Early Access</h3>
                        <p className="text-[11px] text-[#d0d0d0] text-left">
                          VIP access card
                        </p>
                        <span className="text-[#d0d0d0] boostAmount font-medium flex items-center justify-between w-full">
                          <span className="text-[14px]"> Coming soon...</span>
                          <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />
                        </span>
                      </div>

                    </div>


                  </button>

                </div>


              </div>
            </div>
          </div>


          <div
            className={`${openInfo === true ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
          >


            <div ref={infoRef} className={`${openInfo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-[#303030] relative rounded-[16px] flex flex-col justify-center p-8`}>
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                <div className="w-full items-center justify-center flex flex-col space-y-2">
                  <PiRocketLaunchFill size={32} className={`text-${level.class}`} />
                  <p className='font-medium'>x2 balance</p>
                </div>
                <h3 className="font-medium text-[20px] pt-2 pb-2 uppercase">
                  Balance boost card
                </h3>
                <p className="pb-6 text-[15px] w-full text-center">
                  This booster card allows you to get double of your earnings before listing date. Ancipate and keep claiming your tokens as you await airdrop date.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <button
                  onClick={() => setOpenInfo(false)}
                  className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
                >
                  Back to boosters
                </button>
              </div>
            </div>
          </div>

          {/*  */}

          <div
            className={`${openInfoTwo === true ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
          >


            <div ref={infoRefTwo} className={`${openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-[#303030] relative rounded-[16px] flex flex-col justify-center p-8`}>
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                <div className="w-full items-center justify-center flex flex-col space-y-2">
                  <GiBoltDrop size={32} className={`text-${level.class}`} />
                  <p className='font-medium'>early access</p>
                </div>
                <h3 className="font-medium text-[20px] pt-2 pb-2 uppercase">
                  AIRDROP EARLY ACCESS
                </h3>
                <p className="pb-6 text-[15px] w-full text-center">
                  This booster card allows you to be among first 200,000 members to get token distribution and hold before lauching date.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <button
                  onClick={() => setOpenInfoTwo(false)}
                  className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
                >
                  Back to boosters
                </button>
              </div>
            </div>
          </div>




          <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none'>
            {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
          </div>



          {/* Upgrade Modal */}
          <div
            className={`${isUpgradeModalVisible ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-10 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
          >
            <div className={`${isUpgradeModalVisible ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                <button
                  onClick={() => setIsUpgradeModalVisible(false)}
                  className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                >
                  <IoClose size={24} className="text-[#9a96a6]" />
                </button>
                <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                  <GiMagicPalm size={55} className={`text-${level.class}`} />

                </div>
                <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
                  Multitap level <span className={`text-${level.class}`}>{tapValues[tapValue.level]?.value}</span>
                </h3>
                <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="engy" src='/engagetap2.svg' className='w-[18px]' /></span>
                  <span className='font-semibold text-[17px]'>{formatNumber(nextUpgradeCost)}</span>
                </span>

                <p className="pb-6 text-[14px] font-medium w-full text-center">
                  Increase the amount of EN you can earn per one tap. <br />
                  +1 per tap for each level.
                </p>
                <div className="w-full flex justify-center">
                  <button
                    onClick={handleUpgrade}
                    disabled={!hasSufficientBalance}
                    className={`${!hasSufficientBalance ? 'bg-btn2' : `bg-${level.class}`} w-full py-[14px] px-6 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
                  >
                    {isUpgrading ? 'Boosting...' : hasSufficientBalance ? 'Boost' : 'Insufficient Balance'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Energy Upgrade Modal */}
          <div
            className={`${isUpgradeModalVisibleEn ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-10 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
          >
            <div className={`${isUpgradeModalVisibleEn ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                <button
                  onClick={() => setIsUpgradeModalVisibleEn(false)}
                  className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                >
                  <IoClose size={24} className="text-[#9a96a6]" />
                </button>
                <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                  <MdBatteryCharging90 size={55} className={`text-${level.class}`} />

                </div>
                <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
                  Energy Limit level <span className={`text-${level.class}`}>{energyValues[battery.level]?.level}</span>
                </h3>
                <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="engy" src='/engagetap2.svg' className='w-[18px]' /></span>
                  <span className='font-semibold text-[17px]'>{formatNumber(nextEnergyUpgradeCost)}</span>
                </span>

                <p className="pb-6 text-[14px] font-medium w-full text-center">
                  Increase the limit of your energy storage. <br />
                  +500 energy limit for each level.
                </p>
                <div className="w-full flex justify-center">
                  <button
                    onClick={handleEnergyUpgrade}
                    disabled={!hasSufficientBalanceEn}
                    className={`${!hasSufficientBalanceEn ? 'bg-btn2' : `bg-${level.class}`} w-full py-[14px] px-6 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
                  >
                    {isUpgradingEn ? 'Boosting...' : hasSufficientBalanceEn ? 'Boost' : 'Insufficient Balance'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Levels showLevel={showLevel} setShowLevel={setShowLevel} />


        </div>
        <Outlet />
      </Animate>

    </>
  );
};

export default Boost;
