import React from 'react';
import PropTypes from 'prop-types';
import StyledLink from '@bit/opencollective.design-system.components.styled-link';
import { FormattedMessage } from 'react-intl';

/**
 * Returns event's parent collective slug. If the parent is not available,
 * fallback on `collective` slug which will result in a valid URL: parent
 * collective slug is only used to generate pretty URLs.
 */
const getEventParentCollectiveSlug = (parentCollective) => {
  return parentCollective && parentCollective.slug ? parentCollective.slug : 'collective';
};

const LinkToCollective = ({ collective, children }) => {
  const { type, name, slug, parentCollective } = collective;

  if (!collective) {
    return children || <FormattedMessage id="profile.incognito" defaultMessage="Incognito" />;
  }

  return type !== 'EVENT' ? (
    <StyledLink href={`https://opencollective.com/${slug}`}>{children || name || slug}</StyledLink>
  ) : (
    <StyledLink href={`https://opencollective.com/${getEventParentCollectiveSlug(parentCollective)}/events/${slug}`}>
      {children || name || slug}
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
