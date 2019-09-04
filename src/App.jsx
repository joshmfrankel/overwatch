import React, { Component } from 'react';
import Hero from './components/Hero';
import HeroMetadata from './components/HeroMetadata';
import { find, includes, filter } from 'lodash';
import classNames from 'classnames';
import './App.scss';

// @todo
// weapon + skill -> damage, rof, reload time
// combos
const heroes = [
  {
    name: 'Wrecking Ball',
    role: 'tank',
    health: 500,
    armor: 100,
    shield: 0,
    counters: ['Widowmaker'],
  },
  {
    name: 'Sombra',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: ['Wrecking Ball', 'Doomfist'],
  },
  {
    name: 'Widowmaker',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: ['Sombra'],
  },
  {
    name: 'McCree',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: ['Sombra'],
  },
  {
    name: 'Doomfist',
    role: 'damage',
    health: 250,
    armor: 0,
    shield: 0,
    counters: [],
  },
  {
    name: 'Ana',
    role: 'support',
    health: 200,
    armor: 0,
    shield: 0,
    counters: [],
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeroName: null,
      currentHeroCounters: null,
    }
  }

  handleHeroClick = (name) => {
    let { counters } = find(heroes, { name });

    // Remove active Hero by re-clicking hero
    if (this.state.currentHeroName === name) {
      return this.resetCurrentHero();
    }
    this.setState({ currentHeroName: name, currentHeroCounters: counters });
  }

  /**
   * Reset the current state variables to de-focus a hero
   *
   * @return     {Void}
   */
  resetCurrentHero = () => {
    this.setState({ currentHeroName: null, currentHeroCounters: null });
  }

  heroClassName = (name) => {
    return classNames('Hero',
      { 'Hero--active': this.isCurrentlyActiveHero(name) },
      { 'Hero--isCounteredBy': this.isCounteredByActiveHero(name) },
      { 'Hero--isCounter': this.isCounterForActiveHero(name) },
    );
  }

  hasActiveHero = () => {
    return this.state.currentHeroName !== null;
  }

  isCurrentlyActiveHero = (name) => {
    return this.state.currentHeroName === name;
  }

  isCounteredByActiveHero = (counterName) => {
    return includes(this.state.currentHeroCounters, counterName);
  }

  /**
   * Using the current counterName iterator, find their
   * array of counters to determine if one of their counters
   * is the currently active hero. This way we only need to track
   * a list of counters for each hero instead of counters and counteredBy.
   *
   * @param      {String}   counterName  The counter identifier
   * @return     {Boolean}  True if counter for active hero, False otherwise.
   */
  isCounterForActiveHero = (counterName) => {
    let { counters } = find(heroes, { name: counterName });
    if (this.hasActiveHero() && counters !== undefined) {
      return includes(counters, this.state.currentHeroName);
    }
    return false;
  }

  getCurrentHero = () => {
    if (this.hasActiveHero()) {
      return find(heroes, { name: this.state.currentHeroName });
    }
    return {
      name: "No Selection"
    }
  }

  heroCollection = () => {
    if (!this.hasActiveHero()) {
      return heroes;
    }

    return heroes.filter((hero) => {
      return this.isCurrentlyActiveHero(hero.name) || this.isCounteredByActiveHero(hero.name) || this.isCounterForActiveHero(hero.name);
    })
  }

  // @todo filter by role type
  render() {
    return (
      <>
        <div className="FlexboxContainer FlexboxContainer--row">
          <div className="FlexboxContainer-sideColumn">
            <HeroMetadata hero={this.getCurrentHero()} handleReset={this.resetCurrentHero}/>
          </div>

          <div className="FlexboxContainer-mainColumn">
            {this.heroCollection().map((hero) =>
              <Hero
                key={hero.name}
                hero={hero}
                handleHeroClick={() => this.handleHeroClick(hero.name)}
                className={this.heroClassName(hero.name)}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
