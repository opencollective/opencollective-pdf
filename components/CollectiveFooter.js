import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Image, Box } from 'rebass/styled-components';
import Container from '@bit/opencollective.design-system.components.styled-container';
import StyledLink from '@bit/opencollective.design-system.components.styled-link';
import CollectiveAddress from './CollectiveAddress';
import { P } from '@bit/opencollective.design-system.components.styled-text';
import { imagePreview } from '../lib/utils';

const CollectiveFooter = ({ collective }) => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Container borderRight="1px solid" borderColor="black.400" pr={4} mr={4}>
        <StyledLink href={collective.website}>
          <Image css={{ maxWidth: 200, maxHeight: 100 }} src={imagePreview(collective.image, null, { height: 200 })} />
        </StyledLink>
      </Container>
      <Box>
        <P fontWeight="bold" textAlign="center">
          {collective.name}
        </P>
        <P mt={2} textAlign="center" color="black.600">
          <CollectiveAddress collective={collective} />
        </P>
      </Box>
    </Flex>
  );
};

CollectiveFooter.propTypes = {
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
};

export default CollectiveFooter;
