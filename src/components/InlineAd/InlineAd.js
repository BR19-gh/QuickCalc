import { View } from "react-native";
import React, { useState } from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { getTrackingStat } from "../../../_DATA";

const iosAdmobBanner = "ca-app-pub-6960598270271792/9421002249";

const getTrackingStatus = async () => {
  const trackingStatus = await getTrackingStat();
  return trackingStatus;
};

const InlineAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  return (
    <View style={{ height: isAdLoaded ? "auto" : 0 }}>
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : iosAdmobBanner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: !getTrackingStatus(),
        }}
        onAdLoaded={() => {
          setIsAdLoaded(true);
        }}
      />
    </View>
  );
};

export default InlineAd;
