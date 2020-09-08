import React from "react";
import { Card, Row, Col, Image, Button } from "react-bootstrap";

export default ({
  name,
  price,
  image,
  image_alt,
  actionAddToCart,
  actionRemoveProduct
}) => (
  <Card style={{ width: "15rem" }} className="my-1 mx-1">
    <Card.Img
      data-testid="cart-item-img"
      variant="top"
      src={image || ""}
      alt={image_alt || ""}
      className="img-fluid p-4 rounded"
    />
    <hr />
    <Card.Body>
      <Card.Title data-testid="cart-item-title">{name}</Card.Title>
      <Card.Text data-testid="cart-item-price">
        ${parseFloat(price).toFixed(2) || 0}
      </Card.Text>
      <Row>
        <Col className="d-inline-flex justify-content-center">
          <Button
            data-testid="cart-item-btn-addToCart"
            className="btn btn-light"
            variant="outline-dark"
            onClick={actionAddToCart}
            disabled={actionAddToCart ? false : true}
          >
            Add to Cart
          </Button>
        </Col>
        <Col className="d-inline-flex justify-content-center col-4">
          <Button
            data-testid="cart-item-btn-removeFromCart"
            className="btn border-0"
            variant="outline-none"
            onClick={actionRemoveProduct}
            disabled={actionRemoveProduct ? false : true}
          >
            <Image
              data-testid="cart-item-img"
              className="img-responsive"
              width="25"
              height="25"
              src="https://image.flaticon.com/icons/svg/1828/1828843.svg"
            />
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
