import React, { useEffect, useState, useRef } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useUser } from "../context/userContext";

const Wallet = () => {

  const { level } = useUser();

  const [openInfoTwo, setOpenInfoTwo] = useState(false);

  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {

    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openInfoTwo]);


  return (
    <>
      {/* {loading ? (
        <Spinner />
      ) : ( */}
      <Animate>
        <div className="flex-col justify-center w-full px-5 pt-2 space-y-3">


          <div className="flex flex-col items-center justify-center w-full space-y-3">

            <img alt="engy" src={level.imgUrl}
              className="w-[160px] animate-spin spinslow"
            />

            <div className="flex flex-col items-center justify-center w-full space-y-2 text-center">


              <h1 className="font-bold text-[32px] text-center">
                Airdrop Tasks
              </h1>
              <p className='text-[14px] leading-[24px] px-6 pb-8'>
                Earn Engage Points while receiving exclusive $ENG token airdrops based on your points! The higher your level, the bigger the airdrops from top-tier projects. Don't miss out on these rewards!
              </p>
              <div className="flex flex-col w-full">
                {/* <div className="bg-cards mb-4 small-text2 py-4 px-4 rounded-[12px] text-[14px]">
              No airdrop tasks yet, keep tapping and always check the community for announcement of when airdrop tasks will be unlocked.
            </div> */}

                <div onClick={() => setOpenInfoTwo(true)} class="w-full rounded-[15px] bg-gradient-to-r from-[#457576bf] via-[#ff685a] to-[#5c487d9e] p-[1px]">

                  <div class="flex h-full w-full bg-[#319cdf] rounded-[14px] items-center py-4 px-4 relative space-x-3">
                    {/* <div className='w-[60px] h-[60px] rounded-[12px] p-2 bg-[#a2575f] flex items-center justify-center'>
            <img alt="engy" alt="daxy" src='https://ucarecdn.com/ca87080e-9188-4141-8d7b-75d71e1b58cb/telegram.svg' className='w-[40px]'/>
        </div> */}
                    <span className="w-[30px] flex items-center mt-[-2px] ">
                      <img src='https://ucarecdn.com/b6cc2d69-82d2-41b3-9d2e-a3544f0becde/wallet.webp' alt="connect"
                        className="w-full" />
                    </span>

                    <h1 class="text-[15px] small-text2 text-left text-nowrap font-semibold text-white pb-1 flex flex-1">
                      CONNECT YOUR TON WALLET
                    </h1>
                    {/* <a href="https://t.me/plutotapofficial" target="_blank" rel="noreferrer" className="bg-[#edafb7] text-[#000] w-fit py-[10px] px-6 text-[16px] font-medium rounded-[6px]">
Click to Join
        </a> */}
                    {/* <span className="">
          Coming soon....
        </span> */}

                    <MdOutlineKeyboardArrowRight size={24} className='text-[#fff]' />
                  </div>
                </div>



              </div>
            </div>
          </div>


        </div>
        <Outlet />
      </Animate>
      {/* )} */}

      <div
        className={`${openInfoTwo === true ? "visible" : "invisible"
          } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >


        <div ref={infoRefTwo} className={`${openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
          } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="flex flex-col items-center justify-center w-full space-y-3">
            <div className="flex flex-col items-center justify-center w-full space-y-2">
              <span className="w-[50px] flex items-center">
                <img src='https://ucarecdn.com/b6cc2d69-82d2-41b3-9d2e-a3544f0becde/wallet.webp' alt="connect"
                  className="w-full" />
              </span>
              <p className='font-medium'>listing task</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pt-2 pb-2 uppercase">
              CONNECT YOUR TON WALLET
            </h3>
            <p className="pb-6 text-[14px] w-full text-center">
              This task will be available when our token is about to get listed, so anticipate and keep tapping! Always check community for listing news and updates.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Back to wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
