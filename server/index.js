const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const PORT = process.env.PORT || 8080;
const wss  = new WebSocket.Server({ port: PORT });

console.log(`[WS] Server started on port ${PORT}`);

const clients = new Map();

function broadcast(obj, skip) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN && c !== skip) c.send(msg);
  });
}

wss.on("connection", (socket) => {
  const userId = randomUUID().slice(0, 6); 
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