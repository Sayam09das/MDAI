import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import { createServer } from "http";
import setupSocket from "./utils/socket.js";

const port = process.env.PORT || 3000;

/* ======================================================
   CREATE HTTP SERVER & SOCKET.IO
====================================================== */
const httpServer = createServer(app);

// Setup Socket.io
const io = setupSocket(httpServer);

// Make io accessible in Express app
app.set("io", io);

httpServer.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🔌 Socket.io is ready for real-time messaging`);
});

