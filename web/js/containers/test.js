import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Test extends Component {
  render() {
    return (
      <div>
        <div>TEST 123</div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  null
)(Test);
