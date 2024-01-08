import React from 'react';
import {
  Font,
  Page,
  Path,
  Link,
  Text,
  Svg,
  Image,
  View,
  Document,
  StyleSheet,
  renderToStream,
  Polyline,
  Line,
} from '@react-pdf/renderer';
import QRCode from 'qr-image';
import { chunk } from 'lodash';
import path from 'path';
import moment from 'moment';
import { formatCurrency } from '../../../../lib/utils';

// Register fonts
Font.register({
  family: 'Inter-Regular',
  src: path.join(process.cwd(), '.fonts/Inter-Regular.otf'),
});
Font.register({
  family: 'Inter-Bold',
  src: path.join(process.cwd(), '.fonts/Inter-Bold.otf'),
});

// Unit: 1pt = 1/72 inch = 0.352777239 mm
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Inter-Regular',
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
});

const NewLinkIcon = (props) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#FFFFFF"
    stroke="#555555"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <Polyline points="15 3 21 3 21 9" />
    <Line x1="10" x2="21" y1="14" y2="3" />
  </Svg>
);

/**
 * Generate a PDF using PDFKit and return it as a buffer.
 */
export default async function handler(req, res) {
  // Cards can be passed as POST or GET params
  const cards = req.body?.cards || JSON.parse(req.query.cards);
  if (!cards) {
    return res.status(400).send('Malformed request');
  }

  // To test with local data:
  // const cardsContent = fs.readFileSync('lib/fixtures/gift-cards.json', 'utf8');
  // const cards = JSON.parse(cardsContent).cards;

  // Set response headers
  res.setHeader('Cache-Control', 'no-store');
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', 'attachment; filename="gift-cards.pdf"');

  // Generate doc
  const paginatedCards = chunk(cards, 8);
  const MyDocument = () => (
    <Document>
      {paginatedCards.map((pageCards, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={{ flexDirection: 'column' }}>
            {chunk(pageCards, 2).map((cardsPair, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row' }}>
                {cardsPair.map((card, cardIdx) => {
                  const code = card.uuid.split('-')[0];
                  const redeemUrlPrefix = `https://opencollective.com/redeem`;
                  const qrImage = QRCode.imageSync(`https://opencollective.com/redeem/${code}`, {
                    type: 'png',
                    margin: 0,
                  });
                  return (
                    <View key={cardIdx} style={styles.card}>
                      {/** Background */}
                      <Image
                        src="public/static/images/oc-gift-card-front-straightened.png"
                        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
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
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              src="public/static/images/opencollective-icon.png"
                              style={{ width: 25, height: 25 }}
                            />
                            <View style={{ marginLeft: 5 }}>
                              <Text style={{ fontSize: 10, fontFamily: 'Inter-Bold', fontWeight: 'bold' }}>
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
                          <Text style={{ fontSize: 7, fontFamily: 'Inter-Bold', color: '#FFFFFF' }}>Gift Card</Text>
                        </View>
                      </View>

                      {/** Separator line */}
                      <View style={{ height: 1, backgroundColor: '#498bed', marginLeft: 8, marginRight: 8 }} />

                      {/** Description & expiry date */}
                      <View style={{ padding: 8, color: '#FFFFFF' }}>
                        <Text style={{ fontSize: 7, fontFamily: 'Inter-Bold', fontWeight: 'bold' }}>{card.name}</Text>
                        <Text style={{ fontSize: 7 }}>Expires on {moment(card.expiryDate).format('MMM D, YYYY')}</Text>
                      </View>

                      {/** Footer */}
                      <View
                        style={{
                          bottom: 5,
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
                              fontSize: 6,
                            }}
                          >
                            <NewLinkIcon style={{ width: 10, height: 10, marginRight: 3 }} />
                            <Text style={{ color: '#777777' }}>{redeemUrlPrefix.replace('https://', '')}/</Text>
                            <Text
                              style={{ fontSize: 7, fontFamily: 'Inter-Bold', fontWeight: 'bold', color: '#000000' }}
                            >
                              {code}
                            </Text>
                          </Link>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                          {/** QR code */}
                          <Image
                            src={qrImage}
                            style={{
                              width: 50,
                              height: 50,
                              marginBottom: 5,
                              backgroundColor: '#FFFFFF',
                              padding: 3,
                              borderRadius: 3,
                            }}
                          />
                          {/** Amount */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', fontWeight: 'bold' }}>
                              {formatCurrency(card.initialBalance, card.currency, { precision: 0 })}
                            </Text>
                            <Text style={{ fontSize: 7, color: '#777777', marginLeft: 2 }}>{card.currency}</Text>
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
      ))}
    </Document>
  );

  const stream = await renderToStream(<MyDocument />);
  stream.pipe(res);
}
