import { createAction } from "@reduxjs/toolkit";

export const apiCallInit = createAction("api/callInit");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallError = createAction("api/callError");
