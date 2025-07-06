import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addUser,
  removeUser,
  setUserId,
  renameUserRequested,
} from "../features/chat/chatSlice";

export default function Misc() {
  const [userID, setID] = useState("");
  const dispatch = useAppDispatch();

  const myId = useAppSelector((s) => s.chat.userId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newId = userID.trim();

    if (!newId || newId === myId) return;

    if (myId) {
      dispatch(removeUser(myId));
    }
    dispatch(addUser(newId));
    dispatch(setUserId(newId));

    if (myId) {
      dispatch(renameUserRequested({ oldId: myId, newId }));
    } else {
    }

    setID("");
  }

  return (
    <div className="items-center py-5 px-2">
      <form onSubmit={handleSubmit} className="flex justify-center">
        <input
          value={userID}
          onChange={(e) => setID(e.target.value)}
          placeholder="UserID"
          className="border-2 text-sm px-2 rounded-lg w-80%"
          maxLength={16}
        />
      </form>
    </div>
  );
}
