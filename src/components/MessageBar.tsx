import { useState, type FormEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { sendMessage } from "../features/chat/chatSlice";

export default function MessageBar() {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage(text.trim()));
    setText("");
  }

  return (
    <div className="self-center w-full px-4">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-600"
          placeholder="Type a message…"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white
                       disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
