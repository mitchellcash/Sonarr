import React, { Component, PropTypes } from 'react';
import LoadingIndicator from 'Components/LoadingIndicator';
import * as calendarViews from './calendarViews';
import CalendarHeaderConnector from './Header/CalendarHeaderConnector';
import DaysOfWeekConnector from './Day/DaysOfWeekConnector';
import CalendarDaysConnector from './Day/CalendarDaysConnector';
import AgendaConnector from './Agenda/AgendaConnector';

class Calendar extends Component {

  //
  // Render

  render() {
    const {
      fetching,
      populated,
      error,
      view
    } = this.props;

    return (
      <div>
        {
          fetching && !populated &&
            <LoadingIndicator />
        }

        {
          !fetching && !!error &&
            <div>Unable to load the calendar</div>
        }

        {
          !error && populated &&
            <div>
              {
                view === calendarViews.AGENDA ?
                  <div>
                    <CalendarHeaderConnector />
                    <AgendaConnector />
                  </div> :

                  <div>
                    <CalendarHeaderConnector />
                    <DaysOfWeekConnector />
                    <CalendarDaysConnector />
                  </div>
              }

            </div>
        }
      </div>
    );
  }
}

Calendar.propTypes = {
  fetching: PropTypes.bool.isRequired,
  populated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  view: PropTypes.string.isRequired
};

export default Calendar;
