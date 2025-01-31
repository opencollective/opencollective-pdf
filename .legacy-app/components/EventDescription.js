import React from 'react';
import PropTypes from 'prop-types';
import { TimeRange } from './TimeRange';
import { FormattedMessage } from 'react-intl';

export const EventDescription = ({ event }) => {
  return (
    <React.Fragment>
      <FormattedMessage defaultMessage='Registration for "{eventName}"' values={{ eventName: event.name }} />
      {'. '}

      {event.startsAt && (
        <React.Fragment>
          <FormattedMessage defaultMessage="Date:" />
          &nbsp;
          <TimeRange startsAt={event.startsAt} endsAt={event.endsAt} timezone={event.timezone} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

EventDescription.propTypes = {
  event: PropTypes.shape({
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
    timezone: PropTypes.string,
    name: PropTypes.string,
  }),
};
