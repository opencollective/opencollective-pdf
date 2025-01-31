import { FormattedDateParts } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

const CustomIntlDate = ({ date }) => {
  return (
    <FormattedDateParts value={date} day="2-digit" month="2-digit" year="numeric">
      {(parts) => <>{`${parts[4].value}-${parts[0].value}-${parts[2].value}`}</>}
    </FormattedDateParts>
  );
};

CustomIntlDate.propTypes = {
  date: PropTypes.object.isRequired,
};

export default CustomIntlDate;
