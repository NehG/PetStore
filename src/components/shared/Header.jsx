import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { Navbar, Nav, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadCart, noOfItemsInCart } from "../../store/entities/cart";

export default () => {
  const dispatch = useDispatch();
  const count = useSelector(noOfItemsInCart) || 0;

  useEffect(() => {
    dispatch(loadCart());
  }, []);

  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Link to="/">
        <Navbar.Brand>
          <img
            src="https://cdn.worldvectorlogo.com/logos/redux.svg"
            width="30"
            height="30"
            className="d-inline-block align-top mr-2 img-responsive"
            alt="Redux Logo"
          />{" "}
          Pet Store
        </Navbar.Brand>
      </Link>
      <Nav className="ml-auto">
        <Link className="btn btn-outline-light mr-2" to="/products/new">
          Add New Product
        </Link>
        <Link className="btn btn-light" to="/cart">
          <img
            src="https://image.flaticon.com/icons/svg/2514/2514098.svg"
            width="25"
            height="25"
            className="d-inline-block align-top img-responsive"
            alt="Pet Store Cart"
          />
          <Badge variant="light">{count}</Badge>
          <span className="sr-only">petstore cart</span>
        </Link>
      </Nav>
    </Navbar>
  );
};
