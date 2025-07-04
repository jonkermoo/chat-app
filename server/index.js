const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const wss = new WebSocket.Server({ port: 8080 });
console.log("[WS] Server started on ws://localhost:8080");

const clients = new Map();

function broadcast(obj, skip) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN && c !== skip) c.send(msg);
  });
}

wss.on("connection", (socket) => {
  const userId = Math.random().toString(36).slice(2, 8);
  clients.set(socket, userId);
  console.log("[WS] Client connected:", userId);

  socket.send(
    JSON.stringify({
      type: "HELLO",
      payload: {
        id: userId,
        users: Array.from(clients.values()),
      },
    })
  );

  broadcast({ type: "USER_JOIN", payload: { userId } }, socket);


  socket.on("message", (raw) => {
    console.log("[WS] Received chat msg:", raw);
    broadcast(JSON.parse(raw));
  });

  socket.on("close", () => {
    console.log("[WS] Client disconnected:", userId);
    clients.delete(socket);
    broadcast({ type: "USER_LEAVE", payload: { userId } });
  });
});
