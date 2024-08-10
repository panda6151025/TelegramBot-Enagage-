/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {

          primary: "#ffffffeb",
          secondary: "",
          accent: "#ff695a",
          // accent: "#ff9a90",
          cards: "#a4a4a433",
          hoverbg: "#8a8a8a",
          headerCard: "#a4a4a433",
          energybar: "#32374e",
          btn: "#ff695a",
          // btn: "#c67e77",
          btn2: "#00000066",
          
          lime: "#e1f75c",
          dimtext: "#ffffff71",
          modal: "#303030",


        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
          Inter: ["'Inter', sans-serif"],
          outfit: ["'Outfit', sans-serif"],
          RobotoMono: ["'Roboto Mono', monospace"],
          PublicSans: ["'Public Sans', sans-serif"],
          Monserrat: ["'Montserrat', sans-serif"],
          Syne: ["'Syne', sans-serif"],
          Orkney: ["'Orkney', sans-serif"],
          Cerebri: ["'Cerebri Sans', sans-serif"]
        },
      },
      screens: {
        xs: "480px",
        ss: "600px",
        sm: "768px",
        ms: "1024px",
        md: "1140px",
        lg: "1200px",
        xl: "1700px",
      },
    },
    plugins: [require('tailwindcss')],
  };
  