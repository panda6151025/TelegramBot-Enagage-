import React, { useState } from "react";
import { updateDoc, doc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore configuration
import axios from "axios";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";
import ManualTasks from "../Components/ManualTasks";
import { PiNotebook } from "react-icons/pi";
import { FaBoxes } from "react-icons/fa";

import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";
import MilestoneRewards from "../Components/MilestoneRewards";
import Levels from "../Components/Levels";

const TasksList = () => {
  const {
    id,
    balance,
    level,
    refBonus,
    setBalance,
    completedTasks,
    setCompletedTasks,
    tasks,
    setTasks,
  } = useUser(); // Assuming 'id' is the user's document ID in Firestore
  const [modalOpen, setModalOpen] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [currentError, setCurrentError] = useState({}); // Task-specific error messages
  const [showVerifyButtons, setShowVerifyButtons] = useState({}); // State to manage the display of Verify buttons
  const [countdownFinished, setCountdownFinished] = useState({});
  const [claiming, setClaiming] = useState({});
  const [claimError, setClaimError] = useState("");
  const [activeIndex, setActiveIndex] = useState(1);
  const [claimedBonus, setClaimedBonus] = useState(0); // New state to store the claimed bonus amount
  const [congrats, setCongrats] = useState(false);
  const [showLevel, setShowLevel] = useState();

  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const telegramBotToken = "BOT TOKEN";

  const performTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    window.open(task.link, "_blank");
    setTimeout(() => {
      setShowVerifyButtons({ ...showVerifyButtons, [taskId]: true });
    }, 2000); // Show Verify button 2 seconds after clicking Perform
  };

  const checkTelegramMembership = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      const response = await axios.get(
        `https://api.telegram.org/bot${telegramBotToken}/getChatMember`,
        {
          params: {
            chat_id: task.chatId,
            user_id: id, // Use the user's Firestore document ID as the Telegram user ID
          },
        }
      );

      if (
        response.data.ok &&
        (response.data.result.status === "member" ||
          response.data.result.status === "administrator" ||
          response.data.result.status === "creator")
      ) {
        // Update task verification status in Firestore
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, verified: true } : task
          )
        );
      } else {
        setCurrentError({
          [taskId]: `Verification failed for Task ${taskId}: Join the channel to verify.`,
        });
      }
    } catch (error) {
      console.error("Error verifying Telegram membership:", error);
      setCurrentError({
        [taskId]: `Verification failed for Task ${taskId}: Could not verify Telegram membership.`,
      });
    }
  };

  const startCountdown = (taskId) => {
    setCurrentError({}); // Reset error state
    setCountdowns({ ...countdowns, [taskId]: 5 });

    const countdownInterval = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const newCountdown = prevCountdowns[taskId] - 1;
        if (newCountdown <= 0) {
          clearInterval(countdownInterval);
          setCountdownFinished({ ...countdownFinished, [taskId]: true });
          return { ...prevCountdowns, [taskId]: 0 };
        }
        return { ...prevCountdowns, [taskId]: newCountdown };
      });
    }, 1000);

    checkTelegramMembership(taskId); // Call the API immediately
  };

  const claimTask = async (taskId) => {
    setClaiming({ ...claiming, [taskId]: true });
    setClaimError("");
    try {
      const task = tasks.find((task) => task.id === taskId);
      const userDocRef = doc(db, "telegramUsers", id);

      await updateDoc(userDocRef, {
        balance: increment(task.bonus),
        tasksCompleted: arrayUnion(taskId),
      });

      // Update the balance and completedTasks state
      setBalance((prevBalance) => prevBalance + task.bonus);
      setCompletedTasks((prevCompletedTasks) => [
        ...prevCompletedTasks,
        taskId,
      ]);

      setClaimedBonus(task.bonus);
      setModalOpen(true);
      setCongrats(true);

      setTimeout(() => {
        setCongrats(false);
      }, 4000);
    } catch (error) {
      console.error("Error claiming task:", error);
      setClaimError("Failed to claim the task. Please try again.");
    } finally {
      setClaiming({ ...claiming, [taskId]: false });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
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
  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  return (
    <>
      <Animate>
        <div className="flex-col justify-center w-full px-5 pt-1 space-y-6">
          <div className="flex justify-between w-full">
            <button
              onClick={() => setShowLevel(true)}
              className="w-[55%] flex space-x-1 items-center"
            >
              <span className="flex items-center justify-center">
                <img
                  alt="engy"
                  src={level.imgUrl}
                  className="w-[18px] h-full"
                />
              </span>
              <span className="font-semibold text-[15px] flex items-center space-x-1">
                <span className=""> {level.name}</span>
                <span className="flex items-center">
                  {" "}
                  <RiArrowRightSLine size={22} className="" />{" "}
                </span>
              </span>
            </button>

            <div className="w-fit py-[4px] px-3 flex items-center space-x-1 justify-center border-[1px] border-[#707070] rounded-[25px]">
              <span className="w-[22px]">
                <img alt="engy" src="/engagetap2.svg" className="w-full" />
              </span>
              <h1 className="text-[15px] font-bold">
                {formatNumber(balance + refBonus)}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div
              onClick={() => handleMenu(1)}
              className={`${activeIndex === 1 ? "bg-cards text-[#ebebeb]" : ""
                }  rounded-[6px] text-primary py-[10px] px-3 w-[45%] flex space-x-2 justify-center text-center text-[15px] font-semibold items-center`}
            >
              <PiNotebook size={16} className="" />
              <span>Tasks</span>
            </div>

            <div
              onClick={() => handleMenu(2)}
              className={`${activeIndex === 2 ? "bg-cards text-[#ebebeb]" : ""
                }  rounded-[6px] text-primary py-[10px] px-3 w-[45%] space-x-2 font-semibold text-[15px] flex justify-center text-center items-center`}
            >
              <FaBoxes size={16} className="" /> <span>Challenges</span>
            </div>
          </div>

          <div className={`${activeIndex === 1 ? "block" : "hidden"}`}>
            <h1 className="text-[24px] font-semibold">Earn more tokens</h1>
            <p className="text-[14px] leading-[24px]">
              Perform tasks daily to earn more EN tokens and level up real
              quick!
            </p>
          </div>
          {/*  */}

          <div className={`${activeIndex === 2 ? "block" : "hidden"}`}>
            <h1 className="text-[24px] font-semibold">Milestone rewards</h1>
            <p className="text-[14px] leading-[24px]">
              Complete specific milestones to unlock huge rewards and bonuses!
            </p>
          </div>

          <div
            id="refer"
            className="w-full h-[60vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]"
          >
            {/* tasks */}
            <div
              className={`${activeIndex === 1 ? "block" : "hidden"
                } w-full flex items-end justify-center flex-col space-y-4`}
            >

              <ManualTasks />

              <div
                className={`${modalOpen === true ? "visible" : "invisible"
                  } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
              >
                <div
                  className={`${modalOpen === true
                    ? "opacity-100 mt-0 ease-in duration-300"
                    : "opacity-0 mt-[100px]"
                    } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}
                >
                  <div className="flex flex-col items-center justify-center w-full space-y-3">
                    <div className="flex flex-col items-center justify-center w-full space-y-2">
                      <IoCheckmarkCircleSharp
                        size={32}
                        className={`text-${level.class}`}
                      />
                      <p className="font-medium">Let's go!!</p>
                    </div>
                    <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
                      <span className={`text-${level.class}`}>
                        +{formatNumberCliam(claimedBonus)}
                      </span>{" "}
                      EN CLAIMED
                    </h3>
                    <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
                      Keep performing new tasks! something huge is coming!
                      Perform more and earn more ENG now!
                    </p>
                  </div>

                  <div className="flex justify-center w-full">
                    <button
                      onClick={closeModal}
                      className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
                    >
                      Continue tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* challenges */}

            <div
              className={`${activeIndex === 2 ? "block" : "hidden"
                } w-full flex items-end justify-center flex-col space-y-4`}
            >
              <MilestoneRewards />
            </div>
          </div>

          <div className="w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none">
            {congrats ? (
              <img src="/congrats.gif" alt="congrats" className="w-[80%]" />
            ) : (
              <></>
            )}
          </div>

          <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
        </div>
        <Outlet />
      </Animate>
    </>
  );
};

export default TasksList;
