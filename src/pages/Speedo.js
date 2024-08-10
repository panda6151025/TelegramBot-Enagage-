import React, { useRef, useEffect, useState } from 'react';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircleSharp, IoClose } from 'react-icons/io5';
import { updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore configuration
import { NavLink } from 'react-router-dom';

const Game = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highest, setHighest] = useState(localStorage.getItem('highest') || 0);
  const [isGameOver, setIsGameOver] = useState(true);
  const [spawnTime, setSpawnTime] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false); // New state to track if the game has started
  const projectilesRef = useRef([]);
  const enemiesRef = useRef([]);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);
  const spawnEnemiesIntervalRef = useRef(null);
  const { level, id, setBalance, shooters, setShooters, setTotalScore } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [congrats, setCongrats] = useState(false)



  // Load images
  const playerImage = new Image();
  playerImage.src = `${level.imgUrl}`;

  const projectileImage = new Image();
  projectileImage.src = '/frens2.webp';

  const enemyImages = [];
  for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `/shooters/enemy${i}.webp`;
    enemyImages.push(img);
  }

  const backgroundImage = new Image();
  backgroundImage.src = '/shooters/gamebg.webp';

  useEffect(() => {
    const canvas = canvasRef.current;
    // eslint-disable-next-line
    const c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stopGame();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isGameOver && gameStarted) {
      clearInterval(spawnEnemiesIntervalRef.current);
      cancelAnimationFrame(animationIdRef.current);
      if (score > highest) {
        setHighest(score);
        localStorage.setItem('highest', score);
      }
    }
  }, [isGameOver, gameStarted, score, highest]);

  const calculateVelocity = (x, y, x1 = canvasRef.current.width / 2, y1 = canvasRef.current.height / 2) => {
    const angle = Math.atan2(y1 - y, x1 - x);
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  };

  class Ball {
    constructor(x, y, radius, image) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.image = image;
    }

    draw(c) {
      c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }

  class Shooter extends Ball {
    constructor(x, y, radius, image, velocity) {
      super(x, y, radius, image);
      this.velocity = velocity;
    }

    update(c) {
      this.draw(c);
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }

  class Particle extends Shooter {
    constructor(x, y, radius, image, velocity) {
      super(x, y, radius, image, velocity);
      this.alpha = 1;
    }

    draw(c) {
      c.save();
      c.globalAlpha = this.alpha;
      c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      c.restore();
    }

    update(c) {
      this.draw(c);
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
      this.x = this.x + this.velocity.x * 2;
      this.y = this.y + this.velocity.y * 2;
      this.alpha -= 0.01;
    }
  }

  const updateScore = (times = 1) => {
    setSpawnTime((prev) => prev * 0.9995);
    setScore((prev) => prev + 100 * times);
  };

  const shootEnemy = (e) => {
    const x = canvasRef.current.width / 2;
    const y = canvasRef.current.height / 2;
    const v = calculateVelocity(x, y, e.clientX, e.clientY);
    v.x *= 5.5;
    v.y *= 5.5;
    projectilesRef.current.push(new Shooter(x, y, 5, projectileImage, v));
  };

  const animate = () => {
    const c = canvasRef.current.getContext('2d');
    animationIdRef.current = requestAnimationFrame(animate);

    // Draw the background image
    c.drawImage(backgroundImage, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const player = new Ball(canvasRef.current.width / 2, canvasRef.current.height / 2, 20, playerImage);
    player.draw(c);

    particlesRef.current.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        setTimeout(() => {
          particlesRef.current.splice(index, 1);
        }, 0);
      } else {
        particle.update(c);
      }
    });

    projectilesRef.current.forEach((projectile, index) => {
      projectile.update(c);
      if (
        projectile.x + projectile.radius < 1 ||
        projectile.x - projectile.radius > canvasRef.current.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvasRef.current.height
      ) {
        setTimeout(() => {
          projectilesRef.current.splice(index, 1);
        }, 0);
      }
    });

    enemiesRef.current.forEach((enemy, index) => {
      enemy.update(c);
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (dist - enemy.radius - player.radius < 1) {
        stopGame();
      }

      projectilesRef.current.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        if (dist - enemy.radius - projectile.radius < 0) {
          for (let i = 0; i < enemy.radius * 1; i++) {
            particlesRef.current.push(
              new Particle(projectile.x, projectile.y, Math.random() * 3, enemy.image, {
                x: (Math.random() - 0.5) * (Math.random() * 9.8 - 0.5),
                y: (Math.random() - 0.5) * (Math.random() * 9.8 - 0.5),
              })
            );
          }

          if (enemy.radius - 10 > 10) {
            updateScore();
            enemy.radius -= 8;
            setTimeout(() => {
              projectilesRef.current.splice(projectileIndex, 1);
            }, 0);
          } else {
            updateScore(2.5);
            setTimeout(() => {
              enemiesRef.current.splice(index, 1);
              projectilesRef.current.splice(projectileIndex, 1);
            }, 0);
          }
        }
      });
    });
  };

  const spawnEnemies = () => {
    spawnEnemiesIntervalRef.current = setTimeout(() => {
      let x, y;
      const radius = Math.random() * 16 + 14;
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvasRef.current.width + radius;
        y = Math.random() * canvasRef.current.height;
      } else {
        x = Math.random() * canvasRef.current.width;
        y = Math.random() < 0.5 ? 0 - radius : canvasRef.current.height + radius;
      }
      const randomEnemyImage = enemyImages[Math.floor(Math.random() * enemyImages.length)];
      enemiesRef.current.push(new Shooter(x, y, radius, randomEnemyImage, calculateVelocity(x, y)));
      spawnEnemies();
    }, spawnTime);
  };

  const startGame = () => {
    canvasRef.current.addEventListener('click', shootEnemy);
    setIsGameOver(false);
    setGameStarted(true);
    setScore(0);
    setSpawnTime(1000);
    projectilesRef.current = [];
    enemiesRef.current = [];
    particlesRef.current = [];
    animate();
    clearInterval(spawnEnemiesIntervalRef.current);
    spawnEnemies();
  };

  const stopGame = () => {
    setIsGameOver(true);
    canvasRef.current.removeEventListener('click', shootEnemy);
  };


  const claimReward = async () => {

    try {
      const newShots = shooters - 1;
      const userDocRef = doc(db, 'telegramUsers', id);
      await updateDoc(userDocRef, {
        balance: increment(score),
        shooters: newShots,
        totalScore: increment(score)
      });

      // Update the balance and completedTasks state
      setBalance(prevBalance => prevBalance + score);
      setShooters(newShots);
      setTotalScore(prevTotalScore => prevTotalScore + score)
      setModalOpen(true);
      setCongrats(true)

      setTimeout(() => {
          setCongrats(false)
      }, 4000)
      console.log('newshots is', newShots)
      console.log('Bonus claimed successfully')
    } catch (error) {
      console.error('Error claiming task:', error);
    }
  };
console.log('shooters is', shooters)


//   const claimReward = async () => {
//     if (id) {
//     if (Shooters > 0) {
//       setIsDisabled(false);
//       const newRemainingClicks = freeGuru - 1;
//       setFreeGuru(newRemainingClicks);
      
//       // Update the Firestore document
//       const userRef = doc(db, 'telegramUsers', id.toString());
//       await updateDoc(userRef, {
//         freeGuru: newRemainingClicks,
//         timeSta: new Date() 
//       });
//       startTimer();
//       setMainTap(false);
//       setTapGuru(true);
//       location('/'); // Navigate to /home without refreshing the page
//       setCongrats(true)
//       setTimeout(() => {
//         setCongrats(false)
//     }, 2000)
//     } else {
//       setIsDisabled(true);
//     }
//     };
//   };

//   const calculateTimeRemaining = () => {
//     const now = new Date();
//     const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
//     const timeDiff = nextDate - now;
  
//     const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//     const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
//     return { hours, minutes, seconds };
//   };
//   const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeRemaining(calculateTimeRemaining());
//     }, 1000);
    
//     return () => clearInterval(interval); // Clear interval on component unmount
//   }, []);


  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  const closeModal = () => {
    setModalOpen(false);
    startGame();
  };
  const closeGames = () => {
    setGameStarted(false);
  };


  return (
    <div className={`mt-[-20px] ${!gameStarted ? 'z-0' : 'z-[100]'}`}>
      <canvas ref={canvasRef}></canvas>

      {isGameOver ? (
              <div id="modelEl" style={{ display: isGameOver ? 'flex' : 'none' }}>
              <div className='w-full px-4'>
                    <div className='flex w-full px-4 py-8 bg-cards rounded-[15px] items-center justify-center relative flex-col space-y-3'>

                        {!gameStarted ? (
                        <>
                              
            <button id="startGameBtn" onClick={startGame} className='font-medium text-primary'>Start New Game</button>
                        </>
                        ) : (
                        <>
                                        <button
                      onClick={closeGames}
                      className="flex items-center justify-center absolute right-4 top-4 text-center rounded-[12px] font-medium text-[16px]"
                    >
                     <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>
                                        <h1 className='text-[16px] font-semibold'>Game Over</h1>
                <h2 className='font-medium'>Rewards: <span id="bigScoreEl">{score}</span></h2>
                <button className={`bg-${level.class} px-4 py-2 w-full text-[15px] font-semibold rounded-[8px]`} onClick={claimReward}>Claim rewards</button>
               
                        </>
                        )}

               
                </div>
         
        
    
        </div>
        </div>
      ) : (
        <>
        <div className='fixed top-[10px] left-0 right-0 px-4 flex justify-between items-center'>

     
              <div id="scoreEls" className='text-primary text-[16px] font-medium'>Points Gained: {score}</div>
              {/* <div id="highestEls">Highest Score: {highest}</div> */}

              </div>
        </>
      )}

<div
        className={`${
          modalOpen === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div className={`${
          modalOpen === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className={`text-${level.class}`}/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
              <span className={`text-${level.class}`}>+{formatNumberCliam(score)}</span> EN CLAIMED
            </h3>
            <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
             Play more! something huge is coming! Play more and earn more EN now! 
            </p>
          </div>

          <div className="w-full flex justify-center items-center flex-col space-y-3">
            <button
              onClick={closeModal}
              className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
            Play Again (+{shooters} left)
            </button>
    



            <NavLink to="/"
              className={`bg-btn2 text-primary w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
            Exit Game
            </NavLink>
          </div>
        </div>
      </div>

      <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>

    </div>
  );
};

export default Game;
