import PropTypes from 'prop-types';
import React from 'react';
import { H1 } from '@bit/opencollective.design-system.components.styled-text';
import Container from '@bit/opencollective.design-system.components.styled-container';

class TransactionReceipt extends React.Component {
  static getInitialProps(ctx) {
    return { collectiveSlug: ctx.query.collectiveSlug };
  }

  render() {
    return (
      <Container border="1px solid black" p={3} borderRadius={8} m={3}>
        <H1>
          This URL has been deprecated. Please go to{' '}
          <a href={`https://opencollective.com/${this.props.collectiveSlug}/transactions`}>
            https://opencollective.com/{this.props.collectiveSlug}/transactions
          </a>{' '}
          instead to download your receipt.
        </H1>
      </Container>
    );
  }
}

TransactionReceipt.propTypes = {
  collectiveSlug: PropTypes.string.isRequired,
};

export default TransactionReceipt;
