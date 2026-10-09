import React from 'react';
import { get } from 'lodash-es';
import { getCountryName } from '../../server/lib/i18n.js';
import { GraphQLV1Collective } from '../../server/graphql/types/custom-types.js';
import { Account } from '../../server/graphql/types/v2/graphql.js';
import { Text } from '@react-pdf/renderer';

/**
 * Pretty render a location (multiline)
 */
const LocationParagraph = ({
  collective,
  fallBackOnHostAddress,
}: {
  collective: Account | GraphQLV1Collective;
  fallBackOnHostAddress?: boolean;
}) => {
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
          <Text key={idx}>
            {addressPart.trim()}
            <br />
          </Text>
        ))}
      <Text>{country}</Text>
    </React.Fragment>
  );
};

export default LocationParagraph;
