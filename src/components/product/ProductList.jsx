import ProductCard from "./ProductCard";
import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../store/entities/cart";
import {
  loadProducts,
  getProducts,
  removeProduct
} from "../../store/entities/products";

// List of products: /products
export default () => {
  const dispatch = useDispatch();
  const items = useSelector(getProducts);

  useEffect(() => {
    dispatch(loadProducts());
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-center">
        {/* <CardDeck> */}
        {items.map((item) => (
          <ProductCard
            key={item.id}
            {...item}
            actionAddToCart={() => dispatch(addItemToCart(item.id))}
            actionRemoveProduct={() => dispatch(removeProduct(item.id))}
          />
        ))}
        {/* </CardDeck> */}
      </Row>
    </Container>
  );
};
