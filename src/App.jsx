import React, { Component } from 'react';
import Hero from './components/Hero';
import { find, includes } from 'lodash';
import classNames from 'classnames';
import './App.scss';

const heroes = [
  {
    id: 1,
    name: 'Wrecking Ball',
    role: 'tank',
    counteredBy: [2],
  },
  {
    id: 2,
    name: 'Sombra',
    role: 'damage',
    counteredBy: [],
  },
  {
    id: 3,
    name: 'Mercy',
    role: 'support',
    counteredBy: [],
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeroId: null,
      currentCounteredBy: null,
    }
  }

  handleHeroClick = (id) => {
    let { counteredBy } = find(heroes, { id });

    // Remove active by re-clicking hero
    if (this.state.currentHeroId === id) {
      id = null;
      counteredBy = null;
    }
    this.setState({ currentHeroId: id, currentCounteredBy: counteredBy });
  }

  heroClassName = (id) => {
    return classNames('Hero',
      { 'Hero--active': this.state.currentHeroId === id },
      { 'Hero--isCounter': includes(this.state.currentCounteredBy, id) },
    );
  }

  // @todo Hide heros that aren't counters or countered by the currently
  // selected hero
  // @todo filter by role type
  render() {
    return (
      <div className="App">
        {heroes.map((hero) =>
          <Hero
            key={hero.id}
            hero={hero}
            handleHeroClick={() => this.handleHeroClick(hero.id)}
            className={this.heroClassName(hero.id)}
          />
        )}
      </div>
    );
  }
}

export default App;
