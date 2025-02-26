import { BannerAd, BannerAdSize, InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { useState, useEffect } from 'react';

// Ad unit IDs - replace with your actual IDs for production
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';

// Counter for tracking interactions
let interactionCounter = 0;

// Banner Ad Component
export const BannerAdComponent = () => {
  return (
    <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdFailedToLoad={(error) => {
        console.log('Banner ad failed to load: ', error);
      }}
    />
  );
};

// Interstitial Ad Hook
export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState(null);

  useEffect(() => {
    // Create interstitial
    const ad = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Add event listeners
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      // Reload ad for next time
      ad.load();
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial ad error: ', error);
      setLoaded(false);
    });

    // Load initial ad
    ad.load();
    setInterstitialAd(ad);

    // Cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // Function to show ad after every 5 interactions
  const showInterstitialAd = () => {
    interactionCounter++;
    
    if (interactionCounter % 5 === 0 && loaded && interstitialAd) {
      interstitialAd.show();
      return true;
    }
    
    return false;
  };

  return { showInterstitialAd };
};
