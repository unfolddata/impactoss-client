import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ProgressBar from 'components/ProgressBar';
// import messages from './messages';

const ANIMATION_INTERVAL = 10;
const ANIMATION_STEP = 1;
const ANIMATION_WIDTH = 20;

const Styled = styled.div`
  display: block;
  width: 100%
  height: 3px;
  position: relative;
  background-color: ${palette('light', 2)};
  overflow: hidden;
`;
const Bar = styled.div`
  display: block;
  width: ${ANIMATION_WIDTH}%;
  left: ${(props) => props.progress}%;
  height: 3px;
  position: relative;
  background-color: ${palette('primary', 2)};
`;

class Loading extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { progress: -ANIMATION_WIDTH };
  }
  componentDidMount() {
    // console.log('componentDidMount', this.state.progress)
    this.loadInterval = setInterval(this.handleTimeout, ANIMATION_INTERVAL);
  }
  componentWillUnmount() {
    // console.log('componentWillUnmount')
    if (this.loadInterval) {
      clearInterval(this.loadInterval);
      this.loadInterval = false;
    }
  }
  handleTimeout = () => {
    // Added timeout
    this.setState({ progress: this.state.progress < 100 ? (this.state.progress + ANIMATION_STEP) : 0 });
  }
  render() {
    if (this.props.progress) {
      return (
        <ProgressBar
          progress={this.props.progress}
        />
      );
    }
    return (
      <Styled>
        <Bar progress={this.state.progress} />
      </Styled>
    );
  }
}

Loading.propTypes = {
  progress: PropTypes.number,
};

export default Loading;
