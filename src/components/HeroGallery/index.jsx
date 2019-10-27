import React, { Component } from 'react';
import Hero from '../Hero';
import HeroMetadata from '../HeroMetadata';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import { find, includes, filter } from 'lodash';
import classNames from 'classnames';
import Airtable from 'airtable';
import './index.scss';

const airTableApiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBaseKey = process.env.REACT_APP_AIRTABLE_BASE_KEY;

// @todo
// weapon + skill -> damage, rof, reload time
// Reference: https://www.esportstales.com/overwatch/hero-counter-list

class HeroGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
      loading: true,
      currentHero: undefined,

      currentHeroName: null,
      currentHeroCounters: null,
      currentHeroCounteredBy: null,
      currentHeroId: null,
      currentHeroCombos: null,
    }
  }

  componentDidMount = () => {
    let heroes = [];
    this.airtableBase = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseKey);

    this.airtableBase("Heroes").select({ view: "Grid view" }).firstPage((error, records) => {
      records.forEach(record => {
        let currentRecordFields = record.fields;
        currentRecordFields['id'] = record.id;
        heroes.push(currentRecordFields);
      });

      this.setState({ loading: false, heroes });
    });
  }

  handleHeroClick = (id) => {
    this.setState({ loading: false }, () => {
      let currentHero = find(this.state.heroes, { id });

      // Given the current list of heroes
      // filter out heroes where their array of counters
      // doesn't include the currently selected hero
      // Then map the result into a collection of names
      let counteredBy = filter(this.state.heroes, (hero) => {
        return includes(hero.counters, id);
      });

      let counters = filter(this.state.heroes, (hero) => {
        return includes(currentHero.counters, hero.id);
      });

      currentHero.counteredBy = counteredBy;
      currentHero.counters = counters;
      this.setState({ currentHero });

      // @todo Request to Airtable for given Heroes:
      // 2. Weapon & Skill stats
      // this.airtableBase("Combos").select({ view: "Grid view" }).eachPage((records, fetchNextPage) => {
      //   let combos = filter(records, (record) => includes(record.fields.HeroReference, id)).map(record => record.fields);

      //   this.setState({ currentHeroName: name, currentHeroCounters: counters, currentHeroCounteredBy, currentHeroId: id, currentHeroCombos: combos, loading: false });
      // });
    });
  }

  /**
   * Reset the current state variables to de-focus a hero
   *
   * @return     {Void}
   */
  resetCurrentHero = () => {
    this.setState({ currentHero: undefined });
  }

  hasActiveHero = () => {
    return this.state.currentHero !== undefined;
  }

  // @todo filter by role type
  render() {

    const sideColumnClasses = classNames("FlexboxContainer-sideColumn Sidebar",
      { 'Sidebar--active': this.hasActiveHero() }
    );
    return (
      <>
        <div className="FlexboxContainer FlexboxContainer--row">
          <div className={sideColumnClasses}>
            {this.hasActiveHero() && (
              <HeroMetadata hero={this.state.currentHero} handleReset={this.resetCurrentHero}/>
            )}
          </div>

          <div className="FlexboxContainer-mainColumn u-margin-20-30">
            {!this.state.loading && !this.hasActiveHero() && (
              <>
                <div className="HeroGallery-header">
                  <h1 className="HeroGallery-header-title">Choose Your Hero</h1>
                </div>
                {this.state.heroes.map((hero) =>
                  <Hero
                    key={hero.name}
                    hero={hero}
                    handleHeroClick={() => this.handleHeroClick(hero.id)}
                  />
                )}
              </>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHero.counters && (
              <div className="HeroGallery-counters">
                <h2>Counters</h2>
                {this.state.currentHero.counters.map((hero) =>
                  <Hero
                    key={hero.name}
                    hero={hero}
                    handleHeroClick={() => this.handleHeroClick(hero.id)}
                  />
                )}
              </div>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHero.counteredBy && (
              <div className="HeroGallery-counteredBy">
                <h2>Countered By</h2>
                {this.state.currentHero.counteredBy.map((hero) =>
                  <Hero
                    key={hero.name}
                    hero={hero}
                    handleHeroClick={() => this.handleHeroClick(hero.id)}
                  />
                )}
              </div>
            )}

            {!this.state.loading && this.hasActiveHero() && this.state.currentHeroCombos && (
              <>
                <h2>Combos</h2>
                {this.state.currentHeroCombos.map((combo) =>
                  <div className="HeroGallery-combos">
                    <h4>{ combo.name }</h4>
                    <p>{ combo.description }</p>
                    <p>Range: { combo.range }</p>
                    <p>Breakdown: { combo.breakdown }</p>
                    <p>Burst Damage: { combo.burstDamage }</p>
                  </div>
                )}
              </>
            )}
            {this.state.loading && <Loader type="Oval" color="#f0edf2" className="Loader" height={150} width={150} />}
            <p>All trademarks referenced herein are the properties of their respective owners. Styling inspired by overwatch.com. All relevant branding colors and CSS attributes properties of their respective owners.</p>
          </div>
        </div>
      </>
    );
  }
}

export default HeroGallery;
