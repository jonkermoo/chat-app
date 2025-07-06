import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import {
  connectRequested,
  disconnectRequested,
} from "./features/chat/chatSlice";

import "./styles/App.css";
import UsersList from "./components/UsersList";
import MessageList from "./components/MessageList";
import MessageBar from "./components/MessageBar";
import Misc from "./components/Misc";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectRequested());

    return () => {
      dispatch(disconnectRequested());
    };
  }, [dispatch]);

  return (
    <div className="grid grid-cols-[1fr_6fr_0.8fr] h-full bg-gray-100 ">
      {/* Left column – Users list */}
      <div className="grid grid-rows-[1fr_24fr]">
        <div className="border-2 font-bold content-center items-center">
          Users List
        </div>
        <UsersList></UsersList>
      </div>

      {/* Right column – chat */}
      <div className="grid grid-rows-[10fr_1fr] h-full min-h-0">
        {/* Message list */}
        <div className="border-t-2 border-r-2 border-b-2 overflow-y-auto p-1">
          <MessageList />
        </div>
        <div className="border-b-2 border-r-2 p-1 flex">
          {/* Input bar */}
          <MessageBar />
        </div>
      </div>

      <div className="border-t-2 border-r-2 border-b-2 flex-row justify-start">
        {/* misc */}
        <Misc />
      </div>
    </div>
  );
}

export default App;
