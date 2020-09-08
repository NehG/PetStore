import axios from "axios";
import MockAdaptor from "axios-mock-adapter";
import configureStore from "../../configureStore";
import { loadProducts, removeProduct, addProduct } from "../products";

describe("products slice", () => {
  // declare axios and store variables for tests
  let mockAxios, store;

  // helper func
  const getProductsState = () => store.getState().products;

  // before each and every test, instantiate mockAxios and store from scratch
  beforeEach(() => {
    mockAxios = new MockAdaptor(axios);
    store = configureStore();
  });

  // focusing on loadProducts()
  describe("loading products", () => {
    describe("if the product GET request is dispactched mutiple times then", () => {
      it("should fetch products if 'lastFetch' is not recent", async () => {
        // Arrange
        mockAxios.onGet("/products").reply(200, [{ id: 696 }]);

        // Act
        await store.dispatch(loadProducts());

        // Assert
        expect(getProductsState().list).toHaveLength(1);
      });
    });

    // value of "recent" can be defined in config.js
    it("should just do nothing if 'lastFetch' is recent", async () => {
      // Arrange
      mockAxios.onGet("/products").reply(200, [{ id: 696 }]);

      // Act
      await store.dispatch(loadProducts());
      await store.dispatch(loadProducts());

      // Assert
      expect(mockAxios.history.get.length).toBe(1);
    });

    // isLoading property is an important prop as it triggers UI-loader (overlay on screen!).
    describe("isLoading property on dispatch", () => {
      it("should be truthy before fetching products", () => {
        mockAxios.onGet("/products").reply(async () => {
          // before server returns response, isLoading is expected to be true
          expect(getProductsState()?.isLoading).toBeTruthy();
          return [200, [{}]];
        });

        store.dispatch(loadProducts());
      });

      it("should be falsy after products fetched", async () => {
        mockAxios.onGet("/products").reply(200, [{ id: 1 }]);

        await store.dispatch(loadProducts());

        expect(getProductsState().isLoading).toBeFalsy();
      });

      it("should be falsy even after product fetch error", async () => {
        mockAxios.onGet("/products").reply(500);

        await store.dispatch(loadProducts());

        expect(getProductsState().isLoading).toBeFalsy();
      });
    });
  });

  // focusing on product adding
  describe("on adding new product", () => {
    it("should update the product's state", async () => {
      const beforeAdd = [{ id: 1 }];
      const afterAdd = [{ id: 1 }, { id: 2 }];
      mockAxios.onGet("/products").reply(200, beforeAdd);
      mockAxios.onPost("/products").reply(200, afterAdd);

      await store.dispatch(loadProducts());
      expect(getProductsState().list).toMatchObject([{ id: 1 }]);
      await store.dispatch(addProduct({ id: 1 }));

      expect(getProductsState().list).toMatchObject([{ id: 1 }, { id: 2 }]);
    });
  });

  // focusing on product removed
  describe("on removing product from products then", () => {
    it("should update the product's state", async () => {
      mockAxios.onGet("/products").reply(200, [{ id: 1 }, { id: 2 }]);
      mockAxios.onDelete("/products/1").reply(200, [{ id: 2 }]);

      await store.dispatch(loadProducts());
      await store.dispatch(removeProduct(1));

      expect(getProductsState().list).toMatchObject([{ id: 2 }]);
    });
  });
});
