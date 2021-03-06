import React, { useState } from "react";
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import lunr from 'lunr'
import * as JsSearch from 'js-search'
import { Search, Form, Card } from "semantic-ui-react";
import _ from 'lodash'
import { data as nocData } from '../data/noc-reduced-ext.json'
//import { data as nocData } from '../data/naics-reduced-ext.json'


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

let source = nocData.concat(extendedOccupations);
/**
 * Enhancement for LUNR only
 */
source = source.map((entry, index) => {
  return {
    ...entry,
    id: index
  }
});
/** END Enhancement */

/**
 * FUSE
 */
const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.2,
  location: 0,
  distance: 60,
  minMatchCharLength: 3,
  keys: [{
    name: "nocTitle",
    weight: .99,
  },{
    name: "examples",
    weight: 0.3,
  }]
};
const fuse = new Fuse(source, fuseOptions); // "source" is the item array
/** END FUSE */

/**
 * LUNR
 */
const idx = lunr(function () {
  this.field('nocTitle')
  this.field('combinedExamples')
  //this.ref('id')
  source.forEach(entry => this.add(entry))
});
/** END LUNR */

/**
 * JS SEARCH
 */
const idxJsSearch = new JsSearch.Search('id')
idxJsSearch.addIndex('nocTitle');
idxJsSearch.addIndex('combinedExamples');
idxJsSearch.addDocuments(source);
/** END JS SEARCH */

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
          //console.log(fuse.search(value));
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
        case 'lunr':
          //console.log(idx.search(value));
          
          setResults(
            _.map(
              idx.search(value).map(entry => {return source[entry.ref]}),
              result => {return {
                title: result.nocTitle,
                description: result.combinedExamples,
                meta: `Code ${result.nocCode} -- Level ${result.nocLevel}`,
              }} // Mapping makes the consuming resultRender not dump all the props on the DOM
            )
          )
          break;
          case 'js-search':
            //console.log(idxJsSearch.search(value));
            
            setResults(
              _.map(
                idxJsSearch.search(value),//.map(entry => {return source[entry.ref]})
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
  method: PropTypes.oneOf(['fuzzy', 'regex', 'lunr', 'js-search']),
}
NocSearch.defaultProps = {
  method: 'regex'
}

export default NocSearch;