import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import NocSearch from './components/Search';

function App() {
  return (
    <Container>
      <Segment vertical>
        <Header as="h1">National Occupation Code Explorer</Header>
        <NocSearch></NocSearch>
      </Segment>
    </Container>
  );
}

export default App;
