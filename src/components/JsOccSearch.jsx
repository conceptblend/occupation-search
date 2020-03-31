import React from "react";
import PropTypes from 'prop-types'
import * as JsSearch from 'js-search'
import OccupationSearch from './OccupationSearch'


const JsOccSearch = (props) => {
  if (props.source === undefined) throw new Error('JsSearch requires a "source"');

  const idxJsSearch = new JsSearch.Search('id')
  // default
  idxJsSearch.searchIndex = new JsSearch.TfIdfSearchIndex();

  // Search index capable of returning results matching a set of tokens
  // but without any meaningful rank or order.
  //idxJsSearch.searchIndex = new JsSearch.UnorderedSearchIndex();

  /** -------- */
  
  // default -- And the best
  idxJsSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();

  // this index strategy is built for all substrings matches.
  //idxJsSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

  // this index strategy is built for exact word matches.
  //idxJsSearch.indexStrategy = new JsSearch.ExactWordIndexStrategy();

  idxJsSearch.addIndex('nocTitle')
  idxJsSearch.addIndex('combinedExamples')
  //idxJsSearch.addIndex('examples')
  idxJsSearch.addDocuments(props.source)

  const queryFunc = (query) => {

    return idxJsSearch.search(query).map(result => {
      return {
        title: result.nocTitle,
        description: result.combinedExamples,
        meta: `Code ${result.nocCode} -- Level ${result.nocLevel}`,
        'data-matchtype': 'combined',
      }} // Mapping makes the consuming resultRender not dump all the props on the DOM
    )
  }
  return (
    <OccupationSearch key='js-search' queryFn={queryFunc} />
  );
};

JsOccSearch.propTypes = {
  source: PropTypes.array.isRequired,
}

export default JsOccSearch;