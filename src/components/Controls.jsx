import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "./Button";
import { stepForward, makeGrid, makeRandomGrid, play } from "../actions";

class Controls extends Component {
  componentDidMount() {
    this.onPlay();
  }
  onPlay() {
    if (this.props.interval === 0) {
      const id = setInterval(this.props.onNextClick, 200);
      this.props.onPlayClick(id);
    } else {
      clearInterval(this.props.interval);
      this.props.onPlayClick(0);
    }
  }

  render() {
    return (
      <div>
        <Button
          message="randomize"
          handleClick={this.props.onRandomizeClick.bind(this)}
        />
        <Button
          message="reset"
          handleClick={this.props.onResetClick.bind(this)}
        />
        <Button
          message={this.props.interval ? "pause" : "play"}
          handleClick={this.onPlay.bind(this)}
        />
        <Button
          message="next"
          handleClick={this.props.onNextClick.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ interval }) => {
  return {
    interval
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPlayClick: id => {
      dispatch(play(id));
    },
    onResetClick: () => {
      dispatch(makeGrid());
    },
    onNextClick: () => {
      dispatch(stepForward());
    },
    onRandomizeClick: () => {
      dispatch(makeRandomGrid());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
