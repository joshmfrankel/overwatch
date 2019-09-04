import React, { Component } from 'react';
import changeCase from 'change-case';
import './index.scss';

class HeroMetadata extends Component {
  render() {
    const { name, health, armor, shield } = this.props.hero;
    const heroImageSrc = `./images/${changeCase.snakeCase(name)}.png`;

    return (
      <div className="HeroMetadata">
        <h2>{name}</h2>
        <img src={heroImageSrc} width="180" height="auto"/>
        {name !== 'No Selection' &&
          <button className="HeroMetadata-reset" onClick={this.props.handleReset}>Reset Selection</button>

        }
        {name !== 'No Selection' &&
          <ul className="HeroMetadata-stats">
            <li>Health: { health }</li>
            <li>Armor: { armor }</li>
            <li>Shield: { shield }</li>
          </ul>
        }
      </div>
    );
  }
}

export default HeroMetadata;
