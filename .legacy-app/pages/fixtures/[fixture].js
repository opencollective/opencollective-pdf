import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { chunk } from 'lodash';
import PageFormat from '../../lib/constants/page-format';
import { Receipt } from '../../components/Receipt';
import PDFLayout from '../../components/PDFLayout';
import { Box, Flex } from '../../components/styled-components/Grid';
import PrintableGiftCard from '../../components/PrintableGiftCard';

const FIXTURES = {
  'contribution-receipt': require('../../lib/fixtures/contribution-receipt.json'),
  'gift-cards': require('../../lib/fixtures/gift-cards.json'),
};

class FixturePage extends React.Component {
  static async getInitialProps({ req, query }) {
    const isServer = Boolean(req);
    if (isServer) {
      const { name } = path.parse(query.fixture);
      const data = FIXTURES[name];
      if (!data) {
        throw new Error("This fixture doesn't exist");
      }
      return { name, data, pageFormat: query.pageFormat };
    }

    return { name, pageFormat: query.pageFormat };
  }

  render() {
    const { name, data, pageFormat } = this.props;
    return (
      <PDFLayout pageFormat={pageFormat}>
        {name === 'gift-cards' ? (
          <Box>
            {chunk(data.cards, 8).map((paginatedCards, idx) => (
              <Box key={idx} py={5}>
                <Flex flexWrap="wrap" justifyContent="center">
                  {paginatedCards.map((c) => (
                    <Box key={c.uuid} m="22.25px">
                      <PrintableGiftCard
                        amount={c.initialBalance}
                        currency={c.currency}
                        code={c.uuid.split('-')[0]}
                        expiryDate={c.expiryDate}
                        description={c.description}
                        withQRCode
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            ))}
          </Box>
        ) : (
          <Receipt
            receipt={{
              currency: data.host.currency,
              totalAmount: data.amountInHostCurrency.valueInCents,
              transactions: [data],
              host: data.host,
              fromAccount: data.fromAccount,
            }}
          />
        )}
      </PDFLayout>
    );
  }
}

FixturePage.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  data: PropTypes.object,
  name: PropTypes.string,
};

export default FixturePage;
