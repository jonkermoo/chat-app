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
import Credits from "./components/Credits";
import UpdateUser from "./components/UpdateUser";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectRequested());

    return () => {
      dispatch(disconnectRequested());
    };
  }, [dispatch]);

  return (
    <div className="grid grid-cols-[2fr_8fr] h-[100%]">
      {/* Left column – Users list */}
      <div className="grid grid-rows-[0.6fr_0.35fr_0.25fr_4fr]">
        <div className="border-l-2 border-r-2 border-t-2 font-bold">
          <div className="text-2xl py-2">Realtime Chat</div>
          <div className="pb-4">
            <Credits />
          </div>
        </div>
        <div className="border-r-2 border-l-2 border-b-2">
          {/* misc */}
          <UpdateUser />
        </div>

        <div className="border-l-2 border-r-2 border-b-2 d content-center items-center font-bold">
          Users List
        </div>
        <UsersList />
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
    </div>
  );
}

export default App;
