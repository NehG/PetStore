import _ from "lodash";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../store/entities/products";
import { Container, Form, Jumbotron, InputGroup } from "react-bootstrap";

export default (props) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});

  const handleInputChange = (e) => {
    e.persist();
    setFormState({ ...formState, [e.target.name]: _.escape(e.target.value) });
  };

  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (
      !_.isEmpty(formState) &&
      !_.isEmpty(formState?.image) &&
      !_.isEmpty(formState?.name) &&
      !_.isEmpty(formState?.price) &&
      !_.isNaN(formState?.price)
    ) {
      dispatch(addProduct(formState));
      props.history.push("/");
    } else alert("Error! Name (string) & price (number) cannot be empty");
    return;
  };

  const form_group_constructor = (label, type, placeholder, prependText) => (
    <Form.Group controlId={`product${label}${_.uniqueId()}`}>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        {!_.isEmpty(prependText) ? (
          <InputGroup.Prepend>
            <InputGroup.Text>{prependText}</InputGroup.Text>
          </InputGroup.Prepend>
        ) : null}
        <Form.Control
          name={_.lowerCase(label)}
          type={type}
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </InputGroup>
    </Form.Group>
  );

  return (
    <Container fluid>
      <Form className="justify-content-md-center">
        {form_group_constructor(
          "Image",
          "url",
          "Image URL (e.g. https://gajjarnehal.com/favicon.ico)"
        )}
        {form_group_constructor(
          "Name",
          "text",
          "Product Name (e.g. nTags Stainless Steel)"
        )}
        {form_group_constructor(
          "Price",
          "text",
          "Product price (e.g. 10)",
          "$"
        )}
      </Form>
      <hr />
      <h4>Preview</h4>
      <Jumbotron>
        <Container className="d-flex justify-content-center mx-auto">
          {!_.isEmpty(formState) ? (
            <ProductCard
              name={_.get(formState, "name", "Enter Name")}
              price={_.get(formState, "price")}
              image={_.get(formState, "image", "Enter Image URL")}
              image_alt="Enter Image URL"
            />
          ) : null}
        </Container>
      </Jumbotron>
      <Link
        className="btn btn-outline-dark w-25 mb-5"
        onClick={handleAddNewProduct}
        to="/products"
      >
        Add
      </Link>
    </Container>
  );
};
