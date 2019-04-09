import React from "react";
import { connect } from "react-redux";

const Generation = ({ generation }) => {
  return <div>{generation}</div>;
};

const mapStateToProps = (state, ownProps) => {
  return {
    generation: state.generations
  };
};

export default connect(mapStateToProps)(Generation);
