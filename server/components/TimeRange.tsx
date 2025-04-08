import React, { Fragment } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import dayjs from '../lib/dayjs';

const FormattedDateProps = (value, timeZone) => ({
  value,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone,
});

const FormattedTimeProps = (value, timeZone) => ({
  value,
  timeZone,
});

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
      <FormattedDate {...FormattedDateProps(startsAt, timezone)} />
      , <FormattedTime {...FormattedTimeProps(startsAt, timezone)} />{' '}
      {endsAt && (
        <Fragment>
          -{' '}
          {!isSameDay && (
            <Fragment>
              <FormattedDate {...FormattedDateProps(endsAt, timezone)} />,{' '}
            </Fragment>
          )}
          <FormattedTime {...FormattedTimeProps(endsAt, timezone)} />{' '}
        </Fragment>
      )}
      (UTC{dayjs().tz(timezone).format('Z')})
    </Fragment>
  );
};
