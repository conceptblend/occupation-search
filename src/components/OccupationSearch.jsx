import React, { useState } from "react";
import PropTypes from 'prop-types'
import { Search, Form, Card } from "semantic-ui-react";
import _ from 'lodash'


const resultRenderer = ({ title }) => [title && <div key='title'>{title}</div>];

resultRenderer.propTypes = {
  title: PropTypes.string,
}


const OccupationSearch = (props) => {
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
      setIsLoading(false)
      setResults(props.queryFn(value))
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

OccupationSearch.propTypes = {
  queryFn: PropTypes.func.isRequired,
}
OccupationSearch.defaultProps = {}

export default OccupationSearch;