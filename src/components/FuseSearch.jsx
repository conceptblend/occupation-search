import React from "react";
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import OccupationSearch from './OccupationSearch'


const FuseSearch = (props) => {
  if (props.source === undefined) throw new Error('FuseSearch requires a "source"');

  const fuse = new Fuse(
    props.source, // "source" is the item array
    {
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
    }
  );

  const queryFunc = (query) => {
    return fuse.search(query).map(
      result => {
        return {
          title: result.item.nocTitle,
          description: result.item.combinedExamples,
          meta: `Code ${result.item.nocCode} -- Level ${result.item.nocLevel}`,
        } // Mapping makes the consuming resultRender not dump all the props on the DOM
      }
    )
  }
  return (
    <OccupationSearch key='fuse' queryFn={queryFunc} />
  );
};

FuseSearch.propTypes = {
  source: PropTypes.array.isRequired,
}

export default FuseSearch;