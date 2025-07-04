import type { ChatMessage } from "../features/chat/chatSlice";

const WS_URL =
  import.meta.env.MODE === "production"
    ? "wss://chat-app-server-suij.onrender.com"
    : "ws://localhost:8080";

export type WSIncoming =
  | { type: "HELLO"; payload: { id?: string; users?: string[]; message?: string } }
  | { type: "NEW_MESSAGE"; payload: ChatMessage }
  | { type: "USER_JOIN"; payload: { userId: string } }
  | { type: "USER_LEAVE"; payload: { userId: string } };

export type WSOutgoing =
  | { type: "NEW_MESSAGE"; payload: ChatMessage };

class ChatSocket {
  private socket: WebSocket | null = null;

  private readonly url: string;

  constructor(url: string = WS_URL) {
    this.url = url;                 // ← set the field here
  }

  isOpen() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  connect(onMessage: (msg: WSIncoming) => void) {
    if (this.socket && (this.isOpen() || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn("[ChatSocket] already connecting/open");
      return;
    }

    console.log("[ChatSocket] connecting to", this.url);
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => console.log("[ChatSocket] open"));

    this.socket.addEventListener("message", async (event) => {
      const text = event.data instanceof Blob ? await event.data.text() : event.data;
      try {
        onMessage(JSON.parse(text));
      } catch {
        console.error("[ChatSocket] invalid JSON:", text);
      }
    });
  }

  send(msg: WSOutgoing) {
    this.isOpen()
      ? this.socket!.send(JSON.stringify(msg))
      : console.warn("[ChatSocket] cannot send—socket not open");
  }

  disconnect() {
    if (this.socket) {
      console.log("[ChatSocket] disconnecting");
      this.socket.close(1000, "client disconnect");
      this.socket = null;
    }
  }
}

export const chatSocket = new ChatSocket();
