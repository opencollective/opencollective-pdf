import React from 'react';
import { FormattedMessage } from 'react-intl';
import AccountName from './AccountName';
import { Link } from '@react-pdf/renderer';
import { Account } from 'server/graphql/types/v2/graphql';
import { GraphQLV1Collective } from 'server/graphql/types/custom-types';

import { get } from 'lodash-es';

/**
 * Returns event's parent collective slug. If the parent is not available,
 * fallback on `collective` slug which will result in a valid URL: parent
 * collective slug is only used to generate pretty URLs.
 */
const getEventParentCollectiveSlug = (event: Account | GraphQLV1Collective) => {
  const parentSlug =
    get(event, 'parentCollective.slug') || get(event, 'parentAccount.slug') || get(event, 'parent.slug');
  return parentSlug || 'collective';
};

const LinkToCollective = ({
  collective,
  children,
  ...props
}: {
  collective: Account | GraphQLV1Collective;
  children?: React.ReactNode;
} & React.ComponentProps<typeof Link>) => {
  const { type, slug } = collective;

  if (!collective) {
    return children || <FormattedMessage id="Sp8UUp" defaultMessage="Incognito" />;
  }

  return type !== 'EVENT' ? (
    <Link src={`https://opencollective.com/${slug}`} {...props}>
      {children || <AccountName account={collective} />}
    </Link>
  ) : (
    <Link src={`https://opencollective.com/${getEventParentCollectiveSlug(collective)}/events/${slug}`} {...props}>
      {children || <AccountName account={collective} />}
    </Link>
  );
};

export default LinkToCollective;
