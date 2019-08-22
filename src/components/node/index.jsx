import React, { Component } from 'react';

class Node extends Component {
  render() {
    const { hero } = this.props;
    return (
      <div className={`Node ${this.props.className}`} onClick={this.props.handleNodeClick}>
        <p>{hero.name}</p>
      </div>
    );
  }
}

export default Node;
