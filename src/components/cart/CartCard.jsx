import React from "react";
import moment from "moment";
import { Media, Button } from "react-bootstrap";

export default ({
  cId,
  name,
  image,
  price,
  actionRemoveFromCart,
  _timestamp
}) => {
  return (
    <>
      <Media as="li">
        <img width={64} height={64} className="mr-3" src={image || ""} alt="" />
        <Media.Body>
          <h5 className="d-inline">{name}</h5>
          <br />
          <span className="lead small">
            Price:{" "}
            <span className="badge badge-dark badge-pill">
              ${parseFloat(price).toFixed(2)}
            </span>
            <small> + taxes</small>
          </span>
          <br />
          <small className="lead p-0 small badge font-italic">
            {/* <small>#{id}</small>
            <br /> */}
            <small className="float-left">
              added {moment(_timestamp).fromNow()}
            </small>
          </small>
          <Button
            variant="outline-danger"
            className="btn-sm d-inline float-right"
            onClick={() => actionRemoveFromCart(cId)}
          >
            Remove
          </Button>
        </Media.Body>
      </Media>
      <hr />
    </>
  );
};
