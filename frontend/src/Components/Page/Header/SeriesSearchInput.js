import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { routerShape, withRouter } from 'react-router';
import Autosuggest from 'react-autosuggest';
import { icons } from 'Helpers/Props';
import Icon from 'Components/Icon';
import styles from './SeriesSearchInput.css';

class SeriesSearchInput extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      suggestions: []
    };
  }

  //
  // Control

  getSuggestionValue({ title }) {
    return title;
  }

  renderSuggestion({ title }, { query }) {
    const index = title.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) {
      return (
        <span>
          {title}
        </span>
      );
    }

    const preMatch = title.substr(0, index);
    const match = title.substr(index, query.length);
    const postMatch = title.substr(index + query.length);

    return (
      <span>
        {preMatch}
        <span className={styles.match}>
          {match}
        </span>
        {postMatch}
      </span>
    );
  }

  goToSeries(series) {
    this.setState({ value: '' });
    this.props.router.push(`${window.Sonarr.UrlBase}/series/${series.titleSlug}`);
  }

  reset() {
    this.setState({
      value: '',
      suggestions: []
    });
  }

  //
  // Listeners

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  }

  onKeyDown = (event) => {
    // TODO: Select the first series

    if (event.key === 'Tab') {
      event.preventDefault();
      const series = this.state.suggestions[0];

      this.goToSeries(series);
    }
  }

  onBlur = () => {
    this.reset();
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = _.filter(this.props.series, (series) => {
      return series.title.toLowerCase().contains(value.toLowerCase());
    });

    this.setState({ suggestions });
  }

  onSuggestionsClearRequested = () => {
    this.reset();
  }

  onSuggestionSelected = (event, { suggestion }) => {
    this.goToSeries(suggestion);
  }

  //
  // Render

  render() {
    const {
      value,
      suggestions
    } = this.state;

    const inputProps = {
      className: styles.input,
      name: 'seriesSearch',
      value,
      placeholder: 'Search',
      autoComplete: 'off',
      spellCheck: false,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onBlur: this.onBlur,
      onFocus: this.onFocus
    };

    const theme = {
      container: styles.container,
      containerOpen: styles.containerOpen,
      suggestionsContainer: styles.container,
      suggestionsList: styles.list,
      suggestion: styles.listItem,
      suggestionFocused: styles.focused
    };

    return (
      <div className={styles.wrapper}>
        <Icon
          className={styles.icon}
          name={icons.SEARCH}
        />

        <Autosuggest
          id={name}
          inputProps={inputProps}
          theme={theme}
          suggestions={suggestions}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        />
      </div>
    );
  }
}

SeriesSearchInput.propTypes = {
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  router: routerShape.isRequired
};

export default withRouter(SeriesSearchInput);
