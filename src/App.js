import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Segment, Tab } from 'semantic-ui-react'

import { data as nocData } from './data/noc-reduced-ext.json'
import { data as naicsData } from './data/naics-reduced-ext.json'

const FuseSearch = React.lazy(() => import('./components/FuseSearch'));
const TextSearch = React.lazy(() => import('./components/TextSearch'));
const JsOccSearch = React.lazy(() => import('./components/JsOccSearch'));
//const LunrSearch = React.lazy(() => import('./components/LunrSearch'));


const extendedOccupations = [
  {
    "nocTitle": "Not working",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ";unemployed;disability;",
    "examples": ['unemployed', 'disability']
  },
  {
    "nocTitle": "Retired",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": "",
    "examples": []
  },
  {
    "nocTitle": "Student",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": "",
    "examples": []
  },
  {
    "nocTitle": "Homemaker",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ";stay at home;mom;dad;parent;",
    "examples": ['stay at home', 'mom', 'dad', 'parent']
  },
];
const nocSource = nocData.concat(extendedOccupations).map((entry, index) => {
  return {
    ...entry,
    id: index
  }
});

const naicsSource = naicsData.concat(extendedOccupations).map((entry, index) => {
  return {
    ...entry,
    id: index
  }
});


function App() {
  const SearchComponents = (props) => {
    return (
    <Suspense fallback={<div>Loading...</div>}>
        <Segment vertical>
          <Header as="h3">Text</Header>
          <TextSearch key={`${props.keyVal}-text`} source={props.source} />
        </Segment>
        <Segment vertical>
          <Header as="h3">Fuse</Header>
          <FuseSearch key={`${props.keyVal}-fuse`} source={props.source} />
        </Segment>
        <Segment vertical>
          <Header as="h3">JS Search</Header>
          <JsOccSearch key={`${props.keyVal}-js`} source={props.source} />
        </Segment>
        { /*
        <Header as="h3">Lunr</Header>
        <LunrSearch key={`${props.keyVal}-lunr`} source={props.source} />
        */ }
      </Suspense>
    )
  }
  SearchComponents.propTypes = {
    source: PropTypes.array.isRequired
  }
  
  const panes = [
    {
      menuItem: 'NOC',
      render: () => <Tab.Pane attached={false}><SearchComponents key='nocs' keyVal='nocs' source={nocSource} /></Tab.Pane>,
    },
    {
      menuItem: 'NAICS',
      render: () => <Tab.Pane attached={false}><SearchComponents key='naics' keyVal='naics' source={naicsSource}/></Tab.Pane>,
    },
  ]

  return (
    <Container style={{ marginBottom: '5rem'}}>
      <Segment vertical>
        <Header as="h1">Occupation Explorers</Header>
      </Segment>
      <Segment vertical>
        <Tab defaultActiveIndex={0} menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>
    </Container>
  );
}

export default App;
