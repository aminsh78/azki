// frontend/tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./ui/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "blue-main": "#2C6BFF",
        "bg-form": "rgba(255,255,255,0.75)",
        "blur-box": "rgba(255,255,255,0.55)"
      }
    }
  },
  plugins: []
};
