module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#010409",
        secondary: "#0d1117",
      },
      keyframes: {
        shake: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "translate(-0px, -1px) rotate(-4deg)" },
          "20%": { transform: "translate(-3px, 0px) rotate(4deg)" },
          "30%": { transform: "translate(2px, 1px) rotate(0deg)" },
          "40%": { transform: "translate(0px, -0px) rotate(4deg)" },
          "50%": { transform: "translate(-0px, 1px) rotate(-4deg)" },
          "60%": { transform: "translate(-2px, 0px) rotate(0deg)" },
          "70%": { transform: "translate(2px, 0px) rotate(-4deg)" },
          "80%": { transform: "translate(-0px, -0px) rotate(4deg)" },
          "90%": { transform: "translate(0px, 1px) rotate(0deg)" },
          "100%": { transform: "translate(0px, -1px) rotate(-4deg)" },
        },
        show: {
          "0%": {
            opacity: "0%",
            transform: "scale(1.1)",
          },
          "100%": {
            opacity: "100%",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        shake: "shake .4s linear infinite",
        show: "show 1.3s ease",
      },
    },
  },
  plugins: [],
};
