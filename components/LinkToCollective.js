import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import AccountName from './AccountName';
import StyledLink from '@opencollective/frontend-components/components/StyledLink';

/**
 * Returns event's parent collective slug. If the parent is not available,
 * fallback on `collective` slug which will result in a valid URL: parent
 * collective slug is only used to generate pretty URLs.
 */
const getEventParentCollectiveSlug = (parentCollective) => {
  return parentCollective && parentCollective.slug ? parentCollective.slug : 'collective';
};

const LinkToCollective = ({ collective, children }) => {
  const { type, slug, parentCollective } = collective;

  if (!collective) {
    return children || <FormattedMessage id="profile.incognito" defaultMessage="Incognito" />;
  }

  return type !== 'EVENT' ? (
    <StyledLink href={`https://opencollective.com/${slug}`}>
      {children || <AccountName account={collective} />}
    </StyledLink>
  ) : (
    <StyledLink href={`https://opencollective.com/${getEventParentCollectiveSlug(parentCollective)}/events/${slug}`}>
      {children || <AccountName account={collective} />}
    </StyledLink>
  );
};

LinkToCollective.propTypes = {
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string,
    parentCollective: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
  children: PropTypes.node,
};

export default LinkToCollective;
