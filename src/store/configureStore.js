import api from "./middleware/api";
import reducer from "./entities/reducer";
import LogRocket from "./middleware/logger";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

export default (customConfig = []) =>
  configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(),
      api,
      ...customConfig,
      LogRocket.reduxMiddleware()
    ]
  });
