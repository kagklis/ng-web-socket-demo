const WebSocket = require("ws");

const PORT = 3000;
const DEFAULT_INTERVAL = 1000;

// Create a WebSocket server
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
   console.log("Client connected");

   // Send random numbers at the specified interval
   const generateRandomNumbers = () => {
      if (ws.readyState === WebSocket.OPEN) {
         const randomValue = Math.floor(Math.random() * 100);
         ws.send(randomValue.toString());
      }
   };

   // Default interval is 1 second
   let timer = setInterval(generateRandomNumbers, DEFAULT_INTERVAL);

   ws.on("message", (message) => {
      const newInterval = JSON.parse(message);
      // Update the interval if received a new value from the client
      console.log(`New interval: ${newInterval} second(s)`);
      if (!isNaN(newInterval) && newInterval > 0) {
         clearInterval(timer);
         timer = setInterval(generateRandomNumbers, newInterval * 1_000);
      }
   });

   ws.on("close", () => {
      console.log("Client disconnected");
      clearInterval(timer);
   });
});

console.log(`WebSocket server listening on port ${PORT}`);
