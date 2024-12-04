import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import useInterstitialAd from './useInterstitialAd';

const AppNavigationWithAds = ({ children }) => {
  const navigation = useNavigation();
  const interstitialAd = useInterstitialAd();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      interstitialAd.load(); // Show ad on navigation state change
    });

    return unsubscribe;
  }, [navigation, interstitialAd]);

  return children;
};

export default AppNavigationWithAds;
