import React, { Component } from 'react';
import HeroCollection from './components/HeroCollection';
import Hero from './components/Hero';
import './App.scss';

const heroes = [
  {
    id: 1,
    name: 'Wrecking Ball',
    role: 'tank',
    countered_by: [2],
  },
  {
    id: 2,
    name: 'Sombra',
    role: 'damage',
    countered_by: [],
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeroId: null
    }
  }

  handleHeroClick = (id) => {
    console.log(`clicked ${id}`);
    this.setState({ currentHeroId: id });
  }

  isActiveHeroClass = (id) => {
    if (this.state.currentHeroId === id) {
      return 'active';
    }
    return '';
  }

  render() {
    return (
      <div className="App">
        {heroes.map((hero) =>
          <Hero 
            key={hero.id} 
            hero={hero} 
            handleHeroClick={() => this.handleHeroClick(hero.id)} className={this.isActiveHeroClass(hero.id)}/>
        )}
      </div>
    );
  }
}

export default App;
