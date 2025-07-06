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
    <div className="flex-col justify-center items-center w-full h-full">
      <form onSubmit={handleSubmit}>
        <input
          value={userID}
          onChange={(e) => setID(e.target.value)}
          placeholder="UserID"
          className="border-2 text-md rounded-lg pl-3"
          maxLength={16}
        />
      </form>
    </div>
  );
}
