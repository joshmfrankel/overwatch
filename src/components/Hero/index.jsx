import React, { Component } from 'react';
import changeCase from 'change-case';
import './index.scss';

class Hero extends Component {
  render() {
    const { name } = this.props.hero;
    const circleRadius = 50;
    const heroImageSrc = `./images/${changeCase.snakeCase(name)}.png`;

    return (
      <svg
        className='Hero'
        width={circleRadius * 2}
        height={circleRadius * 2}
        title={name}
      >
        <g onClick={this.props.handleHeroClick}>
          <title>{name}</title>
          <clipPath id="heroPortraitClip" transform={`translate(${circleRadius}, ${circleRadius})`}>
            <circle r={circleRadius} id="heroPortrait"></circle>
          </clipPath>

          <use href="#heroPortrait" transform={`translate(${circleRadius}, ${circleRadius})`} />

          <image width="100" height="172" y="-20" href={heroImageSrc} clipPath="url(#heroPortraitClip)" />
        </g>
      </svg>
    );
  }
}

export default Hero;
