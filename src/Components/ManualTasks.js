import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to import your Firestore configuration
import { useUser } from "../context/userContext"; // Ensure you have a context to get the user id

import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { CiNoWaitingSign } from "react-icons/ci";

const ManualTasks = () => {
  const [showVerifyButtons, setShowVerifyButtons] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [buttonText, setButtonText] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [claiming, setClaiming] = useState({});
  const [submitted, setSubmitted] = useState({});
  const { id: userId, manualTasks, userManualTasks, setUserManualTasks, setBalance, level } = useUser(); // Assuming 'id' is the user's document ID in Firestore
  const [claimedBonus, setClaimedBonus] = useState(0); // New state to store the claimed bonus amount
  const [congrats, setCongrats] = useState(false);

  const performTask = (taskId) => {
    const task = manualTasks.find(task => task.id === taskId);
    if (task) {
      window.open(task.link, '_blank');
      setTimeout(() => {
        setShowVerifyButtons(prevState => ({ ...prevState, [taskId]: true }));
      }, 2000); // Enable the verify button after 2 seconds
    }
  };

  const startCountdown = (taskId) => {
    setCountdowns(prevState => ({ ...prevState, [taskId]: 5 }));
    setButtonText(prevState => ({ ...prevState, [taskId]: 'Verifying...' }));

    const countdownInterval = setInterval(() => {
      setCountdowns(prevCountdowns => {
        const newCountdown = prevCountdowns[taskId] - 1;
        if (newCountdown <= 0) {
          clearInterval(countdownInterval);
          setCountdowns(prevState => ({ ...prevState, [taskId]: null })); // Hide the timer
          setButtonText(prevState => ({ ...prevState, [taskId]: 'Verifying' }));
          setModalMessage(
            <div className="flex flex-col items-center justify-center w-full space-y-3">
              <div className="flex flex-col items-center justify-center w-full space-y-2">
                <CiNoWaitingSign size={32} className={`text-${level.class}`} />
                <p className='font-medium text-center'>Wait 30 minutes for moderation check to claim bonus!!</p>
              </div>
              <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
                If you have not performed this task make sure you do so within 30 minutes to claim your bonus!
              </p>
            </div>
          );
          setModalOpen(true);

          // Save the task to the user's document
          const saveTaskToUser = async () => {
            try {
              const userDocRef = doc(db, 'telegramUsers', userId);
              await updateDoc(userDocRef, {
                manualTasks: arrayUnion({ taskId: taskId, completed: false })
              });
              console.log(`Task ${taskId} added to user's manualTasks collection`);
            } catch (error) {
              console.error("Error adding task to user's document: ", error);
            }
          };

          saveTaskToUser();

          // Set submitted to true and save to local storage
          setSubmitted(prevState => ({ ...prevState, [taskId]: true }));
          localStorage.setItem(`submitted_${taskId}`, true);

          return { ...prevCountdowns, [taskId]: null };
        }
        return { ...prevCountdowns, [taskId]: newCountdown };
      });
    }, 1000);
  };

  const claimTask = async (taskId) => {
    setClaiming(prevState => ({ ...prevState, [taskId]: true }));
    try {
      const task = manualTasks.find(task => task.id === taskId);
      const userDocRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userDocRef, {
        manualTasks: userManualTasks.map(task =>
          task.taskId === taskId ? { ...task, completed: true } : task
        ),
        balance: increment(task.bonus)
      });
      setBalance(prevBalance => prevBalance + task.bonus);
      console.log(`Task ${taskId} marked as completed`);
      setUserManualTasks(prevTasks =>
        prevTasks.map(task =>
          task.taskId === taskId ? { ...task, completed: true } : task
        )
      );

      setModalMessage(
        <div className="flex flex-col items-center justify-center w-full space-y-3">
          <div className="flex flex-col items-center justify-center w-full space-y-2">
            <IoCheckmarkCircleSharp size={32} className={`text-${level.class}`} />
            <p className='font-medium text-center'>Let's go!!</p>
          </div>
          <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
            <span className={`text-${level.class}`}>+{formatNumberCliam(task.bonus)}</span> EN CLAIMED
          </h3>
          <p className="pb-6 text-[15px] w-full text-center">
            Keep performing new tasks! something huge is coming! Perform more and earn more ENG now!
          </p>
        </div>
      );
      setModalOpen(true);
      setClaimedBonus(task.bonus);
      setCongrats(true);

      setTimeout(() => {
        setCongrats(false);
      }, 4000);

    } catch (error) {
      console.error("Error updating task status to completed: ", error);
    }
    setClaiming(prevState => ({ ...prevState, [taskId]: false }));
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const submittedStates = manualTasks.reduce((acc, task) => {
      const submittedState = localStorage.getItem(`submitted_${task.id}`) === 'true';
      acc[task.id] = submittedState;
      return acc;
    }, {});
    setSubmitted(submittedStates);
  }, [manualTasks]);

  const confirmTask = (taskId) => {
    // Logic for confirming the task can be added here
    console.log(`Task ${taskId} confirmed`);
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

      {manualTasks.map(task => {
        const userTask = userManualTasks.find(t => t.taskId === task.id);
        const isTaskCompleted = userTask ? userTask.completed : false;
        const isTaskSaved = !!userTask;

        return (
          <div key={task.id} className="w-[93%] rounded-[25px] bg-gradient-to-r from-[#454545] to-[#575349] p-[1px]">
            <div className="flex h-full w-full flex-col bg-[#2d2d2d] justify-center rounded-[24px] py-4 pl-12 pr-4 relative">

              <div className='w-[60px] h-[60px] rounded-[12px] p-2 absolute bg-[#8a8a8a] left-[-7%] todp-[40px] flex items-center justify-center'>
                <img alt="engy" src={task.icon} className='w-[40px]' />
              </div>

              <div className='flex flex-col justify-between w-full h-full space-y-2'>
                <h1 className="text-[15px] text-nowrap line-clamp-1 mr-[5px] font-semibold">
                  {task.title}
                </h1>
                <span className='flex items-center w-fit space-x-1 text-primary text-[14px] font-semibold'>
                  <span className={`w-[10px] h-[10px] bg-${level.class} rounded-full flex items-center`}>
                  </span>
                  <span className=''>
                    +{formatNumber(task.bonus)}
                  </span>
                </span>

                <div className='w-full flex items-center text-[14px] justify-between relative'>

                  {!isTaskSaved && !isTaskCompleted && (
                    <>
                      <button
                        onClick={() => performTask(task.id)}
                        className="w-fit py-[6px] px-4 font-medium bg-[#595959cc] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px]"
                      >
                        Perform
                      </button>
                      {countdowns[task.id] === undefined && (
                        <button
                          onClick={() => startCountdown(task.id)}
                          className={`${submitted[task.id] ? `bg-${level.class} text-[#000]` : buttonText[task.id] || `bg-${level.class} text-[#000]`} ${!showVerifyButtons[task.id] ? "bg-btn2 !text-[#888]" : `bg-${level.class} text-[#000]`} w-fit py-[6px] px-4 font-medium rounded-[6px]`}
                          disabled={!showVerifyButtons[task.id]}
                        >
                          {submitted[task.id] ? 'Verifying' : buttonText[task.id] || 'Verify'}
                        </button>
                      )}
                    </>
                  )}


                  {isTaskSaved && !isTaskCompleted && (
                    <>
                      <button
                        onClick={() => confirmTask(task.id)}
                        className="w-fit py-[6px] px-[1.2rem] font-medium bg-[#494949] text-[#b8b8b8] rounded-[6px]"
                      >
                        Done
                      </button>

                      <button
                        onClick={() => claimTask(task.id)}
                        className={`w-fit py-[6px] px-4 font-medium bg-${level.class} rounded-[6px]`}
                        disabled={claiming[task.id]}
                      >
                        {claiming[task.id] ? 'Claiming...' : 'Claim'}
                      </button>
                    </>
                  )}

                  {countdowns[task.id] !== null && countdowns[task.id] !== undefined && (
                    <span className="w-fit py-[6px] px-4 font-medium rounded-[6px] bg-[#0000004a] text-[#888]">
                      checking {countdowns[task.id]}s
                    </span>
                  )}

                  {countdowns[task.id] === null && (
                    <button
                      className={`w-fit py-[6px] px-4 font-medium rounded-[6px] bg-${level.class}`}
                    >
                      Verifying
                    </button>
                  )}

                  {isTaskCompleted && (
                    <>
                      <span className="w-fit py-[6px] px-4 font-medium bg-[#494949] text-[#b8b8b8] rounded-[6px]">Completed</span>

                      <span className='mr-[6px]'>

                        <IoCheckmarkCircleSharp size={24} className={`text-${level.class}`} />

                      </span>
                    </>

                  )}

                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none'>
        {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
      </div>

      <div
        className={`${modalOpen === true ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div className={`${modalOpen === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>


          {modalMessage}


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
      {/* {claimedBonus && (
        <>
        </>
      )} */}
    </>
  );
};

export default ManualTasks;
