import axios from "axios";
import config from "../config";
import * as actions from "../api";
import logger from "../middleware/logger";

export default ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.apiCallInit.type) return next(action);

  const {
    url,
    method,
    data,
    onStart,
    onSuccess,
    afterSuccess,
    onError
  } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      baseURL: config.BASE_URL,
      url,
      method,
      data
    });

    dispatch(
      onSuccess
        ? { type: onSuccess, payload: response.data } // Specific
        : actions.apiCallSuccess(response.data) // General
    );

    if (afterSuccess) dispatch({ type: afterSuccess });
  } catch (error) {
    console.error(error.message);
    logger.captureException(error); // capture All Exceptions to LogRocket ;)
    dispatch(
      onError
        ? { type: onError, payload: `${error.stack}` } // Specific
        : actions.apiCallError(`${error.stack}`) // General
    );
  }
};
