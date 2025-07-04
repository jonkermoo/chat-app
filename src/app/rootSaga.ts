import { all, fork } from "redux-saga/effects"
import { chatSaga } from "../features/chat/chatSaga"

export default function* rootSaga() {
  yield all([fork(chatSaga)])
}