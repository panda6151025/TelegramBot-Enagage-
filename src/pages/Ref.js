import React, { useState } from "react";
import Animate from "../Components/Animate";
import { NavLink, Outlet } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { FaLink } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import coinsmall from "../images/coinsmall.webp";
import { useUser } from "../context/userContext";
import { RxArrowRight } from "react-icons/rx";

const Ref = () => {
  const { id, refBonus, referrals, loading, level } = useUser();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    // eslint-disable-next-line
    const reflink = `https://t.me/concept_devbot?start=r${id}
🚀 Join the Engage Bot and start tapping and earning now! 🚀

The biggest part of Engage Bot TOKEN distribution will occur among the players here. 💰

Got friends, relatives, co-workers? 🤝
Bring them all into the game. More buddies, more coins! 🎉

Join now! 👉 https://t.me/concept_devbot?start=r${id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
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

  const handleShare = async () => {
    const shareData = {
      title: "Earn Free $ENG Tokens Now!",
      // eslint-disable-next-line
      url: `https://t.me/engagetapbot?start=r${id}\n\ `, // Replace with your link
      text: `🚀 Join Me and start earning free $ENG with the Engage Tap Bot now! 💸


The biggest share of Engage Bot tokens is reserved for the community! 🏆


Climb the leaderboard and claim your part of those free $ENG tokens. 🎯


👫 Invite friends, family, or co-workers and start earning together!
 The more friends, the more coins! 💰🎉`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      fallbackShare(shareData);
    }
  };

  const fallbackShare = (shareData) => {

    const encodedText = encodeURIComponent(
      // eslint-disable-next-line
      `🚀 Join the Engage Bot and start tapping and earning now! 🚀

The biggest part of Engage Bot TOKEN distribution will occur among the players here. 💰

Got friends, relatives, co-workers? 🤝
Bring them all into the game. More buddies, more coins! 🎉

Join now! 👉 ${shareData.url}`
    );
    const encodedUrl = encodeURIComponent(shareData.url);

    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    const telegramUrl = `https://telegram.me/share/url?text=${encodedText}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    const fallbackOptions = [
      { name: "WhatsApp", url: whatsappUrl, icon: '/whatsapp.svg' },
      { name: "Telegram", url: telegramUrl, icon: 'telegram.svg' },
      { name: "Twitter", url: twitterUrl, icon: 'twitter.svg' },
      { name: "Facebook", url: facebookUrl, icon: 'facebook.svg' },
    ];

    const optionsHtml = fallbackOptions
      .map(
        (option) =>
          `<li key="${option.name}" style="display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  "">
        <a href="${option.url}" target="_blank" rel="noopener noreferrer">
        <img alt="engy" src=${option.icon} width="50px"/>
        </a>
        <span style="
    font-size: 12px;
    color: #494949;
    padding-top: 4px;
    font-weight: 500;
">${option.name}</span>
      </li>`
      )
      .join("");

    const fallbackHtml = `
     <div id="fallback-share-popup" style="position: fixed;top: 0;background:#0000007d;left: 0;right: 0;bottom: 0;display: flex;justify-content: center; align-items: start;
     flex-direction: column;"> 
     <div id="close-popup-button" style="
    width: 100%;
    height: 70%;
"></div>
     <div style="background: #f0fdfffa;padding: 20px 24px;width: 100%;box-shadow: 0 0 10px rgba(0,0,0,0.1);height: 30%;border-radius: 16px;"">
        <h3 style=" font-size: 18px;
        font-weight: 600;
        color: #313131;
        padding-bottom: 12px;
        width: 100%;
        text-align: center;
        ">Share via</h3>
        <ul style="display: flex;
        justify-content: space-between;
        gap: 10px">
          ${optionsHtml}
        </ul>
        
        <div style="
    width: 100%;
    padding: 30px 10px 0;
    display: flex;
    justify-content: center;
">
<button id="close-popup-button2" style="
    background: #000000d4;
    padding: 6px 14px;
    font-weight: 500;
    border-radius: 6px;
">Close</button>
</div>

      </div>
      </div>
    `;

    const fallbackPopup = document.createElement("div");
    fallbackPopup.innerHTML = fallbackHtml;
    document.body.appendChild(fallbackPopup);

    document.getElementById("close-popup-button").onclick = () => {
      document.getElementById("fallback-share-popup").remove();
    };
    document.getElementById("close-popup-button2").onclick = () => {
      document.getElementById("fallback-share-popup").remove();
    };
  };

  return (
    <>
      {loading ? ( // Display loading indicator if data is fetching
        <Spinner />
      ) : (
        <>
          <Animate>
            <div className="flex-col justify-center w-full px-5 pt-2 space-y-3">
              <div className="w-full">
                <h1 className="font-semibold text-[18px] pb-1">
                  Invite friends, get rewards!
                </h1>
                <p className="text-[13px] w-full pr-4 pb-1">
                  More frens, more rewards! more milestones to unlock!
                </p>
              </div>

              {/*  */}

              <div className="w-full flex items-center justify-between space-x-[10px] pb-2">
                <button
                  onClick={handleShare}
                  className={`w-[65%] barTitle flex space-x-2 text-${level.class} font-medium text-[14px] bdg-[#dadada] bgd-cards bg-[#2b2b2be2] h-[55px] rounded-[10px] px-4 justify-center items-center text-center`}
                >
                  <span className="flex items-center mt-[-1px]">
                    <MdOutlineFileUpload size={18} className="" />
                  </span>
                  <span className="">Share invite link</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`w-[35%] barTitle flex space-x-2 text-${level.class} font-medium text-[14px] bsg-[#dadada] bg-dcards bg-[#2b2b2be2] h-[55px] rounded-[10px] px-4 justify-center items-center text-center`}
                >
                  <span className="flex items-center">
                    <FaLink size={18} className="" />
                  </span>
                  <span className="">
                    {copied ? <span>Copied!</span> : <span>Copy</span>}
                  </span>
                </button>
              </div>

              {/*  */}

              <div className="flex items-center justify-between w-full pb-3 space-x-3">
                <div className="w-[48.5%] flex flex-col font-medium text-[14px] bg-cards h-[85px] rounded-[10px] px-4 py-2 justify-start text-left relative">
                  <h2 className="!m-0 font-semibold">
                    {loading ? ( // Display loading indicator if data is fetching
                      <>
                        <span className="animate-pulse blur-[2px]">
                          checking..
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[22px] small-text">
                          {referrals.length}
                        </span>{" "}
                        <span className="small-text"> FRENS</span>
                      </>
                    )}
                  </h2>
                  <p className="text-[10px] small-text3 max-w-[10em]">
                    More frens, better rewards
                  </p>
                </div>
                <div className="w-[48.5%] flex flex-col font-medium text-[14px] bg-cards h-[85px] rounded-[10px] px-4 py-2 justify-start text-left relative">
                  <h2 className="!m-0 font-semibold">
                    <span className="text-[22px] small-text">
                      {formatNumber(refBonus)}
                    </span>
                    <span className="text-[18px] small-text2">  $ENG</span>
                  </h2>
                  <div className="flex items-start justify-between w-full">
                    <p className="text-[10px] small-text3 max-w-[10em]">
                      10% of your frens earnings
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-semibold small-text text-[18px] pl-1">
                  Frens list
                </h3>

                <NavLink
                  to="/rewards"
                  className="bg-[#292929] text-[#d9d9d9] hover:bg-hoverbg ease-in duration-200 small-text2 flex items-center space-x-2 py-2 px-3 font-semibold text-[14px] text rounded-[6px]"
                >
                  <span>Claim rewards</span>{" "}
                  <RxArrowRight size={14} className={`text-${level.class} mt-[2px]`} />
                </NavLink>
              </div>
              <div
                id="refer"
                className="w-full h-[60vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]"
              >
                <div className="flex flex-col w-full space-y-3">
                  {loading ? (
                    <p className="w-full text-center">checking...</p>
                  ) : referrals.length === 0 ? (
                    <p className="text-center w-full now pt-8 px-5 text-[14px] leading-[24px]">
                      You have no frens 👨‍👦‍👦 Refer your frens and family, get 10%
                      of their earnings & unlock more rewards!
                    </p>
                  ) : (
                    <>
                      {referrals.map((user, index) => (
                        <div
                          key={index}
                          className="bg-[#2b2b2b96] text-[14px] rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
                        >
                          <div className="flex flex-col flex-1 space-y-1">
                            <h2 className="pl-1 text-[15px] font-semibold">
                              {user.username}
                            </h2>

                            <div className="flex items-center space-x-1">
                              <div className="">
                                <img
                                  src={user.level.imgUrl}
                                  alt="bronze"
                                  className="w-[18px]"
                                />
                              </div>
                              <span className="font-medium small-text2">
                                {user.level.name}
                              </span>
                              <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>

                              <span className="w-[16px]">
                                <img
                                  src={coinsmall}
                                  className="w-full"
                                  alt="coin"
                                />
                              </span>
                              <span className="font-normal text-primary small-text">
                                {formatNumber(user.balance)}
                              </span>
                            </div>
                          </div>

                          <div className={`text-${level.class} font-semibold`}>
                            +{formatNumber((user.balance / 100) * 10)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <Outlet />
          </Animate>
        </>
      )}
    </>
  );
};

export default Ref;
