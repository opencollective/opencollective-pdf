import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Image, Box } from 'rebass/styled-components';
import CollectiveAddress from './CollectiveAddress';
import { imagePreview } from '../lib/utils';
import Container from '@opencollective/frontend-components/components/Container';
import StyledLink from '@opencollective/frontend-components/components/StyledLink';
import { P } from '@opencollective/frontend-components/components/Text';

const CollectiveFooter = ({ collective }) => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Container borderRight="1px solid" borderColor="black.400" pr={4} mr={4}>
        <StyledLink href={collective.website}>
          <Image
            css={{ maxWidth: 200, maxHeight: 100 }}
            src={imagePreview(collective.imageUrl ?? collective.image, null, { height: 200 })}
          />
        </StyledLink>
      </Container>
      <Box>
        <P fontWeight="bold" textAlign="center">
          {collective.name}
        </P>
        <P mt={2} fontSize="12px" textAlign="center" color="black.600">
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
    imageUrl: PropTypes.string,
    image: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
};

export default CollectiveFooter;
