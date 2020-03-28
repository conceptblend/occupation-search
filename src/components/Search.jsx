import React, { useState } from "react";
import PropTypes from 'prop-types'
import { Search, Form, Card } from "semantic-ui-react";
import _ from 'lodash'
import { data as nocData } from '../data/noc-reduced.json'


const resultRenderer = ({ title }) => [title && <div key='title'>{title}</div>];

resultRenderer.propTypes = {
  nocTitle: PropTypes.string,
  nocCombinedExamples: PropTypes.string,
}

const extendedOccupations = [
  {
    "nocTitle": "Not working",
    "nocLevel": "-1",
    "nocCode": "-1",
    "nocCombinedExamples": ";unemployed;disability;"
  },
  {
    "nocTitle": "Retired",
    "nocLevel": "-1",
    "nocCode": "-1",
    "nocCombinedExamples": ""
  },
  {
    "nocTitle": "Student",
    "nocLevel": "-1",
    "nocCode": "-1",
    "nocCombinedExamples": ""
  },
  {
    "nocTitle": "Homemaker",
    "nocLevel": "-1",
    "nocCode": "-1",
    "nocCombinedExamples": ";stay at home;mom;dad;parent;"
  },
];

const source = nocData.concat(extendedOccupations);

const NocSearch = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccuaption] = useState({});

  const resetState = () => {
    setIsLoading(false);
    setQuery('');
    setResults([]);
  }

  const handleResultSelect = (e, { result }) =>  {
    setQuery(''); //result.nocTitle
    setSelectedOccuaption(result);
  }

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setQuery(value);

    setTimeout(() => {
      if (value.length < 1) return resetState()
  
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => (re.test(result.nocTitle) || re.test(result.nocCombinedExamples))
      const resultSort = (resultA, resultB) => (resultA.nocTitle).localeCompare(resultB.nocTitle)

      setIsLoading(false)
      setResults(
        _.map(
          _.filter(source, isMatch).sort(resultSort),
          result => { return { title: result.nocTitle }} // Mapping makes the consuming resultRender not dump all the props on the DOM
        )
      )
    }, 300)
  }
  

  return (
    <>
    <Form>
      <Form.Field>
        <label>Type your job title and select the closest match</label>
        <Search
          fluid
          input={{ icon: 'search', iconPosition: 'left' }}
          loading={isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 500, {
            leading: true
          })}
          results={results}
          resultRenderer={resultRenderer}
          value={query}
          {...props}
        />
      </Form.Field>
    </Form>
    { selectedOccupation.nocTitle && 
      <Card
        fluid
        description={selectedOccupation.nocCombinedExamples}
        header={selectedOccupation.nocTitle}
        meta={`Code ${selectedOccupation.nocCode} -- Level ${selectedOccupation.nocLevel}`}
      />
    }
    </>
  );
};

export default NocSearch;