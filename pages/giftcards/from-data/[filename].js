import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { chunk } from 'lodash';
import PageFormat from '../../../lib/constants/page-format';
import PDFLayout from '../../../components/PDFLayout';
import PrintableGiftCard from '../../../components/PrintableGiftCard';

const getDataFromBody = async (req) => {
  if (req.method == 'POST') {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (data) => {
        body += data;

        // Too much POST data, kill the connection!
        // 1e7 === 1 * Math.pow(10, 7) === 1 * 10000000 ~~~ 10MB
        if (body.length > 1e6) {
          reject(req.connection.destroy());
        }
      });

      req.on('end', () => {
        resolve(JSON.parse(body));
      });
    });
  }
};

class GiftCardsByIds extends React.Component {
  static async getInitialProps(ctx) {
    if (ctx.req) {
      let cards = [];

      try {
        const data = await getDataFromBody(ctx.req);
        cards = data?.cards;
        if (!cards && ctx.query.cards) {
          cards = JSON.parse(ctx.query.cards);
        }
      } catch {
        // ignore
      }

      return {
        cards: cards || [],
        pageFormat: ctx.query.pageFormat,
      };
    }

    return { pageFormat: ctx.query.pageFormat };
  }

  getPageStyle(cardsPerPage, paginatedCards) {
    return {
      width: '8.27in',
      // Don't force height on last iteration to avoid blank page
      height: paginatedCards.length === cardsPerPage ? '11.69in' : 'auto',
    };
  }

  render() {
    const { cards } = this.props;
    const cardsPerPage = 8;
    const chunks = chunk(cards, cardsPerPage);
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <Box>
          {chunks.map((paginatedCards, idx) => (
            <Box key={idx} py={5} css={this.getPageStyle(cardsPerPage, paginatedCards)}>
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
      </PDFLayout>
    );
  }
}

GiftCardsByIds.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      /** The amount in cents */
      initialBalance: PropTypes.number.isRequired,
      /** Currency of the gift card (eg. `EUR`) */
      currency: PropTypes.string.isRequired,
      /** UUID of the card */
      uuid: PropTypes.string.isRequired,
      /** Expiry date */
      expiryDate: PropTypes.string,
    }),
  ),
};

export default GiftCardsByIds;
