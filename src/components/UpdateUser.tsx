import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addUser, removeUser, setUserId } from "../features/chat/chatSlice";

export default function Misc() {
  const [userID, setID] = useState("");
  const dispatch = useAppDispatch();

  const myId = useAppSelector((s) => s.chat.userId); // current visible id
  const users = useAppSelector((s) => s.chat.users); // list shown in sidebar

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newId = userID.trim();
    if (!newId || newId === myId) return; // nothing to do

    // 1️⃣ update sidebar list locally
    if (myId && users.includes(myId)) {
      dispatch(removeUser(myId));
    }
    if (!users.includes(newId)) {
      dispatch(addUser(newId));
    }

    // 2️⃣ set this client’s “visible” id
    dispatch(setUserId(newId));

    // 3️⃣ reset input
    setID("");
  }

  return (
    <div className="items-center py-5">
      <form onSubmit={handleSubmit}>
        <input
          value={userID}
          onChange={(e) => setID(e.target.value)}
          placeholder="UserID"
          className="border-2 h-[3vw] w-[8vw] text-sm px-2 rounded-lg"
          maxLength={16}
        />
      </form>
    </div>
  );
}
