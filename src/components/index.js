import Header from "./shared/Header";
import BodyWrapper from "./shared/Wrapper";
import ErrorBoundary from "./shared/ErrorBoundary";

// const CartList = React.lazy(() => import("./cart/CartList"));
// // const BodyWrapper = React.lazy(() => import("./shared/Wrapper"));
// const ProductList = React.lazy(() => import("./product/ProductList"));
// const NewProductForm = React.lazy(() => import("./product/NewProductForm"));

import CartList from "./cart/CartList";
import ProductList from "./product/ProductList";
import NewProductForm from "./product/NewProductForm";

// root file for all components, for easy import
export {
  ProductList as Main,
  CartList as Cart,
  ErrorBoundary,
  Header,
  NewProductForm,
  BodyWrapper
};
