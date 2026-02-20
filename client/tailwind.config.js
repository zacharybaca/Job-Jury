/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding your "Job Jury" branding colors here
        juryNavy: '#1e293b',
        juryEmerald: '#10b981',
      },
    },
  },
  plugins: [],
}
