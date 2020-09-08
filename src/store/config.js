// const BASE_URL = "https://jsonplaceholder.typicode.com/todos"; // localhost || localhost/api
const BASE_URL = "https://s0872.sse.codesandbox.io/api/"; // localhost/ || localhost/api
// const BASE_URL = "https://petstore-api.vercel.app/api/"; // localhost/ || localhost/api

// const generatePathTo = (path) => BASE_URL + path;
const generatePathTo = (path) => "/" + path;

export default {
  EXPIRY: { CACHE: 2, LOCALSTORAGE: 5 }, // in minutes
  BASE_URL,
  URL: {
    CART: generatePathTo("cart"), // localhost/cart || localhost/api/cart
    PRODUCTS: generatePathTo("products")
  }
};
