import React from 'react';
import { Container, Header, Segment, Tab } from 'semantic-ui-react';
import NocSearch from './components/Search';


const panes = [
  {
    menuItem: 'Regular expression',
    render: () => <Tab.Pane attached={false}><NocSearch key='0' method="regex"></NocSearch></Tab.Pane>,
  },
  {
    menuItem: 'Fuzzy',
    render: () => <Tab.Pane attached={false}><NocSearch key='1' method="fuzzy"></NocSearch></Tab.Pane>,
  },
]

function App() {
  return (
    <Container>
      <Segment vertical>
        <Header as="h1">Occupation Explorers</Header>
      </Segment>
      <Segment vertical>
        <Tab renderActiveOnly={true} defaultActiveIndex={0} menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>
    </Container>
  );
}

export default App;
