import React, { Component } from 'react';
import './index.scss';

class Hero extends Component {
  render() {
    const { hero, isCounter } = this.props;
    const circleRadius = 50;
    return (
      <svg
        className={this.props.className}
        width={circleRadius * 2}
        height={circleRadius * 2}
      >
        <g transform={`translate(${circleRadius}, ${circleRadius})`} onClick={this.props.handleHeroClick}>
        	<circle r={circleRadius}></circle>
          <text textAnchor="middle" alignmentBaseline="central" className="Hero-text">{hero.name}</text>
        </g>
      </svg>
    );
  }
}

export default Hero;
