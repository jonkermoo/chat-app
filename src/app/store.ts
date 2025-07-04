import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chat/chatSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false, // optional
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };