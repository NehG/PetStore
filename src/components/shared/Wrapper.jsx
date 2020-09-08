import React, { Suspense } from "react";
import { Button } from "react-bootstrap";
export default (Child, title) => {
  return class BodyWrapper extends React.Component {
    render() {
      return (
        <>
          {this.props.location?.pathname !== "/" ? (
            <>
              <Button
                variant="dark"
                className="btn-sm mb-1 p-1 mr-2 d-inline float-left"
                onClick={this.props.history.goBack}
              >
                Go Back
              </Button>
              <span className="d-inline float-left mx-1 mr-2">|</span>
            </>
          ) : null}
          <h3>{title}</h3>
          <Suspense fallback={() => <div>Loading...</div>}>
            <Child {...this.props} />
          </Suspense>
        </>
      );
    }
  };
};
