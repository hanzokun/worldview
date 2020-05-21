import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withSearch } from '@elastic/react-search-ui';
import FilterChips from './filter-chips';
import ProductFacet from './product-facet';
import {
  toggleMobileFacets as toggleMobileFacetsAction,
  collapseFacet as collapseFacetAction,
} from '../../../../modules/product-picker/actions';
import facetConfig from '../../../../modules/product-picker/facetConfig';

function Facets(props) {
  const {
    isMobile,
    browser,
    facets,
    filters,
    removeFilter,
    results,
    showMobileFacets,
    toggleMobileFacets,
    collapsedFacets,
    toggleCollapseFacet,
  } = props;

  const showFacets = (browser.greaterThan.small && results.length) || showMobileFacets;

  return !showFacets ? null : (
    <div className="facet-container">

      <FilterChips
        filters={filters}
        removeFilter={removeFilter}
        facetConfig={facetConfig}
      />

      <div className="inner-container">
        {facetConfig.map((config) => {
          const facet = facets[config.field];
          const data = (facet && facet.length && facet[0].data) || [];

          return (
            <ProductFacet
              key={config.field}
              field={config.field}
              label={config.label}
              filterType={config.filterType}
              tooltip={config.tooltip}
              show={config.show}
              view={config.view}
              data={data}
              collapsed={collapsedFacets[config.field]}
              toggleCollapse={toggleCollapseFacet}
            />
          );
        })}
      </div>

      {isMobile && showMobileFacets && (
        <Button
          className="apply-facets"
          onClick={toggleMobileFacets}
        >
          Apply
        </Button>
      )}
    </div>
  );
}

Facets.propTypes = {
  browser: PropTypes.object,
  collapsedFacets: PropTypes.object,
  facets: PropTypes.object,
  filters: PropTypes.array,
  isMobile: PropTypes.bool,
  removeFilter: PropTypes.func,
  results: PropTypes.array,
  showMobileFacets: PropTypes.bool,
  toggleCollapseFacet: PropTypes.func,
  toggleMobileFacets: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  toggleMobileFacets: () => {
    dispatch(toggleMobileFacetsAction());
  },
  toggleCollapseFacet: (field) => {
    dispatch(collapseFacetAction(field));
  },
});

function mapStateToProps(state, ownProps) {
  const { browser, productPicker, date } = state;
  const { showMobileFacets, collapsedFacets } = productPicker;

  return {
    collapsedFacets,
    selectedDate: date.selected,
    isMobile: browser.lessThan.medium,
    showMobileFacets,
    browser,
  };
}
export default withSearch(
  ({
    facets, filters, removeFilter, results,
  }) => ({
    facets, filters, removeFilter, results,
  }),
)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Facets));
