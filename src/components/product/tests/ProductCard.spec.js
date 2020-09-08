import React from "react";
// import { Provider } from "react-redux";
import Enzyme, { shallow } from "enzyme";
// import configureStore from "../../store/configureStore";
import ProductCard from "../ProductCard";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const dataTestId_Attribute = "data-testid";

describe("<ProductCard /> unit test", () => {
  // const mockStore = configureStore();
  const props = {
    name: "nTags Steel Tag -- TEST",
    price: "10",
    image: "",
    actionAddToCart: jest.fn(),
    actionRemoveProduct: jest.fn()
  };

  const wrap = shallow(<ProductCard {...props} />);

  const generateFindAttributesFor = (dataTestId) =>
    `[${dataTestId_Attribute}="${dataTestId}"]`;

  it("render name/title", () => {
    // Assert
    expect(
      wrap.find(generateFindAttributesFor("cart-item-title")).text()
    ).toEqual(props.name);
  });

  it("render price", () => {
    // Assert
    expect(
      wrap.find(generateFindAttributesFor("cart-item-price")).text()
    ).toEqual(`$${parseFloat(props.price).toFixed(2)}`);
  });

  it("simulate 'Add to cart' button click", () => {
    // Act
    wrap
      .find(generateFindAttributesFor("cart-item-btn-addToCart"))
      .simulate("click");

    // Assert
    expect(props.actionAddToCart.mock.calls.length).toBe(1);
  });

  it("simulate 'Remove from cart' button click", () => {
    // Act
    wrap
      .find(generateFindAttributesFor("cart-item-btn-removeFromCart"))
      .simulate("click");

    // Assert
    expect(props.actionAddToCart.mock.calls.length).toBe(1);
  });
});

// const getWrapper = (mockStore = configureStore()) =>
//   mount(
//     <Provider store={mockStore}>
//       <ProductCard />
//     </Provider>
//   );
