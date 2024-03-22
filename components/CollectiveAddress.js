import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getCountryName } from '../lib/i18n';

/**
 * Pretty render a location (multiline)
 */
const CollectiveAddress = ({ collective, fallBackOnHostAddress }) => {
  const countryISO = get(collective, 'location.country');
  const country = countryISO && (getCountryName(countryISO) || countryISO);
  let address = get(collective, 'location.address');
  if (!address && fallBackOnHostAddress) {
    address = get(collective, 'host.location.address');
  }

  return (
    <React.Fragment>
      {address &&
        address.split('\n').map((addressPart, idx) => (
          <span key={idx}>
            {addressPart.trim()}
            <br />
          </span>
        ))}
      {country}
    </React.Fragment>
  );
};

CollectiveAddress.propTypes = {
  fallBackOnHostAddress: PropTypes.bool,
  collective: PropTypes.shape({
    host: PropTypes.object,
    location: PropTypes.shape({
      address: PropTypes.string,
      country: PropTypes.string,
    }),
  }),
};

export default CollectiveAddress;
