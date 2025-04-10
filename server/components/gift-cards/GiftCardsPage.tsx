import React from 'react';
import { Page, Document, Image, View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { chunk } from 'lodash-es';
import { formatCurrency } from '../../lib/currency.js';
import { LinkIcon } from '../icons/Link.js';
import { FontFamily } from '../../../server/lib/pdf.js';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: FontFamily.InterRegular,
    fontSize: 10,
  },
  cardsContainer: {
    flexDirection: 'column',
  },
  cardRow: {
    flexDirection: 'row',
  },
  card: {
    width: 243,
    height: 153,
    margin: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  cardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3,
  },
  brandingContainer: {
    padding: 5,
    color: '#FFFFFF',
  },
  brandingInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 25,
    height: 25,
  },
  brandTextContainer: {
    marginLeft: 5,
  },
  brandTitle: {
    fontSize: 10,
    fontFamily: FontFamily.InterBold,
  },
  brandSubtitle: {
    fontSize: 6,
  },
  giftCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 12,
    marginRight: 5,
    backgroundColor: '#69a0f1',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  giftCardPillText: {
    fontSize: 7,
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#498bed',
    marginLeft: 8,
    marginRight: 8,
  },
  cardDescription: {
    padding: 8,
    color: '#FFFFFF',
  },
  cardName: {
    fontSize: 7,
    fontFamily: FontFamily.InterBold,
  },
  expiryText: {
    fontSize: 7,
  },
  footer: {
    bottom: 6,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5,
    width: '100%',
  },
  redeemLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    textDecoration: 'none',
    fontSize: 7,
  },
  redeemLinkPrefix: {
    color: '#777777',
  },
  redeemLinkCode: {
    fontSize: 7,
    fontFamily: FontFamily.InterBold,
    color: '#000000',
  },
  qrCode: {
    width: 50,
    height: 50,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 3,
  },
  amountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  mainAmount: {
    fontSize: 12,
    fontFamily: FontFamily.InterBold,
  },
  mainAmountCurrency: {
    fontSize: 7,
    color: '#777777',
    marginLeft: 2,
  },
});

type GiftCard = {
  uuid: string;
  name: string;
  expiryDate: string;
  initialBalance: number;
  currency: string;
};

const GiftCardsPage = ({ cards }: { cards: GiftCard[] }) => {
  const paginatedCards = chunk(cards, 8);
  return (
    <Document>
      {!paginatedCards?.length ? (
        <Page size="A4" style={styles.page}>
          <Text>No gift cards found</Text>
        </Page>
      ) : (
        paginatedCards.map((pageCards, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <View style={styles.cardsContainer}>
              {chunk(pageCards, 2).map((cardsPair, rowIdx) => (
                <View key={rowIdx} style={styles.cardRow}>
                  {cardsPair.map((card, cardIdx) => {
                    const code = card.uuid.split('-')[0];
                    const redeemUrlPrefix = `https://opencollective.com/redeem`;
                    const qrImage = QRCode.toDataURL(`https://opencollective.com/redeem/${code}`, {
                      margin: 0,
                    });
                    return (
                      <View key={cardIdx} style={styles.card}>
                        {/** Background */}
                        <Image
                          src="public/static/images/oc-gift-card-front-straightened.png"
                          style={styles.cardBackground}
                        />

                        {/** Header */}
                        <View style={styles.cardHeader}>
                          {/** Open Collective branding */}
                          <View style={styles.brandingContainer}>
                            <View style={styles.brandingInner}>
                              <Image src="public/static/images/opencollective-icon.png" style={styles.brandIcon} />
                              <View style={styles.brandTextContainer}>
                                <Text style={styles.brandTitle}>Open Collective</Text>
                                <Text style={styles.brandSubtitle}>Transparent funding for open source</Text>
                              </View>
                            </View>
                          </View>
                          {/** Blue "Gift Card" rounded pill on the right */}
                          <View style={styles.giftCardPill}>
                            <Text style={styles.giftCardPillText}>Gift Card</Text>
                          </View>
                        </View>

                        {/** Separator line */}
                        <View style={styles.separator} />

                        {/** Description & expiry date */}
                        <View style={styles.cardDescription}>
                          <Text style={styles.cardName}>{card.name}</Text>
                          <Text style={styles.expiryText}>
                            Expires on {dayjs(card.expiryDate).format('MMM D, YYYY')}
                          </Text>
                        </View>

                        {/** Footer */}
                        <View style={styles.footer}>
                          <View>
                            {/** Redeem URL */}
                            <Link src={`${redeemUrlPrefix}/${code}`} style={styles.redeemLink}>
                              <LinkIcon size={6} color="grey" style={{ marginRight: 2 }} />
                              <Text style={styles.redeemLinkPrefix}>{redeemUrlPrefix.replace('https://', '')}/</Text>
                              <Text style={styles.redeemLinkCode}>{code}</Text>
                            </Link>
                          </View>
                          <View style={styles.amountContainer}>
                            {/** QR code */}
                            <Image src={qrImage} style={styles.qrCode} />
                            {/** Amount */}
                            <View style={styles.amountRow}>
                              <Text style={styles.mainAmount}>
                                {formatCurrency(card.initialBalance, card.currency, { precision: 0 })}
                              </Text>
                              <Text style={styles.mainAmountCurrency}>{card.currency}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </Page>
        ))
      )}
    </Document>
  );
};

export default GiftCardsPage;
