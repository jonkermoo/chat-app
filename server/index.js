const http = require("http");
const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const PORT = process.env.PORT || 8080;

// Create HTTP server to handle health checks
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("OK");
});

// Attach WebSocket server to HTTP server
const wss = new WebSocket.Server({ server });

console.log(`[WS] Server created on port ${PORT}`);

const clients = new Map();

function broadcast(obj, skip) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN && c !== skip) c.send(msg);
  });
}

wss.on("connection", (socket) => {
  const userId = "user" + randomUUID().slice(0, 6);
  clients.set(socket, userId);
  console.log("[WS] Client connected:", userId);

  socket.send(
    JSON.stringify({
      type: "HELLO",
      payload: { id: userId, users: [...clients.values()] },
    })
  );

  broadcast({ type: "USER_JOIN", payload: { userId } }, socket);

  socket.on("message", (raw) => {
    console.log("[WS] Received:", raw);
    broadcast(JSON.parse(raw));
  });

  socket.on("close", () => {
    console.log("[WS] Client disconnected:", userId);
    clients.delete(socket);
    broadcast({ type: "USER_LEAVE", payload: { userId } });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`[WS] Server started and listening on port ${PORT}`);
});
