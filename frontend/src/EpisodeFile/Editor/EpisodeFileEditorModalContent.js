import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { kinds } from 'Helpers/Props';
import Button from 'Components/Button';
import SpinnerButton from 'Components/SpinnerButton';
import SelectInput from 'Components/Form/SelectInput';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import EpisodeFileEditorRow from './EpisodeFileEditorRow';
import styles from './EpisodeFileEditorModalContent.css';

const headers = [
  {
    name: 'episodeNumber',
    label: 'Episode',
    sortable: true
  },
  {
    name: 'relativePath',
    label: 'Relative Path'
  },
  {
    name: 'airDateUtc',
    label: 'Air Date',
    sortable: true
  },
  {
    name: 'quality',
    label: 'Quality'
  }
];

class EpisodeFileEditorModalContent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.onSelectAllChange({ value: false });
    }
  }

  //
  // Control

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState);
  }

  //
  // Listeners

  onSelectAllChange = ({ value }) => {
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, id, value, shiftKey);
    });
  }

  onDeletePress = () => {
    this.props.onDeletePress(this.getSelectedIds());
  }

  onQualityChange = ({ value }) => {
    if (value === 'selectQuality') {
      return;
    }

    this.props.onQualityChange(this.getSelectedIds(), parseInt(value));
  }

  //
  // Render

  render() {
    const {
      deleting,
      saving,
      items,
      qualities,
      seriesType,
      onModalClose
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState
    } = this.state;

    const qualityOptions = _.reduceRight(qualities, (acc, quality) => {
      acc.push({
        [quality.id]: quality.name
      });

      return acc;
    }, [{ 'selectQuality': 'Select Quality' }]);

    return (
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          Manage Episodes
        </ModalHeader>

        <ModalBody>
          {
            !items.length &&
              <div>
                No episode files to manage.
              </div>
          }

          {
            !!items.length &&
              <Table
                headers={headers}
                selectAll={true}
                allSelected={allSelected}
                allUnselected={allUnselected}
                // {...otherProps}
                onSelectAllChange={this.onSelectAllChange}
              >
                <TableBody>
                  {
                    items.map((item) => {
                      return (
                        <EpisodeFileEditorRow
                          key={item.id}
                          seriesType={seriesType}
                          isSelected={selectedState[item.episodeFileId]}
                          {...item}
                          onSelectedChange={this.onSelectedChange}
                        />
                      );
                    })
                  }
                </TableBody>
              </Table>
          }
        </ModalBody>

        <ModalFooter>
          <span className={styles.qualitySelectContainer}>
            <SelectInput
              name="quality"
              value="selectQuality"
              values={qualityOptions}
              onChange={this.onQualityChange}
            />
          </span>

          <SpinnerButton
            kind={kinds.DANGER}
            isSpinning={deleting}
            onPress={this.onDeletePress}
          >
            Delete
          </SpinnerButton>

          <Button
            onPress={onModalClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  }
}

EpisodeFileEditorModalContent.propTypes = {
  deleting: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  qualities: PropTypes.arrayOf(PropTypes.object).isRequired,
  seriesType: PropTypes.string.isRequired,
  onDeletePress: PropTypes.func.isRequired,
  onQualityChange: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EpisodeFileEditorModalContent;
