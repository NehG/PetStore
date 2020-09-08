import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import configureStore from "../../configureStore";
import { loadCart, addItemToCart, removeItemFromCart } from "../cart";

describe("cart slice", () => {
  let mockAxios, store;

  const getCartState = () => store.getState().cart;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    store = configureStore();
  });

  describe("loading cart", () => {
    it("should fetch cart items from server", async () => {
      // Arrange
      mockAxios.onGet("/cart").reply(200, [{ cId: 1 }]);

      // Act
      await store.dispatch(loadCart());

      // Assert
      expect(getCartState().list).toMatchObject([{ cId: 1 }]);
    });
    // value of "recent" can be defined in config.js
    it("should just do nothing if 'lastFetch' is recent", async () => {
      // Arrange
      mockAxios.onGet("/cart").reply(200, [{ cId: 1 }]);

      // Act
      await store.dispatch(loadCart());
      await store.dispatch(loadCart());

      // Assert
      expect(mockAxios.history.get.length).toBe(1);
    });

    it("should look at persistent storage before sending request to server", () => {
      // Arrange
      mockAxios.onGet("/cart").reply(async () => {
        expect(jest.spyOn(localStorage, "getItem")).toBeCalledWith("cart");
        return 200;
      });

      // Act
      store.dispatch(loadCart());
    });
  });

  // focusing on isLoading
  describe("isLoading property on dispatch", () => {
    it("should be truthy before fetching items in cart", () => {
      mockAxios.onGet("/cart").reply(async () => {
        // before server returns response, isLoading is expected to be true
        expect(getCartState()?.isLoading).toBeTruthy();
        return [200, [{}]];
      });

      store.dispatch(loadCart());
    });

    it("should be falsy after items in cart are fetched", async () => {
      mockAxios.onGet("/cart").reply(200, [{ cId: 1 }]);

      await store.dispatch(loadCart());

      expect(getCartState().isLoading).toBeFalsy();
    });

    it("should be falsy even after product fetch error", async () => {
      mockAxios.onGet("/cart").reply(500);

      await store.dispatch(loadCart());

      expect(getCartState().isLoading).toBeFalsy();
    });
  });

  // focusing on adding item to the cart
  describe("on adding item to cart", () => {
    it("should update cart's state", async () => {
      const beforeAdd = [{ cId: 1 }];
      const afterAdd = [{ cId: 1 }, { cId: 2 }];
      mockAxios.onGet("/cart").reply(200, beforeAdd);
      mockAxios.onPost("/cart").reply(200, afterAdd);

      await store.dispatch(loadCart());
      expect(getCartState().list).toMatchObject([{ cId: 1 }]);
      await store.dispatch(addItemToCart({ cId: 2 }));

      expect(getCartState().list).toMatchObject([{ cId: 1 }, { cId: 2 }]);
    });

    it("should take a fresh snapshot and update persistent storage", async () => {
      const beforeAdd = [{ cId: 1 }];
      const afterAdd = [{ cId: 1 }, { cId: 2 }];
      mockAxios.onGet("/cart").reply(200, beforeAdd);
      mockAxios.onPost("/cart").reply(200, afterAdd);
      const spy = jest.spyOn(localStorage, "setItem");

      await store.dispatch(loadCart());
      expect(spy).toBeCalled();
      expect(JSON.parse(localStorage.getItem("cart")).value).toMatchObject(
        beforeAdd
      );

      await store.dispatch(addItemToCart(1));
      expect(spy).toBeCalled();
      expect(JSON.parse(localStorage.getItem("cart")).value).toMatchObject(
        afterAdd
      );
    });
  });

  // focusing items from the cart
  describe("on removing items from the cart then", () => {
    it("should update cart's state", async () => {
      mockAxios.onGet("/cart").reply(200, [{ cId: 1 }, { cId: 2 }]);
      mockAxios.onDelete("/cart/1").reply(200, [{ cId: 2 }]);

      await store.dispatch(loadCart());
      await store.dispatch(removeItemFromCart(1));

      expect(getCartState().list).toMatchObject([{ cId: 2 }]);
    });

    it("should take a fresh snapshot and update persistent storage", async () => {
      const afterDelete = [{ cId: 1 }];
      const beforeDelete = [{ cId: 1 }, { cId: 2 }];
      mockAxios.onGet("/cart").reply(200, beforeDelete);
      mockAxios.onDelete("/cart/2").reply(200, afterDelete);
      const spy = jest.spyOn(localStorage, "setItem");

      await store.dispatch(loadCart());
      expect(spy).toBeCalled();
      expect(JSON.parse(localStorage.getItem("cart")).value).toMatchObject(
        beforeDelete
      );

      await store.dispatch(removeItemFromCart(2));
      expect(spy).toBeCalled();
      expect(JSON.parse(localStorage.getItem("cart")).value).toMatchObject(
        afterDelete
      );
    });
  });
});
