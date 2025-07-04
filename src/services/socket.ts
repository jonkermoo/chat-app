import type { ChatMessage } from "../features/chat/chatSlice";

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

  constructor(url = "ws://localhost:8080") {
    this.url = url;
  }

  isOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  connect(onMessage: (msg: WSIncoming) => void) {
    if (this.socket) {
      if (this.isOpen()) {
        console.warn("[ChatSocket] already open—skipping connect()");
        return;
      }
      if (this.socket.readyState === WebSocket.CONNECTING) {
        console.warn("[ChatSocket] connection in progress—skipping connect()");
        return;
      }
    }

    console.log("[ChatSocket] connecting to", this.url);
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      console.log("[ChatSocket] open");
    });

    this.socket.addEventListener("message", async (event) => {
      let text: string;

      if (event.data instanceof Blob) {
        text = await event.data.text();
      } else {
        text = event.data;
      }

      console.log("[ChatSocket] Raw message:", text);

      try {
        const data = JSON.parse(text);
        onMessage(data);
      } catch (err) {
        console.error("[ChatSocket] invalid JSON:", err);
      }
    });
  }

  send(msg: WSOutgoing) {
    if (this.isOpen()) {
      this.socket!.send(JSON.stringify(msg));
    } else {
      console.warn("[ChatSocket] cannot send—socket not open");
    }
  }

  /** Clean close */
  disconnect() {
    if (this.socket) {
      console.log("[ChatSocket] disconnecting");
      this.socket.close(1000, "client disconnect");
      this.socket = null;
    }
  }
  
}



export const chatSocket = new ChatSocket();
