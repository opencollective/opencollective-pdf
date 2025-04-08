import React from 'react';
import { View, Text, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { FontFamily } from '../lib/pdf';
import { GraphQLV1Collective } from 'server/graphql/types/custom-types';
import { Account } from 'server/graphql/types/v2/schema';
import { imagePreview } from 'server/lib/images';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    borderRight: '1px solid #6B7280',
    paddingRight: 16,
    marginRight: 16,
  },
  logo: {
    maxWidth: 200,
    maxHeight: 100,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  collectiveName: {
    fontFamily: FontFamily.InterBold,
    fontSize: 12,
    textAlign: 'center',
  },
  address: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
    fontFamily: FontFamily.InterRegular,
  },
});

const CollectiveFooter = ({ collective }: { collective: Account | GraphQLV1Collective }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {collective.website ? (
          <Link src={collective.website}>
            <Image
              style={styles.logo}
              src={imagePreview(collective.imageUrl ?? collective.image, null, { height: 200 })}
            />
          </Link>
        ) : (
          <Image
            style={styles.logo}
            src={imagePreview(collective.imageUrl ?? collective.image, null, { height: 200 })}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.collectiveName}>{collective.name}</Text>
        <Text style={styles.address}>{collective.location?.address}</Text>
      </View>
    </View>
  );
};

export default CollectiveFooter;
