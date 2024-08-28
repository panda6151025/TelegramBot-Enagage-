import React, { useEffect, useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import { Link, NavLink } from 'react-router-dom';
import styled, { keyframes } from "styled-components";
import { PiHandTap, PiTimerDuotone } from 'react-icons/pi';
import { IoCheckmarkCircleSharp } from "react-icons/io5";

import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import { RiArrowRightSLine } from 'react-icons/ri';
import Levels from '../Components/Levels';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
// import ParticlesBackground from '../Components/Particles';

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div.attrs((props) => ({
  style: {
    background: props.background,
    color: props.color,
    margin: props.margin,
    padding: props.padding,
  },
}))`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const TapEarn = () => {

  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const { balance, tapBalance, energy, totalScore, shooters, battery, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, loading, initialized } = useUser();


  const [points, setPoints] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);

  const [congrats, setCongrats] = useState(false);
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);

  const energyPercentage = (energy / battery.energy) * 100;
  const [energyBar, setEnergyBar] = useState(energyPercentage);

  const [openTap, setOpenTap] = useState(false)
  const [openHome, setOpenHome] = useState(true)


  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid && 'vibrate' in navigator) {
      // Use the vibration API on Android
      navigator.vibrate(50); // Vibrate for 50ms
    } else {
      console.warn('Haptic feedback not supported on this device.');
    }
  }
  const debounceTimerRef = useRef(null);
  const handleClick = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? "wobble-left"
        : offsetX > horizontalMidpoint
          ? "wobble-right"
          : offsetY < verticalMidpoint
            ? "wobble-top"
            : "wobble-bottom";

    // Remove previous animations
    imageRef.current.classList.remove(
      "wobble-top",
      "wobble-bottom",
      "wobble-left",
      "wobble-right"
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };



    setClicks((prevClicks) => [...prevClicks, newClick]);
    setEnergy((prevEnergy) => {
      const newEnergy = prevEnergy - tapValue.value;
      if (newEnergy <= 0) {
        // Set a timer for 1 minute
        const endTime = new Date(new Date().getTime() + 60000);
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('energy', newEnergy);
        setIsDisabled(true);
        const timer = setInterval(() => {
          // const newTimeLeft = new Date(endTime) - new Date();
          const newTimeLeft = new Date(endTime) - new Date();
          if (newTimeLeft <= 0) {
            clearInterval(timer);
            localStorage.removeItem('endTime');
            setIsDisabled(false);
            setIsTimerVisible(false);
            setEnergy(battery.energy);

          } else {
            setTimeRemaining(25000);
            // setTimeRemaining(newTimeLeft);
            setIsRefilling(true);
          }
        }, 1000);
        return 0; // Ensure energy does not drop below 0
      }
      setEnergyBar(newEnergy / battery.energy * 100)
      return Math.max(newEnergy, 0); // Ensure energy does not drop below 0
    });
    setPoints((prevPoints) => prevPoints + tapValue.value);

    const milestones = [
      { points: 4, elementId: 'tapmore' },
      { points: 10, elementId: 'tapmore2' },
      { points: 20, elementId: 'tapmore3' },
      { points: 30, elementId: 'tapmore4' },
      { points: 40, elementId: 'tapmore5' },
      { points: 50, elementId: 'tapmore6' },
      { points: 70, elementId: 'tapmore7' },
      { points: 80, elementId: 'tapmore8' },
      { points: 95, elementId: 'tapmore9' },
      // Add more milestones here as needed
    ];

    milestones.forEach(milestone => {
      if (points === battery.energy / 100 * milestone.points) {
        const element = document.getElementById(milestone.elementId);
        // const element2 = document.getElementById('fire');
        const element3 = document.getElementById('fire2');
        if (element) {
          element.style.visibility = 'visible';
          // element2.style.visibility = 'visible';
          element3.style.visibility = 'visible';
          setTimeout(() => {
            element.style.visibility = "hidden";
            //  element2.style.visibility = "hidden";
            element3.style.visibility = "hidden";
          }, 2000)
        }
      }
    });


    // Example usage:
    // handlePointMilestones(20); // This will change the div with id 'more' to display block
    // handlePointMilestones(50); // This will change the div with id 'more2' to display block
    // handlePointMilestones(100); // This will change the div with id 'more3' to display block
    const pulseElement = document.getElementById('pulser');
    const loaderElement = document.getElementById('loaderan');
    if (pulseElement) {
      pulseElement.style.animationName = 'pulsers';
      loaderElement.style.animationName = 'pulse-zoomin';

      // Clear the previous timeout if it exists
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timeout to remove the animation
      debounceTimerRef.current = setTimeout(() => {
        pulseElement.style.animationName = '';
        loaderElement.style.animationName = '';
      }, 1500); // Adjust the delay to match your animation duration
    }


    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000); // Match this duration with the animation duration
  };

  const maxEnergy = 100;
  const refillDuration = 58; // in seconds
  const incrementPerSecond = maxEnergy / refillDuration; // calculates the increment needed to reach maxEnergy in 60 seconds

  useEffect(() => {
    const startTime = localStorage.getItem('energyRefillStartTime');
    if (startTime) {
      const elapsed = (Date.now() - new Date(parseInt(startTime, 10))) / 1000; // elapsed time in seconds
      const savedEnergyBar = parseFloat(localStorage.getItem('energyBar')) || 0;
      const newEnergyBar = Math.min(savedEnergyBar + (elapsed * incrementPerSecond), maxEnergy);
      setEnergyBar(newEnergyBar);
      if (newEnergyBar < maxEnergy) {
        setIsRefilling(true);
      } else {
        localStorage.removeItem('energyRefillStartTime');
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let refillInterval;

    const startRefill = () => {
      const startTime = Date.now();
      localStorage.setItem('energyRefillStartTime', startTime);
      localStorage.setItem('energyBar', energyBar);

      refillInterval = setInterval(() => {
        setEnergyBar(prevEnergyBar => {
          // eslint-disable-next-line
          const elapsed = (Date.now() - startTime) / 1000; // elapsed time in seconds
          const newEnergyBar = Math.min(prevEnergyBar + incrementPerSecond, maxEnergy);
          localStorage.setItem('energyBar', newEnergyBar);
          if (newEnergyBar >= maxEnergy) {
            clearInterval(refillInterval);
            localStorage.removeItem('energyRefillStartTime');
            setIsRefilling(false); // Assuming you have a setIsRefilling function
          }
          return newEnergyBar;
        });
      }, 1000); // Increment every second
    };

    if (isRefilling) {
      startRefill();
    }

    return () => clearInterval(refillInterval);
    // eslint-disable-next-line
  }, [isRefilling, energyBar]);




  const handleClaim = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());
      try {
        await updateDoc(userRef, {
          balance: balance + points,
          energy: energy,
          tapBalance: tapBalance + points

        });
        setBalance((prevBalance) => prevBalance + points);
        setTapBalance((prevTapBalance) => prevTapBalance + points);
        localStorage.setItem('energy', energy);

        if (energy <= 0) {
          setIsTimerVisible(true);
        }
        console.log('Points claimed successfully');
      } catch (error) {
        console.error('Error updating balance and energy:', error);
      }
    }
    openClaimer();
  };




  useEffect(() => {
    const savedEndTime = localStorage.getItem('endTime');
    if (savedEndTime) {
      const endTime = new Date(savedEndTime);
      const newTimeLeft = endTime - new Date();
      if (newTimeLeft > 0) {
        setIsDisabled(true);
        setIsTimerVisible(true);
        // setTimeRemaining(newTimeLeft);
        setTimeRemaining(25000);

        const timer = setInterval(() => {
          const updatedTimeLeft = endTime - new Date();
          if (updatedTimeLeft <= 0) {
            clearInterval(timer);
            localStorage.removeItem('endTime');
            setIsDisabled(false);
            setIsTimerVisible(false);
            setEnergy(battery.energy);
          } else {
            // setTimeRemaining(updatedTimeLeft);
            setTimeRemaining(25000);

          }
        }, 1000);
      } else {
        localStorage.removeItem('endTime');
      }
    }
    // eslint-disable-next-line
  }, []);

  // Effect to log the values of timeRemaining and energy whenever they change
  useEffect(() => {
    if (initialized) {
      const savedEnergy = localStorage.getItem('energy');
      console.log("Energy Remaining:", savedEnergy);
    }
  }, [timeRemaining, energy, initialized]);

  const closeClaimer = () => {
    setOpenClaim(false);
    setPoints(0); // Reset points after claiming

  };

  const openClaimer = () => {
    setOpenClaim(true)
    setCongrats(true)

    setTimeout(() => {
      setCongrats(false)
    }, 4000)


  }



  const formatTimeRemaining = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const tapGame = () => {
    setOpenTap(true);
    setOpenHome(false);
  }


  return (
    <>
      {loading ? (
        <Spinner />
      ) : (

        <Animate>

          <div className='flex flex-col justify-center w-full pt-3 homee'>
            <div className='flex flex-col justify-center w-full px-5 space-y-3'>

              <h1 className='flex items-center justify-center w-full space-x-1'>
                <img src="/engagetap2.svg" className='w-[28px] animate-pulse' alt='engagecoin' />
                <span className='text-[26px] balancy font-bold'>
                  <span className='pl-[2px]'>{formatNumber(balance + refBonus)} <span className=''></span></span>
                </span>
              </h1>
              <div onClick={() => setShowLevel(true)} className='w-full flex space-x-1 items-center !mt-[4px] pt-[2px] pb-[14px] justify-center'>
                <span className='flex items-center justify-center'>

                  <img alt="engy" src={level.imgUrl} className='w-[18px] h-full' />

                </span>
                <span className='levelName font-medium text-[15px] flex items-center space-x-1'>
                  <span className=''> {level.name}</span>
                  <span className='flex items-center'>  <RiArrowRightSLine size={18} className='' /> </span>
                </span>
              </div>
            </div>

            {/* <button onClick={handleRefillClick} className='py-2 bg-black'>
  REFILL
</button> */}


            {openHome && (
              <div className='w-full relative h-screen bg-cards shadowtop border-[0.5px] border-[#595959] bordercut rounded-tl-[40px] rounded-tr-[40px]'>
                <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5 pt-[6px]'>

                  <div className="w-full flex flex-col overflow-y-auto pb-[100px] h-[60vh] scroller">

                    <div className="pb-1 pt-7">
                      <h1 className='text-[20px] font-semibold pb-1'>
                        Play to Earn
                      </h1>
                      <p className='text-[14px] leading-[24px] pr-6'>
                        Have fun while you earn and accumulate Engage Points now!
                      </p>
                    </div>

                    <div className="flex flex-col w-full pt-3 pb-4 space-y-3">



                      <button onClick={tapGame} className="w-full justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
                        <div className="flex items-center w-full space-x-3">
                          <span className='w-[60px]'>
                            <img src={level.imgUrl} alt={level.name} className='w-[60px]' />
                          </span>
                          <div className="font-semibold boostTitle text-[16px] flex-1 items-start text-left flex flex-col space-y-[2px]">
                            <h3> Tap to Earn</h3>
                            <p className="text-[11px] text-[#d0d0d0] text-left pb-1">
                              {energy} energy left
                            </p>
                            <span className="text-[#e7e7e7] boostAmount font-medium flex items-center justify-between w-full">
                              <span className="text-[14px]"> {formatNumber(tapBalance)} ENGAGE POINTS EARNED </span>

                            </span>

                          </div>
                          <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />

                        </div>


                      </button>

                      <NavLink to="/speedo" className="w-full justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
                        <div className="flex items-center w-full space-x-3">
                          <span className='w-[60px]'>
                            <img src='/shots.webp' alt={level.name} className='w-[60px]' />
                          </span>
                          <div className="font-semibold boostTitle text-[16px] flex-1 items-start text-left flex flex-col space-y-[2px]">
                            <h3>  Shoot to Earn</h3>
                            <p className="text-[11px] text-[#d0d0d0] text-left pb-1">
                              {shooters} plays remaining
                            </p>
                            <span className="text-[#e7e7e7] boostAmount font-medium flex items-center justify-between w-full">
                              <span className="text-[14px]"> {formatNumber(totalScore)} ENGAGE POINTS EARNED</span>

                            </span>

                          </div>
                          <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />

                        </div>


                      </NavLink>




                      {/* <NavLink to="/speedo"                       
            className="w-[48%] h-[120px] justify-center p-3 flex flex-col space-y-1 bg-cards rounded-[12px]">
            <div className="flex space-x-2">
            <img src={level.imgUrl} alt={level.name} className='w-[20px]'/>
            <span className="font-medium boostTitle text-[15px] items-start text-left flex flex-col space-y-[2px]">
             <h3> Shoot to Earn</h3>
             <p className="text-[11px] text-[#d0d0d0] text-left">
              {shooters} remaining
             </p>
            </span>

            </div>
            <span className="text-[#e7e7e7] boostAmount font-semibold text-[16px] pl-1 flex items-center justify-between w-full">
            <span> {formatNumber(totalScore)} earned</span>
            <MdOutlineKeyboardArrowRight size={30} className='text-[#a3a3a3b5]' />
            </span>

          </NavLink> */}

                    </div>


                  </div>
                </div>
              </div>

            )}


            {openTap && (
              <div className='flex flex-col w-full px-5 space-y-3'>



                <div className='flex items-center justify-center w-full space-x-5'>
                  <div className='bg-headerCard barTitle py-[10px] px-5 w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px] font-medium'>
                    <span className='text-[16px]'>
                      <PiHandTap size={18} className={`text-${level.class}`} />
                    </span>
                    {isTimerVisible ? (
                      <span>
                        wait for refill
                      </span>

                    ) : (
                      <span className='text-nowrap text-[#b9b9b9]'>
                        {energy} taps left</span>
                    )}
                  </div>
                  <div className={`bg-headerCard barTitle py-[10px] px-5 text-${level.class} brightdness-[1.5] font-medium w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px]`}>
                    <span className='text-[16px]'>
                      <PiTimerDuotone size={18} className='' />
                    </span>
                    {isTimerVisible ? (
                      <span className='text-nowrap'>{`${formatTimeRemaining(timeRemaining)}`}</span>
                    ) : (
                      <span>
                        tap now
                      </span>
                    )}
                  </div>
                </div>

                <div className='relative flex items-center justify-center w-full pt-6 peeyo'>
                  <img id="fire2" src='/coinsup.gif' alt='refiler' className='rotate-[180deg] invisible absolute top-[-50px] z-50' />
                  <div id="fire" class={`pyro absolute invisible ease-in duration-100`}>
                    <div class="before"></div>
                    <div class="after"></div>
                  </div>
                  <div id="pulser" className="image-container">

                    <Container className='' id="loaderan">

                      <img
                        onPointerDown={handleClick}
                        ref={imageRef}
                        src={level.imgUrl}
                        alt="Wobble"
                        className={`wobble-image select-none`}
                      />
                      {clicks.map((click) => (
                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                          +{tapValue.value}
                        </SlideUpText>
                      ))}


                      <span id="tapmore" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-0 right-0'>
                        tap more!
                      </span>
                      <span id="tapmore2" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-0 left-0'>
                        let's go!
                      </span>
                      <span id="tapmore3" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        tap! tap! tap!!
                      </span>
                      <span id="tapmore4" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        almost there!!
                      </span>
                      <span id="tapmore5" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        keep going 🤙
                      </span>
                      <span id="tapmore6" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        50% energy left💪
                      </span>
                      <span id="tapmore7" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        tap! tap! tap!!
                      </span>
                      <span id="tapmore8" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        energy running out!
                      </span>
                      <span id="tapmore9" className='bg-[#333333b0] text-nowrap ease-in duration-100 invisible tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
                        refill, refill!🪫
                      </span>
                    </Container>
                  </div>

                </div>

                <div className='w-full flex justify-center flex-col space-y-[20px]'>
                  <div className='w-full px-8'>


                    <div className="flex w-full mt-2 p-[4px] items-center bg-[#252525] rounded-[10px] border-[1px] border-[#323232]">
                      <div className={`h-[8px] rounded-[8px] bg-${level.class}`} style={{ width: `${energyBar}%` }} />
                    </div>
                  </div>

                  <div className={`${glowBooster === true ? "glowbutton" : ""} w-full flex !mt-4 justify-between items-center bg-cards rounded-[12px] py-3 px-4`}>

                    {energy === 0 && points === 0 ? (
                      <>
                        <p className='moreTaps py-2 text-[14px] font-medium pr-3'>
                          Need more taps? Get boosters now!
                        </p>
                        <Link
                          to="/boost"
                          className={`bg-${level.class} getBoosters py-[14px] px-5 text-nowrap rounded-[12px] font-semibold text-[15px]`}
                        >
                          Get Boosters
                        </Link>
                      </>
                    ) : (
                      <>
                        <h3 className='font-semibold text-[24px]'>

                          <span className='pl-[2px]'>{points} <span className={`text-${level.class}`}>$ENG</span></span>

                        </h3>
                        <button
                          onClick={handleClaim}
                          disabled={points === 0}
                          className={`${points === 0 || openClaim ? 'bg-btn2' : `bg-${level.class}`} py-[14px] px-8 rounded-[12px] getBoosters font-bold text-[16px]`}
                        >
                          Claim
                        </button>
                      </>
                    )}
                  </div>

                  <p className='text-[12px] !mt-3 texthome w-full px-[16px] text-center'>
                    {energyBar != 0 ? `You have energy left! Tap and continue the fun! Let's go 🤙` : `No energy left! ⚡️ Wait for your energy to refill, or explore other games to keep earning $ENG tokens! 🎮💰`}
                  </p>


                </div>

              </div>
            )}


            {/* Claim Modal */}

            <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none'>
              {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
            </div>

            <div
              className={`${openClaim === true ? "visible" : "invisible"
                } fixed top-[-12px] bottom-0 left-0 z-10 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
            >


              <div className={`${openClaim === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
                } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
                <div className="flex flex-col items-center justify-center w-full space-y-3">
                  <div className="flex flex-col items-center justify-center w-full space-y-2">
                    <IoCheckmarkCircleSharp size={32} className={`text-${level.class}`} />
                    <p className='font-medium'>Let's go!!</p>
                  </div>
                  <h3 className="font-medium text-[24px] pt-2 pb-2">
                    <span className={`text-${level.class}`}>+{points}</span> ENG
                  </h3>
                  <p className="pb-6 text-[15px] w-full text-center">
                    Keep grinding! something huge is coming! Get more ENG now!
                  </p>
                </div>

                <div className="flex justify-center w-full">
                  <button
                    onClick={closeClaimer}
                    className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
                  >
                    Tap More!
                  </button>
                </div>
              </div>
            </div>



            <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
          </div>
        </Animate>
      )}
    </>
  );
};

export default TapEarn;
