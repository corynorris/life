import React, {Component} from 'react';
import { connect } from 'react-redux'
import Button from './Button';
import { stepForward, makeGrid, makeRandomGrid } from '../actions'

class Controls extends Component {
  render() {
    return (
      <div>
        <Button message="randomize" handleClick={this.props.onRandomizeClick.bind(this)} />
        <Button message="reset" handleClick={this.props.onResetClick.bind(this)} />
        <Button message="play" handleClick={this.props.onPlayClick.bind(this)} />
        <Button message="next" handleClick={this.props.onPlayClick.bind(this)} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPlayClick: () => {
      dispatch(stepForward())
    },
    onResetClick: () => {
      dispatch(makeGrid())
    },
    onNextClick: () => {
      dispatch(stepForward())
    },
    onRandomizeClick: () => {
      dispatch(makeRandomGrid())
    }
  }
}

export default connect(null, mapDispatchToProps)(Controls);