import React, { useState } from "react";
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import { Search, Form, Card } from "semantic-ui-react";
import _ from 'lodash'
//import { data as nocData } from '../data/noc-reduced.json'
import { data as nocData } from '../data/naics-reduced.json'

const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.4,
  location: 0,
  distance: 1000,
  minMatchCharLength: 2,
  keys: [
    "nocTitle",
    "combinedExamples"
  ]
};


const resultRenderer = ({ title }) => [title && <div key='title'>{title}</div>];

resultRenderer.propTypes = {
  title: PropTypes.string,
}

const extendedOccupations = [
  {
    "nocTitle": "Not working",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ";unemployed;disability;"
  },
  {
    "nocTitle": "Retired",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ""
  },
  {
    "nocTitle": "Student",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ""
  },
  {
    "nocTitle": "Homemaker",
    "nocLevel": "-1",
    "nocCode": "-1",
    "combinedExamples": ";stay at home;mom;dad;parent;"
  },
];

const source = nocData.concat(extendedOccupations);
const fuse = new Fuse(source, fuseOptions); // "source" is the item array


const NocSearch = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState({});

  const resetState = () => {
    setIsLoading(false);
    setQuery('');
    setResults([]);
  }

  const handleResultSelect = (e, { result }) =>  {
    setQuery(''); //result.nocTitle
    setSelectedOccupation(result);
  }

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setQuery(value);

    setTimeout(() => {
      if (value.length < 1) return resetState()
  
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => (re.test(result.nocTitle) || re.test(result.combinedExamples))
      const resultSort = (resultA, resultB) => (resultA.nocTitle).localeCompare(resultB.nocTitle)

      setIsLoading(false)

      switch (props.method) {
        case 'fuzzy':
          setResults(
            _.map(
              fuse.search(value),
              result => {return {
                title: result.item.nocTitle,
                description: result.item.combinedExamples,
                meta: `Code ${result.item.nocCode} -- Level ${result.item.nocLevel}`,
              }} // Mapping makes the consuming resultRender not dump all the props on the DOM
            )
          )
          break;
        case 'regex':
          setResults(
            _.map(
              _.filter(source, isMatch).sort(resultSort),
              result => {return {
                title: result.nocTitle,
                description: result.combinedExamples,
                meta: `Code ${result.nocCode} -- Level ${result.nocLevel}`,
              }} // Mapping makes the consuming resultRender not dump all the props on the DOM
            )
          )
          break;
        default:
      }


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
    { selectedOccupation.title && 
      <Card
        fluid
        description={selectedOccupation.description}
        header={selectedOccupation.title}
        meta={selectedOccupation.meta}
      />
    }
    </>
  );
};

NocSearch.propTypes = {
  method: PropTypes.oneOf(['fuzzy', 'regex']),
}
NocSearch.defaultProps = {
  method: 'regex'
}

export default NocSearch;