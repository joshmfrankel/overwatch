import React, { Component } from 'react';
import changeCase from 'change-case';
import './index.scss';

class HeroMetadata extends Component {
  render() {
    const { name, health, armor, shield, role } = this.props.hero;
    const heroImageSrc = `./images/${changeCase.snakeCase(name)}.png`;

    return (
      <div className="HeroMetadata">
        <h1>{name}</h1>
        <img src={heroImageSrc} width="180" height="auto"/>
        {name !== 'No Selection' &&
          <>
            <button className="HeroMetadata-reset" onClick={this.props.handleReset}>Reset Selection</button>
            <h3>{ role }</h3>
            <ul className="HeroMetadata-stats">
              <li>Health: { health }</li>
              <li>Armor: { armor }</li>
              <li>Shield: { shield }</li>
            </ul>
          </>
        }
      </div>
    );
  }
}

export default HeroMetadata;
