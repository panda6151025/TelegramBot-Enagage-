// import React, { useState, useEffect, useRef } from 'react';
// import styled, { keyframes } from 'styled-components';

// const spinAnimation = (speed) => keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

// const ImageContainer = styled.div`
//   display: inline-block;
//   animation: ${({ speed }) => spinAnimation(speed)} infinite linear;
//   animation-duration: ${({ speed }) => speed}s;
// `;

// const SpinImage = ({ src }) => {
//   const [tapCount, setTapCount] = useState(0);
//   const [speed, setSpeed] = useState(10); // Start very slow
//   const intervalRef = useRef(null);

//   const handleClick = () => {
//     setTapCount(tapCount + 1);
//   };

//   useEffect(() => {
//     // Increase the speed with each tap
//     if (tapCount > 0) {
//       setSpeed(Math.max(10 - tapCount * 0.5, 0.1)); // Adjust this formula as needed
//     }
//   }, [tapCount]);

//   useEffect(() => {
//     if (tapCount > 0) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = setInterval(() => {
//         setSpeed((prevSpeed) => Math.min(prevSpeed + 0.5, 10)); // Gradually slow down
//       }, 500);
//     }
//   }, [tapCount]);

//   return (
//     <ImageContainer
//       speed={speed}
//       onPointerDown={handleClick}
//     >
//       <img alt="engy" src={src} alt="spinnable" />
//     </ImageContainer>
//   );
// };

// export default SpinImage;
