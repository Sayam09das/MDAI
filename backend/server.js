import dotenv from "dotenv";
dotenv.config(); 

import "./config/firebase.js";
import app from "./app.js";

const port = process.env.PORT || 3000;

console.log("🔥 Firebase Admin Initialized");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
