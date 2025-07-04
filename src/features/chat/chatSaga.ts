import { eventChannel, type EventChannel } from "redux-saga";
import {
  call,
  put,
  take,
  takeEvery,
  fork,
  cancel,
  cancelled,
  select,
} from "redux-saga/effects";
import { chatSocket, type WSIncoming } from "../../services/socket";
import {
  connectRequested,
  disconnectRequested,
  enqueueMessage,
  sendMessage,
  wsConnected,
  wsDisconnected,
  setUserId,
  addUser,
  removeUser,
  setUsers,
} from "./chatSlice";
import type { SagaIterator } from "redux-saga";


function createSocketChannel(): EventChannel<WSIncoming | { type: "SOCKET_OPEN" }> {
  return eventChannel((emit) => {
    const onMessage = (msg: WSIncoming) => emit(msg);
    chatSocket.connect(onMessage);

    const readyTimer = setInterval(() => {
      if (chatSocket.isOpen()) {
        clearInterval(readyTimer);
        emit({ type: "SOCKET_OPEN" });
      }
    }, 50);

    return () => {
      clearInterval(readyTimer);
      chatSocket.disconnect();
    };
  });
}

function* readSocket(chan: EventChannel<any>): SagaIterator {
  try {
    while (true) {
      const evt: WSIncoming | { type: "SOCKET_OPEN" } = yield take(chan);

      if (evt.type === "SOCKET_OPEN") {
        console.log("[Saga] SOCKET_OPEN → dispatch wsConnected");
        yield put(wsConnected());
        continue;
      }
      if (evt.type === "HELLO") {
        console.log("[Saga] HELLO → setUserId");
        if (typeof evt.payload.id === "string") {
          yield put(setUserId(evt.payload.id));
          localStorage.setItem("uid", evt.payload.id);
        }
        yield put(setUsers(Array.isArray(evt.payload.users) ? evt.payload.users: []));
        continue;
      }
      if (evt.type === "USER_JOIN") {
        console.log("[Saga] USER_JOIN → addUser");
        yield put(addUser(evt.payload.userId));
        continue;
      }
      if (evt.type === "USER_LEAVE") {
        console.log("[Saga] USER_LEAVE → removeUser");
        yield put(removeUser(evt.payload.userId));
        continue;
      }

      if (evt.type === "NEW_MESSAGE") {
        yield put(enqueueMessage(evt.payload));
      }


    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

function* writeSocket(action: ReturnType<typeof sendMessage>) {
  const myId: string = yield select((s) => s.chat.userId);

  const msg = {
    type: "NEW_MESSAGE" as const,
    payload: {
      id: crypto.randomUUID(),
      userId: myId ?? "anon",
      body: action.payload,
      timestamp: Date.now(),
    },
  };
  chatSocket.send(msg);
}

function* handleConnection(): SagaIterator {
  while (true) {
    yield take(connectRequested.type);

    const chan: EventChannel<any> = yield call(createSocketChannel);

    const readerTask = yield fork(readSocket, chan);

    yield take(disconnectRequested.type);

    yield cancel(readerTask);
    chan.close();
    yield put(wsDisconnected());
  }
}

export function* chatSaga() {
  yield fork(handleConnection);
  yield takeEvery(sendMessage.type, writeSocket);
}
