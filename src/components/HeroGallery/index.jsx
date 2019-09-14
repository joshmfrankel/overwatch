import React, { Component } from 'react';
import Hero from '../Hero';
import HeroMetadata from '../HeroMetadata';
import { find, includes, filter } from 'lodash';
import classNames from 'classnames';
import Airtable from 'airtable';
import './index.scss';

const airTableApiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBaseKey = process.env.REACT_APP_AIRTABLE_BASE_KEY;

// @todo
// weapon + skill -> damage, rof, reload time
// combos
// https://www.esportstales.com/overwatch/hero-counter-list

class HeroGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
      loading: true,
      currentHeroName: null,
      currentHeroCounters: null,
      currentHeroCounteredBy: null,
      currentHeroId: null,
      currentHeroCombos: null,
    }
  }

  componentDidMount = () => {
    this.airtableBase = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseKey);

    this.airtableBase("Heroes").select({ view: "Grid view" }).eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        this.setState(state => {
          // Convert field keys to lowercase
          let heroFields = Object.keys(record.fields).reduce((key, value) => (key[value.toLowerCase()] = record.fields[value], key), {});
          heroFields['id'] = record.id;
          return { heroes: state.heroes.concat(heroFields) };
        })
      });
      this.setState({ loading: false });
    });
  }

  handleHeroClick = (name, id) => {
    let { counters } = find(this.state.heroes, { name });

    // Given the current list of heroes
    // filter out heroes where their array of counters
    // doesn't include the currently selected hero
    // Then map the result into a collection of names
    let currentHeroCounteredBy = filter(this.state.heroes, (hero) => {
      return includes(hero.counters, name);
    }).map(hero => hero.name);

    // @todo Request to Airtable for given Heroes:
    // 2. Weapon & Skill stats
    this.airtableBase("Combos").select({ view: "Grid view" }).eachPage((records, fetchNextPage) => {
      let combos = filter(records, (record) => includes(record.fields.HeroReference, id)).map(record => record.fields);

      this.setState({ currentHeroName: name, currentHeroCounters: counters, currentHeroCounteredBy, currentHeroId: id, currentHeroCombos: combos });
    });
  }

  /**
   * Reset the current state variables to de-focus a hero
   *
   * @return     {Void}
   */
  resetCurrentHero = () => {
    this.setState({ currentHeroName: null, currentHeroCounters: null, currentHeroCombos: null, currentHeroId: null });
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
    if (counterName === undefined) {
      return false;
    }

    let { counters } = find(this.state.heroes, { name: counterName });
    if (this.hasActiveHero() && counters !== undefined) {
      return includes(counters, this.state.currentHeroName);
    }
    return false;
  }

  getCurrentHero = () => {
    return find(this.state.heroes, { name: this.state.currentHeroName });
  }

  // @todo filter by role type
  render() {
    return (
      <>
        <div className="FlexboxContainer FlexboxContainer--row">
          {this.hasActiveHero() && (
            <div className="FlexboxContainer-sideColumn">
              <HeroMetadata hero={this.getCurrentHero()} handleReset={this.resetCurrentHero}/>
            </div>
          )}

          <div className="FlexboxContainer-mainColumn">
            {!this.state.loading && !this.hasActiveHero() && (
              <>
                <h1>Choose Your Hero</h1>
                {this.state.heroes.map((hero) =>
                  <Hero
                    key={hero.name}
                    hero={hero}
                    handleHeroClick={() => this.handleHeroClick(hero.name, hero.id)}
                    className={this.heroClassName(hero.name)}
                  />
                )}
              </>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHeroCounters && (
              <>
                <h2>Counters</h2>
                {this.state.currentHeroCounters.map((hero) =>
                  <p>{ hero }</p>
                )}
              </>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHeroCounteredBy && (
              <>
                <h2>Countered By</h2>
                {this.state.currentHeroCounteredBy.map((hero) =>
                  <p>{ hero }</p>
                )}
              </>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHeroCombos && (
              <>
                <h2>Combos</h2>
                {this.state.currentHeroCombos.map((combo) =>
                  <>
                    <h4>{ combo.name }</h4>
                    <p>{ combo.description }</p>
                    <p>Range: { combo.range }</p>
                    <p>Breakdown: { combo.breakdown }</p>
                    <p>Burst Damage: { combo.burstDamage }</p>
                  </>
                )}
              </>
            )}
          </div>
          {this.state.loading && "Loading..."}
        </div>
      </>
    );
  }
}

export default HeroGallery;
