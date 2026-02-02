module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./posts/**/*.{md,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
