import React, { useEffect } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const useInterstitialAd = (onAdClosed) => {
  const interstitial = React.useRef(
    InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true, // Set to `false` for personalized ads
    })
  ).current;

  useEffect(() => {
    const unsubscribe = interstitial.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        interstitial.show();
      }
      if (type === AdEventType.CLOSED) {
        if (onAdClosed) onAdClosed(); // Trigger any callback after the ad closes
        interstitial.load(); // Preload the next ad
      }
    });

    interstitial.load(); // Load the first ad

    return () => unsubscribe();
  }, [interstitial, onAdClosed]);

  return interstitial;
};

export default useInterstitialAd;
