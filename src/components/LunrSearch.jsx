import React from "react";
import PropTypes from 'prop-types'
import _ from 'lodash'
import lunr from 'lunr'
import OccupationSearch from './OccupationSearch'

const LunrSearch = (props) => {
  if (props.source === undefined) throw new Error('LunrSearch requires a "source"');

  const _source = props.source

  const lunrIdx = lunr(function () {
    this.field('nocTitle')
    this.field('combinedExamples')
    this.ref('id')
    _source.forEach(entry => this.add(entry))
  });

  const queryFunc = (query) => {
    return _.map(
      lunrIdx.search(query).map(entry => {return _source[entry.ref]}),
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

LunrSearch.propTypes = {
  source: PropTypes.array.isRequired,
}

export default LunrSearch;