// AdService.js
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { getTrackingStat } from "../../../_DATA";

const iosAdmobInterstitial = "ca-app-pub-6960598270271792/8649920017";
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : iosAdmobInterstitial;

import Purchases, { LOG_LEVEL } from "react-native-purchases";

let interstitial = null;
let adLoaded = false;
let adClosedCallback = null;

const loadAd = () => {
  if (!interstitial) {
    interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      keywords: [
        "calculations",
        "math",
        "education",
        "arithmetic",
        "algebra",
        "geometry",
        "tip",
        "units",
        "calendar",
        "converter",
        "mathematics",
        "learning",
        "tutorial",
        "classroom",
        "curriculum",
        "study",
        "homework",
        "exam",
        "test preparation",
        "problem solving",
        "equations",
        "formulas",
        "graphing",
        "educational tools",
        "math games",
        "STEM",
        "distance learning",
        "online courses",
        "math software",
        "interactive learning",
        "educational apps",
        "academic support",
        "numeracy",
        "educational resources",
        "school",
        "college",
        "university",
        "teacher resources",
        "student resources",
        "lesson plans",
        "educational technology",
        "e-learning",
        "worksheets",
      ],
      requestNonPersonalizedAdsOnly: !getTrackingStat(),
    });

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      adLoaded = true;
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      adLoaded = false;
      if (adClosedCallback) {
        adClosedCallback(); // Execute the callback when the ad is closed
      }
      loadAd(); // Load a new ad when the current ad is closed
    });
  }

  interstitial.load();
};

const showAd = async (onAdClosed) => {
  const customerInfo = await Purchases.getCustomerInfo();
  console.log(
    "customerInfo",
    customerInfo?.entitlements.active["Golden Version"]
  );
  if (customerInfo?.entitlements.active["Golden Version"] !== undefined) {
    return null;
  } else if (adLoaded) {
    adClosedCallback = onAdClosed;
    interstitial.show();
  } else {
    loadAd(); // Ensure the ad is loaded for next time
  }
};

export { loadAd, showAd };
