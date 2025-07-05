import { useAppSelector } from "../app/hooks";

export default function MessageList() {
  const messages = useAppSelector((s) => s.chat.messages);
  const connected = useAppSelector((s) => s.chat.connected);
  const myId = useAppSelector((s) => s.chat.userId);

  return (
    <div className="h-full flex flex-col">
      <div className="font-bold">Messages</div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {!connected && (
          <p className="text-sm text-orange-500">Connecting to server…</p>
        )}
        <div className="flex flex-col gap-2 text-left">
          {messages.map((m) => {
            const isSelf = m.userId === myId;

            return (
              <div
                key={m.id}
                className={`flex flex-col gap-0.5 ${
                  isSelf ? "items-end" : "items-start"
                }`}
              >
                {/* incoming messages */}
                {!isSelf && (
                  <span className="text-xs text-gray-500">{m.userId}</span>
                )}

                {/* chat bubble */}
                <div
                  className={`inline-block rounded-lg px-2 py-1 max-w-xs break-words
                  ${
                    isSelf
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
