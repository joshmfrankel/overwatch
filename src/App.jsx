import React, { Component } from 'react';
import Node from './components/node';
import './App.css';

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
      activeHeroId: null
    }
  }

  handleNodeClick = (id) => {
    this.setState({ activeHeroId: id });
  }

  isActiveHeroClass = (id) => {
    if (this.state.activeHeroId === id) {
      return 'active';
    }
    return '';
  }

  render() {
    return (
      <div className="App">
        {heroes.map((hero) =>
          <Node key={hero.id} hero={hero} handleNodeClick={() => this.handleNodeClick(hero.id)} className={this.isActiveHeroClass(hero.id)}/>
        )}
      </div>
    );
  }
}

export default App;
