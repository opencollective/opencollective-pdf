import React, { Fragment } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import dayjs from '../lib/dayjs';

const getIsSameDay = (startsAt, endsAt, timezone) => {
  if (!endsAt) {
    return true;
  }
  const tzStartsAt = dayjs.tz(new Date(startsAt), timezone);
  const tzEndsAt = dayjs.tz(new Date(endsAt), timezone);
  return tzStartsAt.isSame(tzEndsAt, 'day');
};

export const TimeRange = ({ startsAt, endsAt, timezone }) => {
  const isSameDay = getIsSameDay(startsAt, endsAt, timezone);
  return (
    <Fragment>
      <FormattedDate value={startsAt} weekday="long" day="numeric" month="long" year="numeric" timeZone={timezone} />
      , <FormattedTime value={startsAt} timeZone={timezone} />{' '}
      {endsAt && (
        <Fragment>
          -{' '}
          {!isSameDay && (
            <Fragment>
              <FormattedDate
                value={endsAt}
                weekday="long"
                day="numeric"
                month="long"
                year="numeric"
                timeZone={timezone}
              />
              ,{' '}
            </Fragment>
          )}
          <FormattedTime value={endsAt} timeZone={timezone} />{' '}
        </Fragment>
      )}
      (UTC{dayjs().tz(timezone).format('Z')})
    </Fragment>
  );
};
