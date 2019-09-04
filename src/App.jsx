import React, { Component } from 'react';
import Hero from './components/Hero';
import HeroMetadata from './components/HeroMetadata';
import { find, includes, filter } from 'lodash';
import classNames from 'classnames';
import './App.scss';

// @todo
// weapon + skill -> damage, rof, reload time
// combos
// @todo use name as the key!!!
const heroes = [
  {
    id: 1,
    name: 'Wrecking Ball',
    role: 'tank',
    health: 500,
    armor: 100,
    shield: 0,
    counters: [3],
  },
  {
    id: 2,
    name: 'Sombra',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: [1, 5],
  },
  {
    id: 3,
    name: 'Widowmaker',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: [2],
  },
  {
    id: 4,
    name: 'McCree',
    role: 'damage',
    health: 200,
    armor: 0,
    shield: 0,
    counters: [2],
  },
  {
    id: 5,
    name: 'Doomfist',
    role: 'damage',
    health: 250,
    armor: 0,
    shield: 0,
    counters: [],
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeroId: null,
      currentHeroCounters: null,
    }
  }

  handleHeroClick = (id) => {
    let { counters } = find(heroes, { id });

    // Remove active Hero by re-clicking hero
    if (this.state.currentHeroId === id) {
      return this.resetCurrentHero();
    }
    this.setState({ currentHeroId: id, currentHeroCounters: counters });
  }

  /**
   * Reset the current state variables to de-focus a hero
   *
   * @return     {Void}
   */
  resetCurrentHero = () => {
    this.setState({ currentHeroId: null, currentHeroCounters: null });
  }

  heroClassName = (id) => {
    return classNames('Hero',
      { 'Hero--active': this.isCurrentlyActiveHero(id) },
      { 'Hero--isCounteredBy': this.isCounteredByActiveHero(id) },
      { 'Hero--isCounter': this.isCounterForActiveHero(id) },
    );
  }

  hasActiveHero = () => {
    return this.state.currentHeroId !== null;
  }

  isCurrentlyActiveHero = (id) => {
    return this.state.currentHeroId === id;
  }

  isCounteredByActiveHero = (counterId) => {
    return includes(this.state.currentHeroCounters, counterId);
  }

  /**
   * Using the current counterId iterator id, find their
   * array of counters to determine if one of their counters
   * is the currently active hero. This way we only need to track
   * a list of counters for each hero instead of counters and counteredBy.
   *
   * @param      {Integer}   counterId  The counter identifier
   * @return     {boolean}  True if counter for active hero, False otherwise.
   */
  isCounterForActiveHero = (counterId) => {
    let { counters } = find(heroes, { id: counterId });
    if (this.hasActiveHero() && counters !== undefined) {
      return includes(counters, this.state.currentHeroId);
    }
    return false;
  }

  getCurrentHero = () => {
    if (this.hasActiveHero()) {
      return find(heroes, { id: this.state.currentHeroId });
    }
    return {
      id: null,
      name: "No Selection"
    }
  }

  heroCollection = () => {
    if (!this.hasActiveHero()) {
      return heroes;
    }

    return heroes.filter((hero) => {
      return this.isCurrentlyActiveHero(hero.id) || this.isCounteredByActiveHero(hero.id) || this.isCounterForActiveHero(hero.id);
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
                key={hero.id}
                hero={hero}
                handleHeroClick={() => this.handleHeroClick(hero.id)}
                className={this.heroClassName(hero.id)}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
