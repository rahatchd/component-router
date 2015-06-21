import React from 'react';
import {Url, InFlux, getDefault} from './InFlux';


const First = React.createClass({
  render() {
    return <div style={{background: 'rgba(255, 0, 0, 0.3)', minHeight: 100}}>First</div>;
  }
});


const Second = React.createClass({
  render() {
    return <div style={{background: 'rgba(0, 255, 0, 0.3)', minHeight: 100}}>Second</div>;
  }
});


const DynamicList = React.createClass({
  propTypes: {
    inFlux: React.PropTypes.object
  },


  render() {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const {namespace, value} = this.props.inFlux;

    const isActive = id => <b>{id === parseInt(value, 10) ? '(Active)' : ''}</b>;

    const item = id => (
      <p key={id}>
        <Url partial={{[namespace]: id}}>{id} {isActive(id)}</Url>
      </p>
    );

    return (
      <div>
        {values.map(item)}
      </div>
    );
  }
});


const inFluxConfig = {
  block1: {
    [getDefault()]: First,
    First: First,
    Second: Second
  },
  block2: {
    X: First,
    Y: Second
  },
  block3: {
    Hello: First,
    World: Second
  },
  list: DynamicList
};


const Tabs = React.createClass({
  propTypes: {
    tabs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    namespace: React.PropTypes.string.isRequired
  },


  render() {
    const {tabs, namespace} = this.props;
    const props = Object.assign({}, this.props);
    delete props.tabs;
    return (
      <ul {...props}>
        {tabs.map(tab => (
          <li key={tab}>
            <Url partial={{[namespace]: tab}}>{tab}</Url>
          </li>
        ))}
      </ul>
    );
  }
});


const Block = React.createClass({
  propTypes: {
    inFlux: React.PropTypes.object
  },


  render() {
    const {keys, namespace, Component} = this.props.inFlux;
    return (
      <div style={{background: 'rgba(0, 0, 0, 0.1)', minHeight: 100}}>
        <Tabs tabs={keys} namespace={namespace} />
        <Component />
      </div>
    );
  }
});


const App = React.createClass({
  render() {
    return (
      <div>
        <h1>In Flux</h1>
        <InFlux config={inFluxConfig} namespace="block1">
          <Block />
        </InFlux>
        <InFlux config={inFluxConfig} namespace="block2">
          <Block />
        </InFlux>
        <InFlux config={inFluxConfig} namespace="block3">
          <Block />
        </InFlux>

        <h2>Dynamic list example</h2>
        <InFlux config={inFluxConfig} namespace="list" />

        <h2>Links examples</h2>
        <p>
          <Url href="/test">
            {`<Url href="/test">`}
          </Url>
        </p>
        <p>
          <Url href="/">
            {`<Url href="/">`}
          </Url>
        </p>
        <p>
          <Url query={{x: 1}}>
            {`<Url query={{x: 1}}>`}
          </Url>
        </p>
        <p>
          <Url partial={{y: 2}}>
            {`<Url partial={{y: 2}}>`}
          </Url>
        </p>
        <p>
          <Url query={{x: 1}} partial={{y: 2}}>
            {`<Url query={{x: 1}} partial={{y: 2}}>`}
          </Url>
        </p>
        <p>
          <Url pathname="/test" query={{x: 1}}>
            {'<Url pathname="/test" query={{x: 1}}>'}
          </Url>
        </p>
        <p>
          <Url pathname="/test" partial={{y: 2}}>
            {`<Url pathname="/test" partial={{y: 2}}>`}
          </Url>
        </p>
        <p>
          <Url pathname="/test" query={{x: 1}} partial={{y: 2}}>
            {`<Url pathname="/test" query={{x: 1}} partial={{y: 2}}>`}
          </Url>
        </p>
        <p>
          <Url pathname="/test" query={{x: 1}} partial={{y: 100}}>
            {`<Url pathname="/test" query={{x: 1}} partial={{y: 100}}>`}
          </Url>
        </p>
      </div>
    );
  }
});


React.render(<App />, document.body);
