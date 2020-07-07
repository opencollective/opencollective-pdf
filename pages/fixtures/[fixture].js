import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { chunk } from 'lodash';
import PageFormat from '../../lib/constants/page-format';
import { Receipt } from '../../components/Receipt';
import PDFLayout from '../../components/PDFLayout';
import { Box, Flex } from 'rebass/styled-components';
import PrintableGiftCard from '../../components/PrintableGiftCard';

const FIXTURES = {
  'donation-receipt': require('../../lib/fixtures/donation-receipt.json'),
  'organization-gift-cards-monthly': require('../../lib/fixtures/organization-gift-cards-monthly.json'),
  'organization-gift-cards-yearly': require('../../lib/fixtures/organization-gift-cards-yearly.json'),
  'simple-transaction': require('../../lib/fixtures/simple-transaction.json'),
  'transactions-with-date-range': require('../../lib/fixtures/transactions-with-date-range.json'),
  'transactions-with-tax': require('../../lib/fixtures/transactions-with-tax.json'),
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
                    <Box key={c.uuid} m={3}>
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
          <Receipt invoice={data} />
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
