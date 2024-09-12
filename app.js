const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");

// let nginx know we want to start serving from the proxy
fs.openSync("/tmp/app-initialized", "w");

// Create an HTTP server
const server = http.createServer(function (req, res) {
  res.writeHead(200);
  res.end("hello world");
});

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connection
wss.on("connection", function (ws) {
  console.info("Client connected");

  // Handle WebSocket messages
  ws.on("message", function (message) {
    console.info("Received message: ", message);

    // Assuming we handle a 'login' message as an example
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "login") {
        // Send back a response to the client
        ws.send(JSON.stringify({ message: parsedMessage.data }));
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  // Handle WebSocket disconnection
  ws.on("close", function () {
    console.info("Client disconnected");
  });

  // Handle WebSocket errors
  ws.on("error", function (err) {
    console.error("WebSocket error:", err);
  });
});

// Listen on the Unix socket for NGINX
server.listen("/tmp/nginx.socket", function () {
  console.info("Server is up");
});
