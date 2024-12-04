import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AppBannerAd = () => {
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={TestIds.BANNER} // Replace with your Ad Unit ID
        size={BannerAdSize.FULL_BANNER}
        onAdFailedToLoad={(error) => console.error('Banner Ad Failed', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppBannerAd;
