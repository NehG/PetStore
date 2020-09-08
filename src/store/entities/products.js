import _ from "lodash";
import moment from "moment";
import config from "../config";
import { apiCallInit } from "../api";
import { createSlice, createSelector } from "@reduxjs/toolkit";

const url = config.URL.PRODUCTS;

const slice = createSlice({
  name: "products",
  initialState: {
    list: [],
    isLoading: false,
    lastFetch: null
  },
  reducers: {
    productRequested: (product) => {
      product.isLoading = true;
    },
    productReceived: (product, action) => {
      product.list = action.payload;
      product.isLoading = false;
      product.lastFetch = Date.now();
    },
    productRequestFailed: (product) => {
      product.isLoading = false;
    },
    newProductAdded: (product, action) => {
      product.list = action.payload;
    },
    productRemoved: (product, action) => {
      product.list = action.payload;
    }
  }
});

const {
  productRequested,
  productReceived,
  productRequestFailed,
  newProductAdded,
  productRemoved
} = slice.actions;

export default slice.reducer;

// Action Creator
export const loadProducts = () => (dispatch, getState) => {
  const { lastFetch } = getState().products;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < config.EXPIRY.CACHE) return;

  return dispatch(
    apiCallInit({
      url,
      onStart: productRequested.type,
      onSuccess: productReceived.type,
      onError: productRequestFailed.type
    })
  );
};

export const addProduct = ({ name, image, price }) =>
  apiCallInit({
    url,
    method: "post",
    data: {
      name,
      image,
      price
    },
    onSuccess: newProductAdded.type
  });

export const removeProduct = (id) =>
  apiCallInit({
    url: `${url}/${id}`,
    method: "delete",
    onSuccess: productRemoved.type
  });

// Memoization
export const getProducts = createSelector(
  (state) => state.products,
  (products) => products?.list
);

export const getProductDetails = (id) =>
  createSelector(getProducts, (products) =>
    _.find(products, ["id", _.escape(id)])
  );
