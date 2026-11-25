import React, { Fragment } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import dayjs from '../lib/dayjs.js';

type DateValue = string | number | Date;

type TimeRangeProps = {
  startsAt: DateValue;
  endsAt?: DateValue | null;
  timezone?: string | null;
};

const getIsSameDay = (startsAt: DateValue, endsAt: DateValue | null | undefined, timezone: string | undefined) => {
  if (!endsAt) {
    return true;
  }
  const tzStartsAt = dayjs.tz(new Date(startsAt), timezone);
  const tzEndsAt = dayjs.tz(new Date(endsAt), timezone);
  return tzStartsAt.isSame(tzEndsAt, 'day');
};

export const TimeRange = ({ startsAt, endsAt, timezone }: TimeRangeProps) => {
  if (timezone === null) {
    // Same error as the one previously thrown by dayjs/Intl for a null timezone
    throw new RangeError('Invalid time zone specified: null');
  }
  const isSameDay = getIsSameDay(startsAt, endsAt, timezone);
  return (
    <Fragment>
      <FormattedDate value={startsAt} weekday="long" day="numeric" month="long" year="numeric" timeZone={timezone} />,{' '}
      <FormattedTime value={startsAt} timeZone={timezone} />{' '}
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
