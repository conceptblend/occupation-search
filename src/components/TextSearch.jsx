import React from "react";
import PropTypes from 'prop-types'
import _ from 'lodash'
import OccupationSearch from './OccupationSearch'

const TextSearch = (props) => {
  if (props.source === undefined) throw new Error('TextSearch requires a "source"');

  const _source = props.source;
  
  
  const resultSort = (resultA, resultB) => (resultA.nocTitle).localeCompare(resultB.nocTitle)

  const queryFunc = (query) => {
    const re = new RegExp(_.escapeRegExp(query), 'i')
    const isMatch = (result) => (re.test(result.nocTitle) || re.test(result.combinedExamples))

    return _.map(
      _.filter(_source, isMatch).sort(resultSort),
      result => {return {
        title: result.nocTitle,
        description: result.combinedExamples,
        meta: `Code ${result.nocCode} -- Level ${result.nocLevel}`,
      }} // Mapping makes the consuming resultRender not dump all the props on the DOM
    )
  }
  return (
    <OccupationSearch key='lunr' queryFn={queryFunc} />
  );
};

TextSearch.propTypes = {
  source: PropTypes.array.isRequired,
}

export default TextSearch;