import React from "react";
import PropTypes from "prop-types";
import { Header } from "./components";
import { Provider } from "react-redux";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";

// Importing Required Components
import {
  Main,
  Cart,
  NewProductForm,
  BodyWrapper,
  ErrorBoundary
} from "./components";

const Root = ({ store }) => (
  <Container>
    <Router>
      <Provider store={store}>
        <Header />
        <ErrorBoundary>
          <Switch>
            {/* Main Route */}
            <Route path="/" component={BodyWrapper(Main, "Products")} exact />
            {/* Route for Products */}
            <Redirect path="/products" to="/" exact />
            {/* <Route path="/products" component={Main} exact /> */}
            <Route
              path="/products/new"
              component={BodyWrapper(NewProductForm, "New Product")}
            />
            {/* <Route path="/product/:id" component={Product} /> */}
            {/* Route for Cart */}
            <Route path="/cart" component={BodyWrapper(Cart, "Cart")} />
            {/* 404 Route */}
            <Route component={() => <div>404 Not found </div>} />
          </Switch>
        </ErrorBoundary>
      </Provider>
    </Router>
  </Container>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
