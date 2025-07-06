import type { ChatMessage } from "../features/chat/chatSlice";

const PRIMARY_WS_URL = import.meta.env.VITE_WS_URL;
const FALLBACK_WS_URL = "ws://localhost:8080";

export type WSIncoming =
  | { type: "HELLO"; payload: { id?: string; users?: string[]; message?: string } }
  | { type: "NEW_MESSAGE"; payload: ChatMessage }
  | { type: "USER_JOIN"; payload: { userId: string } }
  | { type: "USER_LEAVE"; payload: { userId: string } }
  | { type: "USER_RENAME"; payload: { oldId: string; newId: string } };

export type WSOutgoing =
  | { type: "NEW_MESSAGE"; payload: ChatMessage }
  | { type: "USER_RENAME";  payload: { oldId: string; newId: string } };

class ChatSocket {
  private socket: WebSocket | null = null;

  private primaryUrl?: string = PRIMARY_WS_URL;
  private fallbackUrl: string = FALLBACK_WS_URL;

  constructor() {

  }

  isOpen() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  connect(onMessage: (msg: WSIncoming) => void) {
    if (this.socket && (this.isOpen() || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn("[ChatSocket] already connecting/open");
      return;
    }

    const urls = [
      ...(this.primaryUrl ? [this.primaryUrl] : []),
      this.fallbackUrl,
    ];
    let attempt = 0;

    const tryConnect = () => {
      const url = urls[attempt];
      console.log("[ChatSocket] connecting to", url);
      this.socket = new WebSocket(url);

      this.socket.addEventListener("open", () => console.log("[ChatSocket] open"));

      this.socket.addEventListener("message", async (event) => {
        const text =
          event.data instanceof Blob ? await event.data.text() : event.data;
        try {
          onMessage(JSON.parse(text));
        } catch {
          console.error("[ChatSocket] invalid JSON:", text);
        }
      });

      this.socket.addEventListener("error", () => {
        console.warn(`[ChatSocket] connection to ${url} failed`);
        if (attempt < urls.length - 1) {
          attempt++;
          tryConnect();
        }
      });
    };

    tryConnect();
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
