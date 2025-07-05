import { useAppSelector } from "../app/hooks";

export default function UsersList() {
  const users = useAppSelector((s) => s.chat.users);
  const myId = useAppSelector((s) => s.chat.userId);

  return (
    <div className="overflow-y-auto border-l-2 border-r-2 border-b-2 p-2">
      <ul className="space-y-1.5">
        {users.map((id) => (
          <li
            key={id}
            className={`rounded px-2 py-1 text-sm 
              ${
                id === myId
                  ? "bg-gray-500 text-white font-semibold"
                  : "bg-gray-200 text-gray-800"
              }`}
          >
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}
