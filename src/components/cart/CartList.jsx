import _ from "lodash";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCart,
  getItemsInCart,
  removeItemFromCart
} from "../../store/entities/cart";
import CartCard from "./CartCard";

const CartList = () => {
  const dispatch = useDispatch();
  const itemsInCart = useSelector(getItemsInCart);

  useEffect(() => {
    dispatch(loadCart());
  }, []);

  const handleRemoveItemButtonClick = (cId) => {
    dispatch(removeItemFromCart(cId));
  };

  return (
    <Container className="px-5 py-3">
      {!_.isEmpty(itemsInCart) ? (
        itemsInCart.map((item) => (
          <CartCard
            data-testid="cart-item-card"
            key={`${item.cId}`}
            {...item}
            actionRemoveFromCart={handleRemoveItemButtonClick}
          />
        ))
      ) : (
        <p className="lead mt-3" data-testid="cart-empty">
          Sorry, cart is empty, please add products to cart.
        </p>
      )}
    </Container>
  );
};

// List of products: /products
export default CartList;
