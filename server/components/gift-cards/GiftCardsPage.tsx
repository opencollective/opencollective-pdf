import React from "react";
import {
  Page,
  Document,
  Image,
  View,
  Text,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import QRCode from "qrcode";
import { chunk } from "lodash-es";
import { formatCurrency } from "../../utils/currency";
import { LinkIcon } from "../icons/Link";

// Register fonts
Font.register({
  family: "Inter-Regular",
  src: "./public/static/fonts/Inter-Regular.otf",
});
Font.register({
  family: "Inter-Bold",
  src: "./public/static/fonts/Inter-Bold.otf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Inter-Regular",
    fontSize: 10,
  },
  card: {
    width: 243,
    height: 153,
    margin: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderStyle: "dashed",
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
            <View style={{ flexDirection: "column" }}>
              {chunk(pageCards, 2).map((cardsPair, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: "row" }}>
                  {cardsPair.map((card, cardIdx) => {
                    const code = card.uuid.split("-")[0];
                    const redeemUrlPrefix = `https://opencollective.com/redeem`;
                    const qrImage = QRCode.toDataURL(
                      `https://opencollective.com/redeem/${code}`,
                      {
                        margin: 0,
                      }
                    );
                    return (
                      <View key={cardIdx} style={styles.card}>
                        {/** Background */}
                        <Image
                          src="public/static/images/oc-gift-card-front-straightened.png"
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                          }}
                        />

                        {/** Header */}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 3,
                          }}
                        >
                          {/** Open Collective branding */}
                          <View style={{ padding: 5, color: "#FFFFFF" }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
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
                                    fontFamily: "Inter-Bold",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Open Collective
                                </Text>
                                <Text style={{ fontSize: 6 }}>
                                  Transparent funding for open source
                                </Text>
                              </View>
                            </View>
                          </View>
                          {/** Blue "Gift Card" rounded pill on the right */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              height: 12,
                              marginRight: 5,
                              backgroundColor: "#69a0f1",
                              borderRadius: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 7,
                                fontFamily: "Inter-Bold",
                                color: "#FFFFFF",
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
                            backgroundColor: "#498bed",
                            marginLeft: 8,
                            marginRight: 8,
                          }}
                        />

                        {/** Description & expiry date */}
                        <View style={{ padding: 8, color: "#FFFFFF" }}>
                          <Text
                            style={{
                              fontSize: 7,
                              fontFamily: "Inter-Bold",
                              fontWeight: "bold",
                            }}
                          >
                            {card.name}
                          </Text>
                          <Text style={{ fontSize: 7 }}>
                            Expires on{" "}
                            {dayjs(card.expiryDate).format("MMM D, YYYY")}
                          </Text>
                        </View>

                        {/** Footer */}
                        <View
                          style={{
                            bottom: 5,
                            position: "absolute",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            paddingLeft: 5,
                            paddingRight: 5,
                            width: "100%",
                          }}
                        >
                          <View>
                            {/** Redeem URL */}
                            <Link
                              src={`${redeemUrlPrefix}/${code}`}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                textDecoration: "none",
                                fontSize: 6,
                              }}
                            >
                              <LinkIcon size={6} style={{ marginRight: 2 }} />
                              <Text style={{ color: "#777777" }}>
                                {redeemUrlPrefix.replace("https://", "")}/
                              </Text>
                              <Text
                                style={{
                                  fontSize: 6,
                                  fontFamily: "Inter-Bold",
                                  fontWeight: "bold",
                                  color: "#000000",
                                }}
                              >
                                {code}
                              </Text>
                            </Link>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            {/** QR code */}
                            <Image
                              src={qrImage}
                              style={{
                                width: 50,
                                height: 50,
                                marginBottom: 5,
                                backgroundColor: "#FFFFFF",
                                padding: 3,
                                borderRadius: 3,
                              }}
                            />
                            {/** Amount */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: "Inter-Bold",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatCurrency(
                                  card.initialBalance,
                                  card.currency,
                                  { precision: 0 }
                                )}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 7,
                                  color: "#777777",
                                  marginLeft: 2,
                                }}
                              >
                                {card.currency}
                              </Text>
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
