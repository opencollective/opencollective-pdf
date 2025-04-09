import React from 'react';
import { Page, Document, Image, View, Text, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { chunk } from 'lodash-es';
import { formatCurrency } from '../../lib/currency';
import { LinkIcon } from '../icons/Link';
import { FontFamily } from 'server/lib/pdf';
import { createStylesheetWithFonts } from 'server/lib/react-pdf-utils';

const styles = createStylesheetWithFonts({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: FontFamily.InterRegular,
    fontSize: 10,
  },
  card: {
    width: 243,
    height: 153,
    margin: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  qrCode: {
    width: 50,
    height: 50,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 3,
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
            <View style={{ flexDirection: 'column' }}>
              {chunk(pageCards, 2).map((cardsPair, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row' }}>
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
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                          }}
                        />

                        {/** Header */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 3,
                          }}
                        >
                          {/** Open Collective branding */}
                          <View style={{ padding: 5, color: '#FFFFFF' }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Image
                                src="public/static/images/opencollective-icon.png"
                                style={{ width: 25, height: 25 }}
                              />
                              <View style={{ marginLeft: 5 }}>
                                <Text
                                  style={{
                                    fontSize: 10,

                                    fontFamily: FontFamily.InterBold,
                                  }}
                                >
                                  Open Collective
                                </Text>
                                <Text style={{ fontSize: 6 }}>Transparent funding for open source</Text>
                              </View>
                            </View>
                          </View>
                          {/** Blue "Gift Card" rounded pill on the right */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              height: 12,
                              marginRight: 5,
                              backgroundColor: '#69a0f1',
                              borderRadius: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 7,

                                color: '#FFFFFF',
                              }}
                            >
                              Gift Card
                            </Text>
                          </View>
                        </View>

                        {/** Separator line */}
                        <View
                          style={{
                            height: 1,
                            backgroundColor: '#498bed',
                            marginLeft: 8,
                            marginRight: 8,
                          }}
                        />

                        {/** Description & expiry date */}
                        <View style={{ padding: 8, color: '#FFFFFF' }}>
                          <Text
                            style={{
                              fontSize: 7,

                              fontFamily: FontFamily.InterBold,
                            }}
                          >
                            {card.name}
                          </Text>
                          <Text style={{ fontSize: 7 }}>Expires on {dayjs(card.expiryDate).format('MMM D, YYYY')}</Text>
                        </View>

                        {/** Footer */}
                        <View
                          style={{
                            bottom: 6,
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            paddingLeft: 5,
                            paddingRight: 5,
                            width: '100%',
                          }}
                        >
                          <View>
                            {/** Redeem URL */}
                            <Link
                              src={`${redeemUrlPrefix}/${code}`}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                textDecoration: 'none',
                                fontSize: 7,
                              }}
                            >
                              <LinkIcon size={6} color="grey" style={{ marginRight: 2 }} />
                              <Text style={{ color: '#777777' }}>{redeemUrlPrefix.replace('https://', '')}/</Text>
                              <Text
                                style={{
                                  fontSize: 7,

                                  fontFamily: FontFamily.InterBold,
                                  color: '#000000',
                                }}
                              >
                                {code}
                              </Text>
                            </Link>
                          </View>
                          <View
                            style={{
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                            }}
                          >
                            {/** QR code */}
                            <Image src={qrImage} style={styles.qrCode} />
                            {/** Amount */}
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 5,
                              }}
                            >
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
