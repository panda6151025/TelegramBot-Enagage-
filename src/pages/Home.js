import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import "../fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { UserProvider } from "../context/userContext";


const tele = window.Telegram.WebApp;
const Home = () => {

    useEffect(() => {
        tele.ready();
        tele.expand();
        
        // window.Telegram.WebApp.setHeaderColor('#29162c'); // Set header color to red
        window.Telegram.WebApp.setHeaderColor('#191919'); // Set header color to red

              // Haptic feedback
      if (tele.HapticFeedback) {
        tele.HapticFeedback.impactOccurred("medium");
      }
      if (navigator.vibrate) {
        navigator.vibrate(100); // Vibrate for 100ms
    }


    }, []);


    const overflow = 100;
    const scrollableEl = useRef(null);
  
    useEffect(() => {
      document.body.style.overflowY = 'hidden';
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = `${window.innerHeight + overflow}px`;
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);
  
      let ts;
  
      const onTouchStart = (e) => {
        ts = e.touches[0].clientY;
      };
  
      const onTouchMove = (e) => {
        const el = scrollableEl.current;
        if (el) {
          const scroll = el.scrollTop;
          const te = e.changedTouches[0].clientY;
          if (scroll <= 0 && ts < te) {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      };
      const onTouchMoveWithException = (e) => {
        const target = e.target.closest('#refer');
        if (!target) {
          onTouchMove(e);
        }
      };
    
      document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
      document.documentElement.addEventListener('touchmove', onTouchMoveWithException, { passive: false });
    
      // Cleanup event listeners on component unmount
      return () => {
        document.documentElement.removeEventListener('touchstart', onTouchStart);
        document.documentElement.removeEventListener('touchmove', onTouchMoveWithException);
      };
    }, [overflow]);
   
    

  return (
<>

<div className="w-full flex justify-center">
{/* <div className="bg-[#efc26999] blur-[50px] select-none pointer-events-none absolute rotate-[35deg] w-[400px] h-[160px] -left-40 rounded-full"></div> */}
            
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-5 space-y-3 w-full">


            

          <UserProvider>
            <AnimatePresence mode="wait">
            <Outlet />

            <div id="footermain" className="flex flex-col fixed bottom-0 py-6 left-0 right-0 justify-center items-center px-5">


           <Footer/>
           </div>
           
            </AnimatePresence>
            </UserProvider>
    
          
          



           </div>
           </div>
           </div>
           </>
  );
};

export default Home;
