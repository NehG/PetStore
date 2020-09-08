import _ from "lodash";
import moment from "moment";
import config from "../config";
import { apiCallInit } from "../api";
import logger from "../middleware/logger";
import { createSlice, createSelector } from "@reduxjs/toolkit";

// retrive cart url for api: axios
const url = config.URL.CART;

// localStorage / persistentStorage - with expiry @see ../middleware/config.js
/* NOTE: localStorage has no expiry (technically) 
         but we are setting expiry at (../middleware/config.js) 
         for faster cart rendering also authenticating data
*/
const persistentStorageDisabled = () => {
  try {
    window.localStorage.setItem("localStorageEnabled", "true");
    const result =
      window.localStorage.getItem("localStorageEnabled") === "true"
        ? false
        : true;
    window.localStorage.removeItem("localStorageEnabled");
    return result;
  } catch (err) {
    return true;
  }
};
const isPersistedDataEmpty = () =>
  _.isEmpty(JSON.parse(localStorage.getItem("cart"))?.value);

const isPersistedDataExpired = () =>
  moment(JSON.parse(localStorage.getItem("cart"))?.expiry).isSameOrBefore(
    moment().unix()
  );

const isPersistedDataRetrivable =
  !persistentStorageDisabled() &&
  !isPersistedDataEmpty() &&
  !isPersistedDataExpired();

// create slice of cart, @see https://redux-toolkit.js.org/api/createSlice
const slice = createSlice({
  name: "cart",
  initialState: {
    list: [],
    isLoading: false,
    lastFetch: null
  },
  reducers: {
    cartRequested: (cart) => {
      cart.isLoading = true;
    },
    cartReceived: (cart, action) => {
      cart.list = action.payload;
      cart.isLoading = false;
      cart.lastFetch = Date.now();
    },
    cartRequestFailed: (cart) => {
      cart.isLoading = false;
    },
    retriveCartItemsFromPersitentStorage: (cart) => {
      // checking if of persited data is retrivable
      if (!isPersistedDataRetrivable) return;

      // try to get cart items from localStorage else onError return false
      const fetchedOn = Date.now();
      try {
        cart.list = JSON.parse(localStorage.getItem("cart")).value;
        cart.lastFetch = cart.list ? fetchedOn : null;
        logger.info("-- Retrived Cart Items from Persitent Storage --");
        console.info("-- Retrived Cart Items from Persitent Storage --");
      } catch (err) {
        logger.error(err);
      }
    },
    snapshotCartItemsToPersistentStorage: (cart) => {
      logger.info(
        !persistentStorageDisabled() ? "SUCCESS" : "DISABLED",
        "-- Snapshot Cart Items to Persitent Storage --"
      );
      console.info(
        !persistentStorageDisabled() ? "SUCCESS" : "DISABLED",
        "-- Snapshot Cart Items to Persitent Storage --"
      );
      if (persistentStorageDisabled()) return;
      localStorage.setItem(
        "cart",
        JSON.stringify({
          value: cart.list,
          expiry: moment().add(config.EXPIRY.LOCALSTORAGE, "minute").unix()
        })
      );
    },
    itemAddedToCart: (cart, action) => {
      cart.list = action.payload;
    },
    itemRemovedFromCart: (cart, action) => {
      // cart.list = _.remove(cart.list, (item) => item === action.payload);
      cart.list = action.payload;
    }
  }
});

// export actions from redux-toolkit/slice, @see [line:10]
const {
  cartRequested,
  cartReceived,
  cartRequestFailed,
  itemAddedToCart,
  itemRemovedFromCart,
  retriveCartItemsFromPersitentStorage,
  snapshotCartItemsToPersistentStorage
} = slice.actions;

// export reducers from redux-toolkit/slice, @see [line:10]
export default slice.reducer;

export const loadCart = () => async (dispatch, getState) => {
  const { lastFetch } = getState().cart;

  // simple caching for cart, @see ../../config.js for expiry settings
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < config.EXPIRY.CACHE) {
    return;
  }

  // only on GET request we simply load cart from localStorage
  if (isPersistedDataRetrivable) {
    dispatch({ type: retriveCartItemsFromPersitentStorage.type });
    return;
  }

  // after retriving items from cart, cart is still empty then we make req to server or expired
  return dispatch(
    apiCallInit({
      url,
      onStart: cartRequested.type,
      onSuccess: cartReceived.type,
      afterSuccess: snapshotCartItemsToPersistentStorage.type,
      onError: cartRequestFailed.type
    })
  );
};

export const addItemToCart = (id) =>
  apiCallInit({
    url,
    method: "post",
    data: { id },
    onSuccess: itemAddedToCart.type,
    afterSuccess: snapshotCartItemsToPersistentStorage.type
  });

export const removeItemFromCart = (cId) =>
  apiCallInit({
    url: `${url}/${cId}`,
    method: "delete",
    onSuccess: itemRemovedFromCart.type,
    afterSuccess: snapshotCartItemsToPersistentStorage.type
  });

// memoization
export const getItemsInCart = createSelector(
  (state) => state.cart,
  (cart) => cart.list
);

export const noOfItemsInCart = createSelector(
  (state) => state.cart,
  (cart) => cart.list?.length || 0
);

// export const getItemDetails = (productsState, id) => {
//   return createSelector(productsState, (products) =>{
//     console.log(id, products)
//     _.find(products, ["id", id])}
//   );
// };
