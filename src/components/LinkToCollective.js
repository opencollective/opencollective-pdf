import React from 'react';
import PropTypes from 'prop-types';
import StyledLink from './StyledLink';

const LinkToCollective = ({ collective, children }) => (
  <StyledLink href={`https://opencollective.com/${collective.slug}`}>
    {children || collective.name || collective.slug}
  </StyledLink>
);

LinkToCollective.propTypes = {
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  children: PropTypes.node,
};

export default LinkToCollective;
