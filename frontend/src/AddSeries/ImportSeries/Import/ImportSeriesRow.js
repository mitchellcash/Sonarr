import React, { Component, PropTypes } from 'react';
import { inputTypes } from 'Helpers/Props';
import FormInputGroup from 'Components/Form/FormInputGroup';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import ImportSeriesSelectSeriesConnector from './SelectSeries/ImportSeriesSelectSeriesConnector';
import styles from './ImportSeriesRow.css';

class ImportSeriesRow extends Component {

  //
  // Lifecycle

  componentWillReceiveProps(nextProps) {
    const {
      name,
      selectedSeries,
      onSelectedChange
    } = this.props;

    const {
      selectedSeries: nextSelectedSeries,
      isExistingSeries: nextIsExistingSeries,
      isSelected: nextIsSelected
    } = nextProps;

    if (nextIsExistingSeries || !nextSelectedSeries) {
      onSelectedChange({ id: name, value: false });

      return;
    }

    if (nextSelectedSeries && nextSelectedSeries !== selectedSeries) {
      onSelectedChange({ id: name, value: true });

      return;
    }

    this.setState({ isSelected: nextIsSelected });
  }

  //
  // Render

  render() {
    const {
      name,
      monitor,
      qualityProfileId,
      seasonFolder,
      seriesType,
      selectedSeries,
      isExistingSeries,
      isSelected,
      onSelectedChange,
      onInputChange
    } = this.props;

    return (
      <TableRow>
        <TableSelectCell
          id={name}
          isSelected={isSelected}
          isDisabled={!selectedSeries || isExistingSeries}
          onSelectedChange={onSelectedChange}
        />

        <TableRowCell>
          {name}
        </TableRowCell>

        <TableRowCell className={styles.monitor}>
          <FormInputGroup
            type={inputTypes.MONITOR_EPISODES_SELECT}
            name="monitor"
            value={monitor}
            onChange={onInputChange}
          />
        </TableRowCell>

        <TableRowCell className={styles.qualityProfile}>
          <FormInputGroup
            type={inputTypes.QUALITY_PROFILE_SELECT}
            name="qualityProfileId"
            value={qualityProfileId}
            onChange={onInputChange}
          />
        </TableRowCell>

        <TableRowCell className={styles.seriesType}>
          <FormInputGroup
            type={inputTypes.SERIES_TYPE_SELECT}
            name="seriesType"
            value={seriesType}
            onChange={onInputChange}
          />
        </TableRowCell>

        <TableRowCell className={styles.seasonFolder}>
          <FormInputGroup
            type={inputTypes.CHECK}
            name="seasonFolder"
            value={seasonFolder}
            onChange={onInputChange}
          />
        </TableRowCell>

        <TableRowCell className={styles.series}>
          <ImportSeriesSelectSeriesConnector
            name={name}
            isExistingSeries={isExistingSeries}
          />
        </TableRowCell>
      </TableRow>
    );
  }
}

ImportSeriesRow.propTypes = {
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  monitor: PropTypes.string.isRequired,
  qualityProfileId: PropTypes.number.isRequired,
  seriesType: PropTypes.string.isRequired,
  seasonFolder: PropTypes.bool.isRequired,
  selectedSeries: PropTypes.object,
  isExistingSeries: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  queued: PropTypes.bool.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired
};

ImportSeriesRow.defaultsProps = {
  items: []
};

export default ImportSeriesRow;
