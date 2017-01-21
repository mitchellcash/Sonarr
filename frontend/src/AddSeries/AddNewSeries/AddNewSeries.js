import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import TextInput from 'Components/Form/TextInput';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import AddNewSeriesSearchResultConnector from './AddNewSeriesSearchResultConnector';
import styles from './AddNewSeries.css';

class AddNewSeries extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._seriesLookupTimeout = null;

    this.state = {
      term: ''
    };
  }

  // Don't reset the search input after adding a new series,
  // the search result will become a link to the new series

  // componentWillReceiveProps(nextProps) {
  //   const addedSuccessfully = this.props.adding && !nextProps.adding && !nextProps.error;
  //
  //   if (addedSuccessfully && this.props.items.length === 1) {
  //     this.setState({ term: '' });
  //     this.props.onClearSeriesLookup();
  //   }
  // }

  //
  // Listeners

  onSearchInputChange = ({ value }) => {
    if (this._seriesLookupTimeout) {
      clearTimeout(this._seriesLookupTimeout);
    }

    this.setState({ term: value }, () => {
      this._seriesLookupTimeout = setTimeout(() => {
        if (value && value.length > 2) {
          this.props.onSeriesLookupChange(value);
        }
      }, 200);
    });
  }

  onClearSeriesLookupPress = () => {
    this.setState({ term: '' });
    this.props.onClearSeriesLookup();
  }

  //
  // Render

  render() {
    const {
      fetching,
      error,
      items
    } = this.props;

    const term = this.state.term;

    return (
      <PageContent title="Add New Series">
        <PageContentBody>
          <div className={styles.searchContainer}>
            <div className={styles.searchIconContainer}>
              <Icon
                name={icons.SEARCH}
                size={20}
              />
            </div>

            <TextInput
              className={styles.searchInput}
              name="seriesLookup"
              value={term}
              placeholder="eg. Breaking Bad, tvdb:####"
              onChange={this.onSearchInputChange}
            />

            <Button
              className={styles.clearLookupButton}
              onPress={this.onClearSeriesLookupPress}
            >
              <Icon
                name={icons.REMOVE}
                size={20}
              />
            </Button>
          </div>

          {
            fetching &&
              <LoadingIndicator />
          }

          {
            !fetching && !!error &&
              <div>Failed to load search results, please try again.</div>
          }

          {
            !fetching && !!items.length &&
              <div className={styles.searchResults}>
                {
                  items.map((item) => {
                    return (
                      <AddNewSeriesSearchResultConnector
                        key={item.tvdbId}
                        {...item}
                      />
                    );
                  })
                }
              </div>
          }

          {
            !fetching && !items.length && !!term &&
              <div className={styles.message}>
                <div className={styles.noResults}>Couldn't find any results for '{term}'</div>
                <div>You can also search using TVDB ID of a show. eg. tvdb:71663</div>
              </div>
          }

          {
            !term &&
              <div className={styles.message}>
                <div className={styles.helpText}>It's easy to add a new series, just start typing the name the series you want to add.</div>
                <div>You can also search using TVDB ID of a show. eg. tvdb:71663</div>
              </div>
          }

          <div>

          </div>
        </PageContentBody>
      </PageContent>
    );
  }
}

AddNewSeries.propTypes = {
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  adding: PropTypes.bool.isRequired,
  addError: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSeriesLookupChange: PropTypes.func.isRequired,
  onClearSeriesLookup: PropTypes.func.isRequired
};

export default AddNewSeries;
