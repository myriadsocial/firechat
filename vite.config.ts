import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
require('dotenv').config();


// https://vitejs.dev/config/
export default defineConfig({
  server : {
    port : parseInt(process.env.PORT || "3000")
  },
  base : process.env.BASE_DIR || "",
  plugins: [react()]
})
